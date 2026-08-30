import os
import json
import sqlite3

# Comprehensive Category Mapping Rules based on scheme name, category, subcategory, and description
CATEGORY_MAPPING = [
    # Disability & Assistive Support
    (lambda c, s, n, d: "disability" in c or "disability" in s or "adip" in n or "disabled" in d or "assistive" in d, "Disability & Assistive Support"),

    # Education & Scholarships
    (lambda c, s, n, d: "student" in c or "education" in c or "scholarship" in s or "coaching" in s or "shiksha" in n or "vidya" in n or "student" in d, "Education & Scholarships"),

    # Agriculture & Farmers
    (lambda c, s, n, d: "farmer" in c or "agriculture" in c or "kisan" in n or "crop" in s or "irrigation" in s or "fisheries" in s or "dairy" in s or "pashu" in n, "Agriculture & Farmers"),

    # Employment & Skill Development
    (lambda c, s, n, d: "employment" in c or "skill" in s or "vocational" in s or "kaushal" in n or "apprentice" in d or "job" in d, "Employment & Skill Development"),

    # Business & Entrepreneurship
    (lambda c, s, n, d: "business" in c or "msme" in s or "startup" in s or "vendor" in s or "handloom" in s or "mudra" in n or "entrepreneur" in d, "Business & Entrepreneurship"),

    # Women & Child Welfare
    (lambda c, s, n, d: "women" in c or "girl" in s or "maternal" in s or "kanya" in n or "ladli" in n or "matru" in n or "female" in d, "Women & Child Welfare"),

    # Senior Citizens
    (lambda c, s, n, d: "senior" in c or "old age" in s or "teerth" in s or "vayo" in n or "elderly" in d, "Senior Citizens"),

    # Healthcare & Medical
    (lambda c, s, n, d: "health" in c or "medical" in s or "ayushman" in n or "swasthya" in n or "hospital" in d or "arogya" in n, "Healthcare & Medical"),

    # Housing & Shelter
    (lambda c, s, n, d: "housing" in c or "awas" in n or "shelter" in s or "griha" in n, "Housing & Shelter"),

    # Pension & Social Security
    (lambda c, s, n, d: "pension" in c or "social security" in c or "provident" in s or "pension" in n, "Pension & Social Security"),

    # Food & Nutrition
    (lambda c, s, n, d: "ration" in n or "pds" in n or "food security" in s or "poshan" in n or "annapurna" in n, "Food & Nutrition"),

    # Financial Assistance & Loans
    (lambda c, s, n, d: "financial" in c or "loan" in s or "subsidy" in s or "credit" in s, "Financial Assistance & Loans")
]

def apply_comprehensive_categories():
    print("Applying comprehensive category mapping across all 894 schemes...")

    json_path = os.path.join(os.path.dirname(__file__), 'official_schemes_dataset.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        schemes = json.load(f)

    category_counts = {}

    for s in schemes:
        c_low = (s.get("category") or "").lower()
        sub_low = (s.get("sub_category") or "").lower()
        n_low = (s.get("name") or "").lower()
        d_low = ((s.get("short_description") or "") + " " + (s.get("full_description") or "")).lower()

        assigned_cat = None
        for rule_fn, cat_name in CATEGORY_MAPPING:
            if rule_fn(c_low, sub_low, n_low, d_low):
                assigned_cat = cat_name
                break

        if not assigned_cat:
            # Fallback mappings for broad categories
            if "farmer" in c_low or "agriculture" in c_low:
                assigned_cat = "Agriculture & Farmers"
            elif "student" in c_low:
                assigned_cat = "Education & Scholarships"
            elif "health" in c_low:
                assigned_cat = "Healthcare & Medical"
            elif "pension" in c_low:
                assigned_cat = "Pension & Social Security"
            elif "housing" in c_low:
                assigned_cat = "Housing & Shelter"
            elif "women" in c_low:
                assigned_cat = "Women & Child Welfare"
            elif "employment" in c_low:
                assigned_cat = "Employment & Skill Development"
            elif "business" in c_low:
                assigned_cat = "Business & Entrepreneurship"
            else:
                assigned_cat = "Financial Assistance & Loans"

        s["display_category"] = assigned_cat
        category_counts[assigned_cat] = category_counts.get(assigned_cat, 0) + 1

    # Save back to JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(schemes, f, indent=2, ensure_ascii=False)

    print(f"[OK] Comprehensive categories mapped across {len(schemes)} schemes.")
    print("Category Breakdown:")
    for cat_name, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"   - {cat_name}: {count} schemes")

    # Update SQLite DB
    db_path = os.path.join(os.path.dirname(__file__), '..', 'schemesetu.db')
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()

        # Ensure column display_category exists
        cur.execute("PRAGMA table_info(schemes)")
        cols = [c[1] for c in cur.fetchall()]
        if "display_category" not in cols:
            cur.execute("ALTER TABLE schemes ADD COLUMN display_category TEXT")

        for s in schemes:
            cur.execute("UPDATE schemes SET display_category = ? WHERE name = ?", (s["display_category"], s["name"]))

        conn.commit()
        conn.close()
        print("[OK] Database schemesetu.db updated with display_category column.")

if __name__ == "__main__":
    apply_comprehensive_categories()
