from fastapi import APIRouter, FastAPI, status, Header
from fastapi.middleware.cors import CORSMiddleware
import logging
from typing import Optional
import uvicorn 
from src.models import Item, Quiz
from src.queueData import add, add_quiz, cache_by_url, cache_by_url_quiz

app = FastAPI()

router = APIRouter(prefix="/api")

@router.post("/learning-session", status_code=status.HTTP_200_OK)
@cache_by_url()
async def create_item(item: Item, authorization: Optional[str] = Header(None)):
    task = add.delay(item.model_dump())

    return {
        "success": True,
        "status": "Processing",
        "task_id": task.id,
    }

@router.post("/quiz-generate", status_code=status.HTTP_200_OK)
@cache_by_url_quiz()
async def create_quiz(item: Quiz, authorization: Optional[str] = Header(None)):
    task = add_quiz.delay(item.model_dump())
    return {
        "success": True,
        "message": "Processing",
        "task_id": task.id,
    }

# FIXED: Removed duplicate prefix='/api' here
app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "ai-service-layer-running"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def main():
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)

if __name__ == "__main__":
   uvicorn.run("main:app", port=5000) 
