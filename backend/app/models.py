from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database.connection import Base


class Merchant(Base):
    __tablename__ = "merchants"

    id = Column(Integer, primary_key=True, index=True)

    merchant_id = Column(
        String(50),
        unique=True,
        index=True,
        nullable=False
    )

    business_name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    phone = Column(
        String(20),
        nullable=True
    )

    business_type = Column(
        String(50),
        nullable=True
    )

    status = Column(
        String(30),
        default="ACTIVE"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    transaction_id = Column(
        String(50),
        unique=True,
        index=True
    )

    merchant_id = Column(
        String(50),
        index=True,
        nullable=True
    )

    customer_id = Column(
        String(50),
        index=True
    )

    amount = Column(
        Float,
        nullable=False
    )

    payment_method = Column(String(50))

    payment_status = Column(String(30))

    failure_reason = Column(String(100))

    attempt_number = Column(
        Integer,
        default=1
    )

    previous_success_rate = Column(
        Float,
        default=0.0
    )

    customer_transaction_count = Column(
        Integer,
        default=0
    )

    customer_lifetime_value = Column(
        Float,
        default=0.0
    )


class RecoveryAction(Base):
    __tablename__ = "recovery_actions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    transaction_id = Column(
        String(50),
        index=True
    )

    action_type = Column(String(50))

    expected_recovery = Column(
        Float,
        default=0.0
    )

    status = Column(
        String(30),
        default="PENDING"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class RecoveryOutcome(Base):
    __tablename__ = "recovery_outcomes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    action_id = Column(
        Integer,
        ForeignKey("recovery_actions.id")
    )

    transaction_id = Column(
        String(50),
        index=True
    )

    outcome = Column(String(30))

    recovered_amount = Column(
        Float,
        default=0.0
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )