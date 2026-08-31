from ml.predict import predict_recovery


def build_explanation(payment, prediction):
    reasons = []

    # Failure reason based explanation
    if payment.failure_reason == "Network Error":
        reasons.append(
            "Network errors are usually temporary and retryable."
        )

    elif payment.failure_reason == "Bank Timeout":
        reasons.append(
            "Bank timeout failures often succeed on a later attempt."
        )

    elif payment.failure_reason == "Authentication Failed":
        reasons.append(
            "Authentication issues may require customer confirmation or a reminder."
        )

    elif payment.failure_reason == "Insufficient Funds":
        reasons.append(
            "Insufficient funds reduce immediate recovery chances and may require a reminder."
        )

    # Previous success rate
    if payment.previous_success_rate >= 0.7:
        reasons.append(
            "The customer has a strong previous payment success rate."
        )

    elif payment.previous_success_rate >= 0.4:
        reasons.append(
            "The customer has a moderate previous payment success rate."
        )

    else:
        reasons.append(
            "The customer's previous payment success rate is relatively low."
        )

    # Customer lifetime value
    if payment.customer_lifetime_value >= 50000:
        reasons.append(
            "The customer has a high lifetime value, making recovery more valuable."
        )

    elif payment.customer_lifetime_value >= 20000:
        reasons.append(
            "The customer has a moderate lifetime value."
        )

    # Attempt count
    if payment.attempt_number <= 1:
        reasons.append(
            "Only a small number of recovery attempts have been made so far."
        )

    elif payment.attempt_number >= 3:
        reasons.append(
            "Multiple attempts have already been made, which may lower recovery chances."
        )

    # Probability based explanation
    probability = prediction["recovery_probability"]

    if probability >= 70:
        reasons.append(
            "The ML model predicts a high probability of successful recovery."
        )

    elif probability >= 40:
        reasons.append(
            "The ML model predicts a moderate probability of recovery."
        )

    else:
        reasons.append(
            "The ML model predicts a relatively low probability of recovery."
        )

    return reasons


def build_recommendation(payment):
    data = {
        "amount": payment.amount,
        "payment_method": payment.payment_method,
        "failure_reason": payment.failure_reason,
        "attempt_number": payment.attempt_number,
        "previous_success_rate": payment.previous_success_rate,
        "customer_transaction_count": payment.customer_transaction_count,
        "customer_lifetime_value": payment.customer_lifetime_value,
    }

    prediction = predict_recovery(data)

    action = "RETRY_PAYMENT"

    if payment.failure_reason in {
        "Insufficient Funds",
        "Authentication Failed"
    }:
        action = "SEND_REMINDER"

    elif payment.failure_reason in {
        "Bank Timeout",
        "Network Error"
    }:
        action = "ALTERNATIVE_METHOD"

    explanation = build_explanation(
        payment,
        prediction
    )

    return {
        "transaction_id": payment.transaction_id,
        "amount": payment.amount,
        "payment_method": payment.payment_method,
        "failure_reason": payment.failure_reason,
        "recovery_probability": prediction["recovery_probability"],
        "priority": prediction["priority"],
        "expected_recovery": prediction["expected_recovery"],
        "recommended_action": action,
        "explanation": explanation,
    }