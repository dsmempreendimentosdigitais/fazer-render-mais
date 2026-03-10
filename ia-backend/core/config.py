import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://pguser:pgpassword@localhost:5432/fazerrender_ai")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-api-key")

settings = Settings()
