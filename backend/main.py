from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from backend import PneumaAI_Backend
import uvicorn

app = FastAPI()

# Allow React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🚀 Starting Multi-Model PneuAI Engine...")
backend_engine = PneumaAI_Backend()

@app.post("/api/analyze")
async def analyze_xray(
    file: UploadFile = File(...),
    patient_type: str = Form("pediatric") # Default to pediatric
):
    try:
        # Read file
        image_bytes = await file.read()
        
        # Run Analysis
        report = backend_engine.generate_report(image_bytes, patient_type)
        
        return report
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)