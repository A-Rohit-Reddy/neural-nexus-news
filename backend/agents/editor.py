from agents.util import get_llm
from graph.state import AgentState
from langchain_core.prompts import ChatPromptTemplate

def editor_node(state: AgentState) -> AgentState:
    """
    Editor-in-Chief Agent: Decides the tone and structure of the blog post.
    """
    topic = state.get("topic", "")
    items = state.get("news_items", [])
    print(f"--- EDITOR: Planning content for {topic} ---")
    
    if not items:
        return {
            "editor_directives": "No confirmed news found. Cancel publication.",
            "logs": ["Editor found no content to publish."]
        }

    llm = get_llm()
    prompt = ChatPromptTemplate.from_template(
        """
        You are the Editor-in-Chief of 'The Neural Nexus'.
        Topic: {topic}
        Available News Items: {item_count}
        
        Review the items. Some might be "confirmed" facts, others "rumors".
        Decide on a Tone (Neutral, Technical, or Visionary).
        
        Directives:
        1. If mostly rumors, set tone to "Speculative/Investigative" and explicitly warn readers.
        2. If confirmed facts, set tone to "Authoritative".
        3. Prioritize "market_metrics" integration.
        
        Provide diverse directives for the Writer.
        """
    )
    
    response = (prompt | llm).invoke({"topic": topic, "item_count": len(items)})
    
    return {
        "editor_directives": response.content,
        "logs": ["Editor set directives."]
    }
