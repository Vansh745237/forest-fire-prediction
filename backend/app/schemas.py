from pydantic import BaseModel, EmailStr


# =========================
# FIRE PREDICTION SCHEMAS
# =========================

class FireInput(BaseModel):
    temperature: float
    humidity: float
    wind: float
    rain: float


class PredictRequest(BaseModel):
    user_id: int
    temperature: float
    humidity: float
    wind: float
    rain: float


class PredictionResponse(BaseModel):
    probability: float
    risk_level: str


# =========================
# USER SCHEMAS
# =========================

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True


class UserStats(BaseModel):
    prediction_count: int
    high_risk: int
    medium_risk: int
    low_risk: int


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str