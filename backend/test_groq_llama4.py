import os
import base64
from io import BytesIO
from PIL import Image
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def test_groq_llama4():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("❌ Error: Valid GROQ_API_KEY not found in .env")
        return

    try:
        client = Groq(api_key=api_key)
        
        # Create a tiny test image
        img = Image.new('RGB', (100, 100), color = (73, 109, 137))
        buf = BytesIO()
        img.save(buf, format="PNG")
        img_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')

        model_name = "meta-llama/llama-4-scout-17b-16e-instruct"
        print(f"🚀 Sending request to Groq ({model_name})...")
        completion = client.chat.completions.create(
            model=model_name,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "What is in this image? Reply with one word."},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/png;base64,{img_b64}"}
                        }
                    ]
                }
            ],
            temperature=0.1,
            max_tokens=10,
        )
        
        print("\n✅ Groq Response:")
        print("-" * 20)
        print(completion.choices[0].message.content)
        print("-" * 20)
    except Exception as e:
        print(f"❌ Groq Test Failed: {e}")

if __name__ == "__main__":
    test_groq_llama4()
