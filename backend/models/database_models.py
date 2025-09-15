from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
import uuid

Base = declarative_base()

class UserRole(str, Enum):
    CITIZEN = "citizen"
    ANALYST = "analyst" 
    ADMIN = "admin"

class HazardType(str, Enum):
    TSUNAMI = "tsunami"
    CYCLONE = "cyclone"
    STORM_SURGE = "storm_surge"
    COASTAL_EROSION = "coastal_erosion"
    OIL_SPILL = "oil_spill"
    MARINE_POLLUTION = "marine_pollution"
    RIP_CURRENT = "rip_current"
    HIGH_WAVES = "high_waves"
    FLOODING = "flooding"

class SeverityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default=UserRole.CITIZEN)
    is_active = Column(Boolean, default=True)
    phone_number = Column(String)
    emergency_contact = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    hazard_reports = relationship("HazardReport", back_populates="reporter")
    live_locations = relationship("LiveLocation", back_populates="user")

class HazardReport(Base):
    __tablename__ = "hazard_reports"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    reporter_id = Column(String, ForeignKey("users.id"), nullable=False)
    hazard_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_name = Column(String)
    confidence_score = Column(Float, default=0.0)
    urgency_level = Column(String, default="monitoring")
    verified = Column(Boolean, default=False)
    verified_by = Column(String, ForeignKey("users.id"))
    media_urls = Column(JSON)  # Array of image/video URLs
    additional_data = Column(JSON)  # Flexible field for extra data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    reporter = relationship("User", back_populates="hazard_reports", foreign_keys=[reporter_id])
    verifier = relationship("User", foreign_keys=[verified_by])

class LiveLocation(Base):
    __tablename__ = "live_locations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    accuracy = Column(Float)
    speed = Column(Float)
    heading = Column(Float)
    is_emergency = Column(Boolean, default=False)
    battery_level = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="live_locations")

class SafeZone(Base):
    __tablename__ = "safe_zones"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius = Column(Float, nullable=False)  # in meters
    capacity = Column(Integer)
    facilities = Column(JSON)  # Array of available facilities
    contact_info = Column(JSON)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    alert_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    affected_area = Column(JSON)  # Geographic bounds
    issued_by = Column(String, ForeignKey("users.id"), nullable=False)
    expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    issuer = relationship("User", foreign_keys=[issued_by])

class SocialMediaPost(Base):
    __tablename__ = "social_media_posts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    platform = Column(String, nullable=False)  # twitter, facebook, instagram
    post_id = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    author = Column(String)
    posted_at = Column(DateTime(timezone=True))
    
    # ML Analysis Results
    hazard_detected = Column(Boolean, default=False)
    hazard_type = Column(String)
    confidence_score = Column(Float, default=0.0)
    sentiment = Column(String)  # positive, negative, neutral, urgent
    credibility = Column(String)  # high, medium, low
    extracted_location = Column(String)
    entities = Column(JSON)  # Named entities extracted
    
    processed_at = Column(DateTime(timezone=True), server_default=func.now())

class Hotspot(Base):
    __tablename__ = "hotspots"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    center_latitude = Column(Float, nullable=False)
    center_longitude = Column(Float, nullable=False)
    radius = Column(Float, nullable=False)
    hazard_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    report_count = Column(Integer, default=1)
    confidence_score = Column(Float, default=0.0)
    first_reported = Column(DateTime(timezone=True), server_default=func.now())
    last_updated = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
