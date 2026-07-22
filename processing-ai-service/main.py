from fastapi import FastAPI

from src.api.routes import router
from src.api.classification import router as classification_router
from src.config.settings import settings
from src.config.redis import redis_client


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)

app.include_router(router)

app.include_router(
    classification_router,
    prefix="/api",
)


@app.on_event("startup")
async def startup_event():
    try:
        redis_client.ping()
        print("✅ Connected to Redis")
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")