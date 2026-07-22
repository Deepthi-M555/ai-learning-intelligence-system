from langgraph.graph import StateGraph, END

from src.state.learning_state import LearningState

from src.nodes.router_node import (
    router_node,
    should_fetch
)

from src.nodes.fetch_node import fetch_node
from src.nodes.processing_node import processing_node
from src.nodes.classification_node import classification_node


builder = StateGraph(LearningState)

builder.add_node(
    "router",
    router_node
)

builder.add_node(
    "fetch",
    fetch_node
)

builder.add_node(
    "processing",
    processing_node
)

builder.add_node(
    "classification",
    classification_node
)

builder.set_entry_point(
    "router"
)

builder.add_conditional_edges(
    "router",
    should_fetch,
    {
        "fetch": "fetch",
        "processing": "processing"
    }
)

builder.add_edge(
    "fetch",
    "processing"
)

builder.add_edge(
    "processing",
    "classification"
)

builder.add_edge(
    "classification",
    END
)

learning_graph = builder.compile()