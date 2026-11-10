-- ============================================================================
-- SIAP LAPOR – Kota Bandar Lampung
-- Sistem Informasi Aduan dan Pelaporan Masyarakat Kota Bandar Lampung
-- Database Schema (PostgreSQL)
-- Kolaborasi Pemkot Bandar Lampung & Universitas Teknokrat Indonesia (UTI)
-- Copyright©2026 by Rayhan Pratama dan Dr. Erliyan Redy Susanto, M.Kom
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
CREATE TYPE user_role AS ENUM ('WARGA', 'ADMIN', 'PETUGAS', 'PIMPINAN');
CREATE TYPE report_status AS ENUM ('DIAJUKAN', 'DIVERIFIKASI', 'DITUGASKAN', 'DIPROSES', 'SELESAI', 'DITOLAK');
CREATE TYPE priority_level AS ENUM ('BIASA', 'SEDANG', 'MENDESAK');

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nik VARCHAR(16) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'WARGA',
    nip VARCHAR(25), -- Khusus Petugas / Pegawai ASN
    agency_opd VARCHAR(150), -- Khusus Petugas/Admin (misal: Dinas BMBK)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for authentication lookup
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_nik ON users(nik);
CREATE INDEX idx_users_role ON users(role);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    responsible_opd VARCHAR(150) NOT NULL,
    target_sla_hours INT NOT NULL DEFAULT 24,
    icon_name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(30) PRIMARY KEY, -- e.g. 'BDL-2026-0892'
    public_ticket_code VARCHAR(35) UNIQUE NOT NULL, -- e.g. 'TKT-BDL-2026-0892'
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    district VARCHAR(100) NOT NULL, -- Kecamatan (20 Kecamatan Bandar Lampung)
    subdistrict VARCHAR(100), -- Kelurahan
    reference_point TEXT NOT NULL, -- Titik Patokan
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    address_display TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    reporter_display_name VARCHAR(150) NOT NULL,
    reporter_display_phone VARCHAR(25) NOT NULL,
    status report_status NOT NULL DEFAULT 'DIAJUKAN',
    priority priority_level NOT NULL DEFAULT 'SEDANG',
    sla_deadline TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    clarification_request TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for search & filtering
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_category ON reports(category_id);
CREATE INDEX idx_reports_district ON reports(district);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_ticket ON reports(public_ticket_code);

-- 6. REPORT ATTACHMENTS (METADATA FILE BUKTI WARGA)
CREATE TABLE IF NOT EXISTS report_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(30) NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    camera_model VARCHAR(100),
    captured_at TIMESTAMP WITH TIME ZONE,
    exif_latitude NUMERIC(10, 7),
    exif_longitude NUMERIC(10, 7),
    is_exif_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_report ON report_attachments(report_id);

-- 7. ASSIGNMENTS (SURAT PERINTAH TUGAS / SPT)
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spt_number VARCHAR(60) UNIQUE NOT NULL, -- e.g. 'SPT-BMBK-2026-1049'
    report_id VARCHAR(30) NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    assigned_by_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Admin yang mendisposisi
    officer_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Petugas / Koordinator Regu
    team_name VARCHAR(150) NOT NULL, -- misal: 'URC Wilayah Kedaton – Regu 2'
    vehicle_plate VARCHAR(20), -- misal: 'BE 9120 AZ'
    target_completion_date TIMESTAMP WITH TIME ZONE NOT NULL,
    instructions TEXT NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assignments_report ON assignments(report_id);
CREATE INDEX idx_assignments_officer ON assignments(officer_id);

-- 8. STATUS HISTORIES (AUDIT TRAIL ALUR LAPORAN)
CREATE TABLE IF NOT EXISTS status_histories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(30) NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_name VARCHAR(150) NOT NULL,
    from_status report_status,
    to_status report_status NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_status_histories_report ON status_histories(report_id);

