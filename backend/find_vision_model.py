import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def test_vision_models():
    api_key = os.getenv("GROQ_API_KEY")
    client = Groq(api_key=api_key)
    models_to_try = [
        "llama-3.2-11b-vision-preview",
        "llama-3.2-90b-vision-preview",
        "llama-3.2-11b-vision",
        "llava-v1.5-7b-4096-preview"
    ]
    
    for model_name in models_to_try:
        print(f"Testing {model_name}...")
        try:
            # Create a tiny test image
            from PIL import Image
            import base64
            from io import BytesIO
            img = Image.new('RGB', (10, 10), color = 'red')
            buf = BytesIO()
            img.save(buf, format="PNG")
            img_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')

            completion = client.chat.completions.create(
                model=model_name,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Hi"},
                            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_b64}"}}
                        ]
                    }
                ],
                max_tokens=5
            )
            print(f"✅ Success with {model_name}!")
            return model_name
        except Exception as e:
            print(f"❌ Failed {model_name}: {e}")
    return None

if __name__ == "__main__":
    found = test_vision_models()
    if found:
        print(f"\nFinal choice: {found}")
    else:
        print("\nNo vision model found.")
