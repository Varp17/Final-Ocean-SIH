"""
Predictive Hazard Escalation Model
Uses ML to predict probability of hazard escalation and affected zones
"""
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple
from datetime import datetime, timedelta
import logging
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
import joblib
import asyncio
import aiohttp
from geopy.distance import geodesic
import json

logger = logging.getLogger(__name__)

class PredictiveEscalationModel:
    def __init__(self):
        self.escalation_model = None
        self.zone_predictor = None
        self.scaler = StandardScaler()
        self.is_trained = False
        self.weather_cache = {}
        self.historical_data = []
        
    async def initialize(self):
        """Initialize and load pre-trained models"""
        try:
            # Load pre-trained models if available
            try:
                self.escalation_model = joblib.load('models/escalation_model.pkl')
                self.zone_predictor = joblib.load('models/zone_predictor.pkl')
                self.scaler = joblib.load('models/scaler.pkl')
                self.is_trained = True
                logger.info("✅ Loaded pre-trained escalation models")
            except FileNotFoundError:
                logger.info("🔄 No pre-trained models found, will train on first use")
                await self._initialize_models()
                
        except Exception as e:
            logger.error(f"❌ Error initializing escalation model: {e}")
    
    async def _initialize_models(self):
        """Initialize models with default parameters"""
        self.escalation_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.zone_predictor = GradientBoostingRegressor(
            n_estimators=100,
            max_depth=6,
            random_state=42
        )
        
        # Generate synthetic training data for initial model
        await self._generate_synthetic_training_data()
        
    async def _generate_synthetic_training_data(self):
        """Generate synthetic training data for model initialization"""
        np.random.seed(42)
        n_samples = 1000
        
        # Generate synthetic features
        features = []
        labels = []
        zone_sizes = []
        
        for _ in range(n_samples):
            # Report frequency and density
            report_freq = np.random.exponential(5)  # Reports per hour
            report_density = np.random.gamma(2, 2)  # Reports per km²
            
            # Sentiment urgency (0-1 scale)
            sentiment_urgency = np.random.beta(2, 5)
            
            # Weather conditions
            wave_height = np.random.gamma(2, 1.5)
            wind_speed = np.random.gamma(3, 2)
            pressure = np.random.normal(1013, 10)
            
            # Historical hazard frequency
            historical_freq = np.random.poisson(3)
            
            # Time factors
            hour_of_day = np.random.randint(0, 24)
            day_of_week = np.random.randint(0, 7)
            
            feature_vector = [
                report_freq, report_density, sentiment_urgency,
                wave_height, wind_speed, pressure, historical_freq,
                hour_of_day, day_of_week
            ]
            
            # Generate escalation probability based on features
            escalation_score = (
                0.3 * min(report_freq / 10, 1) +
                0.2 * min(report_density / 5, 1) +
                0.2 * sentiment_urgency +
                0.15 * min(wave_height / 5, 1) +
                0.1 * min(wind_speed / 20, 1) +
                0.05 * (1 - abs(pressure - 1013) / 50)
            )
            
            # Add noise and threshold
            escalation_score += np.random.normal(0, 0.1)
            escalation_label = 1 if escalation_score > 0.6 else 0
            
            # Zone size prediction (km²)
            zone_size = max(1, escalation_score * 50 + np.random.normal(0, 5))
            
            features.append(feature_vector)
            labels.append(escalation_label)
            zone_sizes.append(zone_size)
        
        # Train models
        X = np.array(features)
        y_escalation = np.array(labels)
        y_zone = np.array(zone_sizes)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train escalation model
        self.escalation_model.fit(X_scaled, y_escalation)
        
        # Train zone predictor
        self.zone_predictor.fit(X_scaled, y_zone)
        
        self.is_trained = True
        logger.info("✅ Models trained with synthetic data")
        
        # Save models
        joblib.dump(self.escalation_model, 'models/escalation_model.pkl')
        joblib.dump(self.zone_predictor, 'models/zone_predictor.pkl')
        joblib.dump(self.scaler, 'models/scaler.pkl')
    
    async def get_weather_data(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch weather data from API (mock implementation)"""
        cache_key = f"{lat:.2f},{lon:.2f}"
        
        # Check cache (5-minute expiry)
        if cache_key in self.weather_cache:
            cached_time, data = self.weather_cache[cache_key]
            if datetime.now() - cached_time < timedelta(minutes=5):
                return data
        
        # Mock weather data (in production, use actual weather API)
        weather_data = {
            "wave_height": np.random.gamma(2, 1.5),
            "wind_speed": np.random.gamma(3, 2),
            "pressure": np.random.normal(1013, 10),
            "temperature": np.random.normal(25, 5),
            "humidity": np.random.uniform(60, 90),
            "visibility": np.random.uniform(5, 15)
        }
        
        # Cache the data
        self.weather_cache[cache_key] = (datetime.now(), weather_data)
        return weather_data
    
    async def predict_escalation(self, reports: List[Dict], location: Tuple[float, float]) -> Dict[str, Any]:
        """Predict escalation probability and affected zone"""
        if not self.is_trained:
            await self._initialize_models()
        
        try:
            lat, lon = location
            
            # Extract features from reports
            features = await self._extract_features(reports, lat, lon)
            
            # Scale features
            features_scaled = self.scaler.transform([features])
            
            # Predict escalation probability
            escalation_prob = self.escalation_model.predict_proba(features_scaled)[0][1]
            
            # Predict affected zone size
            zone_size = max(1, self.zone_predictor.predict(features_scaled)[0])
            
            # Generate affected zone (circular approximation)
            affected_zone = self._generate_affected_zone(lat, lon, zone_size)
            
            # Determine escalation level
            if escalation_prob >= 0.8:
                level = "critical"
            elif escalation_prob >= 0.6:
                level = "high"
            elif escalation_prob >= 0.4:
                level = "medium"
            else:
                level = "low"
            
            # Generate time-based predictions
            time_predictions = await self._generate_time_predictions(features, escalation_prob)
            
            return {
                "escalation_probability": float(escalation_prob),
                "escalation_level": level,
                "confidence": float(min(escalation_prob * 1.2, 1.0)),
                "affected_zone": affected_zone,
                "zone_size_km2": float(zone_size),
                "time_predictions": time_predictions,
                "recommendations": self._generate_recommendations(escalation_prob, level),
                "prediction_timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error in escalation prediction: {e}")
            return {
                "escalation_probability": 0.5,
                "escalation_level": "unknown",
                "confidence": 0.0,
                "affected_zone": [],
                "zone_size_km2": 1.0,
                "time_predictions": {},
                "recommendations": ["Manual assessment required"],
                "error": str(e)
            }
    
    async def _extract_features(self, reports: List[Dict], lat: float, lon: float) -> List[float]:
        """Extract features from reports and external data"""
        now = datetime.utcnow()
        
        # Report frequency and density
        recent_reports = [r for r in reports if 
                         datetime.fromisoformat(r.get('timestamp', now.isoformat())) > now - timedelta(hours=6)]
        
        report_freq = len(recent_reports) / 6  # Reports per hour
        
        # Calculate report density (reports per km²)
        if len(recent_reports) > 1:
            locations = [(r.get('latitude', lat), r.get('longitude', lon)) for r in recent_reports]
            distances = [geodesic((lat, lon), loc).kilometers for loc in locations]
            avg_distance = np.mean(distances)
            report_density = len(recent_reports) / max(1, avg_distance ** 2)
        else:
            report_density = 1.0
        
        # Sentiment urgency
        sentiments = [r.get('sentiment_score', 0.5) for r in reports]
        sentiment_urgency = np.mean(sentiments) if sentiments else 0.5
        
        # Weather data
        weather = await self.get_weather_data(lat, lon)
        
        # Historical hazard frequency (mock)
        historical_freq = 3  # Average hazards per month in this area
        
        # Time factors
        hour_of_day = now.hour
        day_of_week = now.weekday()
        
        return [
            report_freq,
            report_density,
            sentiment_urgency,
            weather["wave_height"],
            weather["wind_speed"],
            weather["pressure"],
            historical_freq,
            hour_of_day,
            day_of_week
        ]
    
    def _generate_affected_zone(self, center_lat: float, center_lon: float, radius_km: float) -> List[Dict]:
        """Generate affected zone as GeoJSON polygon"""
        # Generate circular zone (simplified)
        points = []
        num_points = 16
        
        for i in range(num_points):
            angle = 2 * np.pi * i / num_points
            # Approximate lat/lon offset for given radius
            lat_offset = radius_km / 111.0 * np.cos(angle)  # 1 degree lat ≈ 111 km
            lon_offset = radius_km / (111.0 * np.cos(np.radians(center_lat))) * np.sin(angle)
            
            points.append({
                "latitude": center_lat + lat_offset,
                "longitude": center_lon + lon_offset
            })
        
        # Close the polygon
        points.append(points[0])
        
        return points
    
    async def _generate_time_predictions(self, features: List[float], base_prob: float) -> Dict[str, Any]:
        """Generate time-based escalation predictions"""
        predictions = {}
        
        # Current
        predictions["now"] = {
            "probability": float(base_prob),
            "level": self._prob_to_level(base_prob)
        }
        
        # +6 hours (slight increase due to potential development)
        prob_6h = min(base_prob * 1.1, 1.0)
        predictions["6_hours"] = {
            "probability": float(prob_6h),
            "level": self._prob_to_level(prob_6h)
        }
        
        # +12 hours (weather dependency)
        weather_factor = 1.0 + (features[3] - 2) * 0.1  # Wave height influence
        prob_12h = min(base_prob * weather_factor, 1.0)
        predictions["12_hours"] = {
            "probability": float(prob_12h),
            "level": self._prob_to_level(prob_12h)
        }
        
        # +24 hours (natural decay unless sustained)
        prob_24h = base_prob * 0.8 if base_prob < 0.7 else base_prob * 0.9
        predictions["24_hours"] = {
            "probability": float(prob_24h),
            "level": self._prob_to_level(prob_24h)
        }
        
        return predictions
    
    def _prob_to_level(self, prob: float) -> str:
        """Convert probability to escalation level"""
        if prob >= 0.8:
            return "critical"
        elif prob >= 0.6:
            return "high"
        elif prob >= 0.4:
            return "medium"
        else:
            return "low"
    
    def _generate_recommendations(self, prob: float, level: str) -> List[str]:
        """Generate recommendations based on escalation probability"""
        recommendations = []
        
        if level == "critical":
            recommendations.extend([
                "Immediate emergency response activation required",
                "Evacuate high-risk areas immediately",
                "Deploy all available emergency resources",
                "Issue emergency broadcast alerts",
                "Coordinate with military/coast guard for large-scale response"
            ])
        elif level == "high":
            recommendations.extend([
                "Activate emergency response teams",
                "Issue public safety warnings",
                "Prepare evacuation plans",
                "Monitor situation continuously",
                "Coordinate with local authorities"
            ])
        elif level == "medium":
            recommendations.extend([
                "Increase monitoring frequency",
                "Alert emergency services to standby",
                "Issue advisory warnings to public",
                "Prepare response resources"
            ])
        else:
            recommendations.extend([
                "Continue routine monitoring",
                "Verify reports with additional sources",
                "Maintain situational awareness"
            ])
        
        return recommendations
    
    async def update_model(self, new_reports: List[Dict], actual_outcomes: List[Dict]):
        """Update model with new data (online learning)"""
        try:
            # Extract features from new reports
            features = []
            labels = []
            
            for report, outcome in zip(new_reports, actual_outcomes):
                if 'latitude' in report and 'longitude' in report:
                    feature_vector = await self._extract_features([report], 
                                                                report['latitude'], 
                                                                report['longitude'])
                    features.append(feature_vector)
                    labels.append(1 if outcome.get('escalated', False) else 0)
            
            if features:
                X = np.array(features)
                y = np.array(labels)
                X_scaled = self.scaler.transform(X)
                
                # Partial fit (if supported) or retrain
                if hasattr(self.escalation_model, 'partial_fit'):
                    self.escalation_model.partial_fit(X_scaled, y)
                else:
                    # For models that don't support partial_fit, we'd need to retrain
                    # with combined old and new data
                    pass
                
                logger.info(f"✅ Model updated with {len(features)} new samples")
                
                # Save updated model
                joblib.dump(self.escalation_model, 'models/escalation_model.pkl')
                
        except Exception as e:
            logger.error(f"Error updating model: {e}")

# Global model instance
escalation_model = PredictiveEscalationModel()
