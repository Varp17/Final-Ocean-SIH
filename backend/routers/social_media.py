from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, List, Optional
import logging
from datetime import datetime

from ..core.database import get_db
from ..ml.advanced_classifiers import SocialMediaAnalyzer
from ..mock_data.data_generator import MockDataGenerator

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/social-media", tags=["social-media"])

# Initialize social media analyzer
social_analyzer = SocialMediaAnalyzer()

@router.get("/posts", response_model=Dict)
async def get_social_posts(
    limit: int = 50,
    min_threat_score: Optional[float] = None,
    platform: Optional[str] = None,
    requires_review: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get social media posts with filtering"""
    try:
        generator = MockDataGenerator()
        all_posts = generator.generate_social_media_posts(200)
        
        # Apply filters
        filtered_posts = all_posts
        
        if min_threat_score:
            filtered_posts = [p for p in filtered_posts if p['threat_score'] >= min_threat_score]
        
        if platform:
            filtered_posts = [p for p in filtered_posts if p['platform'] == platform]
        
        if requires_review is not None:
            filtered_posts = [p for p in filtered_posts if p['requires_review'] == requires_review]
        
        # Sort by threat score and timestamp
        filtered_posts.sort(key=lambda x: (x['threat_score'], x['created_at']), reverse=True)
        
        return {
            'posts': filtered_posts[:limit],
            'total': len(filtered_posts),
            'high_threat_count': len([p for p in filtered_posts if p['threat_score'] >= 7.0]),
            'review_required_count': len([p for p in filtered_posts if p['requires_review']]),
            'platforms': list(set(p['platform'] for p in all_posts))
        }
        
    except Exception as e:
        logger.error(f"Error fetching social media posts: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze", response_model=Dict)
async def analyze_social_post(
    post_data: Dict,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Analyze a social media post for threat assessment"""
    try:
        # Perform social media analysis
        analysis_result = social_analyzer.analyze_social_post(post_data)
        
        # Create analyzed post record
        analyzed_post = {
            'id': f"social_{int(datetime.utcnow().timestamp())}",
            'original_post': post_data,
            'analysis': analysis_result,
            'analyzed_at': datetime.utcnow().isoformat(),
            'status': 'ANALYZED',
            'requires_human_review': analysis_result['requires_analyst_review'],
            'auto_alert_eligible': analysis_result['auto_alert_eligible']
        }
        
        # Background processing for high-threat posts
        if analysis_result['requires_analyst_review']:
            background_tasks.add_task(queue_for_analyst_review, analyzed_post)
        
        if analysis_result['auto_alert_eligible']:
            background_tasks.add_task(trigger_auto_alert, analyzed_post)
        
        return {
            'success': True,
            'analyzed_post': analyzed_post,
            'recommendations': get_analysis_recommendations(analysis_result)
        }
        
    except Exception as e:
        logger.error(f"Error analyzing social media post: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/review-queue", response_model=Dict)
async def get_analyst_review_queue(
    priority: Optional[str] = None,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get posts queued for analyst review"""
    try:
        generator = MockDataGenerator()
        posts = generator.generate_social_media_posts(100)
        
        # Filter posts requiring review
        review_posts = [p for p in posts if p.get('requires_review', False)]
        
        # Add mock review metadata
        for post in review_posts:
            post['review_metadata'] = {
                'queued_at': datetime.utcnow().isoformat(),
                'priority': 'HIGH' if post['threat_score'] >= 8.0 else 'MEDIUM',
                'estimated_review_time': '5-10 minutes',
                'similar_posts_count': 2,
                'auto_flags': ['high_threat_score', 'viral_potential'] if post['threat_score'] >= 7.0 else ['requires_verification']
            }
        
        # Apply priority filter
        if priority:
            review_posts = [p for p in review_posts if p['review_metadata']['priority'] == priority]
        
        # Sort by priority and threat score
        priority_order = {'HIGH': 3, 'MEDIUM': 2, 'LOW': 1}
        review_posts.sort(
            key=lambda x: (priority_order.get(x['review_metadata']['priority'], 0), x['threat_score']), 
            reverse=True
        )
        
        return {
            'review_queue': review_posts[:limit],
            'total_pending': len(review_posts),
            'high_priority_count': len([p for p in review_posts if p['review_metadata']['priority'] == 'HIGH']),
            'estimated_total_review_time': f"{len(review_posts) * 7} minutes"
        }
        
    except Exception as e:
        logger.error(f"Error fetching review queue: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/posts/{post_id}/review", response_model=Dict)
async def submit_analyst_review(
    post_id: str,
    review_data: Dict,
    db: Session = Depends(get_db)
):
    """Submit analyst review for a social media post"""
    try:
        verified = review_data.get('verified', False)
        confidence = review_data.get('confidence', 0.5)
        notes = review_data.get('notes', '')
        action_taken = review_data.get('action_taken', 'none')
        
        review_result = {
            'post_id': post_id,
            'analyst_id': 'analyst_001',  # Mock analyst ID
            'verified': verified,
            'confidence': confidence,
            'notes': notes,
            'action_taken': action_taken,
            'reviewed_at': datetime.utcnow().isoformat(),
            'review_duration_seconds': 420,  # Mock review time
            'previous_status': 'PENDING_REVIEW',
            'new_status': 'VERIFIED' if verified else 'FALSE_POSITIVE'
        }
        
        # Determine follow-up actions
        follow_up_actions = []
        if verified and confidence >= 0.8:
            follow_up_actions.extend(['create_alert', 'notify_authorities'])
        elif verified and confidence >= 0.6:
            follow_up_actions.append('monitor_situation')
        
        return {
            'success': True,
            'review': review_result,
            'follow_up_actions': follow_up_actions,
            'message': f"Post {'verified' if verified else 'marked as false positive'} by analyst"
        }
        
    except Exception as e:
        logger.error(f"Error submitting analyst review: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/hashtag-trends", response_model=Dict)
async def get_hashtag_trends(
    hours: int = 24,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get trending hashtags and their threat analysis"""
    try:
        generator = MockDataGenerator()
        posts = generator.generate_social_media_posts(500)
        
        # Analyze hashtag trends
        hashtag_data = {}
        for post in posts:
            for hashtag in post.get('hashtags', []):
                if hashtag not in hashtag_data:
                    hashtag_data[hashtag] = {
                        'count': 0,
                        'total_threat_score': 0,
                        'posts': [],
                        'platforms': set()
                    }
                
                hashtag_data[hashtag]['count'] += 1
                hashtag_data[hashtag]['total_threat_score'] += post['threat_score']
                hashtag_data[hashtag]['posts'].append(post['id'])
                hashtag_data[hashtag]['platforms'].add(post['platform'])
        
        # Calculate trends
        trending_hashtags = []
        for hashtag, data in hashtag_data.items():
            if data['count'] >= 3:  # Minimum threshold
                avg_threat = data['total_threat_score'] / data['count']
                trend_item = {
                    'hashtag': hashtag,
                    'post_count': data['count'],
                    'avg_threat_score': round(avg_threat, 2),
                    'trend_velocity': round(data['count'] / hours, 2),  # Posts per hour
                    'platforms': list(data['platforms']),
                    'risk_level': 'HIGH' if avg_threat >= 7.0 else 'MEDIUM' if avg_threat >= 5.0 else 'LOW',
                    'requires_monitoring': avg_threat >= 6.0 and data['count'] >= 5
                }
                trending_hashtags.append(trend_item)
        
        # Sort by trend velocity and threat score
        trending_hashtags.sort(key=lambda x: (x['trend_velocity'], x['avg_threat_score']), reverse=True)
        
        return {
            'trending_hashtags': trending_hashtags[:limit],
            'analysis_period_hours': hours,
            'total_unique_hashtags': len(hashtag_data),
            'high_risk_hashtags': len([h for h in trending_hashtags if h['risk_level'] == 'HIGH']),
            'monitoring_required': len([h for h in trending_hashtags if h['requires_monitoring']])
        }
        
    except Exception as e:
        logger.error(f"Error analyzing hashtag trends: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def get_analysis_recommendations(analysis_result: Dict) -> List[str]:
    """Generate recommendations based on analysis results"""
    recommendations = []
    
    threat_score = analysis_result.get('threat_score', 0)
    credibility_score = analysis_result.get('credibility_score', 0)
    
    if threat_score >= 8.0 and credibility_score >= 7.0:
        recommendations.extend([
            'Immediate analyst review required',
            'Consider issuing emergency alert',
            'Verify with local authorities'
        ])
    elif threat_score >= 6.0:
        recommendations.extend([
            'Queue for analyst review',
            'Monitor for corroborating reports',
            'Check official sources'
        ])
    elif threat_score >= 4.0:
        recommendations.append('Continue monitoring')
    
    if analysis_result.get('auto_alert_eligible', False):
        recommendations.append('Eligible for automated alert generation')
    
    return recommendations

async def queue_for_analyst_review(post: Dict):
    """Background task to queue post for analyst review"""
    try:
        logger.info(f"Queuing post {post['id']} for analyst review")
        # In real implementation, this would add to review queue
        
    except Exception as e:
        logger.error(f"Error queuing for review: {e}")

async def trigger_auto_alert(post: Dict):
    """Background task to trigger automatic alert"""
    try:
        logger.info(f"Triggering auto-alert for post {post['id']}")
        # In real implementation, this would create an alert
        
    except Exception as e:
        logger.error(f"Error triggering auto-alert: {e}")
