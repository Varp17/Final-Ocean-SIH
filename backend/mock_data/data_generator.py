import random
import json
from datetime import datetime, timedelta
from typing import List, Dict
import uuid

class MockDataGenerator:
    """Generate realistic mock data for testing and demonstration"""
    
    def __init__(self):
        self.hazard_types = [
            'tsunami', 'cyclone', 'oil_spill', 'flooding', 'storm_surge',
            'marine_pollution', 'coastal_erosion', 'rip_current', 'shark_attack',
            'jellyfish_bloom', 'red_tide', 'vessel_distress'
        ]
        
        self.locations = [
            {'name': 'Sydney Harbour', 'lat': -33.8568, 'lon': 151.2153},
            {'name': 'Gold Coast', 'lat': -28.0167, 'lon': 153.4000},
            {'name': 'Perth Coast', 'lat': -31.9505, 'lon': 115.8605},
            {'name': 'Melbourne Bay', 'lat': -37.8136, 'lon': 144.9631},
            {'name': 'Brisbane River', 'lat': -27.4698, 'lon': 153.0251},
            {'name': 'Adelaide Coast', 'lat': -34.9285, 'lon': 138.6007},
            {'name': 'Darwin Harbour', 'lat': -12.4634, 'lon': 130.8456},
            {'name': 'Cairns Coast', 'lat': -16.9186, 'lon': 145.7781}
        ]
        
        self.report_templates = {
            'tsunami': [
                "Massive wave approaching {location}! Water receding rapidly from shore. Everyone evacuating to higher ground.",
                "Earthquake felt strongly, now seeing unusual wave patterns at {location}. Authorities issuing tsunami warning.",
                "URGENT: Tsunami wave spotted offshore at {location}. Estimated arrival in 15 minutes. GET TO HIGH GROUND NOW!"
            ],
            'cyclone': [
                "Category 4 cyclone approaching {location}. Winds already at 150km/h. Seeking shelter immediately.",
                "Cyclone eye passing over {location}. Massive destruction, trees down, flooding everywhere. Need emergency assistance.",
                "Preparing for cyclone impact at {location}. Winds picking up, heavy rain starting. All residents taking shelter."
            ],
            'oil_spill': [
                "Large oil slick spotted near {location}. Appears to be from vessel accident. Wildlife already affected.",
                "Oil spill confirmed at {location}. Strong petroleum smell, dead fish washing ashore. Environmental disaster.",
                "Massive oil leak at {location}. Cleanup crews needed urgently. Marine life in serious danger."
            ],
            'flooding': [
                "Severe flooding at {location}. Water levels rising rapidly. Roads impassable, residents stranded.",
                "Flash flood warning for {location}. Heavy rainfall causing dangerous conditions. Evacuations underway.",
                "Coastal flooding at {location} due to storm surge. Properties underwater, emergency services overwhelmed."
            ]
        }
        
        self.social_media_templates = [
            "OMG! Something terrible happening at {location}! #OceanRanger #Emergency",
            "Massive waves at {location}! This is not normal! #BlueWatch #Tsunami #Help",
            "BREAKING: Environmental disaster at {location}! #OilSpill #OceanRanger #SaveOurOcean",
            "Cyclone hitting {location} hard! Winds are insane! #StormWatch #BlueWatch #Emergency",
            "Water everywhere at {location}! Flooding is getting worse! #FloodAlert #OceanRanger"
        ]
    
    def generate_mock_reports(self, count: int = 50) -> List[Dict]:
        """Generate mock hazard reports"""
        reports = []
        
        for i in range(count):
            location = random.choice(self.locations)
            hazard_type = random.choice(self.hazard_types)
            
            # Add some randomness to coordinates
            lat_offset = random.uniform(-0.1, 0.1)
            lon_offset = random.uniform(-0.1, 0.1)
            
            # Generate report text
            if hazard_type in self.report_templates:
                text_template = random.choice(self.report_templates[hazard_type])
                text = text_template.format(location=location['name'])
            else:
                text = f"Reporting {hazard_type} incident at {location['name']}. Situation developing."
            
            # Generate timestamps (last 7 days)
            days_ago = random.uniform(0, 7)
            created_at = datetime.utcnow() - timedelta(days=days_ago)
            
            report = {
                'id': str(uuid.uuid4()),
                'text': text,
                'hazard_type': hazard_type,
                'latitude': location['lat'] + lat_offset,
                'longitude': location['lon'] + lon_offset,
                'location_name': location['name'],
                'threat_score': random.uniform(2.0, 9.5),
                'confidence': random.uniform(0.6, 0.95),
                'verified': random.choice([True, False, None]),
                'reporter_id': str(uuid.uuid4()),
                'reporter_credibility': random.uniform(3.0, 9.0),
                'created_at': created_at.isoformat(),
                'media_urls': self._generate_media_urls() if random.random() > 0.7 else [],
                'urgency_level': random.choice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
                'status': random.choice(['PENDING', 'VERIFIED', 'FALSE_ALARM', 'INVESTIGATING'])
            }
            
            reports.append(report)
        
        return reports
    
    def generate_social_media_posts(self, count: int = 100) -> List[Dict]:
        """Generate mock social media posts"""
        posts = []
        
        for i in range(count):
            location = random.choice(self.locations)
            text_template = random.choice(self.social_media_templates)
            text = text_template.format(location=location['name'])
            
            # Generate timestamps (last 24 hours)
            hours_ago = random.uniform(0, 24)
            created_at = datetime.utcnow() - timedelta(hours=hours_ago)
            
            post = {
                'id': str(uuid.uuid4()),
                'text': text,
                'platform': random.choice(['twitter', 'facebook', 'instagram', 'youtube']),
                'user': {
                    'id': str(uuid.uuid4()),
                    'username': f"user_{random.randint(1000, 9999)}",
                    'verified': random.choice([True, False]),
                    'followers_count': random.randint(100, 100000),
                    'location': location['name']
                },
                'engagement': {
                    'likes': random.randint(0, 1000),
                    'shares': random.randint(0, 500),
                    'comments': random.randint(0, 200),
                    'retweet_count': random.randint(0, 300)
                },
                'location': {
                    'lat': location['lat'] + random.uniform(-0.05, 0.05),
                    'lon': location['lon'] + random.uniform(-0.05, 0.05),
                    'name': location['name']
                },
                'media_urls': self._generate_media_urls() if random.random() > 0.6 else [],
                'hashtags': self._extract_hashtags(text),
                'created_at': created_at.isoformat(),
                'threat_score': random.uniform(1.0, 8.0),
                'credibility_score': random.uniform(2.0, 8.5),
                'requires_review': random.choice([True, False])
            }
            
            posts.append(post)
        
        return posts
    
    def generate_emergency_alerts(self, count: int = 10) -> List[Dict]:
        """Generate mock emergency alerts"""
        alerts = []
        
        alert_types = ['TSUNAMI_WARNING', 'CYCLONE_ALERT', 'FLOOD_WARNING', 'OIL_SPILL_ALERT']
        severity_levels = ['WATCH', 'WARNING', 'EMERGENCY']
        
        for i in range(count):
            location = random.choice(self.locations)
            alert_type = random.choice(alert_types)
            severity = random.choice(severity_levels)
            
            # Generate alert based on type
            alert_messages = {
                'TSUNAMI_WARNING': f"TSUNAMI WARNING for {location['name']}. Seek higher ground immediately.",
                'CYCLONE_ALERT': f"CYCLONE ALERT for {location['name']}. Category 3 storm approaching.",
                'FLOOD_WARNING': f"FLOOD WARNING for {location['name']}. Heavy rainfall causing dangerous conditions.",
                'OIL_SPILL_ALERT': f"OIL SPILL ALERT near {location['name']}. Environmental hazard reported."
            }
            
            alert = {
                'id': str(uuid.uuid4()),
                'type': alert_type,
                'severity': severity,
                'title': f"{alert_type.replace('_', ' ').title()} - {location['name']}",
                'message': alert_messages[alert_type],
                'location': location,
                'affected_radius_km': random.uniform(5.0, 50.0),
                'issued_at': (datetime.utcnow() - timedelta(hours=random.uniform(0, 12))).isoformat(),
                'expires_at': (datetime.utcnow() + timedelta(hours=random.uniform(6, 48))).isoformat(),
                'issued_by': random.choice(['Emergency Management', 'Weather Service', 'Coast Guard']),
                'priority': random.choice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
                'status': random.choice(['ACTIVE', 'EXPIRED', 'CANCELLED']),
                'evacuation_zones': [f"Zone {chr(65 + i)}" for i in range(random.randint(1, 4))],
                'emergency_contacts': [
                    {'name': 'Emergency Services', 'phone': '000'},
                    {'name': 'Local Emergency', 'phone': f"1800-{random.randint(100000, 999999)}"}
                ]
            }
            
            alerts.append(alert)
        
        return alerts
    
    def generate_analytics_data(self) -> Dict:
        """Generate mock analytics dashboard data"""
        return {
            'summary_stats': {
                'total_reports_24h': random.randint(50, 200),
                'verified_reports_24h': random.randint(20, 80),
                'active_alerts': random.randint(2, 15),
                'red_zones_active': random.randint(1, 8),
                'social_posts_analyzed': random.randint(500, 2000),
                'threat_score_avg': round(random.uniform(3.0, 7.5), 2)
            },
            'hazard_distribution': {
                'tsunami': random.randint(5, 25),
                'cyclone': random.randint(10, 40),
                'oil_spill': random.randint(3, 15),
                'flooding': random.randint(15, 50),
                'storm_surge': random.randint(8, 30),
                'marine_pollution': random.randint(5, 20)
            },
            'geographic_hotspots': [
                {
                    'location': loc['name'],
                    'lat': loc['lat'],
                    'lon': loc['lon'],
                    'report_count': random.randint(5, 25),
                    'avg_threat_score': round(random.uniform(4.0, 8.5), 2)
                }
                for loc in random.sample(self.locations, 4)
            ],
            'temporal_trends': [
                {
                    'hour': i,
                    'report_count': random.randint(2, 15),
                    'avg_threat_score': round(random.uniform(3.0, 7.0), 2)
                }
                for i in range(24)
            ],
            'verification_stats': {
                'pending_verification': random.randint(10, 50),
                'verified_true': random.randint(30, 100),
                'verified_false': random.randint(5, 25),
                'verification_rate': round(random.uniform(0.65, 0.85), 3)
            }
        }
    
    def _generate_media_urls(self) -> List[str]:
        """Generate mock media URLs"""
        media_types = ['image', 'video']
        urls = []
        
        for _ in range(random.randint(1, 3)):
            media_type = random.choice(media_types)
            if media_type == 'image':
                urls.append(f"https://example.com/media/image_{uuid.uuid4().hex[:8]}.jpg")
            else:
                urls.append(f"https://example.com/media/video_{uuid.uuid4().hex[:8]}.mp4")
        
        return urls
    
    def _extract_hashtags(self, text: str) -> List[str]:
        """Extract hashtags from text"""
        import re
        hashtags = re.findall(r'#\w+', text)
        return [tag.lower() for tag in hashtags]

# Generate and save mock data
def generate_all_mock_data():
    """Generate comprehensive mock data set"""
    generator = MockDataGenerator()
    
    mock_data = {
        'reports': generator.generate_mock_reports(100),
        'social_posts': generator.generate_social_media_posts(200),
        'alerts': generator.generate_emergency_alerts(20),
        'analytics': generator.generate_analytics_data(),
        'generated_at': datetime.utcnow().isoformat()
    }
    
    return mock_data

if __name__ == "__main__":
    # Generate and save mock data
    data = generate_all_mock_data()
    with open('mock_data.json', 'w') as f:
        json.dump(data, f, indent=2)
    print("Mock data generated successfully!")
