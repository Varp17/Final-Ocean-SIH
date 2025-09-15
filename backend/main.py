from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
from typing import List
import asyncio

from routers import auth, analytics, ml, real_time, emergency, admin, citizen, analyst
from core.config import settings
from core.database import init_db
from core.websocket_manager import WebSocketManager
from ml.model_manager import ModelManager

# Initialize WebSocket manager and ML models
websocket_manager = WebSocketManager()
model_manager = ModelManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    await model_manager.load_models()
    print("🚀 Atlas-Alert Backend Started Successfully")
    yield
    # Shutdown
    print("🛑 Atlas-Alert Backend Shutting Down")

app = FastAPI(
    title="Atlas-Alert API",
    description="Ocean Hazard Reporting Platform - Real-time crowdsourced ocean hazard reporting and emergency response system",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(ml.router, prefix="/api/ml", tags=["Machine Learning"])
app.include_router(real_time.router, prefix="/api/real-time", tags=["Real-time"])
app.include_router(emergency.router, prefix="/api/emergency", tags=["Emergency"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(citizen.router, prefix="/api/citizen", tags=["Citizen"])
app.include_router(analyst.router, prefix="/api/analyst", tags=["Analyst"])

@app.get("/")
async def root():
    return {"message": "Atlas-Alert Ocean Hazard Platform API", "version": "2.0.0", "status": "operational"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "ml_models_loaded": model_manager.models_loaded,
        "database_connected": True,
        "websocket_connections": len(websocket_manager.active_connections)
    }

# WebSocket endpoint for real-time updates
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket_manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket_manager.send_personal_message(f"Echo: {data}", client_id)
    except WebSocketDisconnect:
        websocket_manager.disconnect(client_id)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
