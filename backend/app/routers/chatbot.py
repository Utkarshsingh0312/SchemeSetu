import json
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.domain import User, Conversation, ChatMessageRecord
from app.schemas.domain import ChatMessage, ChatResponse, ChatMessageRecordOut
from app.services.chatbot import process_chat_query
from app.auth.jwt import get_current_user, require_current_user

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])

def get_or_create_user_conversation(user_id: int, db: Session) -> Conversation:
    conv = db.query(Conversation).filter(Conversation.user_id == user_id).first()
    if not conv:
        conv = Conversation(user_id=user_id)
        db.add(conv)
        db.commit()
        db.refresh(conv)
    return conv

@router.get("/messages", response_model=List[ChatMessageRecordOut])
def get_user_messages(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    conv = get_or_create_user_conversation(current_user.id, db)
    # Mark admin messages as read when user fetches messages
    unread_admin = db.query(ChatMessageRecord).filter(
        ChatMessageRecord.conversation_id == conv.id,
        ChatMessageRecord.sender_type == "admin",
        ChatMessageRecord.is_read == False
    ).all()
    for m in unread_admin:
        m.is_read = True
    if unread_admin:
        db.commit()

    return conv.messages

@router.get("/unread-count")
def get_unread_count(
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user:
        return {"unread_count": 0}
    
    conv = db.query(Conversation).filter(Conversation.user_id == current_user.id).first()
    if not conv:
        return {"unread_count": 0}
    
    count = db.query(ChatMessageRecord).filter(
        ChatMessageRecord.conversation_id == conv.id,
        ChatMessageRecord.sender_type == "admin",
        ChatMessageRecord.is_read == False
    ).count()
    
    return {"unread_count": count}

@router.post("/read")
def mark_read(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(Conversation.user_id == current_user.id).first()
    if conv:
        unread_admin = db.query(ChatMessageRecord).filter(
            ChatMessageRecord.conversation_id == conv.id,
            ChatMessageRecord.sender_type == "admin",
            ChatMessageRecord.is_read == False
        ).all()
        for m in unread_admin:
            m.is_read = True
        db.commit()
    return {"status": "ok"}

@router.post("/query", response_model=ChatResponse)
def chat_query(
    msg: ChatMessage,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ai_response = process_chat_query(msg.query, db)

    if current_user:
        conv = get_or_create_user_conversation(current_user.id, db)
        now = datetime.datetime.utcnow()

        # Save user message
        user_msg = ChatMessageRecord(
            conversation_id=conv.id,
            sender_type="user",
            sender_id=current_user.id,
            message=msg.query,
            is_read=True,
            created_at=now
        )
        db.add(user_msg)

        # Save AI response message
        related_json = json.dumps([s.dict() for s in ai_response.related_schemes], default=str) if ai_response.related_schemes else None
        ai_msg = ChatMessageRecord(
            conversation_id=conv.id,
            sender_type="ai",
            message=ai_response.answer,
            related_schemes=related_json,
            disclaimer=ai_response.disclaimer,
            is_read=True,
            created_at=now + datetime.timedelta(milliseconds=100)
        )
        db.add(ai_msg)

        conv.updated_at = now
        db.commit()

    return ai_response
