from sqlalchemy import func

from app.models import Transaction, RecoveryOutcome
from app.services.recommendation_service import build_recommendation


def get_failed_payments(db, merchant_id, limit=20):
    payments = (
        db.query(Transaction)
        .filter(
            Transaction.merchant_id == merchant_id,
            func.lower(Transaction.payment_status) == "failed"
        )
        .limit(limit)
        .all()
    )

    return [
        build_recommendation(payment)
        for payment in payments
    ]


def get_payment_by_id(
    db,
    merchant_id,
    transaction_id
):
    payment = (
        db.query(Transaction)
        .filter(
            Transaction.merchant_id == merchant_id,
            Transaction.transaction_id == transaction_id
        )
        .first()
    )

    return (
        build_recommendation(payment)
        if payment
        else None
    )


def get_recovery_summary(db, merchant_id):

    # All transactions belonging to this merchant
    merchant_transactions = (
        db.query(Transaction)
        .filter(
            Transaction.merchant_id == merchant_id
        )
        .all()
    )

    transaction_ids = [
        transaction.transaction_id
        for transaction in merchant_transactions
    ]

    # Current failed transactions
    failed = [
        transaction
        for transaction in merchant_transactions
        if (transaction.payment_status or "").lower()
        == "failed"
    ]

    recommendations = [
        build_recommendation(payment)
        for payment in failed
    ]

    current_at_risk = sum(
        item["amount"]
        for item in recommendations
    )

    current_expected = sum(
        item["expected_recovery"]
        for item in recommendations
    )

    # Successful outcomes only for this merchant
    if transaction_ids:
        outcomes = (
            db.query(RecoveryOutcome)
            .filter(
                RecoveryOutcome.transaction_id.in_(
                    transaction_ids
                ),
                func.upper(
                    RecoveryOutcome.outcome
                ) == "SUCCESS"
            )
            .all()
        )
    else:
        outcomes = []

    recovered_by_transaction = {}

    for outcome in outcomes:
        amount = outcome.recovered_amount or 0.0

        previous = recovered_by_transaction.get(
            outcome.transaction_id,
            0.0
        )

        recovered_by_transaction[
            outcome.transaction_id
        ] = max(
            previous,
            amount
        )

    recovered_revenue = sum(
        recovered_by_transaction.values()
    )

    successful_recoveries = len(
        recovered_by_transaction
    )

    before_failed_payments = (
        len(failed) + successful_recoveries
    )

    before_at_risk_revenue = (
        current_at_risk + recovered_revenue
    )

    recovery_rate = (
        (
            recovered_revenue
            / before_at_risk_revenue
        ) * 100
        if before_at_risk_revenue > 0
        else 0
    )

    return {
        "failed_payments": len(failed),

        "at_risk_revenue": round(
            current_at_risk,
            2
        ),

        "expected_recovery": round(
            current_expected,
            2
        ),

        "recovered_revenue": round(
            recovered_revenue,
            2
        ),

        "recovery_rate": round(
            recovery_rate,
            2
        ),

        "before_failed_payments":
            before_failed_payments,

        "before_at_risk_revenue": round(
            before_at_risk_revenue,
            2
        ),

        "after_failed_payments":
            len(failed),

        "after_at_risk_revenue": round(
            current_at_risk,
            2
        ),

        "successful_recoveries":
            successful_recoveries,

        "revenue_saved": round(
            recovered_revenue,
            2
        ),
    }