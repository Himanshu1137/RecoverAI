from pathlib import Path
import joblib
import numpy as np


MODEL_PATH = Path(__file__).parent / "models" / "recovery_model.pkl"


def load_model():
    # The bundled model may have been created with a different scikit-learn
    # version on another machine. If loading fails, retrain locally.
    if MODEL_PATH.exists():
        try:
            return joblib.load(MODEL_PATH)
        except Exception:
            pass

    from ml.train import train
    train()
    return joblib.load(MODEL_PATH)


def predict_recovery(data: dict):
    model = load_model()

    features = np.array([[
        data["amount"],
        data.get("previous_success_rate", 0.0),
        data.get("attempt_number", 1),
        data.get("customer_transaction_count", 0),
        data.get("customer_lifetime_value", 0.0),
    ]])

    probability = float(model.predict_proba(features)[0][1])
    probability_percent = round(probability * 100, 2)

    if probability_percent >= 70:
        priority = "HIGH"
    elif probability_percent >= 40:
        priority = "MEDIUM"
    else:
        priority = "LOW"

    expected_recovery = round(
        data["amount"] * probability,
        2,
    )

    return {
        "recovery_probability": probability_percent,
        "priority": priority,
        "expected_recovery": expected_recovery,
    }


if __name__ == "__main__":
    sample = {
        "amount": 12000,
        "payment_method": "UPI",
        "failure_reason": "Network Error",
        "attempt_number": 1,
        "previous_success_rate": 0.92,
        "customer_transaction_count": 15,
        "customer_lifetime_value": 75000,
    }

    print(predict_recovery(sample))
