# 1. Define Data Schema (Matches JS payload)
from typing import List, Optional
from pydantic import BaseModel


class Classification(BaseModel):
    track: str
    topic: str
    subtopics: List[str]
    resource_type: str
    problem_difficulty: Optional[str] = None


class Item(BaseModel):
    activityId: str
    url: str
    title: str
    content: str
    platform: str
    classification: Optional[Classification] = None
    callbackUrl: Optional[str] = None