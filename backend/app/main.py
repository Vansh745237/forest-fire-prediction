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
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(router)
class ForgotPasswordRequest(BaseModel):
    email: EmailStr


@app.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    try:
        params = {
            "from": "onboarding@resend.dev",
            "to": [data.email],
            "subject": "Password Reset Request",
            "html": """
            <h2>Reset Your Password</h2>
            <p>You requested a password reset.</p>
            """
        }

        resend.Emails.send(params)

        return {
            "message": f"Reset link sent to {data.email}"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )