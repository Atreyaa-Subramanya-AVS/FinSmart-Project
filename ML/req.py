# gemini_util.py
from dotenv import load_dotenv
import os
import requests

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key={GEMINI_API_KEY}"

def generate_reply(prompt: str) -> str:
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.9,
            "topK": 1,
            "topP": 1,
            "maxOutputTokens": 2048,
            "stopSequences": []
        }
    }

    headers = {"Content-Type": "application/json"}

    response = requests.post(GEMINI_ENDPOINT, json=payload, headers=headers)

    if response.status_code == 200:
        data = response.json()
        return (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "No response")
        )
    else:
        return f"Gemini Error {response.status_code}: {response.text}"