# SIAP LAPOR – Kota Bandar Lampung

**Sistem Informasi Aduan dan Pelaporan Masyarakat Kota Bandar Lampung**
Kolaborasi Pemerintah Kota Bandar Lampung & Universitas Teknokrat Indonesia (UTI)
Versi: v1.4 – Smart Governance Pemkot Bandar Lampung & UTI
Copyright©2026 by Rayhan Pratama dan Dr. Erliyan Redy Susanto, M.Kom

---

## Daftar Halaman

1. Landing Page Publik
2. Formulir Buat Laporan Pengaduan Warga
3. Dashboard Ringkasan Admin
4. Verifikasi & Penugasan Pengaduan (Admin)
5. Dashboard Petugas Lapangan

## Catatan Teknis Umum

- Tech stack: HTML, Tailwind CSS (CDN), Google Fonts (Plus Jakarta Sans, JetBrains Mono), Material Symbols Outlined.
- Bahasa antarmuka: Indonesia (`lang="id"`).
- Palet warna: primary `#002548`, primary-container `#173b63`, secondary `#2060a3`, tertiary `#002a26`, error `#ba1a1a`, background `#f8f9ff`.
- Halaman publik (shell `web_standard`): header tetap di atas, tinggi 80px, konten maks. 1280px.
- Halaman dashboard (shell `web_dashboard`): sidebar tetap lebar 288px (`w-72`), header tetap di atas.
- Format nomor tiket: `BDL-2026-XXXX` (internal/admin) dan `TKT-BDL-2026-XXX` (publik).
- Format nomor SPT: `SPT-BMBK-2026-1049`.

---

# 1. Landing Page Publik

**Judul:** Landing Page Publik SIAP LAPOR Kota Bandar Lampung

## Header & Navigasi

Logo Pemkot Bandar Lampung dan Logo UTI, nama sistem "SIAP LAPOR" dengan subjudul "Kota Bandar Lampung - Smart City Service".

Menu: Beranda, Lacak Aduan, Kategori Layanan, Statistik, Panduan, Hubungi Kami.

## Banner Atas

- Kanal Resmi Pelayanan Publik | Kolaborasi Pemkot Bandar Lampung & Universitas Teknokrat Indonesia
- Data Pelapor Terlindungi & Terenkripsi
- Layanan Siaga 24 Jam: **112**

## Hero Section

**Headline:** Suarakan Aspirasi, Bangun Kota Bandar Lampung Bersama SIAP LAPOR

**Deskripsi:** Kanal resmi pelaporan fasilitas umum dan lingkungan secara cepat, transparan, dan terintegrasi untuk mewujudkan Bandar Lampung yang nyaman, tanggap darurat, dan modern.

**Tombol aksi:**
- Buat Laporan Sekarang
- Panduan & SOP

**Widget Lacak Tiket Mandiri**
- Input nomor tiket (contoh: `TKT-2026-BDL-0891`)
- Tombol "Lacak Status"
- Contoh uji cepat: `#TKT-BDL-2026-102`, `#TKT-BDL-2026-115`

**Kartu Statistik Tindak Lanjut Aktif**

| Indikator | Nilai | Keterangan |
|---|---|---|
| Total Laporan | 4.829 | Sejak Januari 2026 |
| Selesai Tuntas | 4.412 | 91.4% Tingkat Sukses |
| Rata-rata Durasi Penanganan | 24 - 48 Jam | Standar Pelayanan Prima |

Peta mini: "Pemantauan Lapangan 20 Kecamatan" – status ONLINE.

## Kategori Layanan Pengaduan Publik

| # | Kategori | OPD Penanggung Jawab | Laporan Aktif | Target Tindak |
|---|---|---|---|---|
| 1 | Jalan Rusak & Lubang | Dinas Bina Marga & Bina Konstruksi | 142 | 24 Jam |
| 2 | Sampah & TPS Liar | Dinas Lingkungan Hidup (DLH) | 89 | 12 Jam |
| 3 | Lampu PJU Padam | Dinas Perhubungan (Dishub) | 63 | 24 Jam |
| 4 | Drainase & Genangan Air | Dinas SDA & Pemukiman | 37 | 48 Jam |
| 5 | Taman & Fasilitas Kota | Dinas Perumahan & Kawasan Permukiman | 21 | 48 Jam |
| 6 | Ketertiban & Trantibum | Satpol PP | 18 | Sigap 6 Jam |

