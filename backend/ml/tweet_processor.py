import re
import json
import asyncio
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
import numpy as np
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
from textblob import TextBlob
import emoji

class AdvancedTweetProcessor:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Load pre-trained models
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-roberta-base-sentiment-latest",
            device=0 if torch.cuda.is_available() else -1
        )
        
        self.spam_classifier = pipeline(
            "text-classification",
            model="unitary/toxic-bert",
            device=0 if torch.cuda.is_available() else -1
        )
        
        # Emergency keywords and patterns
        self.emergency_keywords = {
            'high_priority': [
                'tsunami', 'hurricane', 'earthquake', 'flood', 'fire', 'explosion',
                'emergency', 'help', 'rescue', 'trapped', 'injured', 'danger',
                'evacuation', 'shelter', 'missing person', 'accident'
            ],
            'medium_priority': [
                'storm', 'wind', 'rain', 'power outage', 'road closed',
                'debris', 'damage', 'leak', 'broken', 'hazard'
            ],
            'ocean_specific': [
                'rip current', 'high waves', 'rough seas', 'boat', 'swimmer',
                'beach', 'coast', 'tide', 'marine', 'ocean', 'sea'
            ]
        }
        
        # Spam/joke indicators
        self.spam_patterns = [
            r'😂{2,}', r'lol{2,}', r'haha{3,}', r'lmao{2,}',
            r'#joke', r'#funny', r'#meme', r'just kidding',
            r'clickbait', r'fake news', r'hoax'
        ]
        
        # Location extraction patterns
        self.location_patterns = [
            r'at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'near\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'@\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
        ]

    async def process_tweet_batch(self, tweets: List[Dict]) -> List[Dict]:
        """Process a batch of tweets with ML analysis"""
        processed_tweets = []
        
        for tweet in tweets:
            try:
                processed_tweet = await self.process_single_tweet(tweet)
                processed_tweets.append(processed_tweet)
            except Exception as e:
                print(f"[v0] Error processing tweet {tweet.get('id', 'unknown')}: {e}")
                # Add failed tweet with minimal processing
                processed_tweets.append({
                    **tweet,
                    'ml_analysis': {
                        'confidence_score': 0.1,
                        'is_emergency': False,
                        'is_spam': True,
                        'processing_error': str(e)
                    }
                })
        
        return processed_tweets

    async def process_single_tweet(self, tweet: Dict) -> Dict:
        """Process a single tweet with comprehensive ML analysis"""
        text = tweet.get('text', '')
        
        # Clean and preprocess text
        cleaned_text = self.clean_text(text)
        
        # Run ML analysis
        ml_analysis = {
            'original_text': text,
            'cleaned_text': cleaned_text,
            'confidence_score': 0.0,
            'is_emergency': False,
            'is_spam': False,
            'sentiment': {},
            'emergency_indicators': {},
            'location_mentions': [],
            'credibility_score': 0.0,
            'priority_level': 'low',
            'processing_timestamp': datetime.utcnow().isoformat()
        }
        
        # Skip if text is too short or empty
        if len(cleaned_text.strip()) < 10:
            ml_analysis['is_spam'] = True
            ml_analysis['confidence_score'] = 0.1
            return {**tweet, 'ml_analysis': ml_analysis}
        
        # Spam/joke detection
        spam_score = await self.detect_spam_and_jokes(cleaned_text)
        ml_analysis['is_spam'] = spam_score > 0.7
        
        if not ml_analysis['is_spam']:
            # Sentiment analysis
            sentiment = await self.analyze_sentiment(cleaned_text)
            ml_analysis['sentiment'] = sentiment
            
            # Emergency detection
            emergency_analysis = await self.detect_emergency_content(cleaned_text)
            ml_analysis['emergency_indicators'] = emergency_analysis
            ml_analysis['is_emergency'] = emergency_analysis['is_emergency']
            
            # Location extraction
            locations = self.extract_locations(cleaned_text)
            ml_analysis['location_mentions'] = locations
            
            # Credibility scoring
            credibility = await self.calculate_credibility_score(tweet, cleaned_text)
            ml_analysis['credibility_score'] = credibility
            
            # Priority calculation
            priority = self.calculate_priority_level(emergency_analysis, sentiment, credibility)
            ml_analysis['priority_level'] = priority
            
            # Overall confidence score
            confidence = self.calculate_confidence_score(
                emergency_analysis, sentiment, credibility, spam_score
            )
            ml_analysis['confidence_score'] = confidence
        
        return {**tweet, 'ml_analysis': ml_analysis}

    def clean_text(self, text: str) -> str:
        """Clean and normalize tweet text"""
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\$$\$$,]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        
        # Convert emojis to text descriptions
        text = emoji.demojize(text, delimiters=(" ", " "))
        
        # Remove excessive punctuation
        text = re.sub(r'[!]{2,}', '!', text)
        text = re.sub(r'[?]{2,}', '?', text)
        text = re.sub(r'[.]{3,}', '...', text)
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove mentions and hashtags for analysis (keep original for context)
        analysis_text = re.sub(r'@\w+', '', text)
        analysis_text = re.sub(r'#\w+', '', analysis_text)
        
        return analysis_text.strip()

    async def detect_spam_and_jokes(self, text: str) -> float:
        """Detect spam, jokes, and non-serious content"""
        spam_score = 0.0
        
        # Pattern-based detection
        for pattern in self.spam_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                spam_score += 0.3
        
        # Excessive emoji usage
        emoji_count = len(re.findall(r':[a-z_]+:', text))
        if emoji_count > 5:
            spam_score += 0.2
        
        # Excessive capitalization
        caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)
        if caps_ratio > 0.5:
            spam_score += 0.2
        
        # ML-based toxicity detection (repurposed for spam)
        try:
            toxicity_result = self.spam_classifier(text[:512])  # Limit text length
            if toxicity_result[0]['label'] == 'TOXIC' and toxicity_result[0]['score'] > 0.8:
                spam_score += 0.4
        except Exception as e:
            print(f"[v0] Spam classification error: {e}")
        
        return min(spam_score, 1.0)

    async def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment with emergency context"""
        try:
            # Use transformer model
            result = self.sentiment_analyzer(text[:512])
            
            # Also use TextBlob for additional analysis
            blob = TextBlob(text)
            
            return {
                'transformer_sentiment': result[0]['label'],
                'transformer_confidence': result[0]['score'],
                'polarity': blob.sentiment.polarity,
                'subjectivity': blob.sentiment.subjectivity,
                'urgency_indicators': self.detect_urgency_in_sentiment(text)
            }
        except Exception as e:
            print(f"[v0] Sentiment analysis error: {e}")
            return {
                'transformer_sentiment': 'NEUTRAL',
                'transformer_confidence': 0.5,
                'polarity': 0.0,
                'subjectivity': 0.5,
                'urgency_indicators': []
            }

    def detect_urgency_in_sentiment(self, text: str) -> List[str]:
        """Detect urgency indicators in text"""
        urgency_patterns = [
            r'\b(urgent|emergency|immediate|asap|now|help|sos)\b',
            r'\b(please|need|require).*(help|assistance|rescue)\b',
            r'\b(trapped|stuck|stranded|lost)\b',
            r'\b(injured|hurt|bleeding|unconscious)\b'
        ]
        
        indicators = []
        for pattern in urgency_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            indicators.extend(matches)
        
        return list(set(indicators))

    async def detect_emergency_content(self, text: str) -> Dict:
        """Detect emergency-related content with confidence scoring"""
        emergency_score = 0.0
        detected_keywords = []
        emergency_type = None
        
        text_lower = text.lower()
        
        # Check for emergency keywords
        for category, keywords in self.emergency_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    detected_keywords.append(keyword)
                    if category == 'high_priority':
                        emergency_score += 0.4
                        emergency_type = 'high_priority'
                    elif category == 'medium_priority':
                        emergency_score += 0.2
                        if not emergency_type:
                            emergency_type = 'medium_priority'
                    elif category == 'ocean_specific':
                        emergency_score += 0.3
                        if not emergency_type:
                            emergency_type = 'ocean_hazard'
        
        # Check for emergency phrases
        emergency_phrases = [
            r'need help', r'call 911', r'emergency services',
            r'people trapped', r'building collapse', r'gas leak',
            r'power lines down', r'road blocked', r'bridge out'
        ]
        
        for phrase in emergency_phrases:
            if re.search(phrase, text_lower):
                emergency_score += 0.3
                detected_keywords.append(phrase)
        
        # Check for time-sensitive language
        time_sensitive = [
            r'happening now', r'right now', r'currently',
            r'just happened', r'ongoing', r'in progress'
        ]
        
        for pattern in time_sensitive:
            if re.search(pattern, text_lower):
                emergency_score += 0.2
        
        is_emergency = emergency_score > 0.5
        
        return {
            'is_emergency': is_emergency,
            'emergency_score': min(emergency_score, 1.0),
            'emergency_type': emergency_type,
            'detected_keywords': list(set(detected_keywords)),
            'confidence': min(emergency_score * 1.2, 1.0)
        }

    def extract_locations(self, text: str) -> List[Dict]:
        """Extract location mentions from text"""
        locations = []
        
        for pattern in self.location_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                location_text = match.group(1)
                locations.append({
                    'text': location_text,
                    'confidence': 0.7,  # Basic pattern matching confidence
                    'type': 'mentioned_location'
                })
        
        # Look for coordinates
        coord_pattern = r'(-?\d+\.?\d*),\s*(-?\d+\.?\d*)'
        coord_matches = re.finditer(coord_pattern, text)
        for match in coord_matches:
            lat, lng = match.groups()
            try:
                lat_f, lng_f = float(lat), float(lng)
                if -90 <= lat_f <= 90 and -180 <= lng_f <= 180:
                    locations.append({
                        'text': f"{lat}, {lng}",
                        'latitude': lat_f,
                        'longitude': lng_f,
                        'confidence': 0.9,
                        'type': 'coordinates'
                    })
            except ValueError:
                pass
        
        return locations

    async def calculate_credibility_score(self, tweet: Dict, text: str) -> float:
        """Calculate credibility score based on various factors"""
        score = 0.5  # Base score
        
        # Account age and verification (mock data)
        user = tweet.get('user', {})
        if user.get('verified', False):
            score += 0.2
        
        # Account age (assume older accounts are more credible)
        created_at = user.get('created_at')
        if created_at:
            # Mock: assume account is credible if it has engagement
            score += 0.1
        
        # Follower count (mock)
        followers = user.get('followers_count', 0)
        if followers > 1000:
            score += 0.1
        elif followers > 10000:
            score += 0.2
        
        # Text quality indicators
        if len(text) > 50:  # Detailed reports are more credible
            score += 0.1
        
        if re.search(r'\d+', text):  # Contains numbers (addresses, times, etc.)
            score += 0.1
        
        # Reduce score for excessive punctuation or caps
        if re.search(r'[!?]{3,}', text):
            score -= 0.1
        
        caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)
        if caps_ratio > 0.3:
            score -= 0.1
        
        return max(0.0, min(1.0, score))

    def calculate_priority_level(self, emergency_analysis: Dict, sentiment: Dict, credibility: float) -> str:
        """Calculate overall priority level"""
        if emergency_analysis['is_emergency'] and emergency_analysis['emergency_score'] > 0.8:
            if credibility > 0.7:
                return 'critical'
            else:
                return 'high'
        elif emergency_analysis['is_emergency'] and emergency_analysis['emergency_score'] > 0.5:
            return 'high' if credibility > 0.6 else 'medium'
        elif emergency_analysis['emergency_score'] > 0.3:
            return 'medium' if credibility > 0.5 else 'low'
        else:
            return 'low'

    def calculate_confidence_score(self, emergency_analysis: Dict, sentiment: Dict, 
                                 credibility: float, spam_score: float) -> float:
        """Calculate overall confidence in the analysis"""
        if spam_score > 0.7:
            return 0.1
        
        confidence = 0.0
        
        # Emergency detection confidence
        confidence += emergency_analysis.get('confidence', 0.0) * 0.4
        
        # Sentiment analysis confidence
        confidence += sentiment.get('transformer_confidence', 0.5) * 0.2
        
        # Credibility score
        confidence += credibility * 0.3
        
        # Spam score (inverse)
        confidence += (1.0 - spam_score) * 0.1
        
        return min(1.0, confidence)

# Mock data generator for testing
class MockTweetGenerator:
    def __init__(self):
        self.emergency_templates = [
            "🚨 URGENT: Major flooding at {location}! Water levels rising rapidly. Multiple cars stranded. Need immediate rescue assistance! #Emergency #Flood",
            "HELP! Building collapse at {location}. People trapped inside. Emergency services needed NOW! 🆘",
            "⚠️ Gas leak reported near {location}. Strong smell, residents evacuating. Fire department en route. Avoid the area!",
            "Tsunami warning! Massive waves approaching {location} coast. EVACUATE IMMEDIATELY! This is not a drill! 🌊",
            "🔥 Wildfire spreading fast toward {location}. Homes threatened. Evacuation orders in effect. Stay safe!",
        ]
        
        self.normal_templates = [
            "Beautiful sunset at {location} beach today 🌅 Perfect weather for a walk",
            "Traffic is a bit heavy near {location} due to construction. Plan extra time for your commute",
            "Power outage in {location} area. Utility company says it should be restored within 2 hours",
            "Minor fender bender at {location} intersection. No injuries reported, just some delays",
            "Storm clouds gathering over {location}. Might want to bring an umbrella! ☔",
        ]
        
        self.spam_templates = [
            "OMG you won't believe what happened at {location}! 😂😂😂 This is so funny lmaooo #joke #fake",
            "BREAKING: Aliens landed at {location}!!! Just kidding lol 👽😂 #AprilFools #NotReal",
            "Hahaha someone said there's an emergency at {location} but it's just my cooking 😂🔥 #BadCook",
        ]
        
        self.locations = [
            "Downtown Marina", "Sunset Beach", "Harbor District", "Coastal Highway",
            "Ocean View Park", "Pier 39", "Bayfront Plaza", "Seaside Boulevard"
        ]

    def generate_mock_tweets(self, count: int = 50) -> List[Dict]:
        """Generate mock tweets for testing"""
        tweets = []
        
        for i in range(count):
            # 20% emergency, 60% normal, 20% spam
            rand = np.random.random()
            if rand < 0.2:
                template = np.random.choice(self.emergency_templates)
                tweet_type = 'emergency'
            elif rand < 0.8:
                template = np.random.choice(self.normal_templates)
                tweet_type = 'normal'
            else:
                template = np.random.choice(self.spam_templates)
                tweet_type = 'spam'
            
            location = np.random.choice(self.locations)
            text = template.format(location=location)
            
            tweet = {
                'id': f'tweet_{i+1}',
                'text': text,
                'created_at': (datetime.utcnow() - timedelta(minutes=np.random.randint(0, 1440))).isoformat(),
                'user': {
                    'id': f'user_{np.random.randint(1, 1000)}',
                    'username': f'user{np.random.randint(1, 1000)}',
                    'verified': np.random.random() < 0.1,
                    'followers_count': np.random.randint(10, 50000),
                    'created_at': (datetime.utcnow() - timedelta(days=np.random.randint(30, 3650))).isoformat()
                },
                'retweet_count': np.random.randint(0, 100),
                'like_count': np.random.randint(0, 500),
                'reply_count': np.random.randint(0, 50),
                'source_type': tweet_type,  # For testing purposes
                'hashtags': re.findall(r'#\w+', text),
                'mentions': re.findall(r'@\w+', text)
            }
            
            tweets.append(tweet)
        
        return tweets
