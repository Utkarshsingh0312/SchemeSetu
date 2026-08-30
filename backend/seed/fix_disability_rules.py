import os
import json
import sqlite3

def fix_disability_rules():
    print("Fixing disability_rules and special_conditions for disability schemes...")

    json_path = os.path.join(os.path.dirname(__file__), 'official_schemes_dataset.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        schemes = json.load(f)

    disability_count = 0
    for s in schemes:
        n_low = s["name"].lower()
        d_low = ((s.get("short_description") or "") + " " + (s.get("full_description") or "")).lower()
        cat_low = (s.get("category") or "").lower()
        disp_low = (s.get("display_category") or "").lower()

        if "disab" in n_low or "handicap" in n_low or "adip" in n_low or "udid" in n_low or "disab" in cat_low or "disab" in disp_low:
            s["disability_rules"] = True
            spec = s.get("special_conditions") or []
            if "Disability" not in spec and "disability" not in [x.lower() for x in spec]:
                spec.append("Disability")
            s["special_conditions"] = spec
            disability_count += 1
        else:
            s["disability_rules"] = False

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(schemes, f, indent=2, ensure_ascii=False)

    print(f"[OK] Updated disability_rules for {disability_count} schemes in JSON.")

    db_path = os.path.join(os.path.dirname(__file__), '..', 'schemesetu.db')
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()

        for s in schemes:
            name = s["name"]
            dis_rule = 1 if s.get("disability_rules") else 0
            spec_json = json.dumps(s.get("special_conditions") or [])
            cur.execute("UPDATE schemes SET disability_rules = ?, special_conditions = ? WHERE name = ?", (dis_rule, spec_json, name))

        conn.commit()
        conn.close()
        print("[OK] Database schemesetu.db updated with disability_rules.")

if __name__ == "__main__":
    fix_disability_rules()