Setiap kartu memiliki tautan "Lapor Kategori Ini".

## Alur 5 Tahap Pengaduan Warga

| Tahap | Status | Penjelasan | Keterangan |
|---|---|---|---|
| 01 | Diajukan | Warga mengisi formulir digital, menyematkan pin GPS, dan mengunggah foto bukti | Status kode: DIAJUKAN |
| 02 | Diverifikasi | Tim administrator Diskominfo memvalidasi data dan kelengkapan dokumen | Maksimal 3 jam kerja |
| 03 | Ditugaskan | Disposisi SPT dikirim ke pimpinan OPD dan koordinator lapangan | Integrasi OPD otomatis |
| 04 | Diproses | Regu teknisi diterjunkan ke lokasi | Estimasi 1 - 2 hari |
| 05 | Selesai | Pekerjaan rampung disertai dokumentasi; pelapor menerima notifikasi | Arsip tertutup & selesai |

**Status alternatif – Ditolak:** laporan dapat ditolak bila mengandung hoaks, duplikasi, di luar yurisdiksi Kota Bandar Lampung, atau minim bukti visual. Tersedia tautan "Pelajari Kriteria Validasi".

## Laporan Publik Terkini

Filter: Semua, Selesai, Diproses.

| Tiket | Judul | Status | Pelaksana | Lokasi |
|---|---|---|---|---|
| #TKT-BDL-2026-102 | Perbaikan Jalan Berlubang Raden Intan | Selesai ditangani (durasi 1 hari) | URC Dinas Bina Marga | Kec. Enggal |
| #TKT-BDL-2026-115 | Pembersihan Sampah Liar & Drainase | Sedang diproses | Regu Kuning DLH (2 dump truck) | Kec. Way Halim |
| #TKT-BDL-2026-121 | Penggantian Lampu PJU ZA Pagar Alam | Ditugaskan ke Dishub (jadwal malam ini) | Tim teknis Dishub | Kec. Kedaton |

Tombol "Lihat Detail" membuka modal status tiket. Tersedia tautan "Buka Dashboard Seluruh Pengaduan Warga (Publik)".

## Banner Kolaborasi Riset

**Judul:** Inovasi Sivitas Akademika UTI untuk Transformasi Kota Cerdas Bandar Lampung

Platform dikembangkan melalui sinergi Pemkot Bandar Lampung dengan peneliti dan talenta muda UTI (Kampus Sang Juara).

Sorotan: **100%** Karya Mandiri Putra Daerah · **ISO 27001** Prinsip Keamanan Siber · **Real-time** Sinkronisasi Tiket OPD.

Disupervisi oleh Rayhan Pratama dan Dr. Erliyan Redy Susanto, M.Kom. Tombol: "Baca Dokumen Kerja Sama".

## FAQ

1. **Apakah identitas pelapor dijamin kerahasiaannya?** Ya. Tersedia opsi "Lapor Secara Anonim / Rahasia"; NIK, nama, dan kontak hanya diverifikasi sistem terenkripsi dan tidak ditampilkan ke publik maupun petugas lapangan.
2. **Berapa lama batas waktu SOP?** Verifikasi administrasi maks. 3 jam kerja; tindak lanjut fisik rata-rata 24-48 jam. Kondisi darurat ditangani tim siaga 112.
3. **Bagaimana memeriksa progres?** Masukkan nomor tiket pada kolom pencarian atau menu Lacak Aduan; foto sebelum dan sesudah penanganan dapat dilihat.
4. **Apa yang dilakukan jika laporan ditolak?** Admin menyertakan alasan transparan; warga dapat mengajukan laporan baru dengan lokasi dan foto yang lebih spesifik.

**Callout darurat:** Telepon 112 (Siaga 24 Jam).

## Perilaku Interaktif (JavaScript)

