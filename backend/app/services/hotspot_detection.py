"""
Hotspot detection and clustering service using PostGIS
"""
import asyncio
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text, func
from ..database import SessionLocal
from ..models.db_models import Report, SocialPost, Zone
from ..config import settings
from ..websocket_manager import WebSocketManager

websocket_manager = WebSocketManager()

async def trigger_clustering():
    """
    Trigger hotspot clustering analysis
    """
    db = SessionLocal()
    try:
        # Run clustering algorithm
        clusters = await detect_hotspots(db)
        
        # Create or update zones for significant clusters
        for cluster in clusters:
            if cluster["avg_confidence"] >= settings.threat_confidence_auto_alert:
                await create_or_update_zone(cluster, db)
        
        # Broadcast zone updates
        await websocket_manager.broadcast({
            "type": "zones_updated",
            "data": {"cluster_count": len(clusters)}
        })
        
    finally:
        db.close()

async def detect_hotspots(db: Session) -> List[Dict]:
    """
    Detect hotspots using DBSCAN clustering on recent reports
    """
    # Get recent high-confidence reports and social posts
    time_window = "3 hours"
    confidence_threshold = 0.4
    
    # Query for clustering candidates
    query = text(f"""
        WITH pts AS (
            SELECT 
                id, 
                lat, 
                lon, 
                confidence,
                hazard_type,
                'report' as source_type,
                ST_SetSRID(ST_Point(lon, lat), 4326) as geom
            FROM reports 
            WHERE created_at >= now() - interval '{time_window}' 
                AND confidence >= {confidence_threshold}
            
            UNION ALL
            
            SELECT 
                id,
                lat,
                lon,
                relevance as confidence,
                hazard_type,
                'social' as source_type,
                ST_SetSRID(ST_Point(lon, lat), 4326) as geom
            FROM social_posts 
            WHERE created_at >= now() - interval '{time_window}' 
                AND relevance >= {confidence_threshold}
                AND lat IS NOT NULL 
                AND lon IS NOT NULL
        ),
        clustered AS (
            SELECT 
                id,
                lat,
                lon,
                confidence,
                hazard_type,
                source_type,
                geom,
                ST_ClusterDBSCAN(
                    ST_Transform(geom, 3857), 
                    eps := {settings.cluster_eps_meters}, 
                    minpoints := {settings.cluster_min_points}
                ) OVER () as cluster_id
            FROM pts
        )
        SELECT 
            cluster_id,
            COUNT(*) as point_count,
            AVG(confidence) as avg_confidence,
            ST_AsGeoJSON(ST_ConvexHull(ST_Collect(geom))) as cluster_geom,
            ST_AsGeoJSON(ST_Centroid(ST_Collect(geom))) as centroid,
            array_agg(DISTINCT hazard_type) as hazard_types,
            MIN(lat) as min_lat,
            MAX(lat) as max_lat,
            MIN(lon) as min_lon,
            MAX(lon) as max_lon
        FROM clustered 
        WHERE cluster_id IS NOT NULL
        GROUP BY cluster_id
        HAVING COUNT(*) >= {settings.cluster_min_points}
        ORDER BY avg_confidence DESC
    """)
    
    result = db.execute(query)
    clusters = []
    
    for row in result:
        # Calculate radius in km
        lat_diff = row.max_lat - row.min_lat
        lon_diff = row.max_lon - row.min_lon
        radius_km = max(lat_diff, lon_diff) * 111  # Rough conversion to km
        
        clusters.append({
            "cluster_id": row.cluster_id,
            "point_count": row.point_count,
            "avg_confidence": float(row.avg_confidence),
            "cluster_geom": row.cluster_geom,
            "centroid": row.centroid,
            "hazard_types": row.hazard_types,
            "radius_km": radius_km
        })
    
    return clusters

async def create_or_update_zone(cluster: Dict, db: Session):
    """
    Create or update a red zone based on cluster data
    """
    try:
        # Create buffered polygon around cluster
        buffer_meters = max(1000, cluster["radius_km"] * 1000)  # At least 1km buffer
        
        # Create zone with buffered geometry
        zone_query = text(f"""
            INSERT INTO zones (type, name, geom, avg_confidence, report_count, radius_km, metadata)
            VALUES (
                'red',
                'Hotspot Cluster {cluster["cluster_id"]}',
                ST_Buffer(ST_GeomFromGeoJSON('{cluster["cluster_geom"]}'), {buffer_meters}),
                {cluster["avg_confidence"]},
                {cluster["point_count"]},
                {cluster["radius_km"]},
                '{{"hazard_types": {cluster["hazard_types"]}, "auto_generated": true}}'::jsonb
            )
            ON CONFLICT DO NOTHING
            RETURNING id
        """)
        
        result = db.execute(zone_query)
        zone_id = result.fetchone()
        
        if zone_id:
            db.commit()
            print(f"Created red zone {zone_id[0]} for cluster {cluster['cluster_id']}")
            
            # Broadcast new zone
            await websocket_manager.broadcast_new_zone({
                "zone_id": zone_id[0],
                "type": "red",
                "confidence": cluster["avg_confidence"],
                "radius_km": cluster["radius_km"]
            })
    
    except Exception as e:
        db.rollback()
        print(f"Error creating zone for cluster {cluster['cluster_id']}: {e}")

def get_current_hotspots(db: Session) -> List[Dict]:
    """
    Get current active hotspots/zones
    """
    query = text("""
        SELECT 
            id,
            type,
            name,
            ST_AsGeoJSON(geom) as geom_json,
            avg_confidence,
            report_count,
            radius_km,
            metadata,
            created_at
        FROM zones 
        WHERE active = true 
        ORDER BY avg_confidence DESC, created_at DESC
    """)
    
    result = db.execute(query)
    hotspots = []
    
    for row in result:
        hotspots.append({
            "id": row.id,
            "type": row.type,
            "name": row.name,
            "poly_geojson": row.geom_json,
            "avg_confidence": float(row.avg_confidence) if row.avg_confidence else 0.0,
            "report_count": row.report_count,
            "radius_km": float(row.radius_km) if row.radius_km else 0.0,
            "metadata": row.metadata,
            "created_at": row.created_at.isoformat()
        })
    
    return hotspots
