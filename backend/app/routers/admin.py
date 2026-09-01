import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.domain import User, Scheme
from app.schemas.domain import SchemeCreate, SchemeOut
from app.auth.jwt import require_admin
from app.routers.schemes import format_scheme

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/schemes", response_model=List[SchemeOut])
def admin_get_all_schemes(admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    schemes = db.query(Scheme).order_by(Scheme.id.desc()).all()
    return [format_scheme(s) for s in schemes]

@router.post("/schemes", response_model=SchemeOut)
def admin_create_scheme(scheme_in: SchemeCreate, admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    scheme = Scheme(
        name=scheme_in.name,
        short_description=scheme_in.short_description,
        full_description=scheme_in.full_description,
        state=scheme_in.state,
        scheme_type=scheme_in.scheme_type,
        category=scheme_in.category,
        benefit=scheme_in.benefit,
        benefit_amount=scheme_in.benefit_amount,
        min_age=scheme_in.min_age,
        max_age=scheme_in.max_age,
        max_income=scheme_in.max_income,
        occupation_rules=json.dumps(scheme_in.occupation_rules or []),
        category_rules=json.dumps(scheme_in.category_rules or []),
        gender_rules=json.dumps(scheme_in.gender_rules or []),
        disability_rules=scheme_in.disability_rules,
        special_conditions=json.dumps(scheme_in.special_conditions or []),
        documents=json.dumps(scheme_in.documents or []),
        application_steps=json.dumps(scheme_in.application_steps or []),
        deadline=scheme_in.deadline,
        active=scheme_in.active,
        official_source_url=scheme_in.official_source_url,
        official_application_url=scheme_in.official_application_url,
        source_name=scheme_in.source_name,
        last_verified_at=scheme_in.last_verified_at,
        verification_status=scheme_in.verification_status
    )
    db.add(scheme)
    db.commit()
    db.refresh(scheme)
    return format_scheme(scheme)

@router.put("/schemes/{scheme_id}", response_model=SchemeOut)
def admin_update_scheme(scheme_id: int, scheme_in: SchemeCreate, admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    
    scheme.name = scheme_in.name
    scheme.short_description = scheme_in.short_description
    scheme.full_description = scheme_in.full_description
    scheme.state = scheme_in.state
    scheme.scheme_type = scheme_in.scheme_type
    scheme.category = scheme_in.category
    scheme.benefit = scheme_in.benefit
    scheme.benefit_amount = scheme_in.benefit_amount
    scheme.min_age = scheme_in.min_age
    scheme.max_age = scheme_in.max_age
    scheme.max_income = scheme_in.max_income
    scheme.occupation_rules = json.dumps(scheme_in.occupation_rules or [])
    scheme.category_rules = json.dumps(scheme_in.category_rules or [])
    scheme.gender_rules = json.dumps(scheme_in.gender_rules or [])
    scheme.disability_rules = scheme_in.disability_rules
    scheme.special_conditions = json.dumps(scheme_in.special_conditions or [])
    scheme.documents = json.dumps(scheme_in.documents or [])
    scheme.application_steps = json.dumps(scheme_in.application_steps or [])
    scheme.deadline = scheme_in.deadline
    scheme.active = scheme_in.active
    scheme.official_source_url = scheme_in.official_source_url
    scheme.official_application_url = scheme_in.official_application_url
    scheme.source_name = scheme_in.source_name
    scheme.last_verified_at = scheme_in.last_verified_at
    scheme.verification_status = scheme_in.verification_status

    db.commit()
    db.refresh(scheme)
    return format_scheme(scheme)

@router.delete("/schemes/{scheme_id}")
def admin_delete_scheme(scheme_id: int, admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    scheme.active = False
    db.commit()
    return {"message": "Scheme deactivated"}

# --- ADMIN SUPPORT CHAT ENDPOINTS ---
from app.models.domain import Conversation, ChatMessageRecord
from app.schemas.domain import ConversationListItemOut, ChatMessageRecordOut, AdminReplyMessage
import datetime

@router.get("/conversations", response_model=List[ConversationListItemOut])
def admin_get_conversations(admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    convs = db.query(Conversation).order_by(Conversation.updated_at.desc()).all()
    result = []
    for c in convs:
        last_msg = db.query(ChatMessageRecord).filter(ChatMessageRecord.conversation_id == c.id).order_by(ChatMessageRecord.created_at.desc()).first()
        unread_cnt = db.query(ChatMessageRecord).filter(
            ChatMessageRecord.conversation_id == c.id,
            ChatMessageRecord.sender_type == "user",
            ChatMessageRecord.is_read == False
        ).count()
        
        result.append(ConversationListItemOut(
            id=c.id,
            user_id=c.user.id if c.user else c.user_id,
            user_name=c.user.name if c.user else f"User #{c.user_id}",
            user_email=c.user.email if c.user else "citizen@schemesetu.in",
            last_message=last_msg.message if last_msg else None,
            last_message_time=last_msg.created_at if last_msg else c.updated_at,
            unread_count=unread_cnt,
            created_at=c.created_at,
            updated_at=c.updated_at
        ))
    return result

@router.get("/conversations/{conversation_id}", response_model=List[ChatMessageRecordOut])
def admin_get_conversation_messages(conversation_id: int, admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Mark user messages as read by admin when admin views conversation
    unread_user_msgs = db.query(ChatMessageRecord).filter(
        ChatMessageRecord.conversation_id == conv.id,
        ChatMessageRecord.sender_type == "user",
        ChatMessageRecord.is_read == False
    ).all()
    for m in unread_user_msgs:
        m.is_read = True
    if unread_user_msgs:
        db.commit()

    return conv.messages

@router.post("/conversations/{conversation_id}/messages", response_model=ChatMessageRecordOut)
def admin_send_message(conversation_id: int, reply_in: AdminReplyMessage, admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if not reply_in.message or not reply_in.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    now = datetime.datetime.utcnow()
    admin_msg = ChatMessageRecord(
        conversation_id=conv.id,
        sender_type="admin",
        sender_id=admin_user.id,
        message=reply_in.message.strip(),
        is_read=False,
        created_at=now
    )
    db.add(admin_msg)
    conv.updated_at = now
    db.commit()
    db.refresh(admin_msg)

    return admin_msg
