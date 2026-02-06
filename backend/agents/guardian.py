from agents.util import get_llm
from graph.state import AgentState
from langchain_core.prompts import ChatPromptTemplate

def guardian_node(state: AgentState) -> AgentState:
    """
    Guardian Agent: Compliance and safety check.
    """
    print(f"--- GUARDIAN: Reviewing draft ---")
    draft = state.get("draft_content", "")
    
    if draft == "No content available.":
         return {"guardian_feedback": "PASS", "logs": ["Guardian approved empty state."]}

    llm = get_llm()
    prompt = ChatPromptTemplate.from_template(
        """
        Review the following blog post draft for:
        1. Hallucinations (obvious falsehoods).
        2. Offensive content.
        3. Compliance with AI safety norms.
        
        Draft:
        {draft}
        
        If PASS, reply exactly 'PASS'.
        If FAIL, reply 'FAIL: <reason>'.
        """
    )
    
    response = (prompt | llm).invoke({"draft": draft})
    decision = response.content.strip()
    
    log = f"Guardian decision: {decision}"
    return {
        "guardian_feedback": decision,
        "logs": [log]
    }
