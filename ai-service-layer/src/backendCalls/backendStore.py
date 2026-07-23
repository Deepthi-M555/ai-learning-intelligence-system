import logging
import json
import requests

from src.config import get_settings

logger = logging.getLogger(__name__)
NODE_SERVER_URL_SUMMARY= get_settings().NODE_SERVER_URL_SUMMARY
NODE_SERVER_URL_QUIZ=get_settings().NODE_SERVER_URL_QUIZ

def send_to_node_server(item, content: str) -> dict:
    payload = {
        "activityId": item.activityId,
        "url": item.url,
        "title": item.title,
        "content": content,
        "platform": item.platform,
        "classification": item.classification.model_dump(),
        "callbackUrl": item.callbackUrl,
    }

    logger.info(
        "Sending summary payload for activityId=%s url=%s",
        item.activityId,
        item.url,
    )

    print(json.dumps(payload, indent=2))

    try:
        response = requests.post(NODE_SERVER_URL_SUMMARY, json=payload)
        response.raise_for_status()

        logger.info(
            "Backend summary callback succeeded for activityId=%s",
            item.activityId,
        )

        return {
            "status": "success",
            "data": response.json(),
        }

    except requests.exceptions.RequestException as e:
        logger.exception(
            "Backend summary callback failed for activityId=%s",
            item.activityId,
        )
        return {
            "status": "error",
            "message": str(e),
        }

def send_to_node_server_quiz(quiz) -> dict:
    payload = {
    "activityId": quiz.activityId,    
    "status": "COMPLETED",
    "quiz": quiz.quiz.model_dump(),
}

    logger.info(
        "Sending quiz callback for activityId=%s",
        quiz.activityId,
    )

    print(json.dumps(payload, indent=2))

    try:
        response = requests.post(quiz.callbackUrl, json=payload)
        response.raise_for_status()

        logger.info(
            "Backend quiz callback succeeded for activityId=%s",
            quiz.activityId,
        )

        return {
            "status": "success",
            "data": response.json(),
        }

    except requests.exceptions.RequestException as e:
        logger.exception(
            "Backend quiz callback failed for activityId=%s",
            quiz.activityId,
        )
        return {
            "status": "error",
            "message": str(e),
        }