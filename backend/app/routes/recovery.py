from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies.auth import get_current_merchant
from app.models import Merchant, Transaction, RecoveryOutcome
from app.schemas import RecoveryRequest
from app.services.recovery_service import simulate_recovery


router = APIRouter(
    prefix="/api/recovery",
    tags=["Recovery"]
)


@router.post("/simulate")
def simulate(
    request: RecoveryRequest,
    db: Session = Depends(get_db),
    current_merchant: Merchant = Depends(get_current_merchant)
):
    # Find transaction ONLY for logged-in merchant
    payment = (
        db.query(Transaction)
        .filter(
            Transaction.transaction_id == request.transaction_id,
            Transaction.merchant_id == current_merchant.merchant_id
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    # Prevent duplicate recovery
    if (payment.payment_status or "").upper() == "RECOVERED":
        raise HTTPException(
            status_code=409,
            detail="Transaction already recovered"
        )

    existing_success = (
        db.query(RecoveryOutcome)
        .filter(
            RecoveryOutcome.transaction_id == request.transaction_id,
            RecoveryOutcome.outcome == "SUCCESS"
        )
        .first()
    )

    if existing_success:
        payment.payment_status = "RECOVERED"
        db.commit()

        raise HTTPException(
            status_code=409,
            detail="Transaction already recovered"
        )

    probability = request.recovery_probability / 100.0

    action, result = simulate_recovery(
        db=db,
        transaction_id=request.transaction_id,
        action_type=request.action_type,
        expected_recovery=request.expected_recovery,
        probability=probability
    )

    payment.attempt_number = (
        payment.attempt_number or 0
    ) + 1

    if result.outcome == "SUCCESS":
        payment.payment_status = "RECOVERED"
        result.recovered_amount = payment.amount

    else:
        payment.payment_status = "FAILED"
        result.recovered_amount = 0.0

    db.commit()

    db.refresh(payment)
    db.refresh(action)
    db.refresh(result)

    return {
        "transaction_id": payment.transaction_id,
        "merchant_id": current_merchant.merchant_id,
        "action": action.action_type,
        "outcome": result.outcome,
        "recovered_amount": round(
            result.recovered_amount,
            2
        ),
        "payment_status": payment.payment_status,
        "attempt_number": payment.attempt_number,
        "action_id": action.id
    }