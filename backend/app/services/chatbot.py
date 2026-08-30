import re
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.domain import Scheme
from app.schemas.domain import SchemeOut, ChatResponse
from app.services.eligibility import format_scheme_out

CIVIC_DISCLAIMER = "SchemeSetu is an independent prototype and is not affiliated with the Government of India. Eligibility information should be verified on the official scheme portal before applying."

def process_chat_query(query: str, db: Session) -> ChatResponse:
    q_lower = query.lower().strip()
    is_hindi = bool(re.search(r'[\u0900-\u097F]', query)) or any(k in q_lower for k in ["kya", "kaise", "yojana", "batao", "bataiye", "hindi"])
    
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

    if "student" in q_lower or "scholarship" in q_lower or "छात्र" in q_lower or "छात्रवृत्ति" in q_lower:
        if is_hindi:
            answer = "हमारे डेटाबेस में कई छात्रवृत्ति और छात्र सहायता योजनाएं (जैसे उत्तर-मैट्रिक छात्रवृत्ति, केंद्रीय क्षेत्र छात्रवृत्ति) उपलब्ध हैं। अपने राज्य, श्रेणी और आय सीमाओं के विरुद्ध सटीक पात्रता की जांच करने के लिए स्कीमसेतु में अपनी प्रोफ़ाइल भरें।"
        else:
            answer = "We found several scholarships and student support schemes in our database (e.g. Post-Matric Scholarship, Central Sector Scholarship). Fill out your profile in SchemeSetu to check exact eligibility against your state, category, and income limits."
    elif "farmer" in q_lower or "kisan" in q_lower or "agriculture" in q_lower or "किसान" in q_lower or "कृषि" in q_lower:
        if is_hindi:
            answer = "किसानों के लिए, स्कीमसेतु पीएम-किसान, किसान क्रेडिट कार्ड (केसीसी), और पीएम फसल बीमा योजना जैसी योजनाओं को ट्रैक करता है। आप आवश्यक दस्तावेज़ और आधिकारिक लिंक सीधे अपनी पासबुक में देख सकते हैं।"
        else:
            answer = "For farmers, SchemeSetu tracks schemes like PM-KISAN, Kisan Credit Card (KCC), and PM Fasal Bima Yojana. You can view required documents and official links directly in your Passbook."
    elif "document" in q_lower or "paper" in q_lower or "दस्तावेज़" in q_lower or "कागज़" in q_lower:
        if is_hindi:
            answer = "अधिकांश कल्याणकारी योजनाओं के लिए आधार कार्ड, आय प्रमाण पत्र, बैंक पासबुक, निवास प्रमाण पत्र और जाति/श्रेणी प्रमाण पत्र जैसे मानक दस्तावेज़ों की आवश्यकता होती है। स्कीमसेतु का प्रत्येक योजना विवरण पृष्ठ सटीक दस्तावेज़ चेकलिस्ट प्रदान करता है।"
        else:
            answer = "Most welfare schemes require standard document proofs such as Aadhaar Card, Income Certificate, Bank Passbook, Residence Proof, and Caste/Category Certificate. Each scheme detail page on SchemeSetu provides an exact document checklist."
    elif "health" in q_lower or "hospital" in q_lower or "ayushman" in q_lower or "स्वास्थ्य" in q_lower or "अस्पताल" in q_lower:
        if is_hindi:
            answer = "आयुष्मान भारत (पीएम-जय) जैसी स्वास्थ्य बीमा योजनाएं माध्यमिक और तृतीयक अस्पताल में भर्ती के लिए प्रति परिवार प्रति वर्ष ₹5 लाख तक का कवरेज प्रदान करती हैं। मानदंडों की पुष्टि के लिए अपनी पात्रता प्रोफ़ाइल देखें।"
        else:
            answer = "Health insurance schemes like Ayushman Bharat (PM-JAY) provide coverage up to ₹5 lakh per family per year for secondary and tertiary hospitalization. Check your eligibility profile to verify criteria."
    elif matched_schemes:
        if is_hindi:
            answer = f"आपके प्रश्न के आधार पर, मुझे स्कीमसेतु डेटाबेस में {len(matched_schemes)} प्रासंगिक योजना(एं) मिलीं। आप नीचे विवरण की समीक्षा कर सकते हैं या पूर्ण पात्रता का परीक्षण करने के लिए अपनी प्रोफ़ाइल बना सकते हैं।"
        else:
            answer = f"Based on your question, I found {len(matched_schemes)} relevant scheme(s) in the SchemeSetu database. You can review the details below or build your profile to test full eligibility."
    else:
        if is_hindi:
            answer = "मुझे उस प्रश्न के लिए हमारे योजना डेटाबेस में कोई सीधा मेल नहीं मिला। कृपया अपनी पात्रता प्रोफ़ाइल बनाएं या श्रेणी (किसान, छात्र, स्वास्थ्य, पेंशन आदि) के अनुसार खोजें। आवेदन करने से पहले आधिकारिक सरकारी पोर्टल पर अंतिम विवरण सत्यापित करना याद रखें।"
        else:
            answer = "I couldn't find a direct match in our scheme database for that query. Please build your eligibility profile or search by category (Farmers, Students, Health, Pension, etc.). Remember to verify final details on the official government portal."

    return ChatResponse(
        answer=answer,
        related_schemes=formatted_related,
        disclaimer=CIVIC_DISCLAIMER
    )
