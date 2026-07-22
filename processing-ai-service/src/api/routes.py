from fastapi import APIRouter

from src.config.settings import settings
from src.schemas.health import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/")
def root():
    return {
        "message": "Processing AI Service Running"
    }

@router.get("/health")
def health():
    return {
        "success": True,
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "healthy"
    }