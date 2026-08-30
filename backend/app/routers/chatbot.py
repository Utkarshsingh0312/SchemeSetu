from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.domain import ChatMessage, ChatResponse
from app.services.chatbot import process_chat_query

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])

@router.post("/query", response_model=ChatResponse)
def chat_query(msg: ChatMessage, db: Session = Depends(get_db)):
    return process_chat_query(msg.query, db)
