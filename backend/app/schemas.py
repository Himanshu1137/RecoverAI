from pydantic import BaseModel, Field


# -------------------------
# ML Prediction
# -------------------------

class PaymentPredictionRequest(BaseModel):
    amount: float = Field(gt=0)
    payment_method: str
    failure_reason: str
    attempt_number: int = Field(default=1, ge=1)
    previous_success_rate: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )
    customer_transaction_count: int = Field(
        default=0,
        ge=0
    )
    customer_lifetime_value: float = Field(
        default=0.0,
        ge=0.0
    )


# -------------------------
# Gemini Agent
# -------------------------

class AgentRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=1000
    )


# -------------------------
# Recovery
# -------------------------

class RecoveryRequest(BaseModel):
    transaction_id: str
    action_type: str
    expected_recovery: float = Field(ge=0)
    recovery_probability: float = Field(
        ge=0,
        le=100
    )


# -------------------------
# Merchant Registration
# -------------------------

class MerchantRegister(BaseModel):
    business_name: str = Field(
        min_length=2,
        max_length=100
    )

    email: str = Field(
        min_length=5,
        max_length=100
    )

    password: str = Field(
        min_length=8,
        max_length=128
    )

    phone: str | None = None

    business_type: str | None = None


# -------------------------
# Merchant Login
# -------------------------

class MerchantLogin(BaseModel):
    email: str
    password: str


# -------------------------
# Merchant Response
# -------------------------

class MerchantResponse(BaseModel):
    merchant_id: str
    business_name: str
    email: str
    phone: str | None = None
    business_type: str | None = None
    status: str


# -------------------------
# Login Token Response
# -------------------------

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

    merchant_id: str
    business_name: str
class TransactionCreate(BaseModel):
    transaction_id: str = Field(min_length=2, max_length=50)
    customer_id: str = Field(min_length=2, max_length=50)
    amount: float = Field(gt=0)
    payment_method: str = Field(min_length=2, max_length=50)
    failure_reason: str = Field(min_length=2, max_length=100)

    attempt_number: int = Field(default=1, ge=1)
    previous_success_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    customer_transaction_count: int = Field(default=0, ge=0)
    customer_lifetime_value: float = Field(default=0.0, ge=0)