from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    temperature = Column(Float)
    humidity = Column(Float)
    wind = Column(Float)
    rain = Column(Float)

    probability = Column(Float)
    risk_level = Column(String)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    prediction_count = Column(Integer, default=0)

    high_risk = Column(Integer, default=0)
    medium_risk = Column(Integer, default=0)
    low_risk = Column(Integer, default=0)