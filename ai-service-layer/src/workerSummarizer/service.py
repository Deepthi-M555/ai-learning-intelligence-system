from .agent import summarize_web_content
from ..models import WebContentSummary


def summarize_url(url: str, content: str = "") -> WebContentSummary:
    return summarize_web_content(url, content)
