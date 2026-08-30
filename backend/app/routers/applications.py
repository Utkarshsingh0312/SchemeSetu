import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.domain import User, Application, Scheme
from app.schemas.domain import ApplicationOut, ApplicationUpdate
from app.auth.jwt import require_current_user
from app.routers.schemes import format_scheme
from app.services.eligibility import parse_json_list

router = APIRouter(prefix="/api/applications", tags=["Applications"])

def format_application(app: Application) -> ApplicationOut:
    return ApplicationOut(
        id=app.id,
        scheme=format_scheme(app.scheme),
        status=app.status,
        notes=app.notes,
        documents_ready=parse_json_list(app.documents_ready),
        created_at=app.created_at,
        updated_at=app.updated_at
    )

@router.get("", response_model=List[ApplicationOut])
def get_applications(current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    apps = db.query(Application).filter(Application.user_id == current_user.id).all()
    return [format_application(a) for a in apps]

@router.post("/{scheme_id}", response_model=ApplicationOut)
def create_or_get_application(scheme_id: int, current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    
    app = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.scheme_id == scheme_id
    ).first()

    if not app:
        app = Application(
            user_id=current_user.id,
            scheme_id=scheme_id,
            status="Documents Pending",
            notes="Started via SchemeSetu Passbook"
        )
        db.add(app)
        db.commit()
        db.refresh(app)
    
    return format_application(app)

@router.put("/{app_id}", response_model=ApplicationOut)
def update_application(app_id: int, app_in: ApplicationUpdate, current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    app = db.query(Application).filter(
        Application.id == app_id,
        Application.user_id == current_user.id
    ).first()
    
    if not app:
        raise HTTPException(status_code=404, detail="Application record not found")
    
    app.status = app_in.status
    if app_in.notes is not None:
        app.notes = app_in.notes
    if app_in.documents_ready is not None:
        app.documents_ready = json.dumps(app_in.documents_ready)

    db.commit()
    db.refresh(app)
    return format_application(app)