- `quickFill(ticket)` – mengisi kolom pencarian dan langsung melacak.
- `trackTicketModal()` – validasi input kosong, lalu menampilkan modal:
  - mengandung `102` → status **Selesai Tuntas** (hotmix 4 cm).
  - mengandung `115` → status **Sedang Diproses** (estimasi 3 jam).
  - lainnya → **Tercatat dalam Sistem** (tahap verifikasi berkas).
- `viewReportDetail(ticket)`, `closeModal()`, `toggleFaq(num)` (accordion dengan rotasi ikon).

## Footer

- WhatsApp Aduan: +62 811-7200-112
- Email: pengaduan@bandarlampungkota.go.id
- Sekretariat: Gedung PTSP Pemkot Bandar Lampung, Jl. Drs. Warsito No. 1, Teluk Betung, Kota Bandar Lampung, Lampung 35211
- Pusat Riset Smart City UTI: Jl. H. ZA. Pagar Alam No. 9-11, Kedaton

---

# 2. Formulir Buat Laporan Pengaduan Warga

**Judul:** Formulir Aspirasi & Pengaduan Fasilitas Publik

## Header Halaman

Metrik ringkas: **Rerata Respon OPD** 1x24 Jam · **Tingkat Penanganan** 94.8% (1.482 tuntas).

## Indikator Langkah

1. Informasi Pelaporan (aktif)
2. Lokasi & Titik Acuan
3. Bukti Lampiran

## Kolom Formulir

| Bagian | Field | Keterangan / Contoh Isi |
|---|---|---|
| Kategori Laporan * | Pilihan (pill) | Jalan Rusak (aktif), Sampah Menumpuk, Lampu PJU Mati, Drainase Tersumbat, Fasilitas Umum, Lain-lain / Aspirasi |
| Judul Singkat * | Teks | "Lubang Aspal Sedalam 15cm di dekat Bundaran Hajimena" (5-10 kata) |
| Deskripsi Lengkap * | Textarea, maks. 500 karakter | Penghitung karakter dinamis; tidak boleh memuat kata kasar, SARA, atau data pribadi pihak lain |
| Kecamatan | Dropdown | Rajabasa (terpilih), Kedaton, Tanjung Karang Pusat/Barat/Timur, Teluk Betung Selatan/Utara/Barat/Timur, Way Halim, Sukarame, Kemiling, Labuhan Ratu, Enggal, Panjang, Bumi Waras |
| Titik Acuan | Teks | "Sekitar 50 meter sebelum gapura selamat datang, seberang ruko" |
| Geotagging | Peta + tombol "Gunakan Titik Lokasi Saya" | Koordinat -5.3824, 105.2578; Jl. ZA. Pagar Alam - Rajabasa; akurasi ±4 meter |
| Bukti Foto * | Dropzone | JPG/JPEG/PNG, maks. 3 foto, 5 MB per berkas; contoh `pothole_rajabasa_01.jpg` (1.8 MB, terverifikasi EXIF) |
| Lapor Anonim | Toggle | Aktif; nama hanya diketahui verifikator Pemkot |

**Tombol kirim:** Kirim Laporan Pengaduan (tiket resmi terbit otomatis setelah dikirim).

**Keamanan:** data identitas dilindungi enkripsi standar SPBE serta ketentuan UU ITE / Perlindungan Data Pribadi RI.

## Sidebar

1. **Lacak Tiket Instan** – input nomor tiket (contoh `BDL-2026-089`), tombol "Cek Progres Laporan".
2. **Aduan Anda Sebelumnya** (4 total)
   - `#TKT-BDL-2026-089` – Lampu PJU Padam di Jl. Teuku Umar – **Diproses** – Dinas Perhubungan
   - `#TKT-BDL-2026-042` – Tumpukan Sampah Liar Pasar Bawah – **Selesai** – Dinas Lingkungan Hidup
3. **Tips Cepat Ditindaklanjuti**
   1. Ambil foto jelas di siang hari.
   2. Pastikan GPS aktif.
   3. Hindari laporan ganda; cek peta aduan terlebih dahulu.
4. **Kejadian Darurat Kota?** – Call Center 112 dan WhatsApp Aduan Cepat 24 Jam +62 811-7200-112.

## Perilaku Interaktif

- Pemilihan kategori mengubah gaya pill aktif beserta ikonnya.
- Penghitung karakter deskripsi (`n/500 karakter`) berubah merah bila lebih dari 500.

---

# 3. Dashboard Ringkasan Admin

**Judul:** Selamat bertugas, Administrator Command Center
**Tanggal:** Kamis, 24 Oktober 2026 · Server SPBE aktif, sinkronisasi real-time

## Sidebar Admin (Admin Portal BDL)

| Grup | Menu |
|---|---|
| Utama | Dashboard Ringkasan (aktif), Verifikasi & Penugasan (12 Baru), Manajemen Seluruh Aduan |
| Operasional | Petugas Lapangan, Kategori Layanan, Master Wilayah |
| Sistem & Laporan | Manajemen Pengguna, Ekspor & Rekapitulasi, Log Aktivitas Audit |

Profil: Admin Utama – Diskominfo BDL.

## Kontrol Header

- Periode: 7 Hari Terakhir / **Bulan Ini (Oktober 2026)** / Tahun Berjalan 2026
- Tombol: Unduh Ringkasan PDF/CSV, Refresh Data, Input Laporan, Ekspor CSV

## Kartu Metrik

| Metrik | Nilai | Detail |
|---|---|---|
| Total Aduan Masuk | 4.829 | +12% bulan lalu; rerata 158 aduan/hari |
| Menunggu Verifikasi | 34 | 8 urgent (<3 jam); prioritas PJU & Jalan: 21 antrean |
| Sedang Ditangani | 383 | BMBK 142, DLH 120, Dishub 78; Satpol PP & lainnya 43 |
| Selesai & Tertangani | 4.412 | 91.3% rasio; kepuasan 94.8%; SLA on-time 96.2% |

## Antrean Laporan Perlu Verifikasi Cepat

(4 memerlukan tindakan segera)

| No. Tiket | Waktu | Kategori | Keluhan & Lokasi | Sisa SLA |
|---|---|---|---|---|
| BDL-2026-0892 | 24 Okt 2026 09:14 | Jalan Rusak | Jalan Berlubang Parah Depan Mall Boemi Kedaton – Kec. Kedaton, Jl. Teuku Umar | 45 Menit |
| BDL-2026-0891 | 24 Okt 2026 08:42 | Sampah Liar | Tumpukan Sampah Liar Dekat Pasar Kangkung – Kec. Bumi Waras, Jl. Hasanudin | 1 Jam 20 Mnt |
| BDL-2026-0890 | 24 Okt 2026 07:55 | Penerangan (PJU) | Lampu PJU Padam 4 Titik Jl. Teuku Umar – Kec. Kedaton | 2 Jam 00 Mnt |
| BDL-2026-0889 | 24 Okt 2026 06:30 | Drainase / Air | Drainase Meluap Saat Hujan di Jl. Ryacudu – Kec. Sukarame | 3 Jam 15 Mnt |

Aksi cepat: **Verifikasi & Disposisi** dan ikon lihat detail.

## Tren Penanganan Laporan Mingguan

Grafik batang (Senin-Minggu), perbandingan Aduan Masuk vs Aduan Selesai. Rata-rata SLA: 18.4 jam.

| Indikator | Nilai |
|---|---|
| Laporan selesai pekan ini | 782 aduan (↑ 9.4% efisiensi regu) |
| Waktu respon pertama | 42 menit (memenuhi standar KemenPAN-RB) |
| Kecamatan paling aktif | Kedaton (148 laporan) |

## Peta Sebaran Laporan Aktif

Mode Satelit SPBE; Kedaton berstatus **High Alert**, Rajabasa dan Sukarame ditandai aktif. Tautan "Buka Peta Penuh GIS".

## Distribusi Kategori (Bulan Ini)

| Kategori | Jumlah | Persentase |
|---|---|---|
| Jalan & Jembatan Rusak | 620 | 38% |
| Persampahan & Kebersihan | 440 | 27% |
| Penerangan Jalan (PJU) | 290 | 18% |
| Drainase & Banjir | 195 | 12% |
| Ketertiban Umum & PKL | 85 | 5% |

## Kesiapan Regu & OPD (Siaga 24 Jam)

