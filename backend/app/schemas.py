from pydantic import BaseModel

class FireInput(BaseModel):
    temperature: float
    humidity: float
    wind: float
    rain: float

class PredictionResponse(BaseModel):
    probability: float
    risk_level: str