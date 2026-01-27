import os
import base64
from io import BytesIO
from PIL import Image
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def test_user_model():
    api_key = os.getenv("GROQ_API_KEY")
    client = Groq(api_key=api_key)
    
    # Create a tiny test image
    img = Image.new('RGB', (10, 10), color = 'red')
    buf = BytesIO()
    img.save(buf, format="PNG")
    img_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')

    model_name = "openai/gpt-oss-120b"
    print(f"Testing {model_name} with Vision features...")
    try:
        completion = client.chat.completions.create(
            model=model_name,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "What color is this?"},
                        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_b64}"}}
                    ]
                }
            ],
            max_tokens=10
        )
        print(f"✅ {model_name} supports Vision!")
    except Exception as e:
        print(f"❌ {model_name} Vision failed: {e}")
        
    print(f"\nTesting {model_name} with Text-only...")
    try:
        completion = client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": "Hi"}],
            max_tokens=10
        )
        print(f"✅ {model_name} Text-only successful!")
    except Exception as e:
        print(f"❌ {model_name} Text-only failed: {e}")

if __name__ == "__main__":
    test_user_model()
