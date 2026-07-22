from typing import Optional

from pydantic import BaseModel


class ClassificationResult(BaseModel):
    """
    Structured output returned
    by the Classification Agent.
    """

    track: str

    topic: str

    subtopics: list[str]

    resource_type: str

    problem_difficulty: Optional[str] = None