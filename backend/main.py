from fastapi import FastAPI, APIRouter, Query
from pydantic import BaseModel, Field
from typing import List
from bson import ObjectId
from db import chat_collection
from datetime import datetime
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="JournalBot API",
    version="1.0",
    docs_url="/api/docs",    
)

router = APIRouter(prefix="/api")  

def serialize_chat(chat):
    chat["_id"] = str(chat["_id"])
    return chat

class Chat(BaseModel):
    user_id: str
    message: str
    response: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

def generate_response(user_message: str) -> str:
    if "happy" in user_message.lower():
        return "That's great to hear! What made you feel happy today?"
    elif "sad" in user_message.lower():
        return "I'm sorry you're feeling down. Want to talk about it?"
    else:
        return "That’s an interesting reflection. Keep noticing your emotions — they guide your growth."

@router.post("/chats")
async def save_chat(chat: Chat):
    new_chat = {
        "user_id": chat.user_id,
        "message": chat.message,
        "response": generate_response(chat.message),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    result = await chat_collection.insert_one(new_chat)
    new_chat["_id"] = str(result.inserted_id)
    return {"status": "success", "chat": new_chat}

@router.get("/chats", response_model=List[dict])
async def get_chats(
    user_id: Optional[str] = Query(
        None,
        description="Filter chats by user ID",
        example="demo_user"
    ),
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None
):
    query = {}

    if user_id:
        query["user_id"] = user_id

    date_filter = {}
    if date_from:
        date_filter["$gte"] = date_from
    if date_to:
        date_filter["$lte"] = date_to

    if date_filter:
        query["created_at"] = date_filter

    chats = await chat_collection.find(query).sort("created_at", -1).to_list(length=100)

    return [serialize_chat(chat) for chat in chats]

app.include_router(router)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)