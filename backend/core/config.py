from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Atlas-Alert API"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8001

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://atlas_user:atlas_password@localhost:5432/atlas_alert"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://your-frontend-domain.com"
    ]

    # ML Models
    HUGGINGFACE_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    GROQ_API_KEY: str = ""

    # External APIs
    GOOGLE_MAPS_API_KEY: str = ""
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""

    # Redis for caching
    REDIS_URL: str = "redis://localhost:6379"

    # File storage
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB

    class Config:
        env_file = ".env"


settings = Settings()
