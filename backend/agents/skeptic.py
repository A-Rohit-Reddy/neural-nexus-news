import json
import re
from agents.util import get_llm
from graph.state import AgentState
from langchain_core.prompts import ChatPromptTemplate

def skeptic_node(state: AgentState) -> AgentState:
    """
    Skeptic Agent: Verifies news items, marking them as Rumor or Confirmed.
    """
    news_items = state.get("news_items", [])
    print(f"--- SKEPTIC: Verifying {len(news_items)} items ---")
    
    llm = get_llm()
    
    verified_items = []
    
    for item in news_items:
        prompt = ChatPromptTemplate.from_template(
            """
            Analyze the following news snippet. 
            Is it a verifiable fact from a credible source or likely a rumor/speculation?
            
            Content: {summary}
            Source: {url}
            
            Return JSON with:
            - status: "confirmed" or "rumor"
            - reasoning: short explanation
            
            IMPORTANT: Return ONLY valid JSON. No markdown formatting.
            """
        )
        chain = prompt | llm
        
        try:
            response = chain.invoke({"summary": item["summary"], "url": item["url"]})
            content = response.content.strip()
            
            # Robust JSON cleaning
            content = re.sub(r"```json", "", content)
            content = re.sub(r"```", "", content)
            content = content.strip()
            
            data = json.loads(content)
            status = data.get("status", "rumor").lower()
            item["status"] = status
            item["technical_details"] = {"verification_note": data.get("reasoning")}
        except Exception as e:
            print(f"Skeptic Error on item {item.get('title')}: {e}")
            # Fallback: If source mentions a reputable domain, assume confirmed, else rumor
            if any(x in item["url"] for x in ["techcrunch", "wired", "theverge", "arxiv", "github", "openai", "google", "microsoft"]):
                item["status"] = "confirmed"
                item["technical_details"] = {"verification_note": "Auto-confirmed by trusted domain fallback."}
            else:
                item["status"] = "rumor"
            
        if item["status"] == "confirmed":
            verified_items.append(item)
    
    # CRITICAL: If no confirmed items, allowed top 3 rumors to proceed as "Unverified Reports"
    # This ensures the pipeline doesn't dry up.
    if not verified_items and news_items:
        print("--- SKEPTIC: No confirmed facts found. Promoting top rumors to keep pipeline alive. ---")
        for item in news_items[:3]:
             item["status"] = "rumor" # Keep status as rumor
             verified_items.append(item)

    log_entry = f"Skeptic passed {len(verified_items)}/{len(news_items)} items."
    return {
        "news_items": verified_items,
        "logs": [log_entry]
    }
