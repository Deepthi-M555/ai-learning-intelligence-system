from typing import TypedDict

from src.models.processed_context import ProcessedContext
from src.models.classification_result import ClassificationResult


class LearningState(TypedDict, total=False):

    # ---------- Input ----------

    url: str

    platform: str

    title: str

    content: str

    metadata: dict

    # ---------- Fetch ----------

    fetched_content: str

    # ---------- Processing ----------

    processed_context: ProcessedContext

    # ---------- Classification ----------

    classification: ClassificationResult

    