"""
Social media API endpoints
Handles social media post ingestion and processing
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional

from ..database import get_db
from ..models.db_models import SocialPost
from ..models.schemas import SocialPostCreate, SocialPostResponse
from ..services.nlp_processor import process_social_post
from ..services.chatbot import trigger_outreach

router = APIRouter(prefix="/social", tags=["Social Media"])

@router.post("/", response_model=dict)
async def ingest_post(
    post: SocialPostCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Ingest a social media post"""
    try:
        # Create social post record
        db_post = SocialPost(
            platform=post.platform,
            post_id=post.post_id,
            author_handle=post.author_handle,
            text=post.text,
            posted_at=post.posted_at,
            lat=post.lat,
            lon=post.lon
        )
        
        # Set geometry if coordinates available
        if post.lat and post.lon:
            db_post.geom = text(f"ST_SetSRID(ST_Point({post.lon}, {post.lat}), 4326)")
        
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        
        # Process with NLP in background
        background_tasks.add_task(process_social_post, db_post.id)
        
        return {
            "post_id": db_post.id,
            "status": "processing"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error ingesting post: {str(e)}")

@router.post("/webhook")
async def social_webhook(
    payload: dict,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Webhook endpoint for social media platforms"""
    # This would handle platform-specific webhook payloads
    # For now, return success
    return {"status": "received"}

@router.get("/", response_model=List[SocialPostResponse])
def get_social_posts(
    relevance_threshold: float = 0.6,
    hazard_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get processed social posts above relevance threshold"""
    query = db.query(SocialPost).filter(
        SocialPost.processed == True,
        SocialPost.relevance >= relevance_threshold
    )
    
    if hazard_type:
        query = query.filter(SocialPost.hazard_type == hazard_type)
    
    return query.order_by(SocialPost.posted_at.desc()).limit(50).all()

@router.get("/{post_id}")
def get_social_post(post_id: int, db: Session = Depends(get_db)):
    """Get specific social post"""
    post = db.query(SocialPost).filter(SocialPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Social post not found")
    return post
