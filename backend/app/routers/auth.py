from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.domain import User, Profile
from app.schemas.domain import UserRegister, UserLogin, Token, UserOut
from app.auth.jwt import get_password_hash, verify_password, create_access_token, require_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_count = db.query(User).count()
    is_admin = True if user_count == 0 or "admin" in user_in.email.lower() else False

    user = User(
        name=user_in.name,
        email=user_in.email.lower().strip(),
        password_hash=get_password_hash(user_in.password),
        is_admin=is_admin
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    profile = Profile(user_id=user.id)
    db.add(profile)
    db.commit()

    token = create_access_token({"sub": str(user.id)})
    return Token(access_token=token, user=UserOut.from_orm(user))

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email.lower().strip()).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"sub": str(user.id)})
    return Token(access_token=token, user=UserOut.from_orm(user))

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(require_current_user)):
    return UserOut.from_orm(current_user)
