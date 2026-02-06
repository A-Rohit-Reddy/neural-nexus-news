import operator
from typing import Annotated, List, Dict, Any, Optional
from typing_extensions import TypedDict

class NewsItem(TypedDict):
    title: str
    url: str
    summary: str
    source: str
    status: str  # "rumor" | "confirmed"
    technical_details: Optional[Dict[str, Any]]
    market_metrics: Optional[Dict[str, Any]]

class AgentState(TypedDict):
    """
    The state of the Neural Nexus multi-agent system.
    """
    # The search query or topic
    topic: str
    
    # List of potential news items found
    news_items: List[NewsItem]
    
    # Directives from the Editor-in-Chief
    editor_directives: str
    
    # The final generated blog post
    draft_content: str
    
    # Compliance check feedback
    guardian_feedback: str
    
    # Logs of agent actions (for UI) - appending list
    logs: Annotated[List[str], operator.add]
    
    # Current steps taken (for cycle limiting)
    steps: int
