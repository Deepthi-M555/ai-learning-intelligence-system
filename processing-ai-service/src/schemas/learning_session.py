from typing import Any

from pydantic import BaseModel, Field


class LearningSession(BaseModel):

    activityId: str

    sessionId: str

    platform: str

    title: str

    url: str

    content: str | None = None

    metadata: dict[str, Any] = Field(default_factory=dict)

    activeStudyTime: int

    startedAt: str

    completedAt: str