"""
Chatbot service for social media outreach and user engagement
"""
import asyncio
from typing import Optional
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.db_models import SocialPost, SocialOutreach
from ..config import settings

async def trigger_outreach(post_id: int, author_handle: str, content: str):
    """
    Trigger chatbot outreach to social media user
    """
    db = SessionLocal()
    try:
        # Create outreach record
        outreach = SocialOutreach(
            social_post_id=post_id,
            outreach_type="dm",  # Default to DM, fallback to reply
            status="pending"
        )
        
        # Generate personalized message
        message = generate_outreach_message(author_handle, content)
        outreach.message_sent = message
        
        db.add(outreach)
        db.commit()
        
        # In production, would send actual DM via Twitter API
        success = await send_social_message(author_handle, message, "dm")
        
        if success:
            outreach.status = "sent"
        else:
            # Fallback to public reply
            reply_message = generate_public_reply(author_handle)
            success = await send_social_message(author_handle, reply_message, "reply")
            if success:
                outreach.outreach_type = "reply"
                outreach.message_sent = reply_message
                outreach.status = "sent"
        
        db.commit()
        
    finally:
        db.close()

def generate_outreach_message(author_handle: str, content: str) -> str:
    """
    Generate personalized outreach message
    """
    # Extract key terms from content for personalization
    content_lower = content.lower()
    
    if "oil" in content_lower:
        hazard_ref = "oil spill situation"
    elif "wave" in content_lower:
        hazard_ref = "wave conditions"
    elif "flood" in content_lower:
        hazard_ref = "flooding situation"
    elif "storm" in content_lower:
        hazard_ref = "storm conditions"
    else:
        hazard_ref = "ocean hazard situation"
    
    message = f"""Hi {author_handle} - We're Atlas-Alert, an ocean safety monitoring system. 

We noticed your post about the {hazard_ref}. To help us verify and respond appropriately:

1) Can you confirm the exact location?
2) When did this occur?
3) Are people currently in danger?

You can reply here or visit our secure form: {settings.backend_url}/social/confirm?post_id={id}

Your report helps keep coastal communities safe. Thank you!

Contact: help@atlas-alert.org"""
    
    return message

def generate_public_reply(author_handle: str) -> str:
    """
    Generate public reply when DM not available
    """
    return f"@{author_handle} Thanks for the report! Please DM us or visit {settings.backend_url}/report for details. #OceanSafety"

async def send_social_message(handle: str, message: str, message_type: str) -> bool:
    """
    Send message via social media API
    Mock implementation - in production would use actual APIs
    """
    # Simulate API call delay
    await asyncio.sleep(0.1)
    
    # Mock success rate (90% for DMs, 95% for replies)
    import random
    success_rate = 0.9 if message_type == "dm" else 0.95
    
    success = random.random() < success_rate
    
    if success:
        print(f"[CHATBOT] Sent {message_type} to {handle}: {message[:50]}...")
    else:
        print(f"[CHATBOT] Failed to send {message_type} to {handle}")
    
    return success

async def handle_user_response(user_handle: str, response_text: str, post_id: Optional[int] = None):
    """
    Handle user response to chatbot outreach
    """
    db = SessionLocal()
    try:
        # Find the outreach record
        outreach = None
        if post_id:
            outreach = db.query(SocialOutreach).filter(
                SocialOutreach.social_post_id == post_id
            ).first()
        
        if outreach:
            outreach.response_received = response_text
            outreach.status = "responded"
            outreach.responded_at = func.now()
            db.commit()
        
        # Process the response and potentially create a structured report
        structured_data = extract_structured_info(response_text)
        
        # Forward to analyst review queue
        print(f"[CHATBOT] Response from {user_handle} forwarded to analyst review")
        print(f"Structured data: {structured_data}")
        
        return {"status": "forwarded_to_analyst", "data": structured_data}
    
    finally:
        db.close()

def extract_structured_info(response_text: str) -> dict:
    """
    Extract structured information from user response
    """
    import re
    
    # Extract location information
    location_patterns = [
        r"(?:at|in|near|around)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        r"location[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)"
    ]
    
    locations = []
    for pattern in location_patterns:
        matches = re.findall(pattern, response_text, re.IGNORECASE)
        locations.extend(matches)
    
    # Extract time information
    time_patterns = [
        r"(\d{1,2}:\d{2})",
        r"(yesterday|today|now|morning|afternoon|evening)",
        r"(\d{1,2}\s+(?:hours?|minutes?)\s+ago)"
    ]
    
    times = []
    for pattern in time_patterns:
        matches = re.findall(pattern, response_text, re.IGNORECASE)
        times.extend(matches)
    
    # Check for danger indicators
    danger_keywords = ["danger", "emergency", "help", "rescue", "trapped", "injured"]
    has_danger = any(keyword in response_text.lower() for keyword in danger_keywords)
    
    return {
        "locations": locations[:3],
        "times": times[:2],
        "has_danger": has_danger,
        "full_response": response_text
    }

def get_outreach_analytics() -> dict:
    """
    Get chatbot outreach analytics
    """
    db = SessionLocal()
    try:
        total_outreach = db.query(SocialOutreach).count()
        sent_outreach = db.query(SocialOutreach).filter(SocialOutreach.status == "sent").count()
        responded_outreach = db.query(SocialOutreach).filter(SocialOutreach.status == "responded").count()
        
        # Response rate
        response_rate = responded_outreach / sent_outreach if sent_outreach > 0 else 0
        
        # Outreach type distribution
        dm_count = db.query(SocialOutreach).filter(SocialOutreach.outreach_type == "dm").count()
        reply_count = db.query(SocialOutreach).filter(SocialOutreach.outreach_type == "reply").count()
        
        return {
            "total_outreach": total_outreach,
            "sent_outreach": sent_outreach,
            "responded_outreach": responded_outreach,
            "response_rate": response_rate,
            "dm_count": dm_count,
            "reply_count": reply_count
        }
    
    finally:
        db.close()
