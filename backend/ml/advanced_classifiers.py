import numpy as np
import pandas as pd
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import torch
from typing import Dict, List, Tuple, Optional
import re
import logging

logger = logging.getLogger(__name__)

class HazardClassifier:
    """Advanced hazard classification with multiple models and ensemble voting"""
    
    def __init__(self):
        self.hazard_types = [
            'tsunami', 'cyclone', 'oil_spill', 'flooding', 'storm_surge', 
            'marine_pollution', 'coastal_erosion', 'rip_current', 'shark_attack',
            'jellyfish_bloom', 'red_tide', 'vessel_distress', 'infrastructure_damage'
        ]
        
        # Initialize transformers pipeline for sentiment and classification
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis", 
            model="cardiffnlp/twitter-roberta-base-sentiment-latest"
        )
        
        self.text_classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli"
        )
        
        # Initialize traditional ML models with mock training
        self._initialize_traditional_models()
        
    def _initialize_traditional_models(self):
        """Initialize and mock-train traditional ML models"""
        # Mock training data for demonstration
        mock_features = np.random.rand(1000, 50)  # 50 features
        mock_labels = np.random.choice(len(self.hazard_types), 1000)
        
        self.rf_classifier = RandomForestClassifier(n_estimators=100, random_state=42)
        self.gb_classifier = GradientBoostingClassifier(n_estimators=100, random_state=42)
        
        # Mock training
        self.rf_classifier.fit(mock_features, mock_labels)
        self.gb_classifier.fit(mock_features, mock_labels)
        
        # TF-IDF for text features
        self.tfidf = TfidfVectorizer(max_features=1000, stop_words='english')
        mock_texts = [f"sample hazard text {i}" for i in range(1000)]
        self.tfidf.fit(mock_texts)
        
    def extract_text_features(self, text: str) -> np.ndarray:
        """Extract comprehensive text features"""
        # Basic text statistics
        word_count = len(text.split())
        char_count = len(text)
        exclamation_count = text.count('!')
        question_count = text.count('?')
        caps_ratio = sum(1 for c in text if c.isupper()) / len(text) if text else 0
        
        # Urgency keywords
        urgency_keywords = ['emergency', 'urgent', 'help', 'danger', 'critical', 'immediate']
        urgency_score = sum(1 for word in urgency_keywords if word in text.lower())
        
        # Hazard-specific keywords
        hazard_keywords = {
            'tsunami': ['wave', 'surge', 'earthquake', 'retreat'],
            'cyclone': ['wind', 'storm', 'hurricane', 'eye'],
            'oil_spill': ['oil', 'slick', 'pollution', 'leak'],
            'flooding': ['flood', 'water', 'overflow', 'submerged']
        }
        
        keyword_scores = []
        for hazard, keywords in hazard_keywords.items():
            score = sum(1 for word in keywords if word in text.lower())
            keyword_scores.append(score)
        
        # TF-IDF features (truncated for demo)
        tfidf_features = self.tfidf.transform([text]).toarray()[0][:10]  # First 10 features
        
        # Combine all features
        features = np.array([
            word_count, char_count, exclamation_count, question_count, 
            caps_ratio, urgency_score
        ] + keyword_scores + tfidf_features.tolist())
        
        # Pad or truncate to 50 features
        if len(features) < 50:
            features = np.pad(features, (0, 50 - len(features)))
        else:
            features = features[:50]
            
        return features
        
    def classify_hazard(self, text: str, image_analysis: Optional[Dict] = None) -> Dict:
        """Comprehensive hazard classification with ensemble voting"""
        try:
            # Text-based classification using transformers
            transformer_result = self.text_classifier(text, self.hazard_types)
            transformer_scores = {
                label: score for label, score in 
                zip(transformer_result['labels'], transformer_result['scores'])
            }
            
            # Traditional ML classification
            text_features = self.extract_text_features(text).reshape(1, -1)
            rf_pred = self.rf_classifier.predict_proba(text_features)[0]
            gb_pred = self.gb_classifier.predict_proba(text_features)[0]
            
            # Ensemble voting
            ensemble_scores = {}
            for i, hazard in enumerate(self.hazard_types):
                transformer_score = transformer_scores.get(hazard, 0.0)
                rf_score = rf_pred[i] if i < len(rf_pred) else 0.0
                gb_score = gb_pred[i] if i < len(gb_pred) else 0.0
                
                # Weighted ensemble (transformers get higher weight)
                ensemble_scores[hazard] = (
                    0.5 * transformer_score + 
                    0.25 * rf_score + 
                    0.25 * gb_score
                )
            
            # Get top prediction
            top_hazard = max(ensemble_scores, key=ensemble_scores.get)
            confidence = ensemble_scores[top_hazard]
            
            # Sentiment analysis for urgency
            sentiment = self.sentiment_analyzer(text)[0]
            urgency_multiplier = 1.5 if sentiment['label'] == 'NEGATIVE' else 1.0
            
            return {
                'hazard_type': top_hazard,
                'confidence': confidence,
                'urgency_score': confidence * urgency_multiplier,
                'all_scores': ensemble_scores,
                'sentiment': sentiment,
                'features_extracted': len(text_features[0])
            }
            
        except Exception as e:
            logger.error(f"Error in hazard classification: {e}")
            return {
                'hazard_type': 'unknown',
                'confidence': 0.0,
                'urgency_score': 0.0,
                'error': str(e)
            }