| OPD | Kekuatan | Utilisasi |
|---|---|---|
| Dinas PU / BMBK | 8 Regu Reaksi Cepat | 92% |
| Dinas LH (Kebersihan) | 12 Regu Armada Truk | 88% |
| Dinas Perhubungan | 5 Regu Teknisi PJU | 74% |
| Satpol PP Kota BDL | 4 Regu Patroli Trantib | 65% |

## Aktivitas Verifikator Terkini

- 5 menit lalu – Admin Rian memverifikasi `#BDL-2026-0888`; disposisi ke Dinas PU (Kec. Tanjung Karang Pusat).
- 18 menit lalu – Petugas Ahmad (Dishub) mengunggah bukti penyelesaian PJU pada `#BDL-2026-0870`.
- 35 menit lalu – Admin Putri menolak `#BDL-2026-0885` (duplikasi dengan BDL-2026-0882).

---

# 4. Verifikasi & Penugasan Pengaduan (Admin)

**Judul:** Verifikasi & Disposisi Pengaduan Masuk – Pusat Komando & Disposisi
**Status:** 12 laporan menunggu tindakan · Rata-rata respon 18 menit

Deskripsi: validasi bukti digital geotag, analisis kesesuaian yurisdiksi, dan penerbitan Surat Perintah Penugasan (SPT) ke OPD Pemkot Bandar Lampung.

**Aksi massal:** Ekspor Daftar Verifikasi, Verifikasi Terpilih (Batch).

## Tab Status

| Tab | Jumlah |
|---|---|
| Menunggu Verifikasi (aktif) | 12 |
| Butuh Konfirmasi Ulang | 3 |
| Siap Disposisi | 8 |
| Semua Berkas | 23 |

## Filter

- **Kategori Kerusakan:** Semua / Infrastruktur Jalan & Jembatan (BMBK, terpilih) / Kebersihan & Sampah (DLH) / PJU (Dishub) / Drainase & Banjir (SDA)
- **Kecamatan (20 BDL):** Kedaton (terpilih), Bumi Waras, Enggal, Sukarame, Tanjung Karang Pusat, Rajabasa, Kemiling, Teluk Betung Selatan
- **Prioritas SLA:** Mendesak (<1 jam), Peringatan (<3 jam), Normal (24 jam)
- **Validasi Geotag:** Geotag Akurat (GPS Verified), Semua Berkas Lokasi, Perlu Verifikasi Manual

## Panel Kiri – Antrean Laporan Masuk (12 berkas, urut SLA paling kritis)

| Tiket | Judul | Lokasi | SLA | Status / OPD |
|---|---|---|---|---|
| #BDL-2026-0892 (dipilih) | Aspal Amblas & Lubang Berdiameter 40cm Dekat Lampu Merah MBK | Jl. ZA. Pagar Alam, Labuhan Ratu, Kec. Kedaton | 15 Mnt | Menunggu Verifikasi · BMBK Kota · Foto GPS Valid · Rahmat Hidayat (NIK terverifikasi), 45 mnt lalu |
| #BDL-2026-0891 | Sampah Liar Menumpuk Menutup Sebagian Trotoar Pasar | Jl. Hasanudin, Pasar Kangkung, Kec. Bumi Waras | 42 Mnt | Menunggu Verifikasi · DLH |
| #BDL-2026-0890 | 3 Tiang Lampu PJU Padam Berurutan Menjelang Simpang Tugu Juang | Jl. Raden Intan, Gunung Sari, Kec. Enggal | 2 Jam | Menunggu Verifikasi · Dishub |
| #BDL-2026-0887 | Drainase Lingkungan Tersumbat Lumpur Tebal | Jl. Pulau Sebesi, Sukarame | 4 Jam | Butuh Konfirmasi (foto kurang jelas) |
| #BDL-2026-0884 | Pohon Rindang Condong ke Kabel Listrik PLN & Rawan Tumbang | Jl. Imam Bonjol, Gedong Air, Kec. Tanjung Karang Barat | 6 Jam | Menunggu Verifikasi · BPBD / DLH |

## Panel Kanan – Ruang Kerja Verifikasi (#BDL-2026-0892)

