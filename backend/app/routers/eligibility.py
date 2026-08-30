from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.domain import Scheme
from app.schemas.domain import EligibilityRequest, MatchResult
from app.services.eligibility import evaluate_eligibility

router = APIRouter(prefix="/api/eligibility", tags=["Eligibility"])

@router.post("/match", response_model=List[MatchResult])
def match_eligibility(req: EligibilityRequest, db: Session = Depends(get_db)):
    schemes = db.query(Scheme).filter(Scheme.active == True).all()
    results: List[MatchResult] = []
    
    for scheme in schemes:
        res = evaluate_eligibility(scheme, req.profile)
        results.append(res)
        
    # Sort results by score descending (highest score first)
    results.sort(key=lambda x: (x.eligible, x.near_match, x.score), reverse=True)
    return results
