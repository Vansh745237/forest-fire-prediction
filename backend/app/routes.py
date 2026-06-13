from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.predictor import predict_fire
from app.models import Prediction, User
from app.schemas import (
    PredictRequest,
    PredictionResponse,
    UserCreate,
    UserLogin,
    UserStats
)
from app.auth import (
    hash_password,
    verify_password
)

router = APIRouter()
router = APIRouter()

class ChatRequest(BaseModel):
    message: str


# =========================
# SIGNUP
# =========================

@router.post("/signup")
def signup(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        existing_user = db.query(User).filter(
            User.email == user.email
        ).first()

        if existing_user:
            return {
                "message": "Email already exists"
            }

        new_user = User(
            username=user.username,
            email=user.email,
            password=hash_password(user.password)
        )

        db.add(new_user)
        db.commit()

        return {
            "message": "Signup successful"
        }

    except Exception as e:
        db.rollback()
        return {
            "error": str(e)
        }


# =========================
# LOGIN
# =========================

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        return {
            "message": "User not found"
        }

    if not verify_password(
        user.password,
        db_user.password
    ):
        return {
            "message": "Invalid password"
        }

    return {
        "message": "Login successful",
        "user_id": db_user.id,
        "username": db_user.username
    }


# =========================
# PREDICT
# =========================

@router.post("/predict", response_model=PredictionResponse)
def predict(
    data: PredictRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == data.user_id
    ).first()

    if not user:
        return {
            "message": "User not found"
        }

    probability, risk = predict_fire(
        data.temperature,
        data.humidity,
        data.wind,
        data.rain
    )

    probability = float(probability)

    record = Prediction(
        user_id=data.user_id,
        temperature=data.temperature,
        humidity=data.humidity,
        wind=data.wind,
        rain=data.rain,
        probability=probability,
        risk_level=risk
    )

    db.add(record)

    user.prediction_count += 1

    if risk.upper() == "HIGH":
        user.high_risk += 1

    elif risk.upper() == "MEDIUM":
        user.medium_risk += 1

    elif risk.upper() == "LOW":
        user.low_risk += 1

    db.commit()

    return {
        "probability": probability,
        "risk_level": risk
    }


# =========================
# HISTORY
# =========================

@router.get("/history/{user_id}")
def history(
    user_id: int,
    db: Session = Depends(get_db)
):
    return db.query(Prediction).filter(
        Prediction.user_id == user_id
    ).all()


# =========================
# USER STATS
# =========================

@router.get(
    "/user-stats/{user_id}",
    response_model=UserStats
)
def get_user_stats(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        return {
            "prediction_count": 0,
            "high_risk": 0,
            "medium_risk": 0,
            "low_risk": 0
        }

    return {
        "prediction_count": user.prediction_count,
        "high_risk": user.high_risk,
        "medium_risk": user.medium_risk,
        "low_risk": user.low_risk
    }


# =========================
# CHATBOT
# =========================

@router.post("/chat")
def chat(data: ChatRequest):
    return {
        "reply": f"You asked: {data.message}"
    }