import json
from langchain_community.tools.tavily_search import TavilySearchResults
from graph.state import AgentState
from core.config import Config

def scavenger_node(state: AgentState) -> AgentState:
    """
    Scavenger Agent: Searches for recent AI news using Tavily.
    """
    topic = state.get("topic", "AI News")
    print(f"--- SCAVENGER: Searching for {topic} ---")
    
    search = TavilySearchResults(
        tavily_api_key=Config.TAVILY_API_KEY,
        max_results=10,
        search_depth="advanced"
    )
    
    try:
        results = search.invoke(topic)
    except Exception as e:
        return {"logs": [f"Scavenger Error: {str(e)}"]}

    news_items = []
    for res in results:
        news_items.append({
            "title": res.get("content", "")[:50] + "...", # rough title fallback
            "url": res.get("url"),
            "summary": res.get("content"),
            "source": res.get("url"),
            "status": "pending",
            "technical_details": None,
            "market_metrics": None
        })

    log_entry = f"Scavenger found {len(news_items)} raw items."
    return {
        "news_items": news_items, 
        "logs": [log_entry]
    }
