from fastapi import FastAPI
from app.database import Base, engine
from app.routes import router
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

class ChatRequest(BaseModel):
    message: str

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

@app.get("/")
def root():

    return {
        "message": "Forest Fire Prediction API Running"
    }