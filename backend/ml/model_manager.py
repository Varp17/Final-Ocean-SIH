import asyncio
from typing import Dict, Any, Optional
import numpy as np
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import spacy
from geopy.geocoders import Nominatim
import re
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ModelManager:
    def __init__(self):
        self.models_loaded = False
        self.sentiment_analyzer = None
        self.hazard_classifier = None
        self.ner_model = None
        self.geocoder = None
        
    async def load_models(self):
        """Load all ML models asynchronously"""
        try:
            logger.info("🤖 Loading ML models...")
            
            # Load sentiment analysis model
            self.sentiment_analyzer = pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                return_all_scores=True
            )
            
            # Load hazard classification model (using a general classification model)
            self.hazard_classifier = pipeline(
                "zero-shot-classification",
                model="facebook/bart-large-mnli"
            )
            
            # Load NER model for location extraction
            try:
                self.ner_model = spacy.load("en_core_web_sm")
            except OSError:
                logger.warning("spaCy model not found. Install with: python -m spacy download en_core_web_sm")
                self.ner_model = None
            
            # Initialize geocoder
            self.geocoder = Nominatim(user_agent="atlas-alert-platform")
            
            self.models_loaded = True
            logger.info("✅ All ML models loaded successfully")
            
        except Exception as e:
            logger.error(f"❌ Error loading ML models: {e}")
            self.models_loaded = False
    
    async def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of text"""
        if not self.sentiment_analyzer:
            return {"sentiment": "neutral", "confidence": 0.0, "scores": {}}
        
        try:
            results = self.sentiment_analyzer(text)
            
            # Convert to our format
            sentiment_map = {
                "LABEL_0": "negative",
                "LABEL_1": "neutral", 
                "LABEL_2": "positive"
            }
            
            scores = {}
            max_score = 0
            predicted_sentiment = "neutral"
            
            for result in results[0]:
                label = sentiment_map.get(result['label'], result['label'].lower())
                score = result['score']
                scores[label] = score
                
                if score > max_score:
                    max_score = score
                    predicted_sentiment = label
            
            # Check for urgency indicators
            urgency_keywords = ['emergency', 'urgent', 'help', 'danger', 'critical', 'immediate']
            if any(keyword in text.lower() for keyword in urgency_keywords):
                predicted_sentiment = "urgent"
                scores["urgent"] = min(max_score + 0.2, 1.0)
            
            return {
                "sentiment": predicted_sentiment,
                "confidence": max_score,
                "scores": scores
            }
            
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {e}")
            return {"sentiment": "neutral", "confidence": 0.0, "scores": {}}
    
    async def classify_hazard(self, text: str) -> Dict[str, Any]:
        """Classify hazard type and severity from text"""
        if not self.hazard_classifier:
            return self._fallback_hazard_classification(text)
        
        try:
            # Define hazard types
            hazard_types = [
                "tsunami", "cyclone", "storm surge", "coastal erosion",
                "oil spill", "marine pollution", "rip current", 
                "high waves", "flooding", "no hazard"
            ]
            
            # Classify hazard type
            hazard_result = self.hazard_classifier(text, hazard_types)
            
            # Define severity levels
            severity_levels = ["low", "medium", "high", "critical"]
            severity_result = self.hazard_classifier(text, severity_levels)
            
            # Determine urgency
            urgency_levels = ["monitoring", "within days", "within hours", "immediate"]
            urgency_result = self.hazard_classifier(text, urgency_levels)
            
            return {
                "hazard_type": hazard_result['labels'][0].replace(' ', '_'),
                "hazard_confidence": hazard_result['scores'][0],
                "severity": severity_result['labels'][0],
                "severity_confidence": severity_result['scores'][0],
                "urgency": urgency_result['labels'][0].replace(' ', '_'),
                "urgency_confidence": urgency_result['scores'][0],
                "overall_confidence": (
                    hazard_result['scores'][0] + 
                    severity_result['scores'][0] + 
                    urgency_result['scores'][0]
                ) / 3
            }
            
        except Exception as e:
            logger.error(f"Error in hazard classification: {e}")
            return self._fallback_hazard_classification(text)
    
    def _fallback_hazard_classification(self, text: str) -> Dict[str, Any]:
        """Fallback hazard classification using keyword matching"""
        text_lower = text.lower()
        
        # Keyword-based classification
        hazard_keywords = {
            "tsunami": ["tsunami", "tidal wave", "seismic wave"],
            "cyclone": ["cyclone", "hurricane", "typhoon", "storm"],
            "flooding": ["flood", "flooding", "water rising", "inundation"],
            "high_waves": ["big waves", "large waves", "huge waves", "massive waves"],
            "oil_spill": ["oil spill", "oil leak", "petroleum", "crude oil"],
            "rip_current": ["rip current", "undertow", "dangerous current"]
        }
        
        severity_keywords = {
            "critical": ["critical", "severe", "extreme", "catastrophic", "emergency"],
            "high": ["high", "dangerous", "serious", "major"],
            "medium": ["moderate", "medium", "concerning"],
            "low": ["minor", "small", "slight", "low"]
        }
        
        urgency_keywords = {
            "immediate": ["immediate", "now", "urgent", "emergency"],
            "within_hours": ["soon", "today", "hours"],
            "within_days": ["tomorrow", "days", "week"],
            "monitoring": ["watch", "monitor", "observe"]
        }
        
        # Find matches
        detected_hazard = "unknown"
        hazard_confidence = 0.3
        
        for hazard, keywords in hazard_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_hazard = hazard
                hazard_confidence = 0.7
                break
        
        detected_severity = "medium"
        severity_confidence = 0.3
        
        for severity, keywords in severity_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_severity = severity
                severity_confidence = 0.6
                break
        
        detected_urgency = "monitoring"
        urgency_confidence = 0.3
        
        for urgency, keywords in urgency_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_urgency = urgency
                urgency_confidence = 0.6
                break
        
        return {
            "hazard_type": detected_hazard,
            "hazard_confidence": hazard_confidence,
            "severity": detected_severity,
            "severity_confidence": severity_confidence,
            "urgency": detected_urgency,
            "urgency_confidence": urgency_confidence,
            "overall_confidence": (hazard_confidence + severity_confidence + urgency_confidence) / 3
        }
    
    async def extract_locations(self, text: str) -> Dict[str, Any]:
        """Extract location information from text"""
        locations = []
        coordinates = []
        
        try:
            # Use NER model if available
            if self.ner_model:
                doc = self.ner_model(text)
                for ent in doc.ents:
                    if ent.label_ in ["GPE", "LOC"]:  # Geopolitical entity or location
                        locations.append({
                            "name": ent.text,
                            "type": ent.label_,
                            "confidence": 0.8
                        })
            
            # Regex patterns for coordinates
            coord_patterns = [
                r'(-?\d+\.?\d*)[°\s]*[NS][\s,]*(-?\d+\.?\d*)[°\s]*[EW]',
                r'(-?\d+\.?\d*),\s*(-?\d+\.?\d*)',
                r'lat[itude]*:\s*(-?\d+\.?\d*)[,\s]*lon[gitude]*:\s*(-?\d+\.?\d*)'
            ]
            
            for pattern in coord_patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    lat, lon = float(match.group(1)), float(match.group(2))
                    if -90 <= lat <= 90 and -180 <= lon <= 180:
                        coordinates.append({
                            "latitude": lat,
                            "longitude": lon,
                            "confidence": 0.9
                        })
            
            # Geocode location names
            geocoded_locations = []
            if self.geocoder and locations:
                for location in locations[:3]:  # Limit to prevent rate limiting
                    try:
                        result = self.geocoder.geocode(location["name"], timeout=5)
                        if result:
                            geocoded_locations.append({
                                "name": location["name"],
                                "latitude": result.latitude,
                                "longitude": result.longitude,
                                "confidence": location["confidence"] * 0.8
                            })
                    except Exception as e:
                        logger.warning(f"Geocoding failed for {location['name']}: {e}")
            
            return {
                "locations": locations,
                "coordinates": coordinates,
                "geocoded_locations": geocoded_locations,
                "extraction_confidence": 0.7 if (locations or coordinates) else 0.1
            }
            
        except Exception as e:
            logger.error(f"Error in location extraction: {e}")
            return {
                "locations": [],
                "coordinates": [],
                "geocoded_locations": [],
                "extraction_confidence": 0.0
            }
    
    async def assess_threat_level(self, reports: list) -> Dict[str, Any]:
        """Assess overall threat level from multiple reports"""
        if not reports:
            return {
                "threat_level": "low",
                "confidence": 0.0,
                "report_count": 0,
                "recommendations": ["No reports to analyze"]
            }
        
        try:
            # Analyze report patterns
            hazard_types = {}
            severity_scores = []
            urgency_scores = []
            confidence_scores = []
            
            urgency_weights = {
                "immediate": 1.0,
                "within_hours": 0.8,
                "within_days": 0.5,
                "monitoring": 0.2
            }
            
            severity_weights = {
                "critical": 1.0,
                "high": 0.8,
                "medium": 0.5,
                "low": 0.2
            }
            
            for report in reports:
                # Count hazard types
                hazard_type = report.get("hazard_type", "unknown")
                hazard_types[hazard_type] = hazard_types.get(hazard_type, 0) + 1
                
                # Collect scores
                severity = report.get("severity", "low")
                urgency = report.get("urgency", "monitoring")
                confidence = report.get("confidence_score", 0.5)
                
                severity_scores.append(severity_weights.get(severity, 0.2))
                urgency_scores.append(urgency_weights.get(urgency, 0.2))
                confidence_scores.append(confidence)
            
            # Calculate overall threat level
            avg_severity = np.mean(severity_scores) if severity_scores else 0.2
            avg_urgency = np.mean(urgency_scores) if urgency_scores else 0.2
            avg_confidence = np.mean(confidence_scores) if confidence_scores else 0.5
            
            # Weight by number of reports
            report_weight = min(len(reports) / 10, 1.0)  # Max weight at 10 reports
            
            overall_score = (avg_severity * 0.4 + avg_urgency * 0.4 + report_weight * 0.2) * avg_confidence
            
            # Determine threat level
            if overall_score >= 0.8:
                threat_level = "critical"
            elif overall_score >= 0.6:
                threat_level = "high"
            elif overall_score >= 0.4:
                threat_level = "medium"
            else:
                threat_level = "low"
            
            # Generate recommendations
            recommendations = []
            if threat_level in ["critical", "high"]:
                recommendations.extend([
                    "Immediate emergency response required",
                    "Evacuate affected areas if necessary",
                    "Deploy emergency services",
                    "Issue public safety alerts"
                ])
            elif threat_level == "medium":
                recommendations.extend([
                    "Monitor situation closely",
                    "Prepare emergency response teams",
                    "Issue advisory warnings"
                ])
            else:
                recommendations.extend([
                    "Continue monitoring",
                    "Verify reports with additional sources"
                ])
            
            return {
                "threat_level": threat_level,
                "confidence": overall_score,
                "report_count": len(reports),
                "hazard_distribution": hazard_types,
                "average_severity": avg_severity,
                "average_urgency": avg_urgency,
                "recommendations": recommendations,
                "analysis_timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error in threat assessment: {e}")
            return {
                "threat_level": "unknown",
                "confidence": 0.0,
                "report_count": len(reports),
                "recommendations": ["Error in threat assessment - manual review required"]
            }
