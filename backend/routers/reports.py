from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
import logging
from datetime import datetime

from ..core.database import get_db
from ..models.schemas import ReportCreate, ReportOut, ReportUpdate
from ..ml.advanced_classifiers import HazardClassifier, ThreatScorer
from ..services.clustering_service import HotspotDetector
from ..mock_data.data_generator import MockDataGenerator
from ..core.websocket_manager import websocket_manager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/reports", tags=["reports"])

# Initialize ML services
hazard_classifier = HazardClassifier()
threat_scorer = ThreatScorer()

@router.post("/", response_model=Dict)
async def create_report(
    report: ReportCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create a new hazard report with ML analysis"""
    try:
        # Perform ML analysis
        text_analysis = hazard_classifier.classify_hazard(report.text)
        
        # Calculate threat score
        report_data = {
            'text_classification': text_analysis,
            'location_analysis': {'nearby_reports': 0},  # TODO: Implement
            'reporter': {'verified': False, 'historical_accuracy': 0.7, 'total_reports': 1},
            'temporal_analysis': {'risk_multiplier': 1.0}
        }
        
        threat_analysis = threat_scorer.calculate_threat_score(report_data)
        
        # Create report record (mock implementation)
        report_id = f"report_{int(datetime.utcnow().timestamp())}"
        
        report_response = {
            'id': report_id,
            'text': report.text,
            'latitude': report.latitude,
            'longitude': report.longitude,
            'hazard_type': text_analysis['hazard_type'],
            'confidence': text_analysis['confidence'],
            'threat_score': threat_analysis['final_threat_score'],
            'risk_level': threat_analysis['risk_level'],
            'status': 'PENDING',
            'created_at': datetime.utcnow().isoformat(),
            'ml_analysis': {
                'text_classification': text_analysis,
                'threat_analysis': threat_analysis
            }
        }
        
        # Background tasks
        background_tasks.add_task(process_report_clustering, report_response, db)
        background_tasks.add_task(notify_websocket_clients, report_response)
        
        return {
            'success': True,
            'report': report_response,
            'message': 'Report created and analyzed successfully'
        }
        
    except Exception as e:
        logger.error(f"Error creating report: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=Dict)
async def get_reports(
    limit: int = 50,
    offset: int = 0,
    hazard_type: Optional[str] = None,
    min_threat_score: Optional[float] = None,
    verified_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get reports with filtering options"""
    try:
        # Generate mock data for demonstration
        generator = MockDataGenerator()
        all_reports = generator.generate_mock_reports(100)
        
        # Apply filters
        filtered_reports = all_reports
        
        if hazard_type:
            filtered_reports = [r for r in filtered_reports if r['hazard_type'] == hazard_type]
        
        if min_threat_score:
            filtered_reports = [r for r in filtered_reports if r['threat_score'] >= min_threat_score]
        
        if verified_only:
            filtered_reports = [r for r in filtered_reports if r['verified'] is True]
        
        # Apply pagination
        paginated_reports = filtered_reports[offset:offset + limit]
        
        return {
            'reports': paginated_reports,
            'total': len(filtered_reports),
            'limit': limit,
            'offset': offset,
            'filters_applied': {
                'hazard_type': hazard_type,
                'min_threat_score': min_threat_score,
                'verified_only': verified_only
            }
        }
        
    except Exception as e:
        logger.error(f"Error fetching reports: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/hotspots", response_model=Dict)
async def get_hotspots(
    time_window_hours: int = 24,
    db: Session = Depends(get_db)
):
    """Get current hazard hotspots"""
    try:
        # Mock hotspot detection
        generator = MockDataGenerator()
        reports = generator.generate_mock_reports(50)
        
        # Filter high-threat reports
        high_threat_reports = [r for r in reports if r['threat_score'] >= 6.0]
        
        # Mock hotspot analysis
        hotspots = []
        if len(high_threat_reports) >= 3:
            # Group by location (simplified)
            location_groups = {}
            for report in high_threat_reports:
                loc_key = f"{report['latitude']:.1f},{report['longitude']:.1f}"
                if loc_key not in location_groups:
                    location_groups[loc_key] = []
                location_groups[loc_key].append(report)
            
            for loc_key, group_reports in location_groups.items():
                if len(group_reports) >= 2:
                    avg_threat = sum(r['threat_score'] for r in group_reports) / len(group_reports)
                    hotspot = {
                        'hotspot_id': f"hotspot_{loc_key}",
                        'location': {
                            'lat': group_reports[0]['latitude'],
                            'lon': group_reports[0]['longitude'],
                            'name': group_reports[0]['location_name']
                        },
                        'report_count': len(group_reports),
                        'avg_threat_score': round(avg_threat, 2),
                        'dominant_hazard': max(set(r['hazard_type'] for r in group_reports), 
                                             key=[r['hazard_type'] for r in group_reports].count),
                        'risk_level': 'HIGH' if avg_threat >= 7.0 else 'MEDIUM',
                        'radius_km': 5.0,
                        'reports': [r['id'] for r in group_reports]
                    }
                    hotspots.append(hotspot)
        
        return {
            'hotspots': hotspots,
            'analysis_period_hours': time_window_hours,
            'total_reports_analyzed': len(reports),
            'high_threat_reports': len(high_threat_reports)
        }
        
    except Exception as e:
        logger.error(f"Error detecting hotspots: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{report_id}", response_model=Dict)
async def get_report(report_id: str, db: Session = Depends(get_db)):
    """Get detailed report information"""
    try:
        # Mock report retrieval
        generator = MockDataGenerator()
        reports = generator.generate_mock_reports(1)
        report = reports[0]
        report['id'] = report_id
        
        # Add detailed ML analysis
        report['detailed_analysis'] = {
            'text_features': {
                'word_count': len(report['text'].split()),
                'urgency_keywords': 2,
                'sentiment_score': 0.75,
                'confidence_indicators': ['specific_location', 'time_reference']
            },
            'location_analysis': {
                'coordinate_precision': 'HIGH',
                'nearby_reports_1km': 3,
                'historical_incidents': 5
            },
            'verification_status': {
                'auto_verified': False,
                'requires_human_review': True,
                'verification_confidence': 0.68
            }
        }
        
        return {
            'report': report,
            'success': True
        }
        
    except Exception as e:
        logger.error(f"Error fetching report {report_id}: {e}")
        raise HTTPException(status_code=404, detail="Report not found")

@router.put("/{report_id}/verify", response_model=Dict)
async def verify_report(
    report_id: str,
    verification_data: Dict,
    db: Session = Depends(get_db)
):
    """Verify or reject a report"""
    try:
        verified = verification_data.get('verified', False)
        notes = verification_data.get('notes', '')
        
        # Mock verification process
        verification_result = {
            'report_id': report_id,
            'verified': verified,
            'verified_at': datetime.utcnow().isoformat(),
            'verified_by': 'analyst_user',
            'notes': notes,
            'previous_status': 'PENDING',
            'new_status': 'VERIFIED' if verified else 'FALSE_ALARM'
        }
        
        return {
            'success': True,
            'verification': verification_result,
            'message': f"Report {'verified' if verified else 'marked as false alarm'}"
        }
        
    except Exception as e:
        logger.error(f"Error verifying report {report_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def process_report_clustering(report: Dict, db: Session):
    """Background task to process report clustering"""
    try:
        # Mock clustering process
        logger.info(f"Processing clustering for report {report['id']}")
        # In real implementation, this would trigger hotspot detection
        
    except Exception as e:
        logger.error(f"Error in clustering process: {e}")

async def notify_websocket_clients(report: Dict):
    """Background task to notify WebSocket clients"""
    try:
        await websocket_manager.broadcast({
            'type': 'new_report',
            'data': report
        })
        
    except Exception as e:
        logger.error(f"Error broadcasting report: {e}")
