import asyncio
import hashlib
import json
import logging
from functools import wraps

from aiocache import Cache

from ..backendCalls import send_to_node_server, send_to_node_server_quiz

def _build_cache(cache_namespace: str) -> Cache:
    return Cache(
        Cache.REDIS,
        endpoint="localhost",
        port=6379,
        namespace=cache_namespace,
    )


def cache_by_url(namespace: str = "study"):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            print("CACHE DECORATOR ENTERED", flush=True)
            item = kwargs.get("item") or args[0]
            url_hash = hashlib.sha256(item.url.encode()).hexdigest()
            cache_key = f"{namespace}:{url_hash}"
            cache = _build_cache(namespace)
            cached_value = await cache.get(cache_key)

            if cached_value:
                print("Summary cache hit for sessionId=%s", item.activityId)
                cached_payload = json.loads(cached_value)
                await asyncio.to_thread(
                    send_to_node_server,
                    item,
                    cached_payload["content"],
                )
                return {"success": True, "message": "Cache hit"}

            return await func(*args, **kwargs)

        return wrapper

    return decorator


def cache_by_url_quiz(namespace: str = "quiz"):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            quiz = kwargs.get("item") or kwargs.get("quiz") or args[0]
            url_hash = hashlib.sha256(quiz.url.encode()).hexdigest()
            cache_key = f"{namespace}:{url_hash}"
            cache = _build_cache(namespace)
            cached_value = await cache.get(cache_key)

            if cached_value:
                cached_payload = json.loads(cached_value)
                quiz.question_rows = cached_payload["questions"]
                await asyncio.to_thread(send_to_node_server_quiz, quiz)
             
                return {"success": True, "message": "Cache hit"}

          
            return await func(*args, **kwargs)

        return wrapper

    return decorator
