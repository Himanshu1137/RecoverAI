from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)

def test_prediction():
    payload = {
        "amount": 5000,
        "payment_method": "UPI",
        "failure_reason": "Network Error",
        "attempt_number": 1,
        "previous_success_rate": 0.92,
        "customer_transaction_count": 15,
        "customer_lifetime_value": 75000
    }
    r = client.post("/api/prediction/predict", json=payload)
    assert r.status_code == 200
    body = r.json()
    assert "recovery_probability" in body
    assert "expected_recovery" in body
