"""
Pydantic request/response models
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class HazardType(str, Enum):
    oil_spill = "oil_spill"
    tsunami = "tsunami"
    storm_surge = "storm_surge"
    high_waves = "high_waves"
    flood = "flood"
    cyclone = "cyclone"

class Severity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class ReportSource(str, Enum):
    app = "app"
    sms = "sms"
    social = "social"

# Report schemas
class ReportCreate(BaseModel):
    user_id: Optional[str] = None
    source: ReportSource = ReportSource.app
    hazard_type: HazardType
    description: str
    media_key: Optional[str] = None
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)
    severity: Severity = Severity.medium

class ReportResponse(BaseModel):
    id: int
    user_id: Optional[str]
    source: str
    hazard_type: str
    description: str
    media_url: Optional[str]
    lat: float
    lon: float
    severity: str
    confidence: float
    verified: bool
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Social media schemas
class SocialPostCreate(BaseModel):
    platform: str
    post_id: str
    author_handle: str
    text: str
    posted_at: datetime
    lat: Optional[float] = None
    lon: Optional[float] = None

class SocialPostResponse(BaseModel):
    id: int
    platform: str
    author_handle: str
    text: str
    relevance: float
    urgency: float
    hazard_type: Optional[str]
    lat: Optional[float]
    lon: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Zone schemas
class ZoneCreate(BaseModel):
    type: str  # 'red' or 'green'
    name: str
    geom_geojson: Dict[str, Any]  # GeoJSON polygon
    metadata: Optional[Dict[str, Any]] = {}

class ZoneResponse(BaseModel):
    id: int
    type: str
    name: str
    avg_confidence: Optional[float]
    report_count: int
    radius_km: Optional[float]
    active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Alert schemas
class AlertCreate(BaseModel):
    zone_id: Optional[int] = None
    report_id: Optional[int] = None
    message: str
    channels: List[str] = ["sms", "push"]

class AlertResponse(BaseModel):
    id: int
    message: str
    status: str
    sms_count: int
    issued_at: datetime
    
    class Config:
        from_attributes = True

# Team schemas
class TeamCreate(BaseModel):
    name: str
    phone: str

class LiveLocationUpdate(BaseModel):
    team_id: int
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)

# Chatbot schemas
class ChatbotReply(BaseModel):
    user: str
    message: str
    social_post_id: Optional[int] = None

# Analytics schemas
class HotspotResponse(BaseModel):
    cluster_id: int
    poly_geojson: Dict[str, Any]
    avg_confidence: float
    report_count: int
    radius_km: float
    center_lat: float
    center_lon: float

class AnalyticsResponse(BaseModel):
    total_reports: int
    verified_reports: int
    active_zones: int
    alerts_issued: int
    reports_by_type: Dict[str, int]
    confidence_distribution: Dict[str, int]
