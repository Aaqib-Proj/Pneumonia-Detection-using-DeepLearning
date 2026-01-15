from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

# SQLite Database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./medical_reports.db"

# Create Database Engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Session Local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base Model
Base = declarative_base()

class ReportDB(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    patient_name = Column(String)
    patient_age = Column(String)
    patient_gender = Column(String)
    diagnosis = Column(String)
    confidence = Column(String)
    report_json = Column(Text) # Stores full JSON report
    original_image_base64 = Column(Text) # Stores Input Image as Base64

    # Optional: We could store heatmap separately if needed, but it's in report_json

# Create Tables
def init_db():
    Base.metadata.create_all(bind=engine)
