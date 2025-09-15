import numpy as np
from typing import List, Dict, Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
import logging
from datetime import datetime, timedelta
import geojson
from shapely.geometry import Point, Polygon
from shapely.ops import unary_union
import math

logger = logging.getLogger(__name__)

class HotspotDetector:
    """Advanced hotspot detection and clustering service"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.cluster_distance_km = 5.0  # 5km clustering radius
        self.min_reports_for_hotspot = 3
        self.threat_threshold = 6.0
        
    def detect_hotspots(self, time_window_hours: int = 24) -> List[Dict]:
        """Detect hazard hotspots using spatial-temporal clustering"""
        try:
            # Get recent reports with high threat scores
            cutoff_time = datetime.utcnow() - timedelta(hours=time_window_hours)
            
            query = text("""
                SELECT 
                    id, latitude, longitude, threat_score, hazard_type, 
                    created_at, verified, reporter_id
                FROM reports 
                WHERE created_at >= :cutoff_time 
                AND threat_score >= :threat_threshold
                AND latitude IS NOT NULL 
                AND longitude IS NOT NULL
            """)
            
            result = self.db.execute(query, {
                'cutoff_time': cutoff_time,
                'threat_threshold': self.threat_threshold
            })
            
            reports = [dict(row) for row in result]
            
            if len(reports) < self.min_reports_for_hotspot:
                return []
            
            # Perform spatial clustering
            clusters = self._spatial_clustering(reports)
            
            # Analyze each cluster
            hotspots = []
            for cluster_id, cluster_reports in clusters.items():
                if len(cluster_reports) >= self.min_reports_for_hotspot:
                    hotspot = self._analyze_cluster(cluster_reports)
                    if hotspot:
                        hotspots.append(hotspot)
            
            return sorted(hotspots, key=lambda x: x['risk_score'], reverse=True)
            
        except Exception as e:
            logger.error(f"Error detecting hotspots: {e}")
            return []
    
    def _spatial_clustering(self, reports: List[Dict]) -> Dict[int, List[Dict]]:
        """Perform spatial clustering using distance-based algorithm"""
        clusters = {}
        cluster_id = 0
        processed = set()
        
        for i, report in enumerate(reports):
            if i in processed:
                continue
                
            # Start new cluster
            cluster_reports = [report]
            processed.add(i)
            
            # Find nearby reports
            for j, other_report in enumerate(reports):
                if j in processed or i == j:
                    continue
                    
                distance = self._haversine_distance(
                    report['latitude'], report['longitude'],
                    other_report['latitude'], other_report['longitude']
                )
                
                if distance <= self.cluster_distance_km:
                    cluster_reports.append(other_report)
                    processed.add(j)
            
            if len(cluster_reports) >= self.min_reports_for_hotspot:
                clusters[cluster_id] = cluster_reports
                cluster_id += 1
        
        return clusters
    
    def _analyze_cluster(self, reports: List[Dict]) -> Optional[Dict]:
        """Analyze a cluster to determine if it's a significant hotspot"""
        if not reports:
            return None
        
        # Calculate cluster statistics
        threat_scores = [r['threat_score'] for r in reports]
        avg_threat = np.mean(threat_scores)
        max_threat = np.max(threat_scores)
        
        # Calculate centroid
        lats = [r['latitude'] for r in reports]
        lons = [r['longitude'] for r in reports]
        centroid_lat = np.mean(lats)
        centroid_lon = np.mean(lons)
        
        # Calculate cluster radius
        max_distance = 0
        for report in reports:
            distance = self._haversine_distance(
                centroid_lat, centroid_lon,
                report['latitude'], report['longitude']
            )
            max_distance = max(max_distance, distance)
        
        # Hazard type analysis
        hazard_types = [r['hazard_type'] for r in reports]
        hazard_counts = {}
        for hazard in hazard_types:
            hazard_counts[hazard] = hazard_counts.get(hazard, 0) + 1
        
        dominant_hazard = max(hazard_counts, key=hazard_counts.get)
        
        # Verification rate
        verified_count = sum(1 for r in reports if r.get('verified', False))
        verification_rate = verified_count / len(reports)
        
        # Calculate risk score
        risk_score = self._calculate_cluster_risk_score(
            avg_threat, len(reports), verification_rate, max_distance
        )
        
        # Generate cluster polygon
        cluster_polygon = self._generate_cluster_polygon(reports, max_distance)
        
        return {
            'cluster_id': f"hotspot_{int(datetime.utcnow().timestamp())}_{len(reports)}",
            'centroid': {'lat': centroid_lat, 'lon': centroid_lon},
            'radius_km': max_distance,
            'report_count': len(reports),
            'avg_threat_score': avg_threat,
            'max_threat_score': max_threat,
            'dominant_hazard': dominant_hazard,
            'hazard_distribution': hazard_counts,
            'verification_rate': verification_rate,
            'risk_score': risk_score,
            'risk_level': self._get_risk_level(risk_score),
            'polygon': cluster_polygon,
            'reports': [r['id'] for r in reports],
            'created_at': datetime.utcnow().isoformat(),
            'recommended_actions': self._get_cluster_actions(risk_score, dominant_hazard)
        }
    
    def _calculate_cluster_risk_score(self, avg_threat: float, report_count: int, 
                                    verification_rate: float, radius_km: float) -> float:
        """Calculate overall risk score for a cluster"""
        # Base score from average threat
        base_score = avg_threat
        
        # Density bonus (more reports in smaller area = higher risk)
        density_factor = report_count / (radius_km + 1)  # +1 to avoid division by zero
        density_bonus = min(density_factor * 0.5, 3.0)
        
        # Verification bonus
        verification_bonus = verification_rate * 2.0
        
        # Report count bonus
        count_bonus = min(report_count * 0.2, 2.0)
        
        total_score = base_score + density_bonus + verification_bonus + count_bonus
        return min(total_score, 10.0)
    
    def _generate_cluster_polygon(self, reports: List[Dict], radius_km: float) -> Dict:
        """Generate a polygon representing the cluster area"""
        if len(reports) == 1:
            # Single point - create circle
            center = Point(reports[0]['longitude'], reports[0]['latitude'])
            # Convert km to degrees (rough approximation)
            radius_deg = radius_km / 111.0  # 1 degree ≈ 111 km
            polygon = center.buffer(radius_deg)
        else:
            # Multiple points - create convex hull with buffer
            points = [Point(r['longitude'], r['latitude']) for r in reports]
            if len(points) >= 3:
                polygon = unary_union(points).convex_hull
                # Add buffer for safety zone
                buffer_deg = (radius_km * 0.5) / 111.0
                polygon = polygon.buffer(buffer_deg)
            else:
                # Two points - create line with buffer
                polygon = unary_union(points).buffer(radius_km / 111.0)
        
        # Convert to GeoJSON
        return geojson.loads(geojson.dumps(polygon))
    
    def _haversine_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two points using Haversine formula"""
        R = 6371  # Earth's radius in kilometers
        
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)
        
        a = (math.sin(delta_lat / 2) ** 2 + 
             math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        return R * c
    
    def _get_risk_level(self, score: float) -> str:
        """Convert numeric score to risk level"""
        if score >= 8.5:
            return 'CRITICAL'
        elif score >= 7.0:
            return 'HIGH'
        elif score >= 5.0:
            return 'MEDIUM'
        else:
            return 'LOW'
    
    def _get_cluster_actions(self, risk_score: float, hazard_type: str) -> List[str]:
        """Get recommended actions for a cluster"""
        actions = []
        
        if risk_score >= 8.5:
            actions.extend([
                'Immediate evacuation alert',
                'Deploy emergency response teams',
                'Establish safety perimeter',
                'Activate emergency broadcast system'
            ])
        elif risk_score >= 7.0:
            actions.extend([
                'Issue high-priority alert',
                'Prepare evacuation routes',
                'Increase monitoring',
                'Notify emergency services'
            ])
        elif risk_score >= 5.0:
            actions.extend([
                'Issue area warning',
                'Monitor situation',
                'Prepare response resources'
            ])
        
        # Hazard-specific actions
        hazard_actions = {
            'tsunami': ['Activate tsunami warning system', 'Clear coastal areas'],
            'cyclone': ['Secure loose objects', 'Prepare shelters'],
            'oil_spill': ['Deploy containment booms', 'Notify environmental agencies'],
            'flooding': ['Monitor water levels', 'Prepare sandbags']
        }
        
        if hazard_type in hazard_actions:
            actions.extend(hazard_actions[hazard_type])
        
        return actions

class RedZoneManager:
    """Manages Red Zone creation and updates"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        
    def update_red_zones(self, hotspots: List[Dict]) -> List[Dict]:
        """Update Red Zones based on detected hotspots"""
        red_zones = []
        
        for hotspot in hotspots:
            if hotspot['risk_level'] in ['HIGH', 'CRITICAL']:
                red_zone = self._create_red_zone(hotspot)
                red_zones.append(red_zone)
        
        return red_zones
    
    def _create_red_zone(self, hotspot: Dict) -> Dict:
        """Create a Red Zone from a hotspot"""
        return {
            'zone_id': f"red_zone_{hotspot['cluster_id']}",
            'zone_type': 'RED_ZONE',
            'hazard_type': hotspot['dominant_hazard'],
            'risk_level': hotspot['risk_level'],
            'polygon': hotspot['polygon'],
            'centroid': hotspot['centroid'],
            'radius_km': hotspot['radius_km'],
            'threat_score': hotspot['risk_score'],
            'report_count': hotspot['report_count'],
            'created_at': datetime.utcnow().isoformat(),
            'expires_at': (datetime.utcnow() + timedelta(hours=24)).isoformat(),
            'evacuation_recommended': hotspot['risk_score'] >= 8.0,
            'emergency_contacts': self._get_emergency_contacts(hotspot['dominant_hazard']),
            'safety_instructions': self._get_safety_instructions(hotspot['dominant_hazard'])
        }
    
    def _get_emergency_contacts(self, hazard_type: str) -> List[Dict]:
        """Get emergency contacts for hazard type"""
        contacts = {
            'tsunami': [
                {'name': 'Tsunami Warning Center', 'phone': '1-800-TSUNAMI'},
                {'name': 'Coast Guard', 'phone': '1-800-COAST-GUARD'}
            ],
            'cyclone': [
                {'name': 'Weather Service', 'phone': '1-800-WEATHER'},
                {'name': 'Emergency Management', 'phone': '911'}
            ],
            'oil_spill': [
                {'name': 'Environmental Response', 'phone': '1-800-OIL-SPILL'},
                {'name': 'Coast Guard', 'phone': '1-800-COAST-GUARD'}
            ]
        }
        
        return contacts.get(hazard_type, [
            {'name': 'Emergency Services', 'phone': '911'}
        ])
    
    def _get_safety_instructions(self, hazard_type: str) -> List[str]:
        """Get safety instructions for hazard type"""
        instructions = {
            'tsunami': [
                'Move to higher ground immediately',
                'Stay away from beaches and coastal areas',
                'Listen for official evacuation orders',
                'Do not return until all-clear is given'
            ],
            'cyclone': [
                'Seek shelter in a sturdy building',
                'Stay away from windows',
                'Have emergency supplies ready',
                'Monitor weather updates'
            ],
            'oil_spill': [
                'Avoid contact with contaminated water',
                'Do not consume local seafood',
                'Report wildlife in distress',
                'Follow cleanup guidelines'
            ]
        }
        
        return instructions.get(hazard_type, [
            'Follow local emergency procedures',
            'Stay informed through official channels',
            'Avoid the affected area'
        ])
