"""
ML scoring service using ONNX models with fallback logic
"""
import os
import json
import numpy as np
from typing import Dict, Optional
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.db_models import Report
from ..config import settings

try:
    import onnxruntime as ort
    ONNX_AVAILABLE = True
except ImportError:
    ONNX_AVAILABLE = False
    print("ONNXRuntime not available, using fallback scoring")

class MLScorer:
    def __init__(self):
        self.text_model = None
        self.image_model = None
        self.load_models()
    
    def load_models(self):
        """Load ONNX models if available"""
        if not ONNX_AVAILABLE:
            return
        
        text_model_path = os.path.join(settings.onnx_dir, "text_classifier.onnx")
        image_model_path = os.path.join(settings.onnx_dir, "image_classifier.onnx")
        
        try:
            if os.path.exists(text_model_path):
                self.text_model = ort.InferenceSession(text_model_path)
                print("Loaded text classification model")
        except Exception as e:
            print(f"Failed to load text model: {e}")
        
        try:
            if os.path.exists(image_model_path):
                self.image_model = ort.InferenceSession(image_model_path)
                print("Loaded image classification model")
        except Exception as e:
            print(f"Failed to load image model: {e}")
    
    def score_text(self, text: str) -> Dict:
        """Score text using ONNX model or fallback"""
        if self.text_model and ONNX_AVAILABLE:
            return self._score_text_onnx(text)
        else:
            return self._score_text_fallback(text)
    
    def score_image(self, image_url: str) -> Dict:
        """Score image using ONNX model or fallback"""
        if self.image_model and ONNX_AVAILABLE:
            return self._score_image_onnx(image_url)
        else:
            return self._score_image_fallback(image_url)
    
    def _score_text_onnx(self, text: str) -> Dict:
        """Score text using ONNX model"""
        try:
            # Prepare input (this would depend on your model's input format)
            # For demo, returning mock scores
            return {
                "hazard_type_probs": {
                    "oil_spill": 0.7,
                    "high_waves": 0.2,
                    "tsunami": 0.05,
                    "flood": 0.05
                },
                "urgency": 0.8,
                "keywords": ["oil", "spill", "emergency"],
                "confidence": 0.85
            }
        except Exception as e:
            print(f"ONNX text scoring failed: {e}")
            return self._score_text_fallback(text)
    
    def _score_text_fallback(self, text: str) -> Dict:
        """Fallback rule-based text scoring"""
        text_lower = text.lower()
        
        # Hazard type detection
        hazard_scores = {
            "oil_spill": 0.0,
            "tsunami": 0.0,
            "storm_surge": 0.0,
            "high_waves": 0.0,
            "flood": 0.0,
            "cyclone": 0.0
        }
        
        # Oil spill keywords
        oil_keywords = ["oil", "spill", "slick", "petroleum", "crude", "fuel leak"]
        hazard_scores["oil_spill"] = sum(0.2 for kw in oil_keywords if kw in text_lower)
        
        # Wave keywords
        wave_keywords = ["wave", "waves", "surf", "swell", "rough sea"]
        hazard_scores["high_waves"] = sum(0.2 for kw in wave_keywords if kw in text_lower)
        
        # Tsunami keywords
        tsunami_keywords = ["tsunami", "tidal wave", "seismic wave"]
        hazard_scores["tsunami"] = sum(0.3 for kw in tsunami_keywords if kw in text_lower)
        
        # Flood keywords
        flood_keywords = ["flood", "flooding", "inundation", "overflow"]
        hazard_scores["flood"] = sum(0.25 for kw in flood_keywords if kw in text_lower)
        
        # Storm keywords
        storm_keywords = ["storm", "cyclone", "hurricane", "typhoon"]
        hazard_scores["cyclone"] = sum(0.25 for kw in storm_keywords if kw in text_lower)
        
        # Normalize scores
        for key in hazard_scores:
            hazard_scores[key] = min(1.0, hazard_scores[key])
        
        # Urgency scoring
        urgency_keywords = ["emergency", "urgent", "help", "danger", "critical", "immediate"]
        urgency = min(1.0, sum(0.2 for kw in urgency_keywords if kw in text_lower))
        
        # Extract keywords
        all_keywords = oil_keywords + wave_keywords + tsunami_keywords + flood_keywords + storm_keywords
        found_keywords = [kw for kw in all_keywords if kw in text_lower]
        
        return {
            "hazard_type_probs": hazard_scores,
            "urgency": urgency,
            "keywords": found_keywords[:5],
            "confidence": max(hazard_scores.values()) * 0.8  # Slightly lower confidence for fallback
        }
    
    def _score_image_onnx(self, image_url: str) -> Dict:
        """Score image using ONNX model"""
        # Mock implementation - in production would download and process image
        return {
            "labels": {
                "oil_sheen": 0.92,
                "water": 0.05,
                "debris": 0.03
            },
            "confidence": 0.92
        }
    
    def _score_image_fallback(self, image_url: str) -> Dict:
        """Fallback image scoring based on filename/metadata"""
        if not image_url:
            return {"labels": {}, "confidence": 0.0}
        
        # Simple filename-based scoring
        filename = image_url.lower()
        labels = {}
        
        if any(term in filename for term in ["oil", "spill", "slick"]):
            labels["oil_spill"] = 0.7
        elif any(term in filename for term in ["wave", "surf", "storm"]):
            labels["high_waves"] = 0.6
        elif any(term in filename for term in ["flood", "water"]):
            labels["flood"] = 0.6
        else:
            labels["unknown"] = 0.3
        
        return {
            "labels": labels,
            "confidence": max(labels.values()) if labels else 0.0
        }

