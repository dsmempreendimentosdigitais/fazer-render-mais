import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://pguser:pgpassword@localhost:5432/fazerrender_ai")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "your-google-api-key")

settings = Settings()
