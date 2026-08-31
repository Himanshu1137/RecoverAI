from fastapi import APIRouter, HTTPException
from app.schemas import PaymentPredictionRequest
from ml.predict import predict_recovery

router = APIRouter(prefix="/api/prediction", tags=["Prediction"])

@router.post("/predict")
def predict(data: PaymentPredictionRequest):
    try:
        return predict_recovery(data.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Prediction service failed.") from exc
