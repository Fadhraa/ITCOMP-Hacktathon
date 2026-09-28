-- ============================================================
-- AquaGuard Coastal EWS & DLH Incident Response Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Table: sensor_nodes
CREATE TABLE IF NOT EXISTS sensor_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_code VARCHAR(30) UNIQUE NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: sensor_telemetry_logs
CREATE TABLE IF NOT EXISTS sensor_telemetry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_id UUID REFERENCES sensor_nodes(id) ON DELETE CASCADE,
    ph_level NUMERIC(4,2) NOT NULL,
    water_level_cm NUMERIC(5,1) NOT NULL,
    salinity_ppt NUMERIC(4,1) NOT NULL,
    status VARCHAR(20) NOT NULL,                  -- 'SAFE', 'WARNING', 'DANGER'
    action_directive TEXT NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_telemetry_sensor_time ON sensor_telemetry_logs(sensor_id, recorded_at DESC);

-- 3. Table: incident_reports
CREATE TABLE IF NOT EXISTS incident_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code VARCHAR(30) UNIQUE NOT NULL,
    reporter_phone VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status VARCHAR(20) DEFAULT 'PENDING',         -- 'PENDING', 'INVESTIGATING', 'RESOLVED'
    priority VARCHAR(10) DEFAULT 'MEDIUM',        -- 'LOW', 'MEDIUM', 'HIGH'
    correlation_score INTEGER DEFAULT 0,          -- 0 - 100 (%)
    correlated_sensor_id UUID REFERENCES sensor_nodes(id),
    officer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reports_status ON incident_reports(status);

-- 4. Table: alert_subscriptions
CREATE TABLE IF NOT EXISTS alert_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20),
    push_token TEXT,
    coastal_sector VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table: officer_profiles
CREATE TABLE IF NOT EXISTS officer_profiles (
    id UUID PRIMARY KEY, -- Nanti akan refer ke auth.users(id)
    full_name VARCHAR(100) NOT NULL,
    badge_number VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'OFFICER',       -- 'OFFICER', 'ADMIN'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for live synchronization between Petambak and DLH Command Center
ALTER PUBLICATION supabase_realtime ADD TABLE sensor_telemetry_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE incident_reports;

-- ============================================================
-- SEED DATA (Data Awal untuk Demo Hackathon)
-- ============================================================

-- Insert Sensor Nodes
INSERT INTO sensor_nodes (sensor_code, location_name, latitude, longitude) VALUES
('NODE-A04', 'Muara Tambak Delta Timur', -7.1245, 112.7891),
('NODE-B01', 'Estuari Pesisir Sektor Tengah', -7.1180, 112.7950),
('NODE-C02', 'Kanal Outfall Industri Barat', -7.1310, 112.7810)
ON CONFLICT (sensor_code) DO NOTHING;

-- Insert Initial Telemetry for NODE-A04 (Warning Scenario)
INSERT INTO sensor_telemetry_logs (sensor_id, ph_level, water_level_cm, salinity_ppt, status, action_directive, recorded_at)
SELECT 
    id, 
    5.40, 
    138.0, 
    22.5, 
    'WARNING', 
    'Tindakan Segera: Tutup pintu air primer tambak! Terdeteksi anomali keasaman air laut mendekati batas toleransi benur.',
    NOW()
FROM sensor_nodes WHERE sensor_code = 'NODE-A04'
LIMIT 1;

-- Insert Initial Telemetry for NODE-B01 (Normal State)
INSERT INTO sensor_telemetry_logs (sensor_id, ph_level, water_level_cm, salinity_ppt, status, action_directive, recorded_at)
SELECT 
    id, 
    7.40, 
    85.0, 
    24.0, 
    'SAFE', 
    'Kondisi air normal. Pintu air aman dibuka sesuai jadwal pasang surut.',
    NOW()
FROM sensor_nodes WHERE sensor_code = 'NODE-B01'
LIMIT 1;

-- Insert Sample Citizen Incident Report
INSERT INTO incident_reports (
    ticket_code, 
    reporter_phone, 
    description, 
    image_url, 
    latitude, 
    longitude, 
    status, 
    priority, 
    correlation_score, 
    officer_notes
) VALUES (
    'TK-2026-0925-081',
    '+6281278901234',
    'Terlihat pembuangan cairan hitam berbusa pekat dan berbau menyengat dari saluran pembuangan pabrik kimia saat air laut mulai pasang.',
    'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
    -7.1250,
    112.7885,
    'PENDING',
    'HIGH',
    94,
    'Disposisi ke Tim PPNS Lingkungan Hidup Sektor Delta Timur untuk uji sampel laboratorium.'
) ON CONFLICT (ticket_code) DO NOTHING;
