# SIAP LAPOR – Kota Bandar Lampung (v1.4)
### Sistem Informasi Aduan dan Pelaporan Masyarakat Kota Bandar Lampung
**Kolaborasi Riset Smart Governance:** Pemerintah Kota Bandar Lampung & Universitas Teknokrat Indonesia (UTI)

> **Copyright©2026 by Rayhan Pratama dan Dr. Erliyan Redy Susanto, M.Kom**  
> **NPM:** 23311140 | **Kelas:** SI23DX | **Dosen:** Dr. Erliyan Redy Susanto, M.Kom.

---

## 📌 Ringkasan Aplikasi

Aplikasi prototipe interaktif modern **SIAP LAPOR** dibangun berdasarkan spesifikasi lengkap pada `PRD_SIAP_LAPOR_Rayhan_Pratama.md` dan `Design.md`. Aplikasi ini memfasilitasi pelaporan fasilitas umum dan lingkungan warga Kota Bandar Lampung terintegrasi Organisasi Perangkat Daerah (OPD), mulai dari jalan rusak, tumpukan sampah, lampu PJU, drainase tersumbat, taman kota, hingga trantibum.

## 🚀 Fitur 5 Halaman Terpadu

1. **🌐 1. Landing Page Publik (`/landing`):**
   - Hero aspirasi warga & hotline Call Center darurat **112**.
   - Widget pelacakan tiket mandiri instan dengan modal interaktif (stepper 5 status, foto sebelum & sesudah, riwayat audit).
   - Kartu statistik pelayanan (4.829 total laporan, 4.412 selesai / 91.4%, SLA 24-48 jam).
   - 6 Kategori Layanan terhubung OPD & target SLA resmi.
   - Infografis alur 5 tahap penanganan SOP & kriteria penolakan.
   - Umpan publik laporan terkini dengan filter (Semua, Selesai, Diproses).
   - Banner riset Smart City UTI (ISO 27001, 100% karya putra daerah).
   - Accordion FAQ interaktif & callout darurat 112.

2. **📝 2. Formulir Buat Laporan Pengaduan Warga (`/citizen-form`):**
   - Stepper 3 tahap: (1) Informasi Pelaporan $\rightarrow$ (2) Titik Lokasi & Acuan $\rightarrow$ (3) Bukti Lampiran.
   - Pilihan kategori format visual pill interaktif.
   - Input judul dan textarea deskripsi dengan counter dinamis (`n/500 karakter`).
   - Pilihan 20 Kecamatan resmi Kota Bandar Lampung.
   - Widget Geotagging peta interaktif dengan tombol *"Gunakan Titik Lokasi Saya"* (-5.3824, 105.2578).
   - Dropzone unggah foto bukti dengan verifikasi metadata EXIF anti-hoaks.
   - Switch toggle *"Lapor Secara Anonim / Rahasia"* berstandar UU PDP.
   - Generator nomor tiket resmi otomatis (`TKT-BDL-2026-XXXX`).
   - Sidebar riwayat tiket sebelumnya & tips cepat ditindaklanjuti.

3. **📊 3. Dashboard Ringkasan Admin Command Center (`/admin-dashboard`):**
   - Shell admin dengan sidebar portal lebar 288px (`w-72`).
   - 4 Kartu metrik KPI (Total Masuk 4.829, Menunggu 34, Diproses 383, Selesai 4.412).
   - Antrean verifikasi mendesak dengan hitung mundur SLA (<45 menit s/d 3 jam) dan tombol *"Verifikasi & Disposisi"*.
   - Visualisasi grafik tren mingguan (Aduan Masuk vs Selesai).
   - Peta sebaran titik panas GIS (*Kedaton High Alert*).
   - Distribusi persentase kategori kerusakan.
   - Kesiapan regu siaga 24 jam & utilisasi armada OPD (BMBK 92%, DLH 88%, Dishub 74%, Satpol PP 65%).
   - Ekspor data rekapitulasi ke berkas CSV.

4. **⚖️ 4. Verifikasi & Penugasan Pengaduan - Admin Workspace (`/admin-verification`):**
   - Tab status berkas (Menunggu Verifikasi: 12, Butuh Konfirmasi: 3, Siap Disposisi: 8).
   - Layout 2-panel: Panel kiri antrean kritis; Panel kanan ruang investigasi berkas tiket utama (`#BDL-2026-0892` Simpang MBK).
   - Pemeriksaan metadata identitas Dukcapil, kewenangan yurisdiksi Jalan Kota, dan inspeksi EXIF foto.
   - **3 Mode Keputusan Verifikator:**
     - *Mode 1 (Setujui & Disposisi):* Penerbitan Surat Perintah Tugas (SPT) resmi ke URC 02 BMBK.
     - *Mode 2 (Tolak Laporan):* Alasan standar SOP BDL & penjelasan santun untuk warga.
     - *Mode 3 (Klarifikasi ke Warga):* Checklist kekurangan berkas terkirim ke WhatsApp warga.
   - Audit trail berkas terenkripsi SHA-256.

5. **🚜 5. Dashboard Petugas Lapangan URC (`/officer-dashboard`):**
   - Antarmuka ramah perangkat mobile/tablet untuk kru teknis lapangan.
   - Profil petugas: Ahmad Fauzi (NIP. 19880415 201201 1 003) – URC 02 BMBK, Armada Truk BE 9120 AZ.
   - Lembar kerja SPT `#SPT-BMBK-2026-1049` (Tiket `#BDL-2026-0892` Simpang MBK).
   - Alur 4 tahap pengerjaan fisik lapangan: Ditugaskan $\rightarrow$ Tiba & Pasang Rambu $\rightarrow$ Dikerjakan $\rightarrow$ Selesai.
   - Tombol buka navigasi rute Google Maps.
   - Dokumentasi foto ganda: Foto SEBELUM (warga) vs Foto SESUDAH (kamera URC bergeotag).
   - Form catatan teknis perbaikan jalan (metode hotmix 8 cm, marka darurat).
   - Input realisasi penggunaan material (2.5 ton hotmix, 1 drum tack coat, 6 personel).
   - Aksi penyelesaian tugas yang langsung memperbarui status tiket secara menyeluruh.

---

## 🛠️ Tech Stack & Standar Desain

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (Palet warna resmi: Primary `#002548`, Primary Container `#173b63`, Secondary `#2060a3`, Tertiary `#002a26`, Error `#ba1a1a`, Background `#f8f9ff`)
- **Tipografi:** Plus Jakarta Sans & JetBrains Mono (Google Fonts)
- **Ikonografi:** Lucide React & Material Symbols
- **State & Penyimpanan:** React Context API + LocalStorage sync

---

## 💻 Menjalankan Aplikasi di Lokal

Jalankan perintah berikut di PowerShell / Terminal:

```powershell
# 1. Jalankan development server
npm run dev

# 2. Atau build untuk production
npm run build
```

Buka peramban di [http://localhost:3000](http://localhost:3000) (atau port yang ditampilkan Vite). Gunakan **Role Switcher Bar** di bagian paling atas halaman untuk berpindah secara instan di antara kelima halaman prototipe.

