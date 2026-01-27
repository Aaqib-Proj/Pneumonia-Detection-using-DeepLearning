from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    context: str = ""

@router.post("/api/chat")
async def chat_with_ai(request: ChatRequest):
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key or api_key == "your_groq_api_key_here":
            return {"error": "Groq API key not configured"}

        client = Groq(api_key=api_key)
        
        # Build system message with medical context
        system_message = f"""You are a professional AI Radiologist Assistant integrated into PneuAI, 
a pneumonia detection system. You provide clear, accurate medical information.

{request.context}

Guidelines:
- Answer medical questions professionally and concisely
- Use medical terminology when appropriate but explain complex terms
- If discussing the current case, reference the diagnosis data provided
- For treatment questions, always recommend consulting a physician
- Be empathetic and supportive
- Keep responses under 150 words unless detailed explanation is needed
"""

        # Convert messages to Groq format
        groq_messages = [{"role": "system", "content": system_message}]
        groq_messages.extend([{"role": msg.role, "content": msg.content} for msg in request.messages])

        # Call Groq API
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=groq_messages,
            temperature=0.7,
            max_tokens=500,
        )

        response_text = completion.choices[0].message.content
        
        return {"response": response_text}
    
    except Exception as e:
        print(f"Chat Error: {e}")
        return {"error": str(e)}
