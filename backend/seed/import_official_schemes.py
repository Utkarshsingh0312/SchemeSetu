import sys
import os
import json
import re
import sqlite3
from datetime import datetime

# Add backend root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal, engine, Base
from app.models.domain import Scheme, VerificationStatus

def normalize_string(val: str) -> str:
    if not val:
        return ""
    val = val.lower().strip()
    val = re.sub(r'[^a-z0-9]', '', val)
    return val

def migrate_db_schema():
    """Ensure all newly added columns exist in SQLite database without losing data"""
    db_path = os.path.join(os.path.dirname(__file__), '..', 'schemesetu.db')
    if not os.path.exists(db_path):
        Base.metadata.create_all(bind=engine)
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    columns_to_add = [
        ("short_name", "TEXT"),
        ("government_level", "TEXT DEFAULT 'Central'"),
        ("ministry", "TEXT"),
        ("department", "TEXT"),
        ("sub_category", "TEXT"),
        ("district", "TEXT"),
        ("benefit_amount", "TEXT"),
        ("launch_year", "INTEGER"),
        ("status", "TEXT DEFAULT 'Active'"),
        ("target_beneficiaries", "TEXT"),
        ("eligibility_mode", "TEXT DEFAULT 'DETERMINISTIC'"),
        ("eligibility_description", "TEXT"),
        ("eligible_states", "TEXT"),
        ("eligible_categories", "TEXT"),
        ("eligible_occupations", "TEXT"),
        ("eligible_genders", "TEXT")
    ]

    cursor.execute("PRAGMA table_info(schemes)")
    existing_cols = [row[1] for row in cursor.fetchall()]

    for col_name, col_type in columns_to_add:
        if col_name not in existing_cols:
            try:
                cursor.execute(f"ALTER TABLE schemes ADD COLUMN {col_name} {col_type}")
                print(f"[MIGRATION] Added missing column: schemes.{col_name}")
            except Exception as e:
                print(f"[MIGRATION WARNING] Could not add column {col_name}: {e}")

    conn.commit()
    conn.close()

def import_real_schemes():
    print("==================================================")
    print("   IMPORTING REAL OFFICIAL GOVERNMENT SCHEMES     ")
    print("==================================================")

    # 1. Run database schema migration
    migrate_db_schema()

    # 2. Load official scheme dataset
    dataset_path = os.path.join(os.path.dirname(__file__), 'official_schemes_dataset.json')
    
    if os.path.exists(dataset_path):
        with open(dataset_path, 'r', encoding='utf-8') as f:
            raw_schemes = json.load(f)
    else:
        from seed.real_official_data import REAL_GOVT_SCHEMES
        raw_schemes = REAL_GOVT_SCHEMES

    print(f"Loaded {len(raw_schemes)} official raw scheme records for ingestion.")

    db = SessionLocal()
    imported_count = 0
    updated_count = 0
    duplicates_skipped = 0

    try:
        existing_schemes = db.query(Scheme).all()
        existing_lookup = {}
        for s in existing_schemes:
            norm_key = (normalize_string(s.name), s.state.lower().strip())
            existing_lookup[norm_key] = s

        for item in raw_schemes:
            name = item.get("name", "").strip()
            source_url = item.get("official_source_url", "").strip()
            state = item.get("state", "All India").strip()
            norm_name_key = (normalize_string(name), state.lower().strip())

            # Deduplication by canonical scheme name and state
            existing = existing_lookup.get(norm_name_key)

            v_status = item.get("verification_status", "PARTIALLY_VERIFIED")
            if v_status not in ["VERIFIED", "PARTIALLY_VERIFIED"]:
                v_status = "PARTIALLY_VERIFIED"

            docs_json = json.dumps(item.get("documents", ["Aadhaar Card", "Identity Proof"]))
            steps_json = json.dumps(item.get("application_steps", ["Visit official portal", "Submit application form"]))
            occ_json = json.dumps(item.get("occupation_rules", []))
            cat_rules_json = json.dumps(item.get("category_rules", []))
            gen_rules_json = json.dumps(item.get("gender_rules", []))
            spec_json = json.dumps(item.get("special_conditions", []))
            states_json = json.dumps(item.get("eligible_states", [state]))
            cats_json = json.dumps(item.get("eligible_categories", []))
            occs_json = json.dumps(item.get("eligible_occupations", []))
            genders_json = json.dumps(item.get("eligible_genders", []))

            if existing:
                if existing.verification_status == "PARTIALLY_VERIFIED" and v_status == "VERIFIED":
                    existing.full_description = item.get("full_description", existing.full_description)
                    existing.official_application_url = item.get("official_application_url", existing.official_application_url)
                    existing.verification_status = "VERIFIED"
                    existing.last_verified_at = item.get("last_verified_at", "2026-08-20")
                    updated_count += 1
                else:
                    duplicates_skipped += 1
                continue

            new_scheme = Scheme(
                name=name,
                short_name=item.get("short_name"),
                short_description=item.get("short_description", name),
                full_description=item.get("full_description", item.get("short_description", name)),
                state=state,
                district=item.get("district"),
                scheme_type=item.get("scheme_type", "Central"),
                government_level=item.get("government_level", "Central"),
                ministry=item.get("ministry"),
                department=item.get("department"),
                category=item.get("category", "General"),
                sub_category=item.get("sub_category"),
                benefit=item.get("benefit", "Financial & Welfare Support"),
                benefit_amount=item.get("benefit_amount"),
                launch_year=item.get("launch_year"),
                status=item.get("status", "Active"),
                target_beneficiaries=item.get("target_beneficiaries"),
                eligibility_mode=item.get("eligibility_mode", "DETERMINISTIC"),
                eligibility_description=item.get("eligibility_description"),
                min_age=item.get("min_age", 0),
                max_age=item.get("max_age", 120),
                max_income=item.get("max_income", 10000000.0),
                occupation_rules=occ_json,
                category_rules=cat_rules_json,
                gender_rules=gen_rules_json,
                disability_rules=item.get("disability_rules"),
                special_conditions=spec_json,
                eligible_states=states_json,
                eligible_categories=cats_json,
                eligible_occupations=occs_json,
                eligible_genders=genders_json,
                documents=docs_json,
                application_steps=steps_json,
                deadline=item.get("deadline", "Open scheme"),
                active=True,
                official_source_url=source_url or "https://www.myscheme.gov.in/",
                official_application_url=item.get("official_application_url") or source_url or "https://www.myscheme.gov.in/",
                source_name=item.get("source_name", "National Portal of India / myScheme"),
                last_verified_at=item.get("last_verified_at", "2026-08-20"),
                verification_status=v_status
            )
            
            db.add(new_scheme)
            existing_lookup[norm_name_key] = new_scheme
            imported_count += 1

        db.commit()
        print(f"\n[OK] Import Complete!")
        print(f"     - Newly Imported Schemes: {imported_count}")
        print(f"     - Updated Schemes: {updated_count}")
        print(f"     - Duplicates Skipped: {duplicates_skipped}")
        print(f"     - Total Schemes in DB: {db.query(Scheme).count()}")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Ingestion failed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    import_real_schemes()
