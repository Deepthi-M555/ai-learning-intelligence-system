def router_node(state):
    """
    Router node.

    It doesn't modify the state.
    It simply forwards the state to the
    conditional edge.
    """

    return state


def should_fetch(state):
    """
    Decide whether webpage fetching
    is required.
    """

    content = state.get("content")

    if content and content.strip():
        return "processing"

    return "fetch"