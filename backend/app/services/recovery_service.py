import random

from app.models import RecoveryAction, RecoveryOutcome


def simulate_recovery(db, transaction_id, action_type, expected_recovery, probability):
    action = RecoveryAction(
        transaction_id=transaction_id,
        action_type=action_type,
        expected_recovery=expected_recovery,
        status="PROCESSING",
    )
    db.add(action)
    db.flush()

    success = random.random() <= probability
    outcome = "SUCCESS" if success else "FAILED"
    recovered_amount = expected_recovery / probability if success and probability > 0 else 0.0

    # Demo simulation: on success, treat the original payment amount as recovered.
    # The route may override this with the actual payment amount.
    result = RecoveryOutcome(
        action_id=action.id,
        transaction_id=transaction_id,
        outcome=outcome,
        recovered_amount=round(recovered_amount, 2),
    )

    action.status = outcome
    db.add(result)
    db.commit()
    db.refresh(action)
    db.refresh(result)

    return action, result
