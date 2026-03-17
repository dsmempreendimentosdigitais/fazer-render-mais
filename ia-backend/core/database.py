from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from .config import settings
import os

def get_vector_store():
    print(f"DEBUG: Initializing Vector Store with API Key starting with: {settings.GOOGLE_API_KEY[:5]}...")
    try:
        embeddings = GoogleGenerativeAIEmbeddings(
            model="text-embedding-004",
            google_api_key=settings.GOOGLE_API_KEY
        )
        
        # Use FAISS for local test, load existing index if present
        if os.path.exists("faiss_index"):
            print("DEBUG: Loading existing FAISS index")
            store = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
        else:
            print("DEBUG: No FAISS index found. Creating dummy index.")
            # Create an empty or dummy one to avoid crashes before ingestion
            store = FAISS.from_texts(["Fazer Render AI Inicializado. Bem-vindo!"], embeddings)
        
        return store
    except Exception as e:
        print(f"ERROR: Failed to initialize vector store: {e}")
        raise e

def save_vector_store(store):
    store.save_local("faiss_index")
