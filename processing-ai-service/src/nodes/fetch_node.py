from src.fetchers.fetch_service import FetchService

fetch_service = FetchService()


def fetch_node(state):

    fetched = fetch_service.fetch(
        state["url"]
    )

    state.update(fetched)

    return state