- **Prioritas:** Tinggi (lalu lintas padat). Diterima 24 Okt 2026, 09:15 WIB via SIAP LAPOR Mobile.
- **Identitas pelapor:** Rahmat Hidayat, terverifikasi Dukcapil BDL, kontak 0812-****-4491.
- **Wilayah:** Kec. Kedaton, Kel. Labuhan Ratu, RT 04 / LK II (Zona Kota A).
- **Kewenangan jalan:** Jalan Kota BDL – kewenangan resmi Pemkot (bukan jalan nasional/provinsi).

**Substansi pengaduan:**

> "Terdapat lubang jalan cukup dalam (sekitar 12-15 cm) akibat hujan deras semalam di lajur kiri mengarah Rajabasa, tepat 50 meter sebelum lampu merah simpang Mall Boemi Kedaton. Pagi ini sudah ada 2 pengendara motor hampir terjatuh saat jam sibuk kerja karena menghindari lubang secara mendadak. Mohon segera ditindaklanjuti penambalan aspal darurat hotmix oleh dinas PU sebelum timbul korban kecelakaan fatal."

**Bukti foto geotag:** metadata valid (anti-hoaks); EXIF Xiaomi 13T 24mm f/1.9; geotag -5.3789° S, 105.2514° E; diambil 24 Okt 2026 08:58 WIB. Tersedia tombol Perbesar dan "Periksa Riwayat Laporan Serupa".

**Peta geospasial:** Jl. ZA. Pagar Alam (depan halte MBK), akurasi 3 meter, tombol Buka Google Maps. Dalam radius 500 m terdapat 1 regu BMBK di Jl. Teuku Umar.

### Tindakan Verifikasi & Penerbitan SPT

Tiga mode: **Setujui & Disposisi (SPT)**, **Tolak Laporan (Resmi)**, **Klarifikasi ke Warga**.

**Mode 1 – Setujui & Disposisi**

| Field | Nilai Default |
|---|---|
| OPD Target * (saran otomatis AI) | Dinas Bina Marga & Bina Konstruksi (BMBK); opsi lain: DLH, Dishub, BPBD, Perkim |
| Regu Lapangan / Koordinator * | URC Wilayah Kedaton – Regu 2 (Ketua: Supriyadi), jarak 1.2 KM; opsi: Regu 1 (Hendra Gunawan), URC Khusus Aspal Hotmix (Tim Sentral Disbina) |
| Prioritas | Biasa (3 hari) / Sedang (24 jam) / **Mendesak (<6 jam)** |
| Target penyelesaian | 2026-10-24, 16:00 |
| Instruksi kerja | Segera lakukan penambalan darurat hotmix hari ini juga; koordinasikan dengan Satlantas / Dishub BDL bila perlu rekayasa lajur |

Tombol: **Kirim Disposisi & Terbitkan Surat Tugas (SPT)**. Notifikasi otomatis ke WhatsApp pelapor dan tablet tim lapangan.

**Mode 2 – Tolak Laporan**

Alasan standar (SOP BDL):
- Bukan kewenangan Pemkot BDL (jalan nasional/BPJN atau provinsi)
- Lokasi di luar wilayah administratif Kota Bandar Lampung
- Laporan duplikat / lokasi serupa sedang ditangani
- Foto bukti tidak valid, buram, atau tidak menggambarkan kondisi nyata
- Indikasi hoaks / informasi palsu / ujaran tidak pantas
- Lainnya (perlu penjelasan spesifik)

Disertai penjelasan santun untuk warga dan rujukan instansi (contoh: diteruskan lewat kanal SP4N-Lapor Provinsi Lampung). Tombol: Batal, Tolak Laporan dengan Alasan Resmi.

**Mode 3 – Klarifikasi ke Warga**

Poin klarifikasi (checkbox): foto ulang dari jarak berbeda (default), konfirmasi patokan bangunan/pagar, kontak alternatif RT/tokoh setempat, pertanyaan khusus lainnya. Pesan langsung ke WhatsApp & aplikasi warga. Tombol: Batal, Kirim Permintaan Klarifikasi.

### Log Jejak Berkas (Enkripsi SHA-256)

