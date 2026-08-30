from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.domain import User, SavedScheme, Scheme, Profile
from app.schemas.domain import SavedSchemeOut, SchemeOut
from app.auth.jwt import require_current_user
from app.routers.schemes import format_scheme

router = APIRouter(prefix="/api/passbook", tags=["Passbook"])

@router.get("", response_model=List[SavedSchemeOut])
def get_saved_schemes(current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    saved = db.query(SavedScheme).filter(SavedScheme.user_id == current_user.id).all()
    return [
        SavedSchemeOut(
            id=item.id,
            scheme=format_scheme(item.scheme),
            created_at=item.created_at
        ) for item in saved
    ]

@router.post("/save/{scheme_id}", response_model=SavedSchemeOut)
def save_scheme(scheme_id: int, current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    existing = db.query(SavedScheme).filter(
        SavedScheme.user_id == current_user.id,
        SavedScheme.scheme_id == scheme_id
    ).first()
    
    if existing:
        return SavedSchemeOut(id=existing.id, scheme=format_scheme(existing.scheme), created_at=existing.created_at)

    saved = SavedScheme(user_id=current_user.id, scheme_id=scheme_id)
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return SavedSchemeOut(id=saved.id, scheme=format_scheme(saved.scheme), created_at=saved.created_at)

@router.delete("/save/{scheme_id}")
def remove_saved_scheme(scheme_id: int, current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    saved = db.query(SavedScheme).filter(
        SavedScheme.user_id == current_user.id,
        SavedScheme.scheme_id == scheme_id
    ).first()
    if saved:
        db.delete(saved)
        db.commit()
    return {"message": "Scheme removed from passbook"}
