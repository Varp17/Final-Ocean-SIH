from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging
from datetime import datetime, timedelta

from ..core.database import get_db
from ..mock_data.data_generator import MockDataGenerator
from ..core.websocket_manager import websocket_manager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/", response_model=Dict[str, Any])
async def get_alerts(
    active_only: bool = True,
    severity: str | None = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get emergency alerts with filtering"""
    try:
        generator = MockDataGenerator()
        all_alerts = generator.generate_emergency_alerts(30)
        
        # Apply filters
        filtered_alerts = all_alerts
        
        if active_only:
            current_time = datetime.utcnow()
            filtered_alerts = [
                alert for alert in filtered_alerts 
                if alert['status'] == 'ACTIVE' and
                   datetime.fromisoformat(alert['expires_at'].replace('Z', '+00:00'))
                   > current_time
            ]
        
        if severity:
            filtered_alerts = [
                alert for alert in filtered_alerts 
                if alert['severity'] == severity
            ]
        
        # Sort by priority and issued time
        priority_order = {'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1}
        filtered_alerts.sort(
            key=lambda x: (priority_order.get(x['priority'], 0), x['issued_at']), 
            reverse=True
        )
        
        return {
            'alerts': filtered_alerts[:limit],
            'total': len(filtered_alerts),
            'active_count': len([a for a in all_alerts if a['status'] == 'ACTIVE']),
            'critical_count': len([a for a in filtered_alerts if a['priority'] == 'CRITICAL'])
        }
        
    except Exception as e:
        logger.error(f"Error fetching alerts: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Dict)
async def create_alert(
    alert_data: Dict,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create new emergency alert"""
    try:
        alert_id = f"alert_{int(datetime.utcnow().timestamp())}"
        
        new_alert = {
            'id': alert_id,
            'type': alert_data.get('type', 'GENERAL_ALERT'),
            'severity': alert_data.get('severity', 'MEDIUM'),
            'title': alert_data.get('title', 'Emergency Alert'),
            'message': alert_data.get('message', ''),
            'location': alert_data.get('location', {}),
            'affected_radius_km': alert_data.get('affected_radius_km', 10.0),
            'issued_at': datetime.utcnow().isoformat(),
            'expires_at': (datetime.utcnow() + timedelta(hours=24)).isoformat(),
            'issued_by': alert_data.get('issued_by', 'System'),
            'priority': alert_data.get('priority', 'MEDIUM'),
            'status': 'ACTIVE',
            'evacuation_zones': alert_data.get('evacuation_zones', []),
            'emergency_contacts': alert_data.get('emergency_contacts', [])
        }
        
        # Background tasks for alert distribution
        background_tasks.add_task(broadcast_alert, new_alert)
        background_tasks.add_task(send_sms_notifications, new_alert)

        return {
            'success': True,
            'alert': new_alert,
            'message': 'Alert created and broadcast initiated'
        }
        
    except Exception as e:
        logger.error(f"Error creating alert: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{alert_id}/status", response_model=Dict)
async def update_alert_status(
    alert_id: str,
    status_data: Dict,
    db: Session = Depends(get_db)
):
    """Update alert status (activate, cancel, expire)"""
    try:
        new_status = status_data.get('status', 'ACTIVE')
        reason = status_data.get('reason', '')
        
        update_result = {
            'alert_id': alert_id,
            'previous_status': 'ACTIVE',  # Mock previous status
            'new_status': new_status,
            'updated_at': datetime.utcnow().isoformat(),
            'updated_by': 'admin_user',
            'reason': reason
        }
        
        # Broadcast status update
        await websocket_manager.broadcast({
            'type': 'alert_status_update',
            'data': update_result
        })
        
        return {
            'success': True,
            'update': update_result,
            'message': f'Alert status updated to {new_status}'
        }
        
    except Exception as e:
        logger.error(f"Error updating alert status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/zones/red", response_model=Dict)
async def get_red_zones(db: Session = Depends(get_db)):
    """Get current Red Zones"""
    try:
        # Mock Red Zone data
        red_zones = [
            {
                'zone_id': 'red_zone_001',
                'zone_type': 'RED_ZONE',
                'hazard_type': 'tsunami',
                'risk_level': 'CRITICAL',
                'centroid': {'lat': -33.8568, 'lon': 151.2153},
                'radius_km': 15.0,
                'threat_score': 9.2,
                'report_count': 8,
                'created_at': datetime.utcnow().isoformat(),
                'expires_at': (datetime.utcnow() + timedelta(hours=12)).isoformat(),
                'evacuation_recommended': True,
                'affected_population_estimate': 25000,
                'evacuation_routes': [
                    {'name': 'Route A', 'direction': 'North via Highway 1'},
                    {'name': 'Route B', 'direction': 'West via Main Street'}
                ]
            },
            {
                'zone_id': 'red_zone_002',
                'zone_type': 'RED_ZONE',
                'hazard_type': 'oil_spill',
                'risk_level': 'HIGH',
                'centroid': {'lat': -28.0167, 'lon': 153.4000},
                'radius_km': 8.0,
                'threat_score': 7.8,
                'report_count': 5,
                'created_at': (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                'expires_at': (datetime.utcnow() + timedelta(hours=18)).isoformat(),
                'evacuation_recommended': False,
                'affected_population_estimate': 12000,
                'safety_instructions': [
                    'Avoid contact with water',
                    'Do not consume local seafood',
                    'Report wildlife in distress'
                ]
            }
        ]
        
        return {
            'red_zones': red_zones,
            'total_zones': len(red_zones),
            'total_affected_population': sum(zone.get('affected_population_estimate', 0) for zone in red_zones),
            'evacuation_zones': len([zone for zone in red_zones if zone.get('evacuation_recommended', False)])
        }
        
    except Exception as e:
        logger.error(f"Error fetching red zones: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def broadcast_alert(alert: Dict):
    """Background task to broadcast alert via WebSocket"""
    try:
        await websocket_manager.broadcast({
            'type': 'emergency_alert',
            'data': alert
        })
        logger.info(f"Alert {alert['id']} broadcast to all clients")
        
    except Exception as e:
        logger.error(f"Error broadcasting alert: {e}")

async def send_sms_notifications(alert: Dict):
    """Background task to send SMS notifications"""
    try:
        # Mock SMS sending
        affected_radius = alert.get('affected_radius_km', 10)
        estimated_recipients = int(affected_radius * 1000)  # Mock calculation
        
        logger.info(f"SMS notifications sent for alert {alert['id']} to ~{estimated_recipients} recipients")
        
    except Exception as e:
        logger.error(f"Error sending SMS notifications: {e}")
