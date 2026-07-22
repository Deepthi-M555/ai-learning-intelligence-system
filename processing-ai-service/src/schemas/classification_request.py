from typing import Any

from pydantic import BaseModel, Field


class ClassificationRequest(BaseModel):
    activity_id: str | None = None
    callback_url: str | None = None

    url: str
    title: str = ""
    content: str = ""
    platform: str = ""
    metadata: dict[str, Any] = Field(
        default_factory=dict
    )