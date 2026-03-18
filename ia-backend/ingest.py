import os
import argparse
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from core.database import get_vector_store
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def ingest_knowledge():
    file_path = "data/knowledge_base.txt"
    if not os.path.exists(file_path):
        logger.error(f"File {file_path} not found.")
        return

    logger.info("Loading documents...")
    loader = TextLoader(file_path, encoding='utf-8')
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", ".", " "]
    )
    splits = text_splitter.split_documents(docs)
    logger.info(f"Split raw knowledge into {len(splits)} chunks.")

    logger.info("Connecting to Vector DB and ingesting...")
    try:
        from langchain_community.vectorstores import FAISS
        from langchain_google_genai import GoogleGenerativeAIEmbeddings
        from core.config import settings
        embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-001",
            google_api_key=settings.GOOGLE_API_KEY
        )
        store = FAISS.from_documents(splits, embeddings)
        store.save_local("faiss_index")
        logger.info("Ingestion complete successfully using FAISS!")
    except Exception as e:
        logger.error(f"Failed to ingest: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest Knowledge Base into PGVector DB")
    args = parser.parse_args()
    ingest_knowledge()
