from langchain_google_genai import ChatGoogleGenerativeAI
from core.config import Config

def get_llm():
    return ChatGoogleGenerativeAI(
        model=Config.MODEL_NAME, 
        google_api_key=Config.GOOGLE_API_KEY,
        temperature=0.7
    )
