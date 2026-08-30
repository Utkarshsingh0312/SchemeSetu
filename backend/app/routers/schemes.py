import math
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.domain import Scheme
from app.schemas.domain import SchemeOut, PaginatedSchemesResponse
from app.services.eligibility import format_scheme_out

format_scheme = format_scheme_out

router = APIRouter(prefix="/api/schemes", tags=["Schemes"])

@router.get("/stats/summary")
def get_scheme_stats(db: Session = Depends(get_db)):
    total = db.query(Scheme).filter(Scheme.active == True).count()
    central = db.query(Scheme).filter(Scheme.active == True, Scheme.government_level == "Central").count()
    state_ut = db.query(Scheme).filter(Scheme.active == True, Scheme.government_level != "Central").count()
    verified = db.query(Scheme).filter(Scheme.active == True, Scheme.verification_status == "VERIFIED").count()
    partially_verified = db.query(Scheme).filter(Scheme.active == True, Scheme.verification_status == "PARTIALLY_VERIFIED").count()
    
    return {
        "total_schemes": total,
        "central_schemes": central,
        "state_ut_schemes": state_ut,
        "verified_schemes": verified,
        "partially_verified_schemes": partially_verified
    }

@router.get("", response_model=PaginatedSchemesResponse)
def get_schemes(
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100),
    category: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    government_level: Optional[str] = Query(None),
    ministry: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Scheme).filter(Scheme.active == True)
    
    if category and category.lower() != "all":
        query = query.filter(Scheme.category.ilike(f"%{category}%"))
    
    if state and state.lower() != "all india":
        query = query.filter((Scheme.state == "All India") | (Scheme.state.ilike(f"%{state}%")))
        
    if government_level and government_level.lower() != "all":
        query = query.filter(Scheme.government_level.ilike(f"%{government_level}%"))

    if ministry and ministry.lower() != "all":
        query = query.filter(Scheme.ministry.ilike(f"%{ministry}%"))

    if search:
        s_pattern = f"%{search.strip()}%"
        query = query.filter(
            (Scheme.name.ilike(s_pattern)) |
            (Scheme.short_description.ilike(s_pattern)) |
            (Scheme.category.ilike(s_pattern)) |
            (Scheme.ministry.ilike(s_pattern)) |
            (Scheme.benefit.ilike(s_pattern))
        )

    total = query.count()
    total_pages = max(1, math.ceil(total / page_size))
    
    offset = (page - 1) * page_size
    schemes = query.order_by(Scheme.id.asc()).offset(offset).limit(page_size).all()
    
    items = [format_scheme_out(s) for s in schemes]
    
    return PaginatedSchemesResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/{scheme_id}", response_model=SchemeOut)
def get_scheme_by_id(scheme_id: int, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return format_scheme_out(scheme)
