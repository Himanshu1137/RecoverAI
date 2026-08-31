from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models import Merchant
from app.tools.recovery_tools import get_recovery_summary
from app.dependencies.auth import get_current_merchant


router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)


@router.get("/summary")
def summary(
    db: Session = Depends(get_db),
    current_merchant: Merchant = Depends(get_current_merchant)
):
    return get_recovery_summary(
        db,
        current_merchant.merchant_id
    )