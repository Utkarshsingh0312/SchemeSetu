import json
from typing import List, Dict, Any
from app.models.domain import Scheme, Profile
from app.schemas.domain import MatchResult, SchemeOut, ProfileSchema

CIVIC_DISCLAIMER = "SchemeSetu provides information for discovery and guidance. Final eligibility, benefits, documents and application status must be confirmed on the official government portal."

STATE_ALIAS_MAP = {
    "andhra pradesh": "Andhra Pradesh", "ap": "Andhra Pradesh", "a.p.": "Andhra Pradesh",
    "arunachal pradesh": "Arunachal Pradesh",
    "assam": "Assam", "as": "Assam",
    "bihar": "Bihar", "br": "Bihar",
    "chhattisgarh": "Chhattisgarh", "cg": "Chhattisgarh", "c.g.": "Chhattisgarh",
    "goa": "Goa", "ga": "Goa",
    "gujarat": "Gujarat", "gj": "Gujarat",
    "haryana": "Haryana", "hr": "Haryana",
    "himachal pradesh": "Himachal Pradesh", "hp": "Himachal Pradesh",
    "jharkhand": "Jharkhand", "jh": "Jharkhand",
    "karnataka": "Karnataka", "ka": "Karnataka",
    "kerala": "Kerala", "kl": "Kerala",
    "madhya pradesh": "Madhya Pradesh", "mp": "Madhya Pradesh",
    "maharashtra": "Maharashtra", "mh": "Maharashtra",
    "manipur": "Manipur", "mn": "Manipur",
    "meghalaya": "Meghalaya", "ml": "Meghalaya",
    "mizoram": "Mizoram", "mz": "Mizoram",
    "nagaland": "Nagaland", "nl": "Nagaland",
    "odisha": "Odisha", "orissa": "Odisha", "od": "Odisha",
    "punjab": "Punjab", "pb": "Punjab",
    "rajasthan": "Rajasthan", "rj": "Rajasthan",
    "sikkim": "Sikkim", "sk": "Sikkim",
    "tamil nadu": "Tamil Nadu", "tn": "Tamil Nadu",
    "telangana": "Telangana", "tg": "Telangana", "ts": "Telangana",
    "tripura": "Tripura", "tr": "Tripura",
    "uttar pradesh": "Uttar Pradesh", "up": "Uttar Pradesh", "u.p.": "Uttar Pradesh", "u.p": "Uttar Pradesh",
    "uttarakhand": "Uttarakhand", "uttaranchal": "Uttarakhand", "uk": "Uttarakhand",
    "west bengal": "West Bengal", "wb": "West Bengal",
    "delhi": "Delhi", "nct of delhi": "Delhi", "dl": "Delhi",
    "jammu and kashmir": "Jammu and Kashmir", "jammu & kashmir": "Jammu and Kashmir", "j&k": "Jammu and Kashmir", "jk": "Jammu and Kashmir",
    "ladakh": "Ladakh", "la": "Ladakh",
    "chandigarh": "Chandigarh", "ch": "Chandigarh",
    "puducherry": "Puducherry", "pondicherry": "Puducherry", "py": "Puducherry",
    "andaman and nicobar islands": "Andaman and Nicobar Islands", "andaman & nicobar": "Andaman and Nicobar Islands",
    "dadra and nagar haveli and daman and diu": "Dadra and Nagar Haveli and Daman and Diu", "dnh & dd": "Dadra and Nagar Haveli and Daman and Diu",
    "lakshadweep": "Lakshadweep", "ld": "Lakshadweep"
}

CATEGORY_ALIAS_MAP = {
    "sc": "SC", "scheduled caste": "SC", "scheduled castes": "SC",
    "st": "ST", "scheduled tribe": "ST", "scheduled tribes": "ST",
    "obc": "OBC", "other backward class": "OBC", "other backward classes": "OBC", "other backward category": "OBC",
    "general": "General", "gen": "General", "unreserved": "General",
    "ews": "EWS", "economically weaker section": "EWS", "economically weaker sections": "EWS"
}

def canonicalize_state(state_name: str) -> str:
    if not state_name:
        return ""
    clean = state_name.strip().lower()
    return STATE_ALIAS_MAP.get(clean, state_name.strip())

