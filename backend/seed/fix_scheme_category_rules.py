import os
import json
import sqlite3

def fix_dataset_category_and_occupation_rules():
    print("Fixing official scheme category and occupation rules in dataset and database...")

    json_path = os.path.join(os.path.dirname(__file__), 'official_schemes_dataset.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        schemes = json.load(f)

    fixed_count = 0
    for s in schemes:
        name_lower = s["name"].lower()
        sub_cat_lower = (s.get("sub_category") or "").lower()

        # 1. SC / ST specific schemes
        if "sc-st" in name_lower or "sc/st" in name_lower or "sc and st" in name_lower:
            s["category_rules"] = ["SC", "ST"]
            s["eligible_categories"] = ["SC", "ST"]
            s["target_beneficiaries"] = "Scheduled Caste (SC) and Scheduled Tribe (ST) beneficiaries"
            fixed_count += 1
        elif " sc " in f" {name_lower} " or "scheduled caste" in name_lower or "post-matric scholarship for sc" in name_lower:
            s["category_rules"] = ["SC"]
            s["eligible_categories"] = ["SC"]
            s["target_beneficiaries"] = "Scheduled Caste (SC) beneficiaries"
            fixed_count += 1
        elif " st " in f" {name_lower} " or "scheduled tribe" in name_lower or "post-matric scholarship for st" in name_lower or "tribal" in sub_cat_lower:
            s["category_rules"] = ["ST"]
            s["eligible_categories"] = ["ST"]
            s["target_beneficiaries"] = "Scheduled Tribe (ST) beneficiaries"
            fixed_count += 1
        elif " obc " in f" {name_lower} " or "other backward" in name_lower or "post-matric scholarship for obc" in name_lower:
            s["category_rules"] = ["OBC"]
            s["eligible_categories"] = ["OBC"]
            s["target_beneficiaries"] = "Other Backward Class (OBC) beneficiaries"
            fixed_count += 1

        # 2. Women specific schemes
        if s.get("category") == "Women" or "kanya" in name_lower or "ladli" in name_lower or "magalir" in name_lower or "girl" in name_lower or "women" in name_lower or "female" in name_lower or "matru" in name_lower or "sukanya" in name_lower:
            s["gender_rules"] = ["Female"]
            s["eligible_genders"] = ["Female"]

    # Save back to JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(schemes, f, indent=2, ensure_ascii=False)

    print(f"[OK] Fixed category & gender rules for {fixed_count} schemes in official_schemes_dataset.json.")

    # Apply fixes directly into SQLite DB as well
    db_path = os.path.join(os.path.dirname(__file__), '..', 'schemesetu.db')
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()

        for s in schemes:
            name = s["name"]
            cat_rules_str = json.dumps(s.get("category_rules", ["All"]))
            elig_cats_str = json.dumps(s.get("eligible_categories", []))
            gen_rules_str = json.dumps(s.get("gender_rules", ["Any"]))
            t_ben = s.get("target_beneficiaries")

            cur.execute("""
                UPDATE schemes
                SET category_rules = ?, eligible_categories = ?, gender_rules = ?, target_beneficiaries = ?
                WHERE name = ?
            """, (cat_rules_str, elig_cats_str, gen_rules_str, t_ben, name))

        conn.commit()
        conn.close()
        print("[OK] Database schemesetu.db updated successfully.")

if __name__ == "__main__":
    fix_dataset_category_and_occupation_rules()
