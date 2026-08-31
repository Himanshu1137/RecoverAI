from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas import AgentRequest
from app.models import Merchant
from app.agents.agent import run_agent
from app.tools.recovery_tools import get_failed_payments
from app.dependencies.auth import get_current_merchant


router = APIRouter(
    prefix="/api/agent",
    tags=["AI Agent"]
)


@router.get("/recommendations")
def recommendations(
    db: Session = Depends(get_db),
    current_merchant: Merchant = Depends(get_current_merchant)
):
    return {
        "recommendations": get_failed_payments(
            db,
            current_merchant.merchant_id,
            limit=50
        )
    }


@router.post("/chat")
def chat(
    request: AgentRequest,
    db: Session = Depends(get_db),
    current_merchant: Merchant = Depends(get_current_merchant)
):
    return {
        "answer": run_agent(
            request.message,
            db,
            current_merchant.merchant_id
        )
    }