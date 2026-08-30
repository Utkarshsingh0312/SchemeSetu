from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.domain import Scheme
from app.schemas.domain import SchemeOut, ChatResponse
from app.services.eligibility import format_scheme_out

CIVIC_DISCLAIMER = "SchemeSetu is an independent prototype and is not affiliated with the Government of India. Eligibility information should be verified on the official scheme portal before applying."

def process_chat_query(query: str, db: Session) -> ChatResponse:
    q_lower = query.lower().strip()
    
    schemes = db.query(Scheme).filter(Scheme.active == True).all()
    matched_schemes: List[Scheme] = []

    # Keyword search across schemes
    keywords = q_lower.split()
    for scheme in schemes:
        text_corpus = f"{scheme.name} {scheme.short_description} {scheme.full_description} {scheme.category} {scheme.benefit} {scheme.state}".lower()
        if any(kw in text_corpus for kw in keywords if len(kw) > 2):
            matched_schemes.append(scheme)

    # Format related schemes using format_scheme_out
    formatted_related: List[SchemeOut] = [format_scheme_out(s) for s in matched_schemes[:4]]

    if "student" in q_lower or "scholarship" in q_lower:
        answer = "We found several scholarships and student support schemes in our database (e.g. Post-Matric Scholarship, Central Sector Scholarship). Fill out your profile in SchemeSetu to check exact eligibility against your state, category, and income limits."
    elif "farmer" in q_lower or "kisan" in q_lower or "agriculture" in q_lower:
        answer = "For farmers, SchemeSetu tracks schemes like PM-KISAN, Kisan Credit Card (KCC), and PM Fasal Bima Yojana. You can view required documents and official links directly in your Passbook."
    elif "document" in q_lower or "paper" in q_lower:
        answer = "Most welfare schemes require standard document proofs such as Aadhaar Card, Income Certificate, Bank Passbook, Residence Proof, and Caste/Category Certificate. Each scheme detail page on SchemeSetu provides an exact document checklist."
    elif "health" in q_lower or "hospital" in q_lower or "ayushman" in q_lower:
        answer = "Health insurance schemes like Ayushman Bharat (PM-JAY) provide coverage up to ₹5 lakh per family per year for secondary and tertiary hospitalization. Check your eligibility profile to verify criteria."
    elif matched_schemes:
        answer = f"Based on your question, I found {len(matched_schemes)} relevant scheme(s) in the SchemeSetu database. You can review the details below or build your profile to test full eligibility."
    else:
        answer = "I couldn't find a direct match in our scheme database for that query. Please build your eligibility profile or search by category (Farmers, Students, Health, Pension, etc.). Remember to verify final details on the official government portal."

    return ChatResponse(
        answer=answer,
        related_schemes=formatted_related,
        disclaimer=CIVIC_DISCLAIMER
    )
