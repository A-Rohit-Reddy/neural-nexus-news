import random
from graph.state import AgentState

def quant_node(state: AgentState) -> AgentState:
    """
    Quant Agent: Adds mock market metrics and 'Market Pulse' data.
    """
    news_items = state.get("news_items", [])
    print(f"--- QUANT: Calculating metrics ---")
    
    for item in news_items:
        # Mocking data as requested
        metrics = {
            "github_stars_growth": f"+{random.randint(10, 500)} today",
            "hacker_news_trend": "Rising" if random.random() > 0.5 else "Stable",
            "market_sentiment": random.choice(["Bullish", "Neutral", "Volatile"])
        }
        item["market_metrics"] = metrics
        
    return {
        "news_items": news_items,
        "logs": ["Quant added market metrics."]
    }
