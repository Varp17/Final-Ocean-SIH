"""
NLP processing service for social media posts and text analysis
"""
import re
import random
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.db_models import SocialPost
from .chatbot import trigger_outreach

# Hazard detection keywords
HAZARD_KEYWORDS = {
    "oil_spill": [
        "oil spill", "oil slick", "black water", "petroleum leak",
        "crude oil", "fuel spill", "oil contamination", "oil leak"
    ],
    "tsunami": [
        "tsunami", "tidal wave", "seismic wave", "earthquake wave",
        "giant wave", "destructive wave"
    ],
    "storm_surge": [
        "storm surge", "high tide", "flooding waves", "surge flooding",
        "coastal flooding", "storm waves", "hurricane surge"
    ],
    "high_waves": [
        "high waves", "huge waves", "massive waves", "dangerous waves",
        "rough seas", "heavy swells", "big waves"
    ],
    "flood": [
        "flood", "flooding", "water rising", "inundation", "overflow",
        "waterlogged", "submerged", "water everywhere"
    ],
    "cyclone": [
        "cyclone", "hurricane", "typhoon", "storm", "severe weather",
        "wind storm", "tropical storm"
    ]
}

# Urgency indicators
URGENCY_KEYWORDS = [
    "help", "emergency", "urgent", "danger", "critical", "immediate",
    "rescue", "sos", "mayday", "alert", "warning", "evacuate"
]

# Location extraction patterns
LOCATION_PATTERNS = [
    r"(?:at|in|near|around)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
    r"([A-Z][a-z]+\s+(?:beach|port|harbor|coast|bay|island))",
    r"([A-Z][a-z]+\s+(?:district|area|region|zone))"
]

def analyze_text(text: str) -> Dict:
    """
    Analyze text for hazard detection, urgency, and sentiment
    """
    text_lower = text.lower()
    
    # Detect hazard type
    hazard_type = "none"
    hazard_confidence = 0.0
    
    for hazard, keywords in HAZARD_KEYWORDS.items():
        matches = sum(1 for keyword in keywords if keyword in text_lower)
        if matches > 0:
            confidence = min(1.0, matches * 0.3)
            if confidence > hazard_confidence:
                hazard_type = hazard
                hazard_confidence = confidence
    
    # Calculate urgency score
    urgency_matches = sum(1 for keyword in URGENCY_KEYWORDS if keyword in text_lower)
    urgency_score = min(1.0, urgency_matches * 0.4)
    
    # Extract keywords
    keywords = []
    for hazard, keyword_list in HAZARD_KEYWORDS.items():
        for keyword in keyword_list:
            if keyword in text_lower:
                keywords.append(keyword)
    
    # Extract potential locations
    locations = []
    for pattern in LOCATION_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        locations.extend(matches)
    
    # Calculate relevance (combination of hazard confidence and urgency)
    relevance = (hazard_confidence * 0.7) + (urgency_score * 0.3)
    
    return {
        "hazard_type": hazard_type if hazard_type != "none" else None,
        "hazard_confidence": hazard_confidence,
        "urgency": urgency_score,
        "relevance": relevance,
        "keywords": keywords[:5],  # Limit to top 5 keywords
        "locations": locations[:3]  # Limit to top 3 locations
    }

def calculate_credibility(author_handle: str, text: str) -> float:
    """
    Calculate author credibility score based on various factors
    Mock implementation - in production, would analyze account history
    """
    credibility = 0.5  # Base credibility
    
    # Account age simulation (would use real API data)
    if len(author_handle) > 10:  # Longer handles might be older accounts
        credibility += 0.1
    
    # Content quality indicators
    if len(text) > 50:  # Detailed posts might be more credible
        credibility += 0.1
    
    if any(word in text.lower() for word in ["photo", "video", "image", "pic"]):
        credibility += 0.15  # Media attachments increase credibility
    
    # Bot-like behavior detection (simplified)
    if text.count("#") > 5:  # Too many hashtags might indicate spam
        credibility -= 0.2
    
    if len(set(text.split())) / len(text.split()) < 0.5:  # High word repetition
        credibility -= 0.1
    
    return max(0.0, min(1.0, credibility))

async def process_social_post(post_id: int):
    """
    Process a social media post with NLP analysis
    """
    db = SessionLocal()
    try:
        post = db.query(SocialPost).filter(SocialPost.id == post_id).first()
        if not post:
            return
        
        # Analyze text content
        analysis = analyze_text(post.text)
        
        # Calculate credibility
        credibility = calculate_credibility(post.author_handle, post.text)
        
        # Update post with analysis results
        post.hazard_type = analysis["hazard_type"]
        post.relevance = analysis["relevance"]
        post.urgency = analysis["urgency"]
        post.credibility = credibility
        post.keywords = analysis["keywords"]
        post.processed = True
        
        # If no coordinates but locations found, could geocode here
        # For now, just store the location names in metadata
        
        db.commit()
        
        # Trigger chatbot outreach if relevant and urgent
        if (analysis["relevance"] >= 0.6 and 
            analysis["urgency"] >= 0.6 and 
            not post.outreach_sent):
            
            await trigger_outreach(post_id, post.author_handle, post.text)
            post.outreach_sent = True
            db.commit()
    
    finally:
        db.close()

def extract_geolocation(text: str, locations: List[str]) -> Optional[Dict]:
    """
    Extract or infer geolocation from text and location names
    Mock implementation - in production would use geocoding APIs
    """
    # Mumbai area coordinates for demo
    mumbai_locations = {
        "mumbai": {"lat": 19.0760, "lon": 72.8777},
        "marine drive": {"lat": 18.9434, "lon": 72.8234},
        "juhu": {"lat": 19.0990, "lon": 72.8265},
        "bandra": {"lat": 19.0596, "lon": 72.8295},
        "colaba": {"lat": 18.9067, "lon": 72.8147},
        "worli": {"lat": 19.0176, "lon": 72.8118},
        "versova": {"lat": 19.1317, "lon": 72.8053}
    }
    
    text_lower = text.lower()
    for location, coords in mumbai_locations.items():
        if location in text_lower:
            return coords
    
    # Check extracted locations
    for location in locations:
        location_lower = location.lower()
        if location_lower in mumbai_locations:
            return mumbai_locations[location_lower]
    
    return None

def get_social_analytics() -> Dict:
    """
    Get analytics for social media processing
    """
    db = SessionLocal()
    try:
        total_posts = db.query(SocialPost).count()
        processed_posts = db.query(SocialPost).filter(SocialPost.processed == True).count()
        relevant_posts = db.query(SocialPost).filter(SocialPost.relevance >= 0.6).count()
        outreach_sent = db.query(SocialPost).filter(SocialPost.outreach_sent == True).count()
        
        # Hazard type distribution
        hazard_distribution = {}
        for hazard_type in ["oil_spill", "tsunami", "storm_surge", "high_waves", "flood", "cyclone"]:
            count = db.query(SocialPost).filter(SocialPost.hazard_type == hazard_type).count()
            hazard_distribution[hazard_type] = count
        
        return {
            "total_posts": total_posts,
            "processed_posts": processed_posts,
            "relevant_posts": relevant_posts,
            "outreach_sent": outreach_sent,
            "processing_rate": processed_posts / total_posts if total_posts > 0 else 0,
            "relevance_rate": relevant_posts / processed_posts if processed_posts > 0 else 0,
            "hazard_distribution": hazard_distribution
        }
    
    finally:
        db.close()
