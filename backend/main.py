from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend import PneumaAI_Backend
import uvicorn
import json
import base64
from database import SessionLocal, init_db, ReportDB

app = FastAPI()

# Init Database
init_db()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
    patient_type: str = Form("pediatric"), # Default to pediatric
    patient_name: str = Form(None),
    patient_age: str = Form(None),
    patient_gender: str = Form(None),
    db: Session = Depends(get_db)
):
    try:
        # Read file
        image_bytes = await file.read()
        
        # Run Analysis
        report = backend_engine.generate_report(image_bytes, patient_type)

        # Inject Patient Data into Report Meta for Frontend Display
        if patient_name:
            report['meta']['name'] = patient_name
        if patient_age and patient_gender:
            report['meta']['age_sex'] = f"{patient_age} / {patient_gender}"
        
        # Convert Input Image to Base64 for Storage
        original_b64 = base64.b64encode(image_bytes).decode('utf-8')
        original_data_uri = f"data:image/png;base64,{original_b64}"

        # Save to SQLite
        try:
            db_report = ReportDB(
                id=report['meta']['id'],
                patient_name=patient_name or "Anonymous",
                patient_age=patient_age or "--",
                patient_gender=patient_gender or "--",
                diagnosis=report['diagnosis']['label'],
                confidence=report['diagnosis']['confidence'],
                report_json=json.dumps(report),
                original_image_base64=original_data_uri
            )
            db.add(db_report)
            db.commit()
            print(f"✅ Saved Report {db_report.id} to DB")
        except Exception as db_err:
            print(f"⚠️ Database Save Failed: {db_err}")

        return report
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/history")
def get_history(db: Session = Depends(get_db)):
    reports = db.query(ReportDB).order_by(ReportDB.timestamp.desc()).limit(50).all()
    results = []
    for r in reports:
        try:
            results.append({
                "id": r.id,
                "timestamp": r.timestamp.isoformat(),
                "patientData": {
                    "name": r.patient_name,
                    "age": r.patient_age,
                    "gender": r.patient_gender
                },
                "diagnosis": r.diagnosis,
                "confidence": r.confidence,
                "reportData": json.loads(r.report_json) if r.report_json else {},
                "originalImageBase64": r.original_image_base64
            })
        except Exception as e:
            print(f"Error parsing report {r.id}: {e}")
    return results

@app.delete("/api/history/{report_id}")
def delete_report(report_id: str, db: Session = Depends(get_db)):
    report = db.query(ReportDB).filter(ReportDB.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    db.delete(report)
    db.commit()
    return {"message": "Deleted successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)