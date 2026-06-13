from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

from app.database import Base, engine, SessionLocal
from app.routes import router
from app.models import User
from app.auth import hash_password

import resend
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

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# DATABASE
# =========================

Base.metadata.create_all(bind=engine)

# =========================
# ROUTES
# =========================

app.include_router(router)

# =========================
# REQUEST MODELS
# =========================

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str


# =========================
# FORGOT PASSWORD
# =========================

@app.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    try:

        reset_link = (
            f"https://forest-fire-prediction-zo7z.vercel.app/reset-password?email={data.email}"
        )

        params = {
            "from": "onboarding@resend.dev",
            "to": [data.email],
            "subject": "Password Reset Request",
            "html": f"""
            <h2>Reset Your Password</h2>

            <p>Click the button below to reset your password:</p>

            <a href="{reset_link}"
               style="
               background:#16a34a;
               color:white;
               padding:12px 20px;
               text-decoration:none;
               border-radius:6px;">
               Reset Password
            </a>
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


# =========================
# RESET PASSWORD
# =========================

@app.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):

    db = SessionLocal()

    try:
        user = db.query(User).filter(
            User.email == data.email
        ).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        user.password = hash_password(
            data.new_password
        )

        db.commit()

        return {
            "message": "Password reset successful"
        }

    finally:
        db.close()


# =========================
# ROOT
# =========================

@app.get("/")
def root():
    return {
        "message": "Forest Fire Prediction API Running"
    }