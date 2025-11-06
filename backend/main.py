from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from typing import List
from bson import ObjectId
from db import chat_collection

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

@router.post("/chats")
async def save_chat(chat: Chat):
    new_chat = chat.dict()
    result = await chat_collection.insert_one(new_chat)
    new_chat["_id"] = str(result.inserted_id)
    return {"status": "success", "chat": new_chat}

@router.get("/chats", response_model=List[dict])
async def get_chats(user_id: str = None):
    query = {"user_id": user_id} if user_id else {}
    chats = await chat_collection.find(query).to_list(length=100)
    return [serialize_chat(chat) for chat in chats]


app.include_router(router)
