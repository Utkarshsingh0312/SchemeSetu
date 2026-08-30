import sys
import os
import json
from collections import Counter
import urllib.parse

# Add backend root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal
from app.models.domain import Scheme

def is_valid_url(url: str) -> bool:
    if not url or not isinstance(url, str):
        return False
    try:
        result = urllib.parse.urlparse(url.strip())
        return all([result.scheme in ['http', 'https'], result.netloc])
    except Exception:
        return False

def audit_schemes():
    db = SessionLocal()
    try:
        schemes = db.query(Scheme).all()
        total_schemes = len(schemes)

        print("==================================================")
        print("    SCHEMESETU FULL DATASET & SOURCE AUDIT        ")
        print("==================================================\n")

        print(f"Total Distinct Schemes in Database: {total_schemes}")

        # 1. Government Level Breakdown
        govt_levels = Counter([s.government_level for s in schemes])
        print("\n--- Government Level Breakdown ---")
        print(f"  Central Government: {govt_levels.get('Central', 0)}")
        print(f"  State Government: {govt_levels.get('State', 0)}")
        print(f"  Union Territory: {govt_levels.get('Union Territory', 0)}")

        # 2. Verification & Eligibility Mode Breakdown
        ver_status = Counter([s.verification_status for s in schemes])
        elig_modes = Counter([s.eligibility_mode for s in schemes])
        print("\n--- Verification & Eligibility Mode Breakdown ---")
        print(f"  VERIFIED: {ver_status.get('VERIFIED', 0)}")
        print(f"  PARTIALLY_VERIFIED: {ver_status.get('PARTIALLY_VERIFIED', 0)}")
        print(f"  DETERMINISTIC / STRUCTURED: {elig_modes.get('DETERMINISTIC', 0) + elig_modes.get('STRUCTURED', 0)}")
        print(f"  DETAIL_REVIEW: {elig_modes.get('DETAIL_REVIEW', 0)}")

        # 3. Source Breakdown Report
        source_counts = Counter()
        for s in schemes:
            src = s.source_name or "Other Official Source"
            if "myscheme" in src.lower():
                source_counts["myScheme.gov.in"] += 1
            elif "india.gov.in" in src.lower() or "national portal" in src.lower():
                source_counts["India.gov.in"] += 1
            elif "ministry" in src.lower() or "central" in src.lower():
                source_counts["Central Ministries"] += 1
            elif "state" in src.lower() or s.government_level == "State":
                source_counts["State Portals"] += 1
            elif s.government_level == "Union Territory":
                source_counts["UT Portals"] += 1
            else:
                source_counts["Other Official Sources"] += 1

        print("\n--- Source Distribution Report ---")
        for src_name, count in source_counts.most_common():
            print(f"  - {src_name}: {count}")

        # 4. State / UT Coverage Distribution
        state_counts = Counter([s.state for s in schemes])
        print("\n--- State & UT Coverage Distribution (Top 20) ---")
        for st, count in state_counts.most_common(20):
            print(f"  - {st}: {count}")

        # 5. Quality & Data Integrity Checks
        missing_source_url = []
        invalid_urls = []
        missing_essential = []
        suspicious_records = []
        seen_names = set()
        duplicates = []

        for s in schemes:
            norm_name = f"{s.name.lower().strip()}--{s.state.lower().strip()}"
            if norm_name in seen_names:
                duplicates.append(s)
            else:
                seen_names.add(norm_name)

            if not s.official_source_url or s.official_source_url.strip() == "":
                missing_source_url.append(s)

            if s.official_source_url and not is_valid_url(s.official_source_url):
                invalid_urls.append((s.id, s.name, s.official_source_url))

            if not s.benefit or not s.short_description or not s.category:
                missing_essential.append(s)

            if s.official_source_url and not any(dom in s.official_source_url.lower() for dom in ['.gov.in', '.nic.in', '.in', '.org.in', '.edu.in', 'http']):
                suspicious_records.append((s.id, s.name, s.official_source_url, "Non-standard domain"))

        print("\n--- Data Quality & Integrity Audits ---")
        print(f"  Duplicates Detected: {len(duplicates)}")
        print(f"  Missing Official Source URL: {len(missing_source_url)}")
        print(f"  Invalid Source URLs: {len(invalid_urls)}")
        print(f"  Missing Essential Info (Benefit/Desc): {len(missing_essential)}")
        print(f"  Records Requiring Review: {len(suspicious_records)}")

        print("\n==================================================")
        print("          DATASET AUDIT COMPLETE                 ")
        print("==================================================")

        return {
            "total_schemes": total_schemes,
            "central": govt_levels.get('Central', 0),
            "state": govt_levels.get('State', 0),
            "ut": govt_levels.get('Union Territory', 0),
            "verified": ver_status.get('VERIFIED', 0),
            "partially_verified": ver_status.get('PARTIALLY_VERIFIED', 0),
            "deterministic": elig_modes.get('DETERMINISTIC', 0),
            "detail_review": elig_modes.get('DETAIL_REVIEW', 0),
            "duplicates": len(duplicates),
            "invalid_urls": len(invalid_urls),
            "sources": dict(source_counts)
        }
    finally:
        db.close()

if __name__ == "__main__":
    audit_schemes()
