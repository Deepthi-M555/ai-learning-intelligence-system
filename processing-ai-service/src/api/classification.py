from celery.result import AsyncResult
from fastapi import APIRouter, HTTPException

from src.celery_app import celery_app
from src.schemas.classification_request import ClassificationRequest
from src.services.cache_service import CacheService
from src.tasks.processing_task import process_learning_task


router = APIRouter(
    prefix="/process",
    tags=["AI Processing"],
)


@router.post("/")
def process_learning(request: ClassificationRequest):

    state = {
        "activity_id": request.activity_id,
        "callback_url": request.callback_url,

        "url": request.url,
        "title": request.title,
        "content": request.content,
        "platform": request.platform,
        "metadata": request.metadata or {},
    }

    cache_key = f"classification:{request.url}"

    cached_result = CacheService.get(cache_key)

    # Already processed before
    if cached_result:
        return {
            "success": True,
            "cached": True,
            "status": "COMPLETED",
            "data": {
                "classification": cached_result
            },
        }

    # Send processing to Celery
    task = process_learning_task.delay(state)

    return {
        "success": True,
        "cached": False,
        "status": "PROCESSING",
        "task_id": task.id,
    }


@router.get("/{task_id}")
def get_processing_result(task_id: str):

    task = AsyncResult(
        task_id,
        app=celery_app,
    )

    if task.state == "PENDING":
        return {
            "success": True,
            "task_id": task_id,
            "status": "PENDING",
        }

    if task.state == "STARTED":
        return {
            "success": True,
            "task_id": task_id,
            "status": "PROCESSING",
        }

    if task.state == "RETRY":
        return {
            "success": True,
            "task_id": task_id,
            "status": "RETRYING",
        }

    if task.state == "FAILURE":
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "task_id": task_id,
                "status": "FAILED",
                "error": str(task.result),
            },
        )

    if task.state == "SUCCESS":
        return {
            "success": True,
            "task_id": task_id,
            "status": "COMPLETED",
            "data": {
                "classification": task.result
            },
        }

    return {
        "success": True,
        "task_id": task_id,
        "status": task.state,
    }