import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies.auth import get_current_merchant
from app.models import Merchant
from app.schemas import (
    MerchantRegister,
    MerchantLogin,
    MerchantResponse,
    TokenResponse,
)
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Merchant Authentication"]
)


def generate_merchant_id():
    return "MER_" + uuid.uuid4().hex[:8].upper()


@router.post(
    "/register",
    response_model=MerchantResponse,
    status_code=status.HTTP_201_CREATED
)
def register_merchant(
    request: MerchantRegister,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(Merchant)
        .filter(Merchant.email == request.email.lower())
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Merchant account already exists with this email"
        )

    merchant = Merchant(
        merchant_id=generate_merchant_id(),
        business_name=request.business_name,
        email=request.email.lower(),
        password_hash=hash_password(
            request.password
        ),
        phone=request.phone,
        business_type=request.business_type,
        status="ACTIVE",
    )

    db.add(merchant)
    db.commit()
    db.refresh(merchant)

    return merchant


@router.post(
    "/login",
    response_model=TokenResponse
)
def login_merchant(
    request: MerchantLogin,
    db: Session = Depends(get_db)
):
    merchant = (
        db.query(Merchant)
        .filter(Merchant.email == request.email.lower())
        .first()
    )

    if not merchant:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        request.password,
        merchant.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if merchant.status != "ACTIVE":
        raise HTTPException(
            status_code=403,
            detail="Merchant account is not active"
        )

    token = create_access_token(
        merchant.merchant_id,
        merchant.email
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "merchant_id": merchant.merchant_id,
        "business_name": merchant.business_name,
    }
@router.get(
    "/me",
    response_model=MerchantResponse
)
def get_my_profile(
    current_merchant: Merchant = Depends(get_current_merchant)
):
    return current_merchant