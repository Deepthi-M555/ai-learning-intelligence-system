from langchain_core.prompts import ChatPromptTemplate

from src.models.classification_result import (
    ClassificationResult,
)
from src.parsers.json_parser import JsonParser
from src.prompts.classification.system_prompt import (
    CLASSIFICATION_SYSTEM_PROMPT,
)
from src.services.llm_service import LLMService


class ClassificationService:
    """
    Uses the LLM to classify processed
    educational learning content.
    """

    def __init__(self):

        self.llm = LLMService()

        self.prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    CLASSIFICATION_SYSTEM_PROMPT,
                ),
                (
                    "human",
                    "{user_prompt}",
                ),
            ]
        )

    def classify(
        self,
        processed_context,
        platform: str | None,
        title: str | None,
        url: str | None,
    ) -> ClassificationResult:

        chain = self.prompt | self.llm.llm

        response = chain.invoke(
            {
                "user_prompt": self._build_user_prompt(
                    processed_context,
                    platform,
                    title,
                    url,
                )
            }
        )

        parsed = JsonParser.parse(response.content)

        return ClassificationResult(
            track=parsed["track"],
            topic=parsed["topic"],
            subtopics=parsed["subtopics"],
            resource_type=parsed["resourceType"],
            problem_difficulty=parsed.get(
                "problemDifficulty"
            ),
        )

    def _build_user_prompt(
        self,
        context,
        platform: str | None,
        title: str | None,
        url: str | None,
    ) -> str:

        return f"""
Platform:
{platform or "Unknown"}

Title:
{title or "Unknown"}

URL:
{url or "Unknown"}

Content:
{context.content}
"""