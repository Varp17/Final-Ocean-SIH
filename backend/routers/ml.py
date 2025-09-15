from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from ml.model_manager import ModelManager
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Dependency to get model manager
async def get_model_manager():
    from main import model_manager
    return model_manager

# Pydantic models for request/response
class SocialMediaAnalysisRequest(BaseModel):
    content: str
    platform: str = "twitter"
    author: Optional[str] = None

class HazardClassificationRequest(BaseModel):
    description: str
    location: Optional[str] = None

class LocationExtractionRequest(BaseModel):
    text: str

class ThreatAssessmentRequest(BaseModel):
    reports: List[Dict[str, Any]]

class MLAnalysisResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    processing_time: float
    model_version: str = "1.0"

@router.post("/analyze-social", response_model=MLAnalysisResponse)
async def analyze_social_media(
    request: SocialMediaAnalysisRequest,
    model_manager: ModelManager = Depends(get_model_manager)
):
    """Analyze social media post for hazard detection and sentiment"""
    import time
    start_time = time.time()
    
    try:
        if not model_manager.models_loaded:
            raise HTTPException(status_code=503, detail="ML models not loaded")
        
        # Perform sentiment analysis
        sentiment_result = await model_manager.analyze_sentiment(request.content)
        
        # Perform hazard classification
        hazard_result = await model_manager.classify_hazard(request.content)
        
        # Extract locations
        location_result = await model_manager.extract_locations(request.content)
        
        # Determine if hazard is detected
        hazard_detected = (
            hazard_result.get("hazard_type") != "no_hazard" and 
            hazard_result.get("overall_confidence", 0) > 0.5
        )
        
        # Assess credibility based on various factors
        credibility_score = 0.5  # Base credibility
        
        # Increase credibility for specific locations
        if location_result.get("geocoded_locations"):
            credibility_score += 0.2
        
        # Increase credibility for urgent sentiment
        if sentiment_result.get("sentiment") == "urgent":
            credibility_score += 0.2
        
        # Increase credibility for high confidence hazard detection
        if hazard_result.get("overall_confidence", 0) > 0.7:
            credibility_score += 0.1
        
        credibility_score = min(credibility_score, 1.0)
        
        # Determine credibility level
        if credibility_score >= 0.8:
            credibility = "high"
        elif credibility_score >= 0.6:
            credibility = "medium"
        else:
            credibility = "low"
        
        processing_time = time.time() - start_time
        
        return MLAnalysisResponse(
            success=True,
            data={
                "hazard_detected": hazard_detected,
                "hazard_analysis": hazard_result,
                "sentiment_analysis": sentiment_result,
                "location_analysis": location_result,
                "credibility": credibility,
                "credibility_score": credibility_score,
                "platform": request.platform,
                "author": request.author
            },
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"Error in social media analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/classify-hazard", response_model=MLAnalysisResponse)
async def classify_hazard(
    request: HazardClassificationRequest,
    model_manager: ModelManager = Depends(get_model_manager)
):
    """Classify hazard type and severity from description"""
    import time
    start_time = time.time()
    
    try:
        if not model_manager.models_loaded:
            raise HTTPException(status_code=503, detail="ML models not loaded")
        
        # Perform hazard classification
        hazard_result = await model_manager.classify_hazard(request.description)
        
        # Extract locations if provided
        location_result = {}
        if request.location:
            location_result = await model_manager.extract_locations(request.location)
        
        processing_time = time.time() - start_time
        
        return MLAnalysisResponse(
            success=True,
            data={
                **hazard_result,
                "location_analysis": location_result,
                "input_description": request.description
            },
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"Error in hazard classification: {e}")
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")

@router.post("/extract-location", response_model=MLAnalysisResponse)
async def extract_location(
    request: LocationExtractionRequest,
    model_manager: ModelManager = Depends(get_model_manager)
):
    """Extract location information from text"""
    import time
    start_time = time.time()
    
    try:
        if not model_manager.models_loaded:
            raise HTTPException(status_code=503, detail="ML models not loaded")
        
        # Extract locations
        location_result = await model_manager.extract_locations(request.text)
        
        processing_time = time.time() - start_time
        
        return MLAnalysisResponse(
            success=True,
            data=location_result,
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"Error in location extraction: {e}")
        raise HTTPException(status_code=500, detail=f"Location extraction failed: {str(e)}")

@router.post("/threat-assessment", response_model=MLAnalysisResponse)
async def assess_threat(
    request: ThreatAssessmentRequest,
    model_manager: ModelManager = Depends(get_model_manager)
):
    """Assess overall threat level from multiple reports"""
    import time
    start_time = time.time()
    
    try:
        if not model_manager.models_loaded:
            raise HTTPException(status_code=503, detail="ML models not loaded")
        
        # Perform threat assessment
        threat_result = await model_manager.assess_threat_level(request.reports)
        
        processing_time = time.time() - start_time
        
        return MLAnalysisResponse(
            success=True,
            data=threat_result,
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"Error in threat assessment: {e}")
        raise HTTPException(status_code=500, detail=f"Threat assessment failed: {str(e)}")

@router.get("/models/status")
async def get_model_status(model_manager: ModelManager = Depends(get_model_manager)):
    """Get status of loaded ML models"""
    return {
        "models_loaded": model_manager.models_loaded,
        "available_models": {
            "sentiment_analyzer": model_manager.sentiment_analyzer is not None,
            "hazard_classifier": model_manager.hazard_classifier is not None,
            "ner_model": model_manager.ner_model is not None,
            "geocoder": model_manager.geocoder is not None
        },
        "status": "operational" if model_manager.models_loaded else "loading"
    }
