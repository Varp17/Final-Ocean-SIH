-- Seed data for Atlas-Alert platform development and testing

-- Insert sample users
INSERT INTO users (id, email, role, name, phone, reputation_score) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@atlasalert.com', 'admin', 'System Administrator', '+91-9876543210', 10.0),
('550e8400-e29b-41d4-a716-446655440002', 'analyst@atlasalert.com', 'analyst', 'Marine Analyst', '+91-9876543211', 8.5),
('550e8400-e29b-41d4-a716-446655440003', 'citizen1@example.com', 'citizen', 'Rajesh Kumar', '+91-9876543212', 7.2),
('550e8400-e29b-41d4-a716-446655440004', 'citizen2@example.com', 'citizen', 'Priya Sharma', '+91-9876543213', 6.8),
('550e8400-e29b-41d4-a716-446655440005', 'responder@coast.gov.in', 'analyst', 'Coast Guard Officer', '+91-9876543214', 9.1);

-- Insert sample safe zones (major Indian coastal cities)
INSERT INTO safe_zones (id, name, geometry, zone_type, description, capacity, facilities, created_by) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    'Mumbai Safe Harbor',
    ST_GeomFromText('POLYGON((72.8 19.0, 72.9 19.0, 72.9 19.1, 72.8 19.1, 72.8 19.0))', 4326),
    'safe',
    'Primary evacuation center for Mumbai coastal area',
    5000,
    ARRAY['Medical facility', 'Food distribution', 'Communication center'],
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    'Chennai Coastal Safety Zone',
    ST_GeomFromText('POLYGON((80.2 13.0, 80.3 13.0, 80.3 13.1, 80.2 13.1, 80.2 13.0))', 4326),
    'safe',
    'Emergency shelter for Chennai region',
    3000,
    ARRAY['Emergency supplies', 'First aid', 'Transportation hub'],
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    '660e8400-e29b-41d4-a716-446655440003',
    'Kochi Warning Zone',
    ST_GeomFromText('POLYGON((76.2 9.9, 76.3 9.9, 76.3 10.0, 76.2 10.0, 76.2 9.9))', 4326),
    'warning',
    'Moderate risk area - monitor conditions',
    NULL,
    ARRAY['Weather monitoring', 'Early warning system'],
    '550e8400-e29b-41d4-a716-446655440001'
);

-- Insert sample hazard reports
INSERT INTO hazard_reports (id, user_id, hazard_type, location, address, description, threat_confidence, urgency_level, status) VALUES
(
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440003',
    'high_waves',
    ST_GeomFromText('POINT(72.8258 18.9750)', 4326),
    'Marine Drive, Mumbai',
    'Unusually high waves observed, water splashing over seawall',
    7.5,
    'high',
    'verified'
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440004',
    'coastal_flooding',
    ST_GeomFromText('POINT(80.2785 13.0878)', 4326),
    'Marina Beach, Chennai',
    'Water level rising rapidly, flooding nearby roads',
    8.2,
    'critical',
    'verified'
),
(
    '770e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    'abnormal_tides',
    ST_GeomFromText('POINT(76.2673 9.9312)', 4326),
    'Fort Kochi Beach',
    'Tide patterns seem unusual, much higher than predicted',
    6.1,
    'medium',
    'pending'
);

-- Insert sample social media posts
INSERT INTO social_media_posts (id, platform, post_id, user_handle, text, location, hashtags, created_at, hazard_type, threat_confidence, good_info_probability, status) VALUES
(
    '880e8400-e29b-41d4-a716-446655440001',
    'twitter',
    'tweet_123456789',
    '@mumbai_resident',
    'Massive waves hitting Marine Drive right now! Water everywhere #OceanRanger #Mumbai #HighWaves',
    ST_GeomFromText('POINT(72.8258 18.9750)', 4326),
    ARRAY['#OceanRanger', '#Mumbai', '#HighWaves'],
    NOW() - INTERVAL '2 hours',
    'high_waves',
    7.8,
    0.85,
    'verified'
),
(
    '880e8400-e29b-41d4-a716-446655440002',
    'twitter',
    'tweet_987654321',
    '@chennai_fisher',
    'Strange tide behavior at Marina Beach today. Much higher than usual. #SeaGuardian #Chennai',
    ST_GeomFromText('POINT(80.2785 13.0878)', 4326),
    ARRAY['#SeaGuardian', '#Chennai'],
    NOW() - INTERVAL '1 hour',
    'abnormal_tides',
    6.5,
    0.72,
    'processed'
);

-- Insert sample alerts
INSERT INTO alerts (id, title, message, alert_type, affected_areas, created_by, expires_at) VALUES
(
    '990e8400-e29b-41d4-a716-446655440001',
    'High Wave Warning - Mumbai Coast',
    'Unusually high waves reported along Mumbai coastline. Avoid beach areas and waterfront. Emergency services on standby.',
    'warning',
    ARRAY['Mumbai', 'Thane', 'Navi Mumbai'],
    '550e8400-e29b-41d4-a716-446655440001',
    NOW() + INTERVAL '6 hours'
),
(
    '990e8400-e29b-41d4-a716-446655440002',
    'Coastal Flooding Alert - Chennai',
    'CRITICAL: Rapid water level rise detected at Marina Beach. Immediate evacuation recommended for low-lying coastal areas.',
    'critical',
    ARRAY['Chennai', 'Kanchipuram'],
    '550e8400-e29b-41d4-a716-446655440001',
    NOW() + INTERVAL '12 hours'
);

-- Insert sample hotspots
INSERT INTO hotspots (id, center_location, radius_meters, report_count, avg_threat_confidence, dominant_hazard_type, urgency_level) VALUES
(
    'aa0e8400-e29b-41d4-a716-446655440001',
    ST_GeomFromText('POINT(72.8258 18.9750)', 4326),
    1500,
    5,
    7.8,
    'high_waves',
    'high'
),
(
    'aa0e8400-e29b-41d4-a716-446655440002',
    ST_GeomFromText('POINT(80.2785 13.0878)', 4326),
    2000,
    3,
    8.1,
    'coastal_flooding',
    'critical'
);

-- Insert sample live locations (recent activity)
INSERT INTO live_locations (user_id, location, timestamp, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440003', ST_GeomFromText('POINT(72.8300 18.9800)', 4326), NOW() - INTERVAL '5 minutes', true),
('550e8400-e29b-41d4-a716-446655440004', ST_GeomFromText('POINT(80.2800 13.0900)', 4326), NOW() - INTERVAL '3 minutes', true),
('550e8400-e29b-41d4-a716-446655440005', ST_GeomFromText('POINT(76.2700 9.9350)', 4326), NOW() - INTERVAL '1 minute', true);
