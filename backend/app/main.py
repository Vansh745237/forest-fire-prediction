from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import router
from pydantic import BaseModel, EmailStr
import resend
from groq import Groq
from dotenv import load_dotenv
import os

# =========================
# LOAD ENV VARIABLES
# =========================

load_dotenv()
resend.api_key = os.getenv("RESEND_API_KEY")

# =========================
# FASTAPI APP
# =========================

app = FastAPI(
    title="Forest Fire Prediction API"
)

print("CORS LOADED")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "https://forest-fire-prediction-zo7z.vercel.app",
        "https://forest-fire-prediction-4yv1.vercel.app",
        "https://forest-fire-prediction-taupe.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(router)