class SocialMediaAnalyzer:
    """Advanced social media analysis for predictive hazard detection"""
    
    def __init__(self):
        self.hashtag_patterns = {
            'ocean_ranger': r'#OceanRanger|#oceanranger',
            'blue_watch': r'#BlueWatch|#bluewatch',
            'emergency': r'#Emergency|#SOS|#Help',
            'weather': r'#Storm|#Cyclone|#Tsunami|#Weather'
        }
        
        self.credibility_factors = {
            'verified_account': 2.0,
            'follower_count_high': 1.5,
            'location_verified': 1.8,
            'media_attached': 1.3,
            'retweet_count_high': 1.4
        }
        
    def analyze_social_post(self, post_data: Dict) -> Dict:
        """Comprehensive social media post analysis"""
        text = post_data.get('text', '')
        user_data = post_data.get('user', {})
        engagement = post_data.get('engagement', {})
        
        # Hashtag analysis
        hashtag_scores = {}
        for category, pattern in self.hashtag_patterns.items():
            matches = len(re.findall(pattern, text, re.IGNORECASE))
            hashtag_scores[category] = matches
        
        # Credibility scoring
        credibility_score = 1.0
        if user_data.get('verified', False):
            credibility_score *= self.credibility_factors['verified_account']
        
        follower_count = user_data.get('followers_count', 0)
        if follower_count > 10000:
            credibility_score *= self.credibility_factors['follower_count_high']
        
        if post_data.get('location'):
            credibility_score *= self.credibility_factors['location_verified']
        
        if post_data.get('media_urls'):
            credibility_score *= self.credibility_factors['media_attached']
        
        retweet_count = engagement.get('retweet_count', 0)
        if retweet_count > 100:
            credibility_score *= self.credibility_factors['retweet_count_high']
        
        # Urgency detection
        urgency_keywords = ['urgent', 'emergency', 'help', 'danger', 'critical', 'now', 'immediate']
        urgency_score = sum(1 for word in urgency_keywords if word in text.lower())
        
        # Panic detection
        panic_indicators = ['panic', 'scared', 'terrified', 'chaos', 'disaster', 'catastrophe']
        panic_score = sum(1 for word in panic_indicators if word in text.lower())
        
        # Overall threat score
        threat_score = (
            (sum(hashtag_scores.values()) * 0.3) +
            (urgency_score * 0.4) +
            (panic_score * 0.3)
        ) * credibility_score
        
        return {
            'threat_score': min(threat_score, 10.0),  # Cap at 10
            'credibility_score': credibility_score,
            'hashtag_scores': hashtag_scores,
            'urgency_score': urgency_score,
            'panic_score': panic_score,
            'requires_analyst_review': threat_score > 7.0,
            'auto_alert_eligible': threat_score > 8.5 and credibility_score > 2.0
        }

