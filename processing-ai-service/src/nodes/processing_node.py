from types import SimpleNamespace

from src.agents.processing.agent import ProcessingAgent

processing_agent = ProcessingAgent()


def processing_node(state):

    session = SimpleNamespace(
        platform=state.get("platform"),
        title=state.get("title"),
        url=state.get("url"),
        metadata=state.get("metadata", {}),
        content=state.get("content")
    )

    state["processed_context"] = processing_agent.process(session)

    return state