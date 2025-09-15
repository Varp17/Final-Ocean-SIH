from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, List, Optional
import logging
from datetime import datetime, timedelta

from ..core.database import get_db
from ..mock_data.data_generator import MockDataGenerator

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/dashboard", response_model=Dict)
async def get_dashboard_analytics(
    time_period: str = "24h",
    db: Session = Depends(get_db)
):
    """Get comprehensive dashboard analytics"""
    try:
        generator = MockDataGenerator()
        analytics_data = generator.generate_analytics_data()
        
        # Add time-based analysis
        time_periods = {
            "1h": 1, "6h": 6, "24h": 24, "7d": 168, "30d": 720
        }
        
        hours = time_periods.get(time_period, 24)
        
        # Enhanced analytics with trends
        enhanced_analytics = {
            **analytics_data,
            'time_period': time_period,
            'trends': {
                'report_trend': '+15%' if hours <= 24 else '+8%',
                'threat_score_trend': '+0.3' if hours <= 24 else '-0.1',
                'verification_rate_trend': '+5%',
                'response_time_trend': '-12%'
            },
            'performance_metrics': {
                'avg_response_time_minutes': 8.5,
                'false_positive_rate': 0.12,
                'alert_accuracy': 0.89,
                'system_uptime': 0.998
            },
            'resource_utilization': {
                'active_analysts': 12,
                'ml_processing_queue': 23,
                'api_requests_per_minute': 145,
                'websocket_connections': 89
            }
        }
        
        return enhanced_analytics
        
    except Exception as e:
        logger.error(f"Error generating dashboard analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports/trends", response_model=Dict)
async def get_report_trends(
    days: int = 7,
    granularity: str = "hourly",
    db: Session = Depends(get_db)
):
    """Get detailed report trends and patterns"""
    try:
        # Generate trend data based on granularity
        if granularity == "hourly":
            periods = 24 * days
            trend_data = [
                {
                    'timestamp': (datetime.utcnow() - timedelta(hours=i)).isoformat(),
                    'report_count': max(0, int(15 + 10 * (0.5 - abs(0.5 - (i % 24) / 24)))),
                    'avg_threat_score': round(4.0 + 2.0 * (0.5 - abs(0.5 - (i % 24) / 24)), 2),
                    'verified_count': max(0, int(8 + 5 * (0.5 - abs(0.5 - (i % 24) / 24)))),
                    'false_alarms': max(0, int(2 + 1 * (abs(0.5 - (i % 24) / 24))))
                }
                for i in range(periods)
            ]
        else:  # daily
            trend_data = [
                {
                    'date': (datetime.utcnow() - timedelta(days=i)).date().isoformat(),
                    'report_count': max(20, int(50 + 30 * (0.5 - abs(0.5 - i / days)))),
                    'avg_threat_score': round(5.0 + 1.5 * (0.5 - abs(0.5 - i / days)), 2),
                    'verified_count': max(10, int(25 + 15 * (0.5 - abs(0.5 - i / days)))),
                    'false_alarms': max(2, int(5 + 3 * (abs(0.5 - i / days))))
                }
                for i in range(days)
            ]
        
        return {
            'trends': trend_data,
            'summary': {
                'total_reports': sum(item['report_count'] for item in trend_data),
                'avg_threat_score': round(sum(item['avg_threat_score'] for item in trend_data) / len(trend_data), 2),
                'verification_rate': round(sum(item['verified_count'] for item in trend_data) / sum(item['report_count'] for item in trend_data), 3),
                'false_alarm_rate': round(sum(item['false_alarms'] for item in trend_data) / sum(item['report_count'] for item in trend_data), 3)
            },
            'period': f"{days} days",
            'granularity': granularity
        }
        
    except Exception as e:
        logger.error(f"Error generating report trends: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/social-media/analysis", response_model=Dict)
