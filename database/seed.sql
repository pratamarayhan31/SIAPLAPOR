-- ============================================================================
-- SIAP LAPOR – Kota Bandar Lampung
-- Initial Seed Data (PostgreSQL)
-- ============================================================================

-- 1. SEED USERS (Password default hashed argon2 / sha256 mock)
INSERT INTO users (id, nik, full_name, email, phone_number, password_hash, role, nip, agency_opd)
VALUES 
(
    'a0000000-0000-0000-0000-000000000001',
    '1871010101900001',
    'Admin Command Center',
    'admin.commandcenter@bandarlampungkota.go.id',
    '08117200112',
    '$argon2id$v=19$m=19456,t=2,p=1$mockadminhash$abcdefghijklmnopqrstuvwxyz123456',
    'ADMIN',
    '198501012010011001',
    'Dinas Komunikasi dan Informatika (Diskominfo)'
),
(
    'a0000000-0000-0000-0000-000000000002',
    '1871021504880003',
    'Ahmad Fauzi',
    'ahmad.fauzi@bandarlampungkota.go.id',
    '081272004491',
    '$argon2id$v=19$m=19456,t=2,p=1$mockofficerhash$abcdefghijklmnopqrstuvwxyz123456',
    'PETUGAS',
    '19880415 201201 1 003',
    'Dinas Bina Marga & Bina Konstruksi (BMBK)'
),
(
    'a0000000-0000-0000-0000-000000000003',
    '1871032410980005',
    'Rahmat Hidayat',
    'rahmat.hidayat@gmail.com',
    '081278904491',
    '$argon2id$v=19$m=19456,t=2,p=1$mockwargahash$abcdefghijklmnopqrstuvwxyz123456',
    'WARGA',
    NULL,
    NULL
)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED CATEGORIES
INSERT INTO categories (id, name, responsible_opd, target_sla_hours, icon_name, description)
VALUES 
('cat-jalan', 'Jalan Rusak & Lubang', 'Dinas Bina Marga & Bina Konstruksi (BMBK)', 24, 'construction', 'Aspal berlubang, amblas, jembatan rusak, dan trotoar pecah.'),
('cat-sampah', 'Sampah & TPS Liar', 'Dinas Lingkungan Hidup (DLH)', 12, 'delete_sweep', 'Penumpukan sampah liar, TPS meluap, dan pembersihan sungai/saluran.'),
('cat-pju', 'Lampu PJU Padam', 'Dinas Perhubungan (Dishub)', 24, 'lightbulb', 'Penerangan Jalan Umum mati, tiang miring, atau korsleting kabel PJU.'),
('cat-drainase', 'Drainase & Genangan Air', 'Dinas SDA & Pemukiman', 48, 'water_damage', 'Saluran tersumbat sedimen lumpur, gorong-gorong pecah, dan genangan jalan.'),
('cat-taman', 'Taman & Fasilitas Kota', 'Dinas Perumahan & Kawasan Permukiman', 48, 'park', 'Pohon pelindung rawan tumbang, bangku taman rusak, dan fasilitas publik.'),
('cat-trantibum', 'Ketertiban & Trantibum', 'Satpol PP Kota Bandar Lampung', 6, 'local_police', 'Gangguan ketertiban umum, PKL menutup akses vital, dan pelanggaran perda.')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED PRIMARY REPORT: BDL-2026-0892 (SIMPANG MBK)
INSERT INTO reports (
    id, public_ticket_code, reporter_id, category_id, title, description,
    district, subdistrict, reference_point, latitude, longitude, address_display,
    is_anonymous, reporter_display_name, reporter_display_phone, status, priority,
    sla_deadline, created_at
)
VALUES (
    'BDL-2026-0892',
    'TKT-BDL-2026-0892',
    'a0000000-0000-0000-0000-000000000003',
    'cat-jalan',
    'Aspal Amblas & Lubang Berdiameter 40cm Dekat Lampu Merah MBK',
    'Terdapat lubang jalan cukup dalam (sekitar 12-15 cm) akibat hujan deras semalam di lajur kiri mengarah Rajabasa, tepat 50 meter sebelum lampu merah simpang Mall Boemi Kedaton. Pagi ini sudah ada 2 pengendara motor hampir terjatuh saat jam sibuk kerja karena menghindari lubang secara mendadak. Mohon segera ditindaklanjuti penambalan aspal darurat hotmix oleh dinas PU sebelum timbul korban kecelakaan fatal.',
    'Kedaton',
    'Labuhan Ratu',
    'Sekitar 50 meter sebelum lampu merah simpang Mall Boemi Kedaton, seberang halte bus',
    -5.3789000,
    105.2514000,
    'Jl. ZA. Pagar Alam, Labuhan Ratu, Kec. Kedaton, Kota Bandar Lampung',
    FALSE,
    'Rahmat Hidayat',
    '0812-****-4491',
    'DIAJUKAN',
    'MENDESAK',
    CURRENT_TIMESTAMP + INTERVAL '45 minutes',
    CURRENT_TIMESTAMP - INTERVAL '2 hours'
)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED REPORT ATTACHMENT FOR BDL-2026-0892
INSERT INTO report_attachments (
    report_id, file_name, file_size_bytes, file_url, mime_type,
    camera_model, captured_at, exif_latitude, exif_longitude, is_exif_verified
)
VALUES (
    'BDL-2026-0892',
    'pothole_mbk_kedaton_01.jpg',
    1845200,
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    'image/jpeg',
    'Xiaomi 13T (24mm f/1.9)',
    CURRENT_TIMESTAMP - INTERVAL '2 hours 15 minutes',
    -5.3789000,
    105.2514000,
    TRUE
);

-- 5. SEED STATUS HISTORY
INSERT INTO status_histories (report_id, actor_id, actor_name, from_status, to_status, notes, created_at)
VALUES (
    'BDL-2026-0892',
    'a0000000-0000-0000-0000-000000000003',
    'Rahmat Hidayat (Warga)',
    NULL,
    'DIAJUKAN',
    'Laporan diajukan melalui portal web SIAP LAPOR dengan koordinat GPS terverifikasi.',
    CURRENT_TIMESTAMP - INTERVAL '2 hours'
);

-- 6. SEED ACTIVITY LOG
INSERT INTO activity_logs (report_id, event_description, actor_name, source_service, sha256_hash)
VALUES (
    'BDL-2026-0892',
    'Laporan diterima dari warga terotentikasi NIK Dukcapil',
    'Sistem Otomasi SPBE',
    'Gateway SIAP LAPOR',
    '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
);
