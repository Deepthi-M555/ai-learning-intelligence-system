from pydantic import BaseModel

from typing import List, Dict, Any


class ProcessedContext(BaseModel):
    """
    Represents the processed learning content
    that is ready for downstream AI agents.
    """

    content: str

    chunks: List[str]

    metadata: Dict[str, Any]