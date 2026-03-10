from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ProfileRequest(BaseModel):
    objetivo: str
    prazo_anos: int
    risco: str # Conservador, Moderado, Arrojado

@router.post("/carteira-modelo")
async def get_carteira(profile: ProfileRequest):
    # This logic matches the Fazer Render+ recommended portfolios
    # Here we should query the DB or use a set of rules. For MVP, hardcoded rules match the spec.
    
    if profile.risco == "Conservador" and profile.prazo_anos <= 1:
        return {
            "nome": "Reserva Pura",
            "alocacao": {
                "RF_Liquidez": 100
            },
            "descricao": "100% Tesouro Selic ou CDB liquidez diária. Foco total em segurança e disponibilidade.",
            "proximo_passo": "Simular Reserva de Emergência no app."
        }
        
    if profile.risco == "Conservador" and profile.prazo_anos <= 7:
        return {
            "nome": "Proteção Inflacionária",
            "alocacao": {
                "RF_IPCA": 60,
                "RF_Liquidez_ou_Pre": 40
            },
            "descricao": "60% Tesouro IPCA+ e 40% CDB/LCI. Foco em não perder poder de compra.",
            "proximo_passo": "Aprender sobre IPCA na Trilha 1."
        }

    # Additional logic maps to the rest of the portfolios
    return {
        "nome": "Crescimento Balanceado",
        "alocacao": {
            "RF": 30,
            "FIIs": 25,
            "Acoes_BR": 30,
            "ETF_Intl": 15
        },
        "descricao": "Carteira balanceada para crescimento de longo prazo e alguma renda mensal.",
        "proximo_passo": "Ver aula de diversificação global."
    }