| Waktu | Kejadian | Sumber |
|---|---|---|
| 09:15 WIB | Laporan diterima dari warga terotentikasi NIK | Sistem Otomasi |
| 09:18 WIB | Koordinat GPS (-5.3789, 105.2514) terverifikasi dalam batas Kota BDL | Geofence Engine |
| 09:22 WIB | Prioritas ditingkatkan ke "Mendesak" oleh analisis sentimen kerawanan MBK | SLA Bot |

## Perilaku Interaktif

`switchAction(mode)` – menampilkan panel `approve` / `reject` / `clarify` dan mengatur gaya tab aktif.

---

# 5. Dashboard Petugas Lapangan

**Judul:** Pusat Kerja Lapangan & Bukti Penyelesaian Fisik
**Portal:** Petugas Teknis · Regu Reaksi Cepat URC 02 · Wilayah Tanjung Karang - Kedaton

**Petugas:** Ahmad Fauzi (NIP. 19880415 201201 1 003) – Dinas Bina Marga & Bina Konstruksi (BMBK). Shift Pagi 08:00-16:00 WIB. Armada Truk BE 9120 AZ, GPS aktif (akurasi 3 m). Jadwal: Kamis, 24 Oktober 2026.

## Sidebar

| Grup | Menu |
|---|---|
| Tugas & Operasional | Daftar Tugas Saya (5, aktif), Peta Rute Penanganan, Riwayat Selesai |
| Regu & Logistik | Kesiapan Armada & Alat, Absensi & Tim Lapangan |

## Kartu Metrik

| Metrik | Nilai | Detail |
|---|---|---|
| Ditugaskan Hari Ini | 5 Tugas | 2 mendesak (SLA <2 jam) |
| Sedang Dikerjakan | 2 Lokasi | Jl. ZA. Pagar Alam & Teuku Umar |
| Menunggu Verifikasi | 1 Laporan | Tambal Aspal Jl. Raden Intan |
| Capaian Target Regu | 80% | 4/5 selesai |

## Antrean Surat Tugas (SPT)

| Tiket | Judul | Lokasi | SLA / Status | Sumber Daya |
|---|---|---|---|---|
| #BDL-2026-0892 | Jalan Rusak / Lubang Aspal Amblas 40cm | Jl. ZA. Pagar Alam (dekat lampu merah MBK), Kedaton | Mendesak (SLA 45 mnt) · **Sedang Dikerjakan** | Hotmix 2.5 ton + stamper; diterima 09:30 |
| #BDL-2026-0890 | PJU 3 Tiang Padam | Jl. Raden Intan, Gunung Sari, Enggal | SLA 2 Jam · Ditugaskan | Unit Crane BMBK 01; 10:10 |
| #BDL-2026-0887 | Saluran Drainase Tersumbat Sampah & Lumpur | Jl. Pulau Sebesi, Sukarame | SLA 4 Jam · Tunggu Material | Ekskavator mini & truk sampah; 08:45 |
| #BDL-2026-0882 | Penambalan Jalan Berlubang Raden Intan | Jl. Raden Intan No. 42 | Verifikasi Bukti (foto terlampir) | Selesai 08:15 |

Filter tab: Semua (5), Mendesak (2), Dalam Proses (2), Verifikasi (1).

## Detail SPT `#SPT-BMBK-2026-1049`

**Judul:** Perbaikan Lubang Aspal Amblas 40cm Simpang MBK · Tiket terkait `#BDL-2026-0892`

- Pelapor: Rahmat Hidayat (0812-****-4491), terverifikasi NIK KTP-el Bandar Lampung.
- Laporan masuk 24 Okt 2026 09:15 WIB; disposisi Kadis 09:30 WIB (URC siaga).
- **Instruksi Kepala Dinas BMBK:** penambalan darurat hotmix cepat beku hari ini; koordinasi dengan Satlantas Polresta & Dishub untuk rekayasa lajur agar tidak macet di simpang Mall Boemi Kedaton.
- Koordinat target: Jl. ZA. Pagar Alam, Kedaton (-5.3789° S, 105.2514° E); tombol "Buka Rute Maps".
- Jarak armada 1.2 KM, estimasi tiba 4 menit; lalu lintas padat merayap (gunakan jalur Teuku Umar bawah).
- Aksi: Cetak SPT, Posko BMBK (telepon).

## Alur Progres Pengerjaan (SOP URC)