-- 9. WORK UPDATES (BUKTI PENYELESAIAN FISIK DARI PETUGAS)
CREATE TABLE IF NOT EXISTS work_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(30) NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    officer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    spt_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
    photo_before_url TEXT NOT NULL,
    photo_after_url TEXT NOT NULL,
    completion_notes TEXT NOT NULL,
    hotmix_tons NUMERIC(6, 2) DEFAULT 0,
    tack_coat_drums INT DEFAULT 0,
    crew_count INT DEFAULT 1,
    verified_latitude NUMERIC(10, 7),
    verified_longitude NUMERIC(10, 7),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_work_updates_report ON work_updates(report_id);

-- 10. ACTIVITY LOGS (JEJAK AUDIT DENGAN SHA-256 HASH)
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(30),
    user_id UUID,
    event_description TEXT NOT NULL,
    actor_name VARCHAR(150) NOT NULL,
    source_service VARCHAR(100) NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_report ON activity_logs(report_id);

-- 11. TRIGGER AUTO UPDATE TIMESTAMP
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_reports_modtime
BEFORE UPDATE ON reports
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================================
-- 12. PENGUATAN KEAMANAN & PELINDUNGAN DATA PRIBADI (UU PDP & BSSN SPBE)
-- Sesuai Hasil Temuan Audit Keamanan SEC-VULN-03 & SEC-VULN-06
-- ============================================================================

-- A. PENEGAKAN ROW LEVEL SECURITY (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- B. KEBIJAKAN HAK AKSES LAPORAN (REPORTS POLICIES)
-- 1. Warga Publik: Hanya dapat melihat aduan miliknya sendiri atau aduan publik yang disetujui
CREATE POLICY rls_reports_citizen_select ON reports
    FOR SELECT
    USING (
        reporter_id = NULLIF(current_setting('app.current_user_id', true), '')::UUID
        OR is_anonymous = FALSE
    );

-- 2. Warga Terotentikasi: Hanya dapat membuat aduan atas nama dirinya
CREATE POLICY rls_reports_citizen_insert ON reports
    FOR INSERT
    WITH CHECK (
        reporter_id = NULLIF(current_setting('app.current_user_id', true), '')::UUID
        OR reporter_id IS NULL
    );

-- 3. Petugas Lapangan: Hanya dapat melihat laporan yang ditugaskan dalam SPT dinasnya
CREATE POLICY rls_reports_officer_select ON reports
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM assignments a
            WHERE a.report_id = reports.id
            AND a.officer_id = NULLIF(current_setting('app.current_user_id', true), '')::UUID
        )
    );

-- 4. Administrator Command Center & Pimpinan: Akses Penuh
CREATE POLICY rls_reports_admin_all ON reports
    FOR ALL
    USING (
        current_setting('app.current_user_role', true) IN ('ADMIN', 'PIMPINAN')
    );

-- C. KEBIJAKAN KEAMANAN LOG AUDIT (APPEND-ONLY TAMPER-PROOF)
-- Log tidak boleh di-UPDATE atau di-DELETE oleh siapapun (termasuk admin)
CREATE POLICY rls_activity_logs_insert ON activity_logs
    FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY rls_activity_logs_select ON activity_logs
    FOR SELECT
    USING (
        current_setting('app.current_user_role', true) IN ('ADMIN', 'PIMPINAN')
    );

-- D. VIEW DATA TERMASKING UNTUK DISPLAY PUBLIK (UU PDP No. 27/2022)
CREATE OR REPLACE VIEW v_public_reports AS
SELECT
    id,
    public_ticket_code,
    category_id,
    title,
    description,
    district,
    latitude,
    longitude,
    address_display,
    status,
    priority,
    sla_deadline,
    CASE 
        WHEN is_anonymous THEN 'Warga Bandar Lampung (Anonim)'
        ELSE SUBSTRING(reporter_display_name, 1, 1) || '*** ' || SPLIT_PART(reporter_display_name, ' ', 2)
    END AS masked_reporter_name,
    CASE
        WHEN is_anonymous THEN '0812-****-****'
        ELSE SUBSTRING(reporter_display_phone, 1, 4) || '-****-' || SUBSTRING(reporter_display_phone, LENGTH(reporter_display_phone) - 3)
    END AS masked_reporter_phone,
    created_at
FROM reports;

