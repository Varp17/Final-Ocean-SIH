"""
Hotspots API endpoints
Handles hotspot detection and zone management
"""
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.schemas import HotspotResponse
from ..services.hotspot_detection import get_current_hotspots, trigger_clustering

router = APIRouter(prefix="/hotspots", tags=["Hotspots"])

@router.get("/", response_model=List[HotspotResponse])
def get_hotspots(db: Session = Depends(get_db)):
    """Get current hotspots and zones"""
    hotspots = get_current_hotspots(db)
    
    # Convert to response format
    response = []
    for hotspot in hotspots:
        # Parse centroid from polygon for center coordinates
        center_lat = 0.0
        center_lon = 0.0
        
        # Simple centroid calculation (in production would use PostGIS)
        if hotspot.get("poly_geojson"):
            try:
                import json
                geom = json.loads(hotspot["poly_geojson"])
                if geom.get("coordinates"):
                    coords = geom["coordinates"][0]  # First ring of polygon
                    if coords:
                        center_lon = sum(coord[0] for coord in coords) / len(coords)
                        center_lat = sum(coord[1] for coord in coords) / len(coords)
            except:
                pass
        
        response.append(HotspotResponse(
            cluster_id=hotspot["id"],
            poly_geojson=json.loads(hotspot["poly_geojson"]) if hotspot.get("poly_geojson") else {},
            avg_confidence=hotspot["avg_confidence"],
            report_count=hotspot["report_count"],
            radius_km=hotspot["radius_km"],
            center_lat=center_lat,
            center_lon=center_lon
        ))
    
    return response

@router.post("/trigger-clustering")
async def trigger_hotspot_clustering(background_tasks: BackgroundTasks):
    """Manually trigger hotspot clustering"""
    background_tasks.add_task(trigger_clustering)
    return {"status": "clustering_triggered"}
