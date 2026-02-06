from langgraph.graph import StateGraph, END
from graph.state import AgentState
from agents.scavenger import scavenger_node
from agents.skeptic import skeptic_node
from agents.analyst import analyst_node
from agents.quant import quant_node
from agents.editor import editor_node
from agents.writer import writer_node
from agents.guardian import guardian_node

def define_graph():
    workflow = StateGraph(AgentState)

    # Add Nodes
    workflow.add_node("scavenger", scavenger_node)
    workflow.add_node("skeptic", skeptic_node)
    workflow.add_node("analyst", analyst_node)
    workflow.add_node("quant", quant_node)
    workflow.add_node("editor", editor_node)
    workflow.add_node("writer", writer_node)
    workflow.add_node("guardian", guardian_node)

    # Set Entry Point
    workflow.set_entry_point("scavenger")

    # Add Edges
    workflow.add_edge("scavenger", "skeptic")
    workflow.add_edge("skeptic", "analyst")
    # Analyst and Quant can run in parallel in theory, but linear for simplicity here
    workflow.add_edge("analyst", "quant")
    workflow.add_edge("quant", "editor")
    workflow.add_edge("editor", "writer")
    workflow.add_edge("writer", "guardian")

    # Conditional Edge for Guardian
    def guardian_check(state: AgentState):
        feedback = state.get("guardian_feedback", "")
        if "FAIL" in feedback:
            return "writer"  # Loop back to writer for revision (simple retry)
        return "end"

    workflow.add_conditional_edges(
        "guardian",
        guardian_check,
        {
            "writer": "writer",
            "end": END
        }
    )

    return workflow.compile()
