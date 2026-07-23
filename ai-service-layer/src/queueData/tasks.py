import asyncio
import hashlib
import json
import logging

from aiocache import Cache
from celery import Celery

from ..backendCalls import send_to_node_server, send_to_node_server_quiz
from ..models import Item, Quiz
from ..workerQuizGenerator import generate_quiz
from ..workerSummarizer.service import summarize_url

logger = logging.getLogger(__name__)
app = Celery("tasks", broker="redis://localhost")


def _build_cache(namespace: str) -> Cache:
    return Cache(
        Cache.REDIS,
        endpoint="localhost",
        port=6379,
        namespace=namespace,
    )


@app.task(name="queueData.add")
def add(item_dict):
    item = Item(**item_dict)
    summary = summarize_url(item.url, item.content)

    url_hash = hashlib.sha256(item.url.encode()).hexdigest()
    cache_key = f"study:{url_hash}"
    cache = _build_cache("study")
    summary_payload = {
        "url": item.url,
        "content": summary.key_points,
        "subtopic": summary.subtopic,
    }

    asyncio.run(cache.set(cache_key, json.dumps(summary_payload), ttl=3600))

    send_to_node_server(item, summary.key_points)

    return {"success": True, "message": "api call success summary stored"}


@app.task(name="queueData.add_quiz")
def add_quiz(quiz_dict):
    quiz_request = Quiz(**quiz_dict)
    generated_quiz = generate_quiz(quiz_request)
    url_hash = hashlib.sha256(generated_quiz.url.encode()).hexdigest()
    cache_key = f"quiz:{url_hash}"
    cache = _build_cache("quiz")
    quiz_payload = {
    "url": generated_quiz.url,
    "quiz": generated_quiz.quiz.model_dump(),
}


    asyncio.run(cache.set(cache_key, json.dumps(quiz_payload), ttl=3600))

    send_to_node_server_quiz(generated_quiz)

    return {"success": True, "message": "api call success quiz stored"}
