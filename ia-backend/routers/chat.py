from fastapi import APIRouter
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from core.database import get_vector_store
from core.config import settings
import logging
import urllib.request
import json
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

def get_current_macro_data():
    try:
        url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json"
        with urllib.request.urlopen(url, timeout=3) as response:
            data = json.loads(response.read().decode())
            return data[0]['valor']
    except Exception as e:
        logger.warning(f"Could not fetch BCB data: {e}")
        return "10.50" # Fallback

class ChatRequest(BaseModel):
    user_id: str
    message: str
    context: dict = {} # Could contain the user's progress, time of day etc.

class ChatResponse(BaseModel):
    reply: str

@router.post("/", response_model=ChatResponse)
async def chat_with_ia(request: ChatRequest):
    try:
        store = get_vector_store()
        retriever = store.as_retriever(search_kwargs={"k": 3})
        
        docs = retriever.invoke(request.message)
        context_text = "\n\n".join([doc.page_content for doc in docs])
        
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.7,
            max_output_tokens=2048,
        )
        
        current_selic = get_current_macro_data()
        current_date = datetime.now().strftime("%d/%m/%Y")
        
        plan = request.context.get("plan", "FREE").upper()

        if plan in ["ADMIN", "PREMIUM"]:
            plan_instructions = (
                "[NÍVEL DE ACESSO: PREMIUM/ADMIN - ACESSO TOTAL]\n"
                "O usuário possui o plano Avançado. Você está **LIVRE** para analisar, ensinar e recomendar sobre TODO e QUALQUER tipo de investimento, "
                "incluindo Ações (Nacionais e Internacionais), Fundos de Investimentos avançados, Criptomoedas, e Carteiras Recomendadas completas com base no cenário."
            )
        else:
            plan_instructions = (
                f"[NÍVEL DE ACESSO: {plan} - LIMITADO]\n"
                "Atenção: O plano atual do usuário libera **somente** discussões sobre Renda Fixa, Tesouro Direto, Fundos Imobiliários (FIIs) e educação financeira genérica ou poupança.\n"
                "REGRA DE OURO: Se ele perguntar sobre Ações, Fundos Multimercado/Internacionais, Opções, ou pedir Carteiras Recomendadas avançadas, **VOCÊ DEVE RECUSAR EDUCADAMENTE**, "
                "explicando que essas análises avançadas são um recurso exclusivo do Plano PREMIUM (R$ 49,90) e convide-o a fazer o upgrade no menu de Planos."
            )
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """Você é o Fazer Render+ IA, um tutor de educação financeira super inteligente, prestativo e baseado nos ensinamentos dos maiores investidores da história.
            
            [CONTEXTO MACROECONÔMICO EM TEMPO REAL]
            Hoje é {current_date}. 
            A Taxa Básica de Juros do Brasil (Taxa Selic) ACABOU de ser puxada direto do Banco Central e está exatamente em: {current_selic}% ao ano. 
            Sempre use essa exata taxa ao fazer comparações com a Poupança ou rendimentos de Renda Fixa para o usuário. 
            Seja didático! A poupança perde agressivamente para a inflação.

            {plan_instructions}

            [SUA ESTRUTURA DE RESPOSTA OBRIGATÓRIA]
            1. 🎯 RESPOSTA DIRETA: Responda o usuário de forma prática e certeira.
            2. 🧠 O PRINCÍPIO POR TRÁS: Explique usando os ensinamentos da nossa base de conhecimentos (faça citações curtas aos mestres).
            3. ⚡ COMO APLICAR AGORA: Um passo a passo (como abrir conta ou investir 50 reais nisso).
            4. ⚠️ CUIDADOS E LIMITAÇÕES: Riscos reais e armadilhas para iniciantes evitarem.
            5. 📚 PRÓXIMO PASSO NO APP: Incentive o usuário a simular isso no "Simulador da plataforma" ou assistir a "Trilha 1".
            
            Baseie-se fielmente neste conhecimento:
            {context}"""),
            ("user", "{message}")
        ])
        
        chain = prompt | llm
        response = chain.invoke({
            "context": context_text,
            "message": request.message,
            "current_selic": current_selic,
            "current_date": current_date,
            "plan_instructions": plan_instructions
        })
        
        return ChatResponse(reply=response.content)
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        # Retornando o erro em desenvolvimento/debug para facilitar a vida do usuário
        return ChatResponse(reply=f"⚠️ Erro Interno na IA (Backend): {str(e)}")
