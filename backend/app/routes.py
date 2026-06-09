from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import FireInput, PredictionResponse
from app.predictor import predict_fire
from app.models import Prediction

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
def predict(data: FireInput, db: Session = Depends(get_db)):

    probability, risk = predict_fire(
        data.temperature,
        data.humidity,
        data.wind,
        data.rain
    )

    probability = float(probability)

    record = Prediction(
        temperature=data.temperature,
        humidity=data.humidity,
        wind=data.wind,
        rain=data.rain,
        probability=probability,
        risk_level=risk
    )

    db.add(record)
    db.commit()

    return {
        "probability": probability,
        "risk_level": risk
    }

@router.get("/history")
def history(db: Session = Depends(get_db)):
    return db.query(Prediction).all()