from app.database.connection import SessionLocal
from app.models import Transaction


DEMO_PAYMENTS = [
    {
        "transaction_id": "TX1023",
        "customer_id": "C1001",
        "amount": 12000,
        "payment_method": "UPI",
        "payment_status": "Failed",
        "failure_reason": "Network Error",
        "attempt_number": 1,
        "previous_success_rate": 0.92,
        "customer_transaction_count": 15,
        "customer_lifetime_value": 75000,
    },
    {
        "transaction_id": "TX1045",
        "customer_id": "C1002",
        "amount": 8500,
        "payment_method": "Card",
        "payment_status": "Failed",
        "failure_reason": "Insufficient Funds",
        "attempt_number": 1,
        "previous_success_rate": 0.82,
        "customer_transaction_count": 10,
        "customer_lifetime_value": 52000,
    },
    {
        "transaction_id": "TX1098",
        "customer_id": "C1003",
        "amount": 7200,
        "payment_method": "NetBanking",
        "payment_status": "Failed",
        "failure_reason": "Bank Timeout",
        "attempt_number": 2,
        "previous_success_rate": 0.78,
        "customer_transaction_count": 22,
        "customer_lifetime_value": 68000,
    },
    {
        "transaction_id": "TX1107",
        "customer_id": "C1004",
        "amount": 4500,
        "payment_method": "UPI",
        "payment_status": "Failed",
        "failure_reason": "Network Error",
        "attempt_number": 1,
        "previous_success_rate": 0.65,
        "customer_transaction_count": 8,
        "customer_lifetime_value": 31000,
    },
    {
        "transaction_id": "TX1132",
        "customer_id": "C1005",
        "amount": 15000,
        "payment_method": "Card",
        "payment_status": "Failed",
        "failure_reason": "Authentication Failed",
        "attempt_number": 2,
        "previous_success_rate": 0.48,
        "customer_transaction_count": 30,
        "customer_lifetime_value": 110000,
    },
]


def seed():
    db = SessionLocal()
    try:
        if db.query(Transaction).count() > 0:
            print("Transactions already exist. Skipping seed.")
            return

        for item in DEMO_PAYMENTS:
            db.add(Transaction(**item))

        db.commit()
        print(f"Seeded {len(DEMO_PAYMENTS)} demo transactions.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