def canonicalize_category(cat_name: str) -> str:
    if not cat_name:
        return ""
    clean = cat_name.strip().lower()
    return CATEGORY_ALIAS_MAP.get(clean, cat_name.strip())

def is_state_eligible(scheme_state: str, scheme_eligible_states: List[str], user_state: str) -> bool:
    c_user_state = canonicalize_state(user_state)
    c_scheme_state = canonicalize_state(scheme_state)
    
    if c_scheme_state in ["All India", "Central", "National", ""]:
        return True

    if c_scheme_state == c_user_state:
        return True

    if scheme_eligible_states:
        c_eligible = [canonicalize_state(st) for st in scheme_eligible_states]
        if "All India" in c_eligible or c_user_state in c_eligible:
            return True

    return False

def is_category_eligible(scheme_cat_rules: List[str], user_category: str) -> tuple:
    if not scheme_cat_rules:
        return True, "No category restrictions"

    c_user_cat = canonicalize_category(user_category)
    c_rules = [canonicalize_category(r) for r in scheme_cat_rules]

    if "All" in c_rules or "Any" in c_rules or "all" in [r.lower() for r in scheme_cat_rules]:
        return True, f"Social category match ({user_category})"

    if c_user_cat in c_rules:
        return True, f"Social category match ({user_category})"

    return False, f"Scheme requires {', '.join(scheme_cat_rules)} category (Your category: {user_category})"

def parse_json_list(value: Any) -> List[str]:
    if not value:
        return []
    if isinstance(value, list):
        return [str(item) for item in value]
    try:
        data = json.loads(value)
        if isinstance(data, list):
            return [str(item) for item in data]
        return [str(data)]
    except Exception:
        return [str(value)]

def format_scheme_out(s: Scheme) -> SchemeOut:
    return SchemeOut(
        id=s.id,
        name=s.name,
        short_name=s.short_name,
        short_description=s.short_description,
        full_description=s.full_description,
        state=s.state,
        district=s.district,
        scheme_type=s.scheme_type,
        government_level=s.government_level or "Central",
        ministry=s.ministry,
        department=s.department,
        category=s.category,
        sub_category=s.sub_category,
        display_category=getattr(s, "display_category", None) or s.category,
        benefit=s.benefit,
        benefit_amount=s.benefit_amount,
        launch_year=s.launch_year,
        status=s.status or "Active",
        target_beneficiaries=s.target_beneficiaries,
        eligibility_mode=s.eligibility_mode or "DETERMINISTIC",
        eligibility_description=s.eligibility_description,
        min_age=s.min_age,
        max_age=s.max_age,
        max_income=s.max_income,
        occupation_rules=parse_json_list(s.occupation_rules),
        category_rules=parse_json_list(s.category_rules),
        gender_rules=parse_json_list(s.gender_rules),
        disability_rules=s.disability_rules,
        special_conditions=parse_json_list(s.special_conditions),
        eligible_states=parse_json_list(s.eligible_states),
        eligible_categories=parse_json_list(s.eligible_categories),
        eligible_occupations=parse_json_list(s.eligible_occupations),
        eligible_genders=parse_json_list(s.eligible_genders),
        documents=parse_json_list(s.documents),
        application_steps=parse_json_list(s.application_steps),
        deadline=s.deadline,
        active=s.active,
        official_source_url=s.official_source_url,
        official_application_url=s.official_application_url,
        source_name=s.source_name,
        last_verified_at=s.last_verified_at,
        verification_status=s.verification_status,
        created_at=s.created_at
    )

