from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.domain import User, Profile
from app.schemas.domain import ProfileSchema
from app.auth.jwt import require_current_user

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("", response_model=ProfileSchema)
def get_profile(current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return ProfileSchema.from_orm(profile)

@router.put("", response_model=ProfileSchema)
def update_profile(profile_in: ProfileSchema, current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
    
    for key, value in profile_in.dict().items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return ProfileSchema.from_orm(profile)
