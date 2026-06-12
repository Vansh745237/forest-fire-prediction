from fastapi import FastAPI, HTTPException
from app.database import Base, engine
from app.routes import router
from fastapi.middleware.cors import CORSMiddleware
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

from fastapi.middleware.cors import CORSMiddleware

from fastapi.middleware.cors import CORSMiddleware
print("CORS LOADED")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        params = {
            "from": "onboarding@resend.dev",
            "to": [data.email],
            "subject": "Password Reset Request",
            "html": """
            <h2>Reset Your Password</h2>
            <p>You requested a password reset.</p>
            <p>If this was you, please reset your password.</p>
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