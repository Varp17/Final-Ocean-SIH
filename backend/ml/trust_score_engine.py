"""
Trust Score Engine for Volunteer and Reporter Credibility
"""
import numpy as np
from typing import Dict, List, Any
from datetime import datetime, timedelta
import logging
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class ReportType(Enum):
    VERIFIED_CORRECT = "verified_correct"
    VERIFIED_INCORRECT = "verified_incorrect"
    PARTIALLY_CORRECT = "partially_correct"
    UNVERIFIED = "unverified"
    FALSE_ALARM = "false_alarm"

@dataclass
class TrustEvent:
    user_id: str
    event_type: ReportType
    timestamp: datetime
    confidence: float
    report_complexity: float  # 0-1, how complex/difficult the report was
    verification_source: str  # "analyst", "volunteer", "automated"
    location_accuracy: float  # 0-1, how accurate the location was
    time_to_verify: timedelta  # How long it took to verify

class TrustScoreEngine:
    def __init__(self):
        self.base_score = 3.0  # Starting trust score (out of 5)
        self.max_score = 5.0
        self.min_score = 0.5
        self.decay_rate = 0.95  # Score decay over time for inactive users
        self.verification_weights = {
            "analyst": 1.0,
            "volunteer": 0.8,
            "automated": 0.6,
            "peer_review": 0.7
        }
        
    def calculate_trust_score(self, user_id: str, trust_events: List[TrustEvent]) -> Dict[str, Any]:
        """Calculate comprehensive trust score for a user"""
        try:
            if not trust_events:
                return {
                    "trust_score": self.base_score,
                    "confidence": 0.1,
                    "total_reports": 0,
                    "verification_rate": 0.0,
                    "reliability_trend": "new_user",
                    "score_breakdown": self._get_empty_breakdown()
                }
            
            # Sort events by timestamp
            events = sorted(trust_events, key=lambda x: x.timestamp)
            recent_events = [e for e in events if 
                           datetime.utcnow() - e.timestamp < timedelta(days=90)]
            
            # Calculate base metrics
            total_reports = len(events)
            verified_correct = len([e for e in events if e.event_type == ReportType.VERIFIED_CORRECT])
            verified_incorrect = len([e for e in events if e.event_type == ReportType.VERIFIED_INCORRECT])
            false_alarms = len([e for e in events if e.event_type == ReportType.FALSE_ALARM])
            
            verification_rate = verified_correct / max(1, verified_correct + verified_incorrect + false_alarms)
            
            # Calculate weighted score components
            accuracy_score = self._calculate_accuracy_score(events)
            consistency_score = self._calculate_consistency_score(events)
            timeliness_score = self._calculate_timeliness_score(events)
            complexity_score = self._calculate_complexity_score(events)
            recency_score = self._calculate_recency_score(events, recent_events)
            
            # Combine scores with weights
            final_score = (
                accuracy_score * 0.35 +
                consistency_score * 0.25 +
                timeliness_score * 0.15 +
                complexity_score * 0.15 +
                recency_score * 0.10
            )
            
            # Apply bounds
            final_score = max(self.min_score, min(self.max_score, final_score))
            
            # Calculate confidence based on number of events
            confidence = min(1.0, total_reports / 20)  # Full confidence at 20+ reports
            
            # Determine reliability trend
            trend = self._calculate_trend(events)
            
            return {
                "trust_score": round(final_score, 2),
                "confidence": round(confidence, 2),
                "total_reports": total_reports,
                "verification_rate": round(verification_rate * 100, 1),
                "reliability_trend": trend,
                "score_breakdown": {
                    "accuracy": round(accuracy_score, 2),
                    "consistency": round(consistency_score, 2),
                    "timeliness": round(timeliness_score, 2),
                    "complexity": round(complexity_score, 2),
                    "recency": round(recency_score, 2)
                },
                "recent_activity": len(recent_events),
                "last_report": events[-1].timestamp.isoformat() if events else None
            }
            
        except Exception as e:
            logger.error(f"Error calculating trust score for {user_id}: {e}")
            return {
                "trust_score": self.base_score,
                "confidence": 0.0,
                "total_reports": 0,
                "verification_rate": 0.0,
                "reliability_trend": "error",
                "score_breakdown": self._get_empty_breakdown(),
                "error": str(e)
            }
    
    def _calculate_accuracy_score(self, events: List[TrustEvent]) -> float:
        """Calculate accuracy component of trust score"""
        if not events:
            return self.base_score
        
        score_sum = 0
        weight_sum = 0
        
        for event in events:
            # Base score for event type
            if event.event_type == ReportType.VERIFIED_CORRECT:
                event_score = 5.0
            elif event.event_type == ReportType.PARTIALLY_CORRECT:
                event_score = 3.5
            elif event.event_type == ReportType.VERIFIED_INCORRECT:
                event_score = 2.0
            elif event.event_type == ReportType.FALSE_ALARM:
                event_score = 1.0
            else:  # UNVERIFIED
                event_score = 3.0  # Neutral
            
            # Weight by verification source reliability
            weight = self.verification_weights.get(event.verification_source, 0.5)
            
            # Adjust by confidence and location accuracy
            event_score *= (event.confidence * 0.7 + event.location_accuracy * 0.3)
            
            score_sum += event_score * weight
            weight_sum += weight
        
        return score_sum / max(1, weight_sum)
    
    def _calculate_consistency_score(self, events: List[TrustEvent]) -> float:
        """Calculate consistency over time"""
        if len(events) < 3:
            return self.base_score
        
        # Calculate rolling accuracy over time windows
        window_size = max(5, len(events) // 4)
        accuracies = []
        
        for i in range(len(events) - window_size + 1):
            window_events = events[i:i + window_size]
            correct = len([e for e in window_events if e.event_type == ReportType.VERIFIED_CORRECT])
            accuracy = correct / len(window_events)
            accuracies.append(accuracy)
        
        if not accuracies:
            return self.base_score
        
        # Consistency is inverse of variance
        variance = np.var(accuracies)
        consistency = max(0, 1 - variance * 2)  # Scale variance to 0-1
        
        return self.base_score + (consistency - 0.5) * 4  # Scale to 1-5 range
    
    def _calculate_timeliness_score(self, events: List[TrustEvent]) -> float:
        """Calculate timeliness based on verification speed"""
        if not events:
            return self.base_score
        
        # Average time to verification (in hours)
        verification_times = [e.time_to_verify.total_seconds() / 3600 for e in events 
                            if e.time_to_verify.total_seconds() > 0]
        
        if not verification_times:
            return self.base_score
        
        avg_time = np.mean(verification_times)
        
        # Score based on average verification time
        # Faster verification = higher score
        if avg_time <= 1:  # Within 1 hour
            return 5.0
        elif avg_time <= 6:  # Within 6 hours
            return 4.0
        elif avg_time <= 24:  # Within 24 hours
            return 3.0
        elif avg_time <= 72:  # Within 3 days
            return 2.0
        else:
            return 1.0
    
    def _calculate_complexity_score(self, events: List[TrustEvent]) -> float:
        """Bonus for handling complex reports correctly"""
        if not events:
            return self.base_score
        
        # Weight correct reports by their complexity
        complex_correct = 0
        total_complex = 0
        
        for event in events:
            if event.report_complexity > 0.7:  # High complexity
                total_complex += 1
                if event.event_type == ReportType.VERIFIED_CORRECT:
                    complex_correct += 1
        
        if total_complex == 0:
            return self.base_score
        
        complex_accuracy = complex_correct / total_complex
        return self.base_score + (complex_accuracy - 0.5) * 4
    
    def _calculate_recency_score(self, all_events: List[TrustEvent], recent_events: List[TrustEvent]) -> float:
        """Score based on recent activity and performance"""
        if not all_events:
            return self.base_score
        
        # Decay score for inactive users
        last_event = max(all_events, key=lambda x: x.timestamp)
        days_since_last = (datetime.utcnow() - last_event.timestamp).days
        
        decay_factor = self.decay_rate ** (days_since_last / 30)  # Decay over months
        
        # Recent performance
        if recent_events:
            recent_correct = len([e for e in recent_events if e.event_type == ReportType.VERIFIED_CORRECT])
            recent_accuracy = recent_correct / len(recent_events)
            recent_score = self.base_score + (recent_accuracy - 0.5) * 4
        else:
            recent_score = self.base_score
        
        return recent_score * decay_factor
    
    def _calculate_trend(self, events: List[TrustEvent]) -> str:
        """Calculate reliability trend"""
        if len(events) < 5:
            return "insufficient_data"
        
        # Split into two halves and compare accuracy
        mid_point = len(events) // 2
        early_events = events[:mid_point]
        recent_events = events[mid_point:]
        
        early_correct = len([e for e in early_events if e.event_type == ReportType.VERIFIED_CORRECT])
        recent_correct = len([e for e in recent_events if e.event_type == ReportType.VERIFIED_CORRECT])
        
        early_accuracy = early_correct / len(early_events)
        recent_accuracy = recent_correct / len(recent_events)
        
        diff = recent_accuracy - early_accuracy
        
        if diff > 0.1:
            return "improving"
        elif diff < -0.1:
            return "declining"
        else:
            return "stable"
    
    def _get_empty_breakdown(self) -> Dict[str, float]:
        """Return empty score breakdown"""
        return {
            "accuracy": self.base_score,
            "consistency": self.base_score,
            "timeliness": self.base_score,
            "complexity": self.base_score,
            "recency": self.base_score
        }
    
    def get_trust_level(self, score: float) -> str:
        """Convert trust score to categorical level"""
        if score >= 4.5:
            return "excellent"
        elif score >= 4.0:
            return "very_good"
        elif score >= 3.5:
            return "good"
        elif score >= 2.5:
            return "fair"
        elif score >= 1.5:
            return "poor"
        else:
            return "very_poor"
    
    def get_recommendations(self, trust_data: Dict[str, Any]) -> List[str]:
        """Get recommendations for improving trust score"""
        recommendations = []
        score = trust_data["trust_score"]
        breakdown = trust_data["score_breakdown"]
        
        if breakdown["accuracy"] < 3.0:
            recommendations.append("Focus on accuracy - verify information before reporting")
        
        if breakdown["consistency"] < 3.0:
            recommendations.append("Maintain consistent reporting quality over time")
        
        if breakdown["timeliness"] < 3.0:
            recommendations.append("Provide timely updates and respond to verification requests quickly")
        
        if trust_data["recent_activity"] < 5:
            recommendations.append("Increase reporting activity to build trust history")
        
        if score < 2.5:
            recommendations.append("Consider additional training or mentorship")
        
        return recommendations

# Global trust engine instance
trust_engine = TrustScoreEngine()
