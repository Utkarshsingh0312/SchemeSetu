import os
import json
import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.domain import User, Profile, Scheme, VerificationStatus
from app.auth.jwt import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Admin User Setup/Update
        admin_email = "admin@schemesetu.gov.in"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            admin_user = User(
                name="SchemeSetu Admin",
                email=admin_email,
                password_hash=get_password_hash("admin123"),
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            db.add(Profile(user_id=admin_user.id))
            db.commit()
            print("[OK] Created default admin user: admin@schemesetu.gov.in / admin123")
        else:
            existing_admin.password_hash = get_password_hash("admin123")
            existing_admin.is_admin = True
            db.commit()

        # 2. Demo Citizen User Setup/Update
        demo_email = "demo@schemesetu.gov.in"
        existing_demo = db.query(User).filter(User.email == demo_email).first()
        if not existing_demo:
            demo_user = User(
                name="Ramesh Kumar (Demo Citizen)",
                email=demo_email,
                password_hash=get_password_hash("demo123"),
                is_admin=False
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            demo_profile = Profile(
                user_id=demo_user.id,
                age=22,
                gender="Male",
                state="Uttar Pradesh",
                district="Lucknow",
                annual_income=240000.0,
                occupation="Student",
                employment_status="Student",
                category="OBC",
                disability_status=False,
                marital_status="Single",
                student=True,
                farmer=False,
                bpl=True,
                senior_citizen=False,
                widow=False,
                pregnant=False,
                rural_resident=True,
                entrepreneur=False
            )
            db.add(demo_profile)
            db.commit()
            print("[OK] Created demo citizen user: demo@schemesetu.gov.in / demo123")
        else:
            existing_demo.password_hash = get_password_hash("demo123")
            existing_demo.is_admin = False
            db.commit()

        # 3. Seed Schemes (if count < 800)
        current_count = db.query(Scheme).count()
        if current_count >= 800:
            print(f"[OK] Database already seeded with {current_count} schemes.")
            return

        json_path = os.path.join(os.path.dirname(__file__), 'official_schemes_dataset.json')
        if not os.path.exists(json_path):
            print(f"[WARN] {json_path} not found.")
            return

        print(f"Seeding {json_path} dataset into database...")
        with open(json_path, 'r', encoding='utf-8') as f:
            schemes_data = json.load(f)

        for s_data in schemes_data:
            existing = db.query(Scheme).filter(Scheme.name == s_data["name"]).first()
            if existing:
                continue

            scheme = Scheme(
                name=s_data["name"],
                short_name=s_data.get("short_name"),
                short_description=s_data["short_description"],
                full_description=s_data.get("full_description") or s_data["short_description"],
                state=s_data.get("state", "All India"),
                district=s_data.get("district"),
                scheme_type=s_data.get("scheme_type", "Central"),
                government_level=s_data.get("government_level", "Central"),
                ministry=s_data.get("ministry"),
                department=s_data.get("department"),
                category=s_data.get("category", "General"),
                sub_category=s_data.get("sub_category"),
                display_category=s_data.get("display_category", s_data.get("category", "General")),
                benefit=s_data["benefit"],
                benefit_amount=s_data.get("benefit_amount"),
                launch_year=s_data.get("launch_year"),
                status=s_data.get("status", "Active"),
                target_beneficiaries=s_data.get("target_beneficiaries"),
                eligibility_mode=s_data.get("eligibility_mode", "DETERMINISTIC"),
                eligibility_description=s_data.get("eligibility_description"),
                min_age=s_data.get("min_age", 0),
                max_age=s_data.get("max_age", 120),
                max_income=s_data.get("max_income", 10000000.0),
                occupation_rules=json.dumps(s_data.get("occupation_rules") or []),
                category_rules=json.dumps(s_data.get("category_rules") or []),
                gender_rules=json.dumps(s_data.get("gender_rules") or []),
                disability_rules=s_data.get("disability_rules"),
                special_conditions=json.dumps(s_data.get("special_conditions") or []),
                eligible_states=json.dumps(s_data.get("eligible_states") or []),
                eligible_categories=json.dumps(s_data.get("eligible_categories") or []),
                eligible_occupations=json.dumps(s_data.get("eligible_occupations") or []),
                eligible_genders=json.dumps(s_data.get("eligible_genders") or []),
                documents=json.dumps(s_data.get("documents") or []),
                application_steps=json.dumps(s_data.get("application_steps") or []),
                deadline=s_data.get("deadline", "Open scheme"),
                active=s_data.get("active", True),
                official_source_url=s_data.get("official_source_url", "https://myscheme.gov.in"),
                official_application_url=s_data.get("official_application_url", "https://myscheme.gov.in"),
                source_name=s_data.get("source_name", "Official Portal"),
                last_verified_at=s_data.get("last_verified_at", "2026-08-15"),
                verification_status=s_data.get("verification_status", "VERIFIED")
            )
            db.add(scheme)

        db.commit()
        seeded_total = db.query(Scheme).count()
        print(f"[OK] Database successfully seeded with {seeded_total} verified schemes.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
