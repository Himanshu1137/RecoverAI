from pathlib import Path
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

MODEL_DIR = Path(__file__).parent / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
MODEL_PATH = MODEL_DIR / "recovery_model.pkl"

def build_demo_dataset():
    rng = np.random.default_rng(42)
    n = 1200
    amount = rng.uniform(200, 50000, n)
    previous_success_rate = rng.uniform(0, 1, n)
    attempt_number = rng.integers(1, 4, n)
    customer_transaction_count = rng.integers(1, 100, n)
    customer_lifetime_value = rng.uniform(1000, 250000, n)

    probability = (
        0.10
        + 0.50 * previous_success_rate
        + 0.12 * (attempt_number == 1)
        + 0.10 * (customer_transaction_count / 100)
        + 0.12 * (customer_lifetime_value / 250000)
        - 0.10 * (amount / 50000)
    )
    probability = np.clip(probability, 0.05, 0.95)
    y = rng.binomial(1, probability)

    X = np.column_stack([
        amount, previous_success_rate, attempt_number,
        customer_transaction_count, customer_lifetime_value,
    ])
    return X, y

def train():
    X, y = build_demo_dataset()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    model = RandomForestClassifier(
        n_estimators=200, random_state=42, class_weight="balanced"
    )
    model.fit(X_train, y_train)
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Test accuracy: {model.score(X_test, y_test):.3f}")

if __name__ == "__main__":
    train()