def evaluate_eligibility(scheme: Scheme, profile: ProfileSchema) -> MatchResult:
    scheme_out = format_scheme_out(scheme)
    eligible_states_list = parse_json_list(scheme.eligible_states)
    category_rules_list = parse_json_list(scheme.category_rules)
    gender_rules_list = parse_json_list(scheme.gender_rules)
    occupation_rules_list = parse_json_list(scheme.occupation_rules)
    special_conditions_list = parse_json_list(scheme.special_conditions)

    matched = []
    failed = []

    # 1. Mandatory State / Geographic Check
    if not is_state_eligible(scheme.state, eligible_states_list, profile.state):
        failed.append(f"Scheme restricted to {scheme.state} (Your state: {profile.state})")
    else:
        matched.append(f"State match ({profile.state})")

    # 2. Mandatory Category Check
    cat_match, cat_reason = is_category_eligible(category_rules_list, profile.category)
    if not cat_match:
        failed.append(cat_reason)
    else:
        matched.append(cat_reason)

    # 3. Mandatory Gender Check
    if gender_rules_list and "Any" not in gender_rules_list and "All" not in gender_rules_list:
        if profile.gender not in gender_rules_list:
            failed.append(f"Target gender: {', '.join(gender_rules_list)} (Your gender: {profile.gender})")
        else:
            matched.append(f"Gender criteria met ({profile.gender})")

    # 4. Mandatory Age Check
    min_a = scheme.min_age or 0
    max_a = scheme.max_age or 120
    if not (min_a <= profile.age <= max_a):
        failed.append(f"Age requirement: {min_a}-{max_a} years (Your age: {profile.age})")
    else:
        matched.append(f"Age match ({profile.age} yrs within {min_a}-{max_a})")

    # 5. Mandatory Income Check
    if scheme.max_income is not None:
        if profile.annual_income > scheme.max_income:
            failed.append(f"Income ceiling ₹{scheme.max_income:,.0f} (Your income: ₹{profile.annual_income:,.0f})")
        else:
            matched.append(f"Income match (₹{profile.annual_income:,.0f} <= ₹{scheme.max_income:,.0f})")

    # 6. Mandatory Occupation Check
    if occupation_rules_list and "All" not in occupation_rules_list and "Any" not in occupation_rules_list:
        if profile.occupation not in occupation_rules_list:
            failed.append(f"Eligible occupations: {', '.join(occupation_rules_list)} (Your occupation: {profile.occupation})")
        else:
            matched.append(f"Occupation match ({profile.occupation})")

    # 7. Mandatory Special Conditions Check
    if special_conditions_list:
        user_spec_flags = {
            "farmer": profile.farmer,
            "student": profile.student,
            "bpl": profile.bpl,
            "senior_citizen": profile.senior_citizen,
            "widow": profile.widow,
            "pregnant": profile.pregnant,
            "rural_resident": profile.rural_resident,
            "entrepreneur": profile.entrepreneur,
            "disability": profile.disability_status,
        }
        for rule in special_conditions_list:
            rule_key = rule.lower()
            if rule_key in user_spec_flags and not user_spec_flags[rule_key]:
                failed.append(f"Requires special condition: {rule.capitalize()}")

    # 8. Mandatory Disability Status Check
    if bool(scheme.disability_rules) and not profile.disability_status:
        failed.append("Requires Person with Disability (PwD) status")

    # Hard Failure Rule: If ANY mandatory criterion failed, return eligible=False and score=0
    if failed:
        return MatchResult(
            scheme=scheme_out,
            eligible=False,
            score=0,
            matched_criteria=matched,
            failed_criteria=failed,
            near_match=False,
            explanation_summary=f"Did not meet {len(failed)} mandatory criteria: {', '.join(failed)}",
            disclaimer=CIVIC_DISCLAIMER
        )

    # DETAIL_REVIEW Handling (All known explicit criteria PASSED)
    if scheme.eligibility_mode == "DETAIL_REVIEW":
        matched.append("General eligibility description available")
        return MatchResult(
            scheme=scheme_out,
            eligible=True,
            score=70,
            matched_criteria=matched,
            failed_criteria=[],
            near_match=False,
            explanation_summary="Eligibility details require review on the official scheme portal.",
            disclaimer=CIVIC_DISCLAIMER
        )

    # DETERMINISTIC Scoring System (All mandatory criteria PASSED)
    score = 100
    summary = f"Matched all {len(matched)} criteria with Profile Match score of 100%."

    return MatchResult(
        scheme=scheme_out,
        eligible=True,
        score=score,
        matched_criteria=matched,
        failed_criteria=[],
        near_match=False,
        explanation_summary=summary,
        disclaimer=CIVIC_DISCLAIMER
    )
