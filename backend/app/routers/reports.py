"""
Reports API endpoints
Handles citizen hazard reports submission and retrieval
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from geoalchemy2.functions import ST_SetSRID, ST_Point

from ..database import get_db
from ..models.db_models import Report, User
from ..models.schemas import ReportCreate, ReportResponse
from ..services.ml_scoring import score_report_async
from ..websocket_manager import WebSocketManager

router = APIRouter(tags=["Reports"])
websocket_manager = WebSocketManager()

@router.post("/", response_model=dict)
async def create_report(
    report: ReportCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Submit a citizen report"""
    try:
        # Create report with PostGIS geometry
        db_report = Report(
            user_id=report.user_id,
            source=report.source,
            hazard_type=report.hazard_type,
            description=report.description,
            media_url=report.media_key,
            lat=report.lat,
            lon=report.lon,
            severity=report.severity
        )
        
        # Set PostGIS geometry
        db_report.geom = text(f"ST_SetSRID(ST_Point({report.lon}, {report.lat}), 4326)")
        
        db.add(db_report)
        db.commit()
        db.refresh(db_report)
        
        # Enqueue ML scoring task
        background_tasks.add_task(score_report_async, db_report.id)
        
        # Broadcast new report via WebSocket
        await websocket_manager.broadcast_new_report({
            "id": db_report.id,
            "hazard_type": db_report.hazard_type,
            "lat": db_report.lat,
            "lon": db_report.lon,
            "severity": db_report.severity
        })
        
        return {"id": db_report.id, "status": "pending"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating report: {str(e)}")

@router.get("/", response_model=List[ReportResponse])
def get_reports(
    bbox: Optional[str] = None,
    since: Optional[str] = None,
    status: Optional[str] = None,
    hazard_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get reports with optional filtering"""
    query = db.query(Report)
    
    # Filter by bounding box (minLon,minLat,maxLon,maxLat)
    if bbox:
        try:
            min_lon, min_lat, max_lon, max_lat = map(float, bbox.split(','))
            query = query.filter(
                Report.lat >= min_lat,
                Report.lat <= max_lat,
                Report.lon >= min_lon,
                Report.lon <= max_lon
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid bbox format")
    
    # Filter by status
    if status:
        query = query.filter(Report.status == status)
    
    # Filter by hazard type
    if hazard_type:
        query = query.filter(Report.hazard_type == hazard_type)
    
    # Filter by date
    if since:
        query = query.filter(Report.created_at >= since)
    
    return query.order_by(Report.created_at.desc()).limit(100).all()

@router.get("/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    """Get specific report by ID"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.put("/{report_id}/verify")
def verify_report(report_id: int, db: Session = Depends(get_db)):
    """Admin endpoint to verify a report"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report.verified = True
    report.status = "verified"
    db.commit()
    
    # Update user credibility
    if report.user_id:
        user = db.query(User).filter(User.id == report.user_id).first()
        if user:
            user.credibility_score = min(1.0, user.credibility_score + 0.1)
            db.commit()
    
    return {"status": "verified", "report_id": report_id}