class ThreatScorer:
    """Advanced threat scoring with multi-factor analysis"""
    
    def __init__(self):
        self.base_weights = {
            'text_classification': 0.25,
            'image_analysis': 0.20,
            'social_media': 0.20,
            'location_density': 0.15,
            'reporter_credibility': 0.10,
            'temporal_factors': 0.10
        }
        
    def calculate_threat_score(self, report_data: Dict) -> Dict:
        """Calculate comprehensive threat score"""
        scores = {}
        
        # Text classification score
        text_result = report_data.get('text_classification', {})
        scores['text_score'] = text_result.get('urgency_score', 0.0)
        
        # Image analysis score (mock for now)
        image_data = report_data.get('image_analysis', {})
        scores['image_score'] = image_data.get('hazard_confidence', 0.0)
        
        # Social media correlation
        social_data = report_data.get('social_correlation', {})
        scores['social_score'] = social_data.get('threat_score', 0.0)
        
        # Location density (reports in area)
        location_data = report_data.get('location_analysis', {})
        scores['density_score'] = min(location_data.get('nearby_reports', 0) * 0.5, 5.0)
        
        # Reporter credibility
        reporter_data = report_data.get('reporter', {})
        credibility = self._calculate_reporter_credibility(reporter_data)
        scores['credibility_score'] = credibility
        
        # Temporal factors (time of day, recent events)
        temporal_data = report_data.get('temporal_analysis', {})
        scores['temporal_score'] = temporal_data.get('risk_multiplier', 1.0)
        
        # Calculate weighted final score
        final_score = sum(
            scores[key.replace('_score', '') + '_score'] * weight 
            for key, weight in self.base_weights.items()
            if key.replace('_', '_') + '_score' in scores
        )
        
        # Apply temporal multiplier
        final_score *= scores.get('temporal_score', 1.0)
        
        # Normalize to 0-10 scale
        final_score = min(final_score, 10.0)
        
        return {
            'final_threat_score': final_score,
            'component_scores': scores,
            'risk_level': self._get_risk_level(final_score),
            'recommended_actions': self._get_recommended_actions(final_score),
            'alert_threshold_met': final_score >= 7.5
        }
    
    def _calculate_reporter_credibility(self, reporter_data: Dict) -> float:
        """Calculate reporter credibility score"""
        base_score = 5.0  # Neutral starting point
        
        # Verified reporter bonus
        if reporter_data.get('verified', False):
            base_score += 2.0
        
        # Historical accuracy
        accuracy = reporter_data.get('historical_accuracy', 0.5)
        base_score += (accuracy - 0.5) * 4.0  # -2 to +2 adjustment
        
        # Report count (experience)
        report_count = reporter_data.get('total_reports', 0)
        experience_bonus = min(report_count * 0.1, 2.0)
        base_score += experience_bonus
        
        return min(max(base_score, 0.0), 10.0)
    
    def _get_risk_level(self, score: float) -> str:
        """Convert numeric score to risk level"""
        if score >= 8.5:
            return 'CRITICAL'
        elif score >= 7.0:
            return 'HIGH'
        elif score >= 5.0:
            return 'MEDIUM'
        elif score >= 2.5:
            return 'LOW'
        else:
            return 'MINIMAL'
    
    def _get_recommended_actions(self, score: float) -> List[str]:
        """Get recommended actions based on threat score"""
        if score >= 8.5:
            return [
                'Issue immediate emergency alert',
                'Deploy emergency response teams',
                'Activate evacuation procedures',
                'Notify government agencies',
                'Broadcast on all channels'
            ]
        elif score >= 7.0:
            return [
                'Issue high-priority alert',
                'Prepare emergency response teams',
                'Monitor situation closely',
                'Notify relevant authorities'
            ]
        elif score >= 5.0:
            return [
                'Issue standard alert',
                'Increase monitoring',
                'Prepare response resources'
            ]
        else:
            return [
                'Log for monitoring',
                'Routine verification'
            ]
