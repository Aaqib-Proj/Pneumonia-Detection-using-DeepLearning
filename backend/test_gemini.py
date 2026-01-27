import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def test_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    try:
        genai.configure(api_key=api_key)
        # Using the exact name from the list
        model_name = 'gemini-flash-latest' 
        print(f"🚀 Sending 'Hello' to {model_name}...")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hello")
        print("\n✅ Gemini Response:")
        print("-" * 20)
        print(response.text)
        print("-" * 20)
    except Exception as e:
        print(f"❌ Gemini Test Failed: {e}")

if __name__ == "__main__":
    test_gemini()
