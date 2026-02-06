from agents.util import get_llm
from graph.state import AgentState
from langchain_core.prompts import ChatPromptTemplate

def analyst_node(state: AgentState) -> AgentState:
    """
    Analyst Agent: Extracts technical details (params, benchmarks).
    """
    news_items = state.get("news_items", [])
    print(f"--- ANALYST: Analyzing {len(news_items)} items ---")
    
    if not news_items:
        return {"logs": ["Analyst skipped: No items to analyze."]}

    llm = get_llm()
    prompt = ChatPromptTemplate.from_template(
        """
        Extract technical details from this news summary.
        Look for: Model sizes, Benchmark scores, GitHub repo links, Architecture details.
        
        Summary: {summary}
        
        Return a short paragraph summarizing technical specs.
        """
    )
    
    for item in news_items:
        try:
            res = prompt | llm
            response = res.invoke({"summary": item["summary"]})
            # Append to existing details or create new
            current_tech = item.get("technical_details") or {}
            current_tech["analysis"] = response.content
            item["technical_details"] = current_tech
        except Exception as e:
            pass

    return {
        "news_items": news_items,
        "logs": ["Analyst enriched items with technical data."]
    }
