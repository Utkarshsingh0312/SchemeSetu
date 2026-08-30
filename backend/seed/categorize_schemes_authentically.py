import os
import json
import sqlite3

# Authentic Subcategory Mapping Rules based on official scheme names and descriptions
SUBCATEGORY_RULES = [
    # Disability
    (lambda n, d: "adip" in n or "assistive" in n or "prosthetic" in n or "fitting" in n or "appliance" in n, "Assistive Devices"),
    (lambda n, d: "disability" in n and ("rehabilitation" in n or "deendayal" in n), "Rehabilitation"),
    (lambda n, d: "disability" in n and ("scholarship" in n or "education" in n or "school" in n), "Disability Education"),
    (lambda n, d: "disability" in n and ("pension" in n or "allowance" in n or "financial" in n), "Disability Financial Assistance"),

    # Farmers & Agriculture
    (lambda n, d: "pm-kisan" in n or "kisan samman" in n or "rythu" in n or "krishak bandhu" in n or "income support" in d, "Farmer Income Support"),
    (lambda n, d: "crop insurance" in n or "fasal bima" in n or "weather insurance" in n, "Crop Insurance"),
    (lambda n, d: "tractor" in n or "machinery" in n or "mechanization" in n or "equipment" in n, "Agricultural Equipment"),
    (lambda n, d: "irrigation" in n or "sinchai" in n or "drip" in n or "krushei" in n, "Irrigation & Water Management"),
    (lambda n, d: "kisan credit" in n or "kcc" in n or "agricultural loan" in n or "farm loan" in n, "Farmer Credit & Loans"),
    (lambda n, d: "fisheries" in n or "matsya" in n or "fisherman" in n or "fishermen" in n, "Fisheries"),
    (lambda n, d: "animal husbandry" in n or "pashu" in n or "dairy" in n or "livestock" in n or "gokul" in n, "Dairy & Livestock"),

    # Education & Students
    (lambda n, d: "post-matric" in n or "pre-matric" in n or "scholarship" in n or "shiksha" in n or "vidya" in n, "Scholarships"),
    (lambda n, d: "coaching" in n or "free coaching" in n or "competitive exam" in n or "abhyudaya" in n, "Competitive Exam Coaching"),
    (lambda n, d: "vocational" in n or "skill development" in n or "apprentice" in n or "kaushal" in n, "Skill Development"),
    (lambda n, d: "higher education" in n or "college" in n or "university" in n or "research fellowship" in n, "Higher Education"),

    # Health
    (lambda n, d: "ayushman" in n or "pm-jay" in n or "health insurance" in n or "swasthya bima" in n or "arogyasri" in n, "Health Insurance"),
    (lambda n, d: "matru" in n or "maternal" in n or "pregnancy" in n or "janani" in n or "poshan" in n, "Maternal Health"),
    (lambda n, d: "child health" in n or "immunization" in n or "indradhanush" in n or "bal Swasthya" in n, "Child Health"),
    (lambda n, d: "teerth" in n or "pilgrimage" in n or "senior citizen" in n, "Senior Pilgrimage & Welfare"),

    # Pension & Social Security
    (lambda n, d: "old age pension" in n or "vayo" in n or "senior citizen pension" in n or "national pension" in n, "Old Age Pension"),
    (lambda n, d: "widow pension" in n or "destitute" in n or "pension for women" in n, "Widow Assistance"),
    (lambda n, d: "provident fund" in n or "epfo" in n or "eshram" in n or "social security" in n, "Social Security"),

    # Business & MSME
    (lambda n, d: "mudra" in n or "standup india" in n or "prime minister's employment generation" in n or "pmegp" in n, "Business Loans"),
    (lambda n, d: "handloom" in n or "weaver" in n or "artisan" in n or "handicraft" in n or "vishwakarma" in n, "Handloom & Handicrafts"),
    (lambda n, d: "street vendor" in n or "svanidhi" in n or "vendor" in n, "Vendor Support"),
    (lambda n, d: "msme" in n or "startup" in n or "incubation" in n, "Startup & MSME"),

    # Housing
    (lambda n, d: "awas" in n or "housing" in n or "shelter" in n or "griha" in n, "Housing Subsidy"),

    # Women & Child
    (lambda n, d: "sukanya" in n or "kanya" in n or "girl child" in n or "ladli" in n or "beti" in n, "Girl Child Welfare"),
    (lambda n, d: "women entrepreneurship" in n or "mahila" in n or "stree" in n or "shg" in n, "Women Support"),

    # Food & Public Distribution
    (lambda n, d: "ration" in n or "pds" in n or "food security" in n or "annapurna" in n or "poshan" in n, "Food Security")
]

def categorize_schemes_authentically():
    print("Categorizing schemes authentically using official metadata...")

    json_path = os.path.join(os.path.dirname(__file__), 'official_schemes_dataset.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        schemes = json.load(f)

    subcat_assigned_count = 0
    broad_only_count = 0

    for s in schemes:
        n_lower = s["name"].lower()
        d_lower = (s.get("short_description") or "") + " " + (s.get("full_description") or "")
        d_lower = d_lower.lower()

        assigned_sub = None
        for rule_fn, sub_label in SUBCATEGORY_RULES:
            if rule_fn(n_lower, d_lower):
                assigned_sub = sub_label
                break

        s["sub_category"] = assigned_sub
        if assigned_sub:
            subcat_assigned_count += 1
        else:
            broad_only_count += 1

    # Save back to JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(schemes, f, indent=2, ensure_ascii=False)

    print(f"[OK] Subcategory assigned: {subcat_assigned_count} schemes.")
    print(f"[OK] Primary category only: {broad_only_count} schemes.")

    # Update SQLite database directly
    db_path = os.path.join(os.path.dirname(__file__), '..', 'schemesetu.db')
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()

        for s in schemes:
            name = s["name"]
            subcat = s.get("sub_category")
            cur.execute("UPDATE schemes SET sub_category = ? WHERE name = ?", (subcat, name))

        conn.commit()
        conn.close()
        print("[OK] Database schemesetu.db subcategories updated successfully.")

if __name__ == "__main__":
    categorize_schemes_authentically()
