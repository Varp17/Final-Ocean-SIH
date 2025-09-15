-- Initial database schema for Atlas-Alert platform
-- PostGIS extension for spatial data
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('citizen', 'analyst', 'admin')),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    reputation_score DECIMAL(3,2) DEFAULT 5.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hazard reports table
CREATE TABLE hazard_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hazard_type VARCHAR(50) NOT NULL CHECK (hazard_type IN ('tsunami', 'high_waves', 'coastal_flooding', 'abnormal_tides', 'suspicious_activity', 'other')),
    location GEOMETRY(POINT, 4326) NOT NULL,
    address TEXT,
    description TEXT,
    media_urls TEXT[],
    threat_confidence DECIMAL(3,1) CHECK (threat_confidence >= 0 AND threat_confidence <= 10),
    urgency_level VARCHAR(20) NOT NULL CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'resolved')),
    verified_by UUID REFERENCES users(id),
    verification_notes TEXT,
    client_report_id VARCHAR(255), -- For offline sync
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live locations table
CREATE TABLE live_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location GEOMETRY(POINT, 4326) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safe zones table
CREATE TABLE safe_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    geometry GEOMETRY(POLYGON, 4326) NOT NULL,
    zone_type VARCHAR(20) NOT NULL CHECK (zone_type IN ('safe', 'danger', 'warning', 'evacuation')),
    description TEXT,
    capacity INTEGER,
    facilities TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('info', 'warning', 'danger', 'critical')),
    affected_areas TEXT[],
    affected_geometry GEOMETRY(MULTIPOLYGON, 4326),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    broadcast_sent BOOLEAN DEFAULT false,
    broadcast_count INTEGER DEFAULT 0
);

-- Social media posts table
CREATE TABLE social_media_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('twitter', 'youtube', 'facebook', 'instagram')),
    post_id VARCHAR(255) NOT NULL,
    user_handle VARCHAR(255),
    text TEXT NOT NULL,
    location GEOMETRY(POINT, 4326),
    hashtags TEXT[],
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    hazard_type VARCHAR(50),
    threat_confidence DECIMAL(3,1),
    good_info_probability DECIMAL(3,2),
    urgency_score DECIMAL(3,2),
    location_verified BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'raw' CHECK (status IN ('raw', 'processed', 'verified', 'rejected')),
    verified_by UUID REFERENCES users(id),
    verification_notes TEXT,
    UNIQUE(platform, post_id)
);

-- Hotspots table
CREATE TABLE hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_location GEOMETRY(POINT, 4326) NOT NULL,
    convex_hull GEOMETRY(POLYGON, 4326),
    radius_meters INTEGER NOT NULL,
    report_count INTEGER NOT NULL,
    social_post_count INTEGER DEFAULT 0,
    avg_threat_confidence DECIMAL(3,1),
    dominant_hazard_type VARCHAR(50),
    urgency_level VARCHAR(20),
    detection_algorithm VARCHAR(50) DEFAULT 'ST-DBSCAN',
    algorithm_params JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_hazard_reports_location ON hazard_reports USING GIST (location);
CREATE INDEX idx_hazard_reports_created_at ON hazard_reports (created_at DESC);
CREATE INDEX idx_hazard_reports_status ON hazard_reports (status);
CREATE INDEX idx_hazard_reports_hazard_type ON hazard_reports (hazard_type);
CREATE INDEX idx_hazard_reports_user_id ON hazard_reports (user_id);

CREATE INDEX idx_live_locations_location ON live_locations USING GIST (location);
CREATE INDEX idx_live_locations_timestamp ON live_locations (timestamp DESC);
CREATE INDEX idx_live_locations_user_id ON live_locations (user_id);
CREATE INDEX idx_live_locations_is_active ON live_locations (is_active);

CREATE INDEX idx_safe_zones_geometry ON safe_zones USING GIST (geometry);
CREATE INDEX idx_safe_zones_zone_type ON safe_zones (zone_type);
CREATE INDEX idx_safe_zones_is_active ON safe_zones (is_active);

CREATE INDEX idx_alerts_created_at ON alerts (created_at DESC);
CREATE INDEX idx_alerts_is_active ON alerts (is_active);
CREATE INDEX idx_alerts_alert_type ON alerts (alert_type);
CREATE INDEX idx_alerts_affected_geometry ON alerts USING GIST (affected_geometry);

CREATE INDEX idx_social_media_posts_location ON social_media_posts USING GIST (location);
CREATE INDEX idx_social_media_posts_created_at ON social_media_posts (created_at DESC);
CREATE INDEX idx_social_media_posts_platform ON social_media_posts (platform);
CREATE INDEX idx_social_media_posts_status ON social_media_posts (status);
CREATE INDEX idx_social_media_posts_hazard_type ON social_media_posts (hazard_type);

CREATE INDEX idx_hotspots_location ON hotspots USING GIST (center_location);
CREATE INDEX idx_hotspots_created_at ON hotspots (created_at DESC);
CREATE INDEX idx_hotspots_is_active ON hotspots (is_active);

CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs (resource_type);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hazard_reports_updated_at BEFORE UPDATE ON hazard_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_safe_zones_updated_at BEFORE UPDATE ON safe_zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotspots_updated_at BEFORE UPDATE ON hotspots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
