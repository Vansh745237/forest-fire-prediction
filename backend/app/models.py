from sqlalchemy import Column, Integer, Float, String
from app.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    temperature = Column(Float)
    humidity = Column(Float)
    wind = Column(Float)
    rain = Column(Float)

    probability = Column(Float)
    risk_level = Column(String)