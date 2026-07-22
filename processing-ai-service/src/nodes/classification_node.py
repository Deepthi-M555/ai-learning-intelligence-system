from src.services.classification_service import ClassificationService

classification_service = ClassificationService()


def classification_node(state):

    state["classification"] = classification_service.classify(
        processed_context=state["processed_context"],
        platform=state.get("platform"),
        title=state.get("title"),
        url=state.get("url"),
    )

    return state