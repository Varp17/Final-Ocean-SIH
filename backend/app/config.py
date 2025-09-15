"""
Configuration settings for Atlas-Alert backend
"""
from pydantic_settings import BaseSettings
from typing import List, Dict, Any
import os

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql+psycopg2://neondb_owner:npg_XCgW5yrakK1t@ep-soft-sunset-ad8xrfyh-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
    
    # Redis for Celery
    redis_url: str = "redis://localhost:6379/0"
    
    # Twilio SMS
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_from_number: str = ""
    
    # Twitter/X API
    twitter_api_key: str = ""
    twitter_api_secret: str = ""
    twitter_bearer_token: str = ""
    twitter_access_token: str = ""
    twitter_access_secret: str = ""
    
    # External APIs
    openweather_api_key: str = ""
    nominatim_url: str = "https://nominatim.openstreetmap.org"
    
    # ML Models
    onnx_dir: str = "/app/ml_models/placeholders"
    
    # App settings
    fastapi_secret_key: str = "your-secret-key-here"
    backend_url: str = "http://localhost:8000"
    
    # MSG91 for mass SMS
    msg91_api_key: str = ""
    
    # Thresholds
    threat_confidence_auto_alert: float = 0.75
    cluster_eps_meters: int = 500
    cluster_min_points: int = 3
    
    # Authority contacts
    authority_contacts: Dict[str, Dict[str, Any]] = {
        "oil_spill": {
            "agency": "Indian Coast Guard",
            "emails": ["mrcc@indiancoastguard.gov.in"],
            "phones": ["+91-11-23717725"]
        },
        "tsunami": {
            "agency": "National Disaster Management Authority",
            "emails": ["control@ndma.gov.in"],
            "phones": ["+91-11-26701700"]
        },
        "storm_surge": {
            "agency": "India Meteorological Department",
            "emails": ["dg@imd.gov.in"],
            "phones": ["+91-11-24629798"]
        }
    }
    
    class Config:
        env_file = ".env"

settings = Settings()
