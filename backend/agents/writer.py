from agents.util import get_llm
from graph.state import AgentState
from langchain_core.prompts import ChatPromptTemplate

def writer_node(state: AgentState) -> AgentState:
    """
    Writer Agent: Synthesizes the blog post.
    """
    print(f"--- WRITER: Drafting post ---")
    
    directives = state.get("editor_directives", "")
    items = state.get("news_items", [])
    
    if "Cancel publication" in directives:
        return {"draft_content": "No content available.", "logs": ["Writer skipped."]}
        
    llm = get_llm()
    
    # Contextualize items
    items_text = ""
    for idx, item in enumerate(items):
        tech = item.get("technical_details", {})
        market = item.get("market_metrics", {})
        status = item.get("status", "unknown").upper()
        items_text += f"\nItem {idx+1} [{status}]:\nTitle: {item['title']}\nSummary: {item['summary']}\nTechnical Analysis: {tech}\nMarket Data: {market}\nSource: {item['url']}\n"
        
    prompt = ChatPromptTemplate.from_template(
        """
        You are a top-tier AI Tech Blogger. Write a blog post based on these directives and news items.
        
        Directives: {directives}
        
        News Data:
        {items_text}
        
        Requirements:
        - Use Markdown.
        - Include a 'Market Pulse' section.
        - Cite sources.
        - Be engaging but accurate.
        """
    )
    
    response = (prompt | llm).invoke({"directives": directives, "items_text": items_text})
    
    return {
        "draft_content": response.content,
        "logs": ["Writer drafted content."]
    }
