from langchain_core.messages import HumanMessage

from src.integrations.llm.providers import get_llm


class LLMService:
    """
    Service responsible for communicating with the configured LLM.
    """

    def __init__(self):
        self.llm = get_llm()

    def invoke(self, prompt: str) -> str:
        """
        Send a prompt to the LLM and return the generated text.
        """

        response = self.llm.invoke(
            [
                HumanMessage(content=prompt)
            ]
        )

        return response.content