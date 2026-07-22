from langchain_groq import ChatGroq

from src.config.settings import settings


def get_llm() -> ChatGroq:
    """
    Create and return a configured Groq LLM instance.
    """

    return ChatGroq(
        api_key=settings.groq_api_key,
        model=settings.model_name,
        temperature=settings.temperature,
    )