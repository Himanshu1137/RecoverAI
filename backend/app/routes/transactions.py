import csv
import io

from fastapi import UploadFile, File
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies.auth import get_current_merchant
from app.models import Merchant, Transaction
from app.schemas import TransactionCreate

router = APIRouter(
    prefix="/api/transactions",
    tags=["Transactions"]
)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_transaction(
    request: TransactionCreate,
    db: Session = Depends(get_db),
    current_merchant: Merchant = Depends(get_current_merchant)
):
    existing = (
        db.query(Transaction)
        .filter(Transaction.transaction_id == request.transaction_id)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Transaction ID already exists"
        )

    transaction = Transaction(
        transaction_id=request.transaction_id,
        merchant_id=current_merchant.merchant_id,
        customer_id=request.customer_id,
        amount=request.amount,
        payment_method=request.payment_method,
        payment_status="FAILED",
        failure_reason=request.failure_reason,
        attempt_number=request.attempt_number,
        previous_success_rate=request.previous_success_rate,
        customer_transaction_count=request.customer_transaction_count,
        customer_lifetime_value=request.customer_lifetime_value,
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return {
        "message": "Failed payment added successfully",
        "transaction_id": transaction.transaction_id,
        "merchant_id": transaction.merchant_id,
        "amount": transaction.amount,
        "payment_method": transaction.payment_method,
        "payment_status": transaction.payment_status,
        "failure_reason": transaction.failure_reason,
    }
@router.post("/upload-csv")
async def upload_transactions_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_merchant: Merchant = Depends(get_current_merchant)
):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed"
        )

    content = await file.read()

    try:
        text = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="CSV must use UTF-8 encoding"
        )

    reader = csv.DictReader(io.StringIO(text))

    required_columns = {
        "transaction_id",
        "customer_id",
        "amount",
        "payment_method",
        "failure_reason",
        "attempt_number",
        "previous_success_rate",
        "customer_transaction_count",
        "customer_lifetime_value",
    }

    if not reader.fieldnames or not required_columns.issubset(
        set(reader.fieldnames)
    ):
        raise HTTPException(
            status_code=400,
            detail="CSV columns are invalid or missing"
        )

    added = 0
    skipped = 0

    for row in reader:
        transaction_id = row["transaction_id"].strip()

        existing = (
            db.query(Transaction)
            .filter(
                Transaction.transaction_id == transaction_id
            )
            .first()
        )

        if existing:
            skipped += 1
            continue

        try:
            transaction = Transaction(
                transaction_id=transaction_id,
                merchant_id=current_merchant.merchant_id,
                customer_id=row["customer_id"].strip(),
                amount=float(row["amount"]),
                payment_method=row["payment_method"].strip(),
                payment_status="FAILED",
                failure_reason=row["failure_reason"].strip(),
                attempt_number=int(row["attempt_number"] or 1),
                previous_success_rate=float(
                    row["previous_success_rate"] or 0
                ),
                customer_transaction_count=int(
                    row["customer_transaction_count"] or 0
                ),
                customer_lifetime_value=float(
                    row["customer_lifetime_value"] or 0
                ),
            )

            db.add(transaction)
            added += 1

        except (ValueError, TypeError):
            db.rollback()

            raise HTTPException(
                status_code=400,
                detail=f"Invalid data in transaction {transaction_id}"
            )

    db.commit()

    return {
        "message": "CSV processed successfully",
        "merchant_id": current_merchant.merchant_id,
        "added": added,
        "skipped": skipped,
    }