# Global scorer instance
ml_scorer = MLScorer()

async def score_report_async(report_id: int):
    """
    Asynchronously score a report using ML models
    """
    db = SessionLocal()
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            return
        
        # Score text content
        text_score = ml_scorer.score_text(report.description)
        
        # Score image if available
        image_score = {"labels": {}, "confidence": 0.0}
        if report.media_url:
            image_score = ml_scorer.score_image(report.media_url)
        
        # Calculate overall threat confidence
        threat_confidence = calculate_threat_confidence(
            text_score, image_score, report
        )
        
        # Update report with scores
        report.confidence = threat_confidence
        report.report_scores = {
            "text_analysis": text_score,
            "image_analysis": image_score,
            "threat_confidence": threat_confidence,
            "timestamp": str(datetime.utcnow())
        }
        
        # Update hazard type if ML suggests different type
        max_hazard = max(text_score["hazard_type_probs"].items(), key=lambda x: x[1])
        if max_hazard[1] > 0.6:  # High confidence threshold
            report.hazard_type = max_hazard[0]
        
        db.commit()
        
        # Trigger clustering if confidence is high
        if threat_confidence >= settings.threat_confidence_auto_alert:
            from .hotspot_detection import trigger_clustering
            await trigger_clustering()
    
    finally:
        db.close()

def calculate_threat_confidence(text_score: Dict, image_score: Dict, report) -> float:
    """
    Calculate overall threat confidence score
    """
    # Base weights
    text_weight = 0.4
    image_weight = 0.3
    credibility_weight = 0.15
    density_weight = 0.1
    corroboration_weight = 0.05
    
    # Text confidence
    text_confidence = text_score.get("confidence", 0.0)
    
    # Image confidence
    image_confidence = image_score.get("confidence", 0.0)
    
    # User credibility (mock - would use actual user credibility)
    user_credibility = 0.5  # Default credibility
    
    # Location density (mock - would calculate nearby reports)
    location_density = 0.3
    
    # Social corroboration (mock - would check social media mentions)
    social_corroboration = 0.2
    
    # Calculate weighted score
    threat_confidence = (
        text_weight * text_confidence +
        image_weight * image_confidence +
        credibility_weight * user_credibility +
        density_weight * location_density +
        corroboration_weight * social_corroboration
    )
    
    return min(1.0, max(0.0, threat_confidence))
