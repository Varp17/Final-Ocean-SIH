"""
SQLAlchemy ORM models with PostGIS support
Atlas-Alert database schema
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography
from geoalchemy2.elements import WKTElement
import uuid
from sqlalchemy.dialects.postgresql import UUID

from ..database import Base


# -------------------- Helper Functions --------------------
def point(lat: float, lon: float) -> WKTElement:
    """Convert latitude and longitude to PostGIS POINT"""
    return WKTElement(f"POINT({lon} {lat})", srid=4326)


def polygon(wkt: str) -> WKTElement:
    """Convert WKT polygon string to PostGIS polygon"""
    return WKTElement(wkt, srid=4326)


# -------------------- Models --------------------
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255))
    email = Column(String(255), unique=True, index=True)
    phone_hash = Column(String(255))
    role = Column(String(50), default="citizen")
    credibility_score = Column(Float, default=0.5)
    last_known_lat = Column(Float)
    last_known_lon = Column(Float)
    last_known_geom = Column(Geography('POINT', srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    reports = relationship("Report", back_populates="user")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    source = Column(String(50))
    hazard_type = Column(String(100))
    description = Column(Text)
    media_url = Column(String(500))
    lat = Column(Float)
    lon = Column(Float)
    geom = Column(Geography('POINT', srid=4326))
    severity = Column(String(20), default="medium")
    confidence = Column(Float, default=0.0)
    verified = Column(Boolean, default=False)
    status = Column(String(50), default="pending")
    report_scores = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="reports")
    alerts = relationship("Alert", back_populates="report")


class SocialPost(Base):
    __tablename__ = "social_posts"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String(50))
    post_id = Column(String(255))
    author_handle = Column(String(255))
    text = Column(Text)
    posted_at = Column(DateTime(timezone=True))
    lat = Column(Float)
    lon = Column(Float)
    geom = Column(Geography('POINT', srid=4326))
    relevance = Column(Float, default=0.0)
    urgency = Column(Float, default=0.0)
    credibility = Column(Float, default=0.5)
    hazard_type = Column(String(100))
    keywords = Column(ARRAY(String))
    processed = Column(Boolean, default=False)
    outreach_sent = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Zone(Base):
    __tablename__ = "zones"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(20))
    name = Column(String(255))
    geom = Column(Geography('POLYGON', srid=4326))
    zone_metadata = Column(JSON)
    avg_confidence = Column(Float)
    report_count = Column(Integer, default=0)
    radius_km = Column(Float)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    alerts = relationship("Alert", back_populates="zone")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=True)
    message = Column(Text)
    channels = Column(ARRAY(String))
    status = Column(String(50), default="pending")
    authority_notified = Column(Boolean, default=False)
    sms_count = Column(Integer, default=0)
    issued_at = Column(DateTime(timezone=True), server_default=func.now())

    zone = relationship("Zone", back_populates="alerts")
    report = relationship("Report", back_populates="alerts")


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    phone = Column(String(20))
    assigned_zone_id = Column(Integer, ForeignKey("zones.id"), nullable=True)
    status = Column(String(50), default="available")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    live_locations = relationship("LiveLocation", back_populates="team")


class LiveLocation(Base):
    __tablename__ = "live_locations"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    lat = Column(Float)
    lon = Column(Float)
    geom = Column(Geography('POINT', srid=4326))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    team = relationship("Team", back_populates="live_locations")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    action = Column(String(255))
    resource_type = Column(String(100))
    resource_id = Column(String(100))
    details = Column(JSON)
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class SocialOutreach(Base):
    __tablename__ = "social_outreach"

    id = Column(Integer, primary_key=True, index=True)
    social_post_id = Column(Integer, ForeignKey("social_posts.id"))
    outreach_type = Column(String(50))
    status = Column(String(50), default="pending")
    message_sent = Column(Text)
    response_received = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    responded_at = Column(DateTime(timezone=True))
