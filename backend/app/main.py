from fastapi import FastAPI, HTTPException
from app.database import Base, engine
from app.routes import router
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

import smtplib
from email.mime.text import MIMEText
from groq import Groq
from dotenv import load_dotenv
import os

# =========================
# LOAD ENV VARIABLES
# =========================

load_dotenv()

# =========================
# FASTAPI APP
# =========================

app = FastAPI(
    title="Forest Fire Prediction API"
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
allow_origins=[
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

# =========================
# GROQ CLIENT
# =========================

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# =========================
# CHAT REQUEST MODEL
# =========================

# =========================
# CHAT REQUEST MODEL
# =========================

class ChatRequest(BaseModel):
    message: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
# =========================
# AI CHATBOT ENDPOINT
# =========================

@app.post("/chat")
async def chat(data: ChatRequest):

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": """
You are Forest Fire Intelligence Assistant.

Help users with:

- Forest fire prediction
- Weather conditions
- Fire safety recommendations
- Dashboard usage
- Risk analysis
- Prediction explanations
- Location selection
- PDF report generation

Keep answers concise and helpful.
"""
                },
                {
                    "role": "user",
                    "content": data.message
                }
            ]
        )

        reply = response.choices[0].message.content

        return {
            "reply": reply
        }

    except Exception as e:

        return {
            "reply": f"Error: {str(e)}"
        }

# =========================
# ROOT ENDPOINT
# =========================
@app.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):

    try:
        sender_email = os.getenv("EMAIL_USER")
        sender_password = os.getenv("EMAIL_PASSWORD")

        if not sender_email or not sender_password:
            raise HTTPException(
                status_code=500,
                detail="Email credentials not configured"
            )

        reset_link = (
            "https://forest-fire-prediction-zo7z.vercel.app/reset-password"
        )

        msg = MIMEText(
            f"""
Hello,

You requested a password reset.

Click the link below:

{reset_link}

If you did not request this, ignore this email.
"""
        )

        msg["Subject"] = "Password Reset Request"
        msg["From"] = sender_email
        msg["To"] = data.email

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()

        return {
            "message": "Reset link sent successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@app.get("/")
def root():

    return {
        "message": "Forest Fire Prediction API Running"
    }