| Tahap | Status | Waktu |
|---|---|---|
| 1. Ditugaskan | Selesai | 09:30 WIB |
| 2. Tiba & Rambu | Selesai | 10:05 WIB |
| 3. Dikerjakan | Sedang berlangsung | – |
| 4. Selesai | Menunggu bukti | – |

## Dokumentasi Bukti Fisik Lapangan (wajib 2 bukti, bergeotag)

| Foto | Detail |
|---|---|
| **Sebelum** | EXIF valid; geotag -5.37892, 105.25141 (Kedaton); 24 Okt 2026 09:12 WIB, oleh warga SIAP LAPOR. Kondisi: lubang sedalam 40 cm, aspal terkelupas akibat genangan, rawan kecelakaan motor. |
| **Sesudah** | Kamera URC; geotag -5.37891, 105.25140 (akurasi 2.8 m); 24 Okt 2026 11:20 WIB, oleh Petugas Ahmad Fauzi. Kondisi: hotmix rata sempurna, dipadatkan plate stamper, marka lajur darurat dipasang. |

**Catatan teknis pengerjaan *:**

> Telah dilakukan perataan permukaan jalan, pembersihan sisa lumpur, pemadatan base course, dan penambalan hotmix aspal tebal 8cm seluas 1.5 x 1.2 meter di simpang MBK Kedaton. Marka darurat telah dipasang. Arus lalu lintas telah kembali lancar dan aman bagi pengendara roda dua maupun roda empat.

Catatan ini otomatis masuk dalam resume penyelesaian publik bagi pelapor.

**Realisasi material & tim (BMBK):** Hotmix 2.5 ton terpakai · Tack coat 1 drum digunakan · 6 personel URC hadir.

**Tombol:** Simpan Draft Progres · Kirim Bukti & Ajukan Penyelesaian Tiket.

## Riwayat Log Respon Cepat Hari Ini (diperbarui 11:25 WIB)

| Waktu | SPT | Kejadian |
|---|---|---|
| 11:22 WIB | #SPT-1049 | Foto penyelesaian berhasil diunggah; terverifikasi GPS Kedaton oleh Ahmad Fauzi |
| 10:05 WIB | #SPT-1049 | Armada tiba di lokasi MBK; pemasangan traffic cone & koordinasi buka tutup lajur Dishub |
| 09:30 WIB | #SPT-1049 | Disposisi diterima; armada BE 9120 AZ bergerak dari posko induk BMBK Rajabasa |

Footer: Program Kolaborasi Riset Smart City UTI bersama Pemkot Bandar Lampung · Integritas Data URC Berbasis Geotagging · Call Center 112 Pemkot · Dinas PU BMBK Kota Bandar Lampung.

---

# Catatan Konsistensi Data Antar Halaman

Beberapa hal yang terlihat berbeda antar halaman dan mungkin perlu diseragamkan:

1. **Tanggal:** halaman admin dan petugas memakai 24 Oktober 2026 (disebut "Kamis"), padahal 24 Oktober 2026 jatuh pada hari Sabtu.
2. **Format nomor tiket:** `BDL-2026-XXXX` (admin/petugas) vs `TKT-BDL-2026-XXX` (publik).
3. **Lokasi tiket 0892:** admin dashboard menulis "Jl. Teuku Umar", sedangkan halaman verifikasi dan petugas menulis "Jl. ZA. Pagar Alam".
4. **Total laporan:** 4.829 di landing page dan dashboard admin, namun formulir warga menampilkan "1.482 Tuntas" dengan tingkat penanganan 94.8%, sementara landing page menampilkan 4.412 selesai (91.4%).
5. **Kewenangan OPD:** Dinas BMBK (nama di admin/petugas) vs "Dinas PU / BMBK" di dashboard.
6. **Hotmix:** ketebalan tambalan "4 cm" di modal landing page vs "8 cm" di catatan petugas.
7. **Privasi:** FAQ menyatakan identitas tidak ditampilkan ke petugas lapangan, namun halaman petugas menampilkan nama dan kontak (tersamar) pelapor.
8. **Kecamatan:** "Labuhan Ratu" tercantum sebagai kecamatan di formulir, tetapi sebagai kelurahan di halaman verifikasi.
