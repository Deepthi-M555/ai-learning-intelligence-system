import json

from src.config.redis import redis_client

CACHE_EXPIRY = 60 * 60 * 24  # 24 hours


class CacheService:

    @staticmethod
    def get(key: str):
        data = redis_client.get(key)

        if data:
            return json.loads(data)

        return None

    @staticmethod
    def set(key: str, value):
        if hasattr(value, "model_dump"):
            value = value.model_dump()

        redis_client.setex(
            key,
            CACHE_EXPIRY,
            json.dumps(value)
        )