from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, recommendations
import uvicorn
import os

app = FastAPI(
    title="Fazer Render+ IA Tutor",
    description="API for the Fazer Render+ AI Tutor and Recommendations",
    version="1.0.0"
)

# Adicionando CORS para o frontend na Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rota de raiz para Health Check do Render (Garante 200 OK)
@app.get("/")
@app.head("/")
async def root():
    return {"status": "online", "message": "Fazer Render+ IA Backend is running!"}

# Incluindo as rotas funcionais
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    # O Render define a variável PORT automaticamente
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
