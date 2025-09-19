"""
API endpoint for predictive escalation analysis
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from pydantic import BaseModel
from ..ml.predictive_escalation import escalation_model
from ..database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/ml/predict", tags=["ML Prediction"])

class EscalationRequest(BaseModel):
    reports: List[Dict[str, Any]]
    location: Dict[str, float]  # {"latitude": float, "longitude": float}
    time_horizon: str = "24h"  # "6h", "12h", "24h", "48h"

class TrustScoreRequest(BaseModel):
    user_id: str
    include_recommendations: bool = True

@router.post("/escalation")
async def predict_escalation(request: EscalationRequest, db: Session = Depends(get_db)):
    """Predict hazard escalation probability and affected zones"""
    try:
        location = (request.location["latitude"], request.location["longitude"])
        
        # Get prediction from ML model
        prediction = await escalation_model.predict_escalation(request.reports, location)
        
        return {
            "success": True,
            "prediction": prediction,
            "metadata": {
                "model_version": "1.0",
                "prediction_id": f"pred_{int(time.time())}",
                "input_reports": len(request.reports)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.post("/trust-score")
async def calculate_trust_score(request: TrustScoreRequest, db: Session = Depends(get_db)):
    """Calculate trust score for a user"""
    try:
        from ..ml.trust_score_engine import trust_engine, TrustEvent, ReportType
        from datetime import datetime, timedelta
        
        # Mock trust events (in production, fetch from database)
        mock_events = [
            TrustEvent(
                user_id=request.user_id,
                event_type=ReportType.VERIFIED_CORRECT,
                timestamp=datetime.utcnow() - timedelta(days=5),
                confidence=0.9,
                report_complexity=0.7,
                verification_source="analyst",
                location_accuracy=0.95,
                time_to_verify=timedelta(hours=2)
            ),
            TrustEvent(
                user_id=request.user_id,
                event_type=ReportType.VERIFIED_CORRECT,
                timestamp=datetime.utcnow() - timedelta(days=10),
                confidence=0.85,
                report_complexity=0.5,
                verification_source="volunteer",
                location_accuracy=0.8,
                time_to_verify=timedelta(hours=4)
            )
        ]
        
        trust_data = trust_engine.calculate_trust_score(request.user_id, mock_events)
        
        if request.include_recommendations:
            trust_data["recommendations"] = trust_engine.get_recommendations(trust_data)
            trust_data["trust_level"] = trust_engine.get_trust_level(trust_data["trust_score"])
        
        return {
            "success": True,
            "trust_data": trust_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trust score calculation failed: {str(e)}")

@router.get("/model-status")
async def get_model_status():
    """Get status of ML models"""
    try:
        return {
            "escalation_model": {
                "loaded": escalation_model.is_trained,
                "last_updated": "2025-01-19T10:00:00Z",
                "version": "1.0"
            },
            "trust_engine": {
                "loaded": True,
                "version": "1.0"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")
