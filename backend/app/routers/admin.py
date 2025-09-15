"""
Admin API endpoints
Administrative functions and team management
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.db_models import Team, LiveLocation, Zone, Report, Alert
from ..models.schemas import TeamCreate, LiveLocationUpdate, ZoneCreate, AnalyticsResponse

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/teams", response_model=dict)
def create_team(team: TeamCreate, db: Session = Depends(get_db)):
    """Create a rescue team"""
    db_team = Team(name=team.name, phone=team.phone)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return {"team_id": db_team.id, "status": "created"}

@router.get("/teams")
def get_teams(db: Session = Depends(get_db)):
    """Get all teams"""
    return db.query(Team).all()

@router.post("/teams/{team_id}/assign_zone")
def assign_team_to_zone(team_id: int, zone_id: int, db: Session = Depends(get_db)):
    """Assign team to a zone"""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    zone = db.query(Zone).filter(Zone.id == zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    team.assigned_zone_id = zone_id
    team.status = "deployed"
    db.commit()
    
    return {"status": "assigned", "team_id": team_id, "zone_id": zone_id}

@router.post("/live_locations")
def update_live_location(location: LiveLocationUpdate, db: Session = Depends(get_db)):
    """Update team live location"""
    from sqlalchemy import text
    
    db_location = LiveLocation(
        team_id=location.team_id,
        lat=location.lat,
        lon=location.lon,
        geom=text(f"ST_SetSRID(ST_Point({location.lon}, {location.lat}), 4326)")
    )
    
    db.add(db_location)
    db.commit()
    
    return {"status": "location_updated"}

@router.post("/zones", response_model=dict)
def create_zone(zone: ZoneCreate, db: Session = Depends(get_db)):
    """Create a manual zone"""
    from geoalchemy2.shape import from_shape
    from shapely.geometry import shape
    
    try:
        # Convert GeoJSON to PostGIS geometry
        geom = from_shape(shape(zone.geom_geojson), srid=4326)
        
        db_zone = Zone(
            type=zone.type,
            name=zone.name,
            geom=geom,
            metadata=zone.metadata
        )
        
        db.add(db_zone)
        db.commit()
        db.refresh(db_zone)
        
        return {"zone_id": db_zone.id, "status": "created"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Invalid geometry: {str(e)}")

@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    """Get system analytics"""
    total_reports = db.query(Report).count()
    verified_reports = db.query(Report).filter(Report.verified == True).count()
    active_zones = db.query(Zone).filter(Zone.active == True).count()
    alerts_issued = db.query(Alert).count()
    
    # Reports by type
    reports_by_type = {}
    for hazard_type in ["oil_spill", "tsunami", "storm_surge", "high_waves", "flood"]:
        count = db.query(Report).filter(Report.hazard_type == hazard_type).count()
        reports_by_type[hazard_type] = count
    
    # Confidence distribution
    confidence_distribution = {
        "low": db.query(Report).filter(Report.confidence < 0.3).count(),
        "medium": db.query(Report).filter(Report.confidence >= 0.3, Report.confidence < 0.7).count(),
        "high": db.query(Report).filter(Report.confidence >= 0.7).count()
    }
    
    return AnalyticsResponse(
        total_reports=total_reports,
        verified_reports=verified_reports,
        active_zones=active_zones,
        alerts_issued=alerts_issued,
        reports_by_type=reports_by_type,
        confidence_distribution=confidence_distribution
    )
