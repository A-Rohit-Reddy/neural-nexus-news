import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
    MODEL_NAME = os.getenv("MODEL_NAME", "gemini-1.5-flash")

    # Auto-correct common mistakes where .env still has "gpt-4o-mini"
    if "gpt" in MODEL_NAME.lower():
        print(f"⚠️ Warning: MODEL_NAME='{MODEL_NAME}' is invalid for Google API. Switching to 'gemini-1.5-flash'.")
        MODEL_NAME = "gemini-1.5-flash"

    @staticmethod
    def validate():
        if not Config.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY is missing in .env")
        if not Config.TAVILY_API_KEY:
            raise ValueError("TAVILY_API_KEY is missing in .env")
