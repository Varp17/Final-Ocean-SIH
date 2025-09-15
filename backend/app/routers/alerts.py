"""
Alerts API endpoints
Handles alert creation and notification management
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.db_models import Alert, Zone, Report
from ..models.schemas import AlertCreate, AlertResponse
from ..services.notification import send_alert_notifications

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.post("/issue", response_model=AlertResponse)
async def issue_alert(
    alert: AlertCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Issue an alert for a zone or report"""
    try:
        # Validate zone or report exists
        if alert.zone_id:
            zone = db.query(Zone).filter(Zone.id == alert.zone_id).first()
            if not zone:
                raise HTTPException(status_code=404, detail="Zone not found")
        
        if alert.report_id:
            report = db.query(Report).filter(Report.id == alert.report_id).first()
            if not report:
                raise HTTPException(status_code=404, detail="Report not found")
        
        # Create alert record
        db_alert = Alert(
            zone_id=alert.zone_id,
            report_id=alert.report_id,
            message=alert.message,
            channels=alert.channels,
            status="pending"
        )
        
        db.add(db_alert)
        db.commit()
        db.refresh(db_alert)
        
        # Send notifications in background
        background_tasks.add_task(send_alert_notifications, db_alert.id)
        
        return db_alert
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error issuing alert: {str(e)}")

@router.get("/", response_model=List[AlertResponse])
def get_alerts(
        status: str | None = None,
        db: Session = Depends(get_db)
):
    """Get alerts with optional status filter"""
    query = db.query(Alert)
    
    if status:
        query = query.filter(Alert.status == status)
    
    return query.order_by(Alert.issued_at.desc()).limit(50).all()

@router.get("/{alert_id}", response_model=AlertResponse)
def get_alert(alert_id: int, db: Session = Depends(get_db)):
    """Get specific alert"""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.put("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    """Acknowledge an alert"""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.status = "acknowledged"
    db.commit()
    
    return {"status": "acknowledged", "alert_id": alert_id}
