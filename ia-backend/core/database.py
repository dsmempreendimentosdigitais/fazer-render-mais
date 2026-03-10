from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from .config import settings
import os

def get_vector_store():
    embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
    
    # Use FAISS for local test, load existing index if present
    if os.path.exists("faiss_index"):
        store = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    else:
        # Create an empty or dummy one to avoid crashes before ingestion
        store = FAISS.from_texts(["Fazer Render AI Inicializado"], embeddings)
    
    return store

def save_vector_store(store):
    store.save_local("faiss_index")