async def get_social_media_analysis(
    hours: int = 24,
    db: Session = Depends(get_db)
):
    """Get social media analysis and insights"""
    try:
        generator = MockDataGenerator()
        social_posts = generator.generate_social_media_posts(200)
        
        # Analyze social media data
        high_threat_posts = [post for post in social_posts if post['threat_score'] >= 6.0]
        review_required = [post for post in social_posts if post['requires_review']]
        
        # Platform analysis
        platform_stats = {}
        for post in social_posts:
            platform = post['platform']
            if platform not in platform_stats:
                platform_stats[platform] = {'count': 0, 'avg_threat': 0, 'high_threat': 0}
            platform_stats[platform]['count'] += 1
            platform_stats[platform]['avg_threat'] += post['threat_score']
            if post['threat_score'] >= 6.0:
                platform_stats[platform]['high_threat'] += 1
        
        # Calculate averages
        for platform in platform_stats:
            platform_stats[platform]['avg_threat'] = round(
                platform_stats[platform]['avg_threat'] / platform_stats[platform]['count'], 2
            )
        
        # Hashtag analysis
        hashtag_counts = {}
        for post in social_posts:
            for hashtag in post.get('hashtags', []):
                hashtag_counts[hashtag] = hashtag_counts.get(hashtag, 0) + 1
        
        top_hashtags = sorted(hashtag_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return {
            'summary': {
                'total_posts_analyzed': len(social_posts),
                'high_threat_posts': len(high_threat_posts),
                'posts_requiring_review': len(review_required),
                'avg_threat_score': round(sum(post['threat_score'] for post in social_posts) / len(social_posts), 2),
                'avg_credibility_score': round(sum(post['credibility_score'] for post in social_posts) / len(social_posts), 2)
            },
            'platform_breakdown': platform_stats,
            'trending_hashtags': [{'hashtag': tag, 'count': count} for tag, count in top_hashtags],
            'high_threat_posts': high_threat_posts[:10],  # Top 10 high threat posts
            'review_queue': len(review_required),
            'analysis_period_hours': hours
        }
        
    except Exception as e:
        logger.error(f"Error generating social media analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/performance", response_model=Dict)
async def get_system_performance(db: Session = Depends(get_db)):
    """Get system performance metrics"""
    try:
        import random
        
        performance_data = {
            'api_performance': {
                'avg_response_time_ms': round(random.uniform(50, 200), 2),
                'requests_per_second': round(random.uniform(100, 500), 2),
                'error_rate': round(random.uniform(0.001, 0.01), 4),
                'uptime_percentage': round(random.uniform(99.5, 99.99), 3)
            },
            'ml_performance': {
                'classification_accuracy': round(random.uniform(0.85, 0.95), 3),
                'avg_processing_time_ms': round(random.uniform(200, 800), 2),
                'model_confidence_avg': round(random.uniform(0.75, 0.90), 3),
                'false_positive_rate': round(random.uniform(0.05, 0.15), 3)
            },
            'database_performance': {
                'query_avg_time_ms': round(random.uniform(10, 50), 2),
                'connection_pool_usage': round(random.uniform(0.3, 0.8), 2),
                'storage_usage_gb': round(random.uniform(50, 200), 2),
                'backup_status': 'healthy'
            },
            'websocket_performance': {
                'active_connections': random.randint(50, 200),
                'messages_per_second': round(random.uniform(10, 100), 2),
                'connection_success_rate': round(random.uniform(0.95, 0.99), 3),
                'avg_latency_ms': round(random.uniform(20, 100), 2)
            },
            'system_resources': {
                'cpu_usage_percent': round(random.uniform(20, 80), 1),
                'memory_usage_percent': round(random.uniform(40, 85), 1),
                'disk_usage_percent': round(random.uniform(30, 70), 1),
                'network_io_mbps': round(random.uniform(10, 100), 2)
            }
        }
        
        return performance_data
        
    except Exception as e:
        logger.error(f"Error generating performance metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))
