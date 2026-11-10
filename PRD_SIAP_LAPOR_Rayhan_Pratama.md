# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## SIAP LAPOR – Sistem Informasi Aduan dan Pelaporan Masyarakat Kota Bandar Lampung

**Nama:** Rayhan Pratama  
**NPM:** 23311140  
**Kelas:** SI23DX  
**Dosen:** Dr. Erliyan Redy Susanto, M.Kom.  
**Pemda:** Kota Bandar Lampung  

## 1. Latar Belakang
SIAP LAPOR merupakan prototipe aplikasi web untuk mengumpulkan pengaduan masyarakat terkait fasilitas umum dan lingkungan dalam satu sistem. Aplikasi menyediakan tiket laporan, verifikasi, penugasan petugas, pelacakan status, dan dashboard. Proyek ini bersifat akademik dan tidak diklaim sebagai layanan resmi atau terintegrasi dengan sistem Pemkot.

## 2. Tujuan
- Menyediakan kanal digital untuk pengaduan.
- Memberikan kode tiket dan pelacakan status.
- Membantu admin memverifikasi dan menugaskan laporan.
- Membantu petugas mencatat tindak lanjut.
- Menyajikan statistik bagi pimpinan.

## 3. Pengguna
| Role | Fungsi |
|---|---|
| Masyarakat | Membuat dan memantau laporan milik sendiri. |
| Admin | Verifikasi, kategori, penugasan, pengelolaan akun. |
| Petugas | Melihat tugas dan memperbarui progres laporan yang ditugaskan. |
| Pimpinan | Melihat dashboard dan rekap agregat. |

## 4. Fitur Utama
1. Registrasi, login, dan role-based access.
2. Pembuatan laporan dengan kategori, deskripsi, lokasi, dan bukti.
3. Kode tiket unik dan halaman pelacakan.
4. Verifikasi atau penolakan disertai alasan.
5. Penugasan kepada petugas.
6. Pembaruan status dan catatan tindak lanjut.
7. Dashboard statistik dan ekspor CSV.
8. Riwayat status dan activity log.

## 5. Alur Status
Diajukan → Diverifikasi → Ditugaskan → Diproses → Selesai. Laporan yang tidak memenuhi ketentuan dapat berstatus Ditolak dengan alasan tercatat.

## 6. Entitas Database
- `users`: identitas akun, password hash, role, status aktif.
- `categories`: kategori pengaduan.
- `reports`: kode tiket, pelapor, kategori, deskripsi, lokasi, status.
- `report_attachments`: metadata file bukti.
- `assignments`: petugas yang ditugaskan.
- `status_histories`: riwayat perubahan status.
- `work_updates`: catatan dan bukti tindak lanjut.
- `activity_logs`: jejak aktivitas penting.

## 7. Stack Teknologi
- Frontend: React + TypeScript + Tailwind CSS.
- Backend: Rust dengan `vercel_runtime`.
- Database access: SQLx.
- Database: PostgreSQL.
- Deployment: Vercel.
- File evidence: object storage eksternal.

Rust Runtime Vercel berstatus Beta sehingga kompatibilitas dependency dan proses build/deploy wajib diuji. PostgreSQL harus disediakan melalui layanan eksternal/Marketplace; Vercel Postgres lama tidak lagi ditawarkan sebagai produk baru. Rahasia seperti `DATABASE_URL` dan `JWT_SECRET` disimpan sebagai environment variables.

## 8. Kebutuhan Keamanan
- Password wajib di-hash.
- Otorisasi berbasis role dan kepemilikan laporan.
- Query database terparameterisasi.
- Validasi input dan unggahan file.
- Rate limiting untuk endpoint publik.
- Secret tidak boleh disimpan di repository.
- Catat perubahan status dan tindakan admin.

## 9. Kriteria Penerimaan
1. Masyarakat dapat membuat laporan dan menerima tiket.
2. Masyarakat hanya dapat melihat laporannya sendiri.
3. Admin dapat memverifikasi, menolak, dan menugaskan.
4. Petugas hanya dapat mengubah laporan yang ditugaskan.
5. Riwayat status mencatat aktor dan waktu.
6. Pimpinan dapat melihat statistik.
7. Aplikasi responsif dan memvalidasi input.

## 10. Identitas Aplikasi
Header menampilkan logo resmi Pemerintah Kota Bandar Lampung dan Universitas Teknokrat Indonesia. Footer wajib:  
**Copyright©2026 by Rayhan Pratama dan Dr. Erliyan Redy Susanto, M.Kom**

## 11. Referensi
- https://vercel.com/docs/functions/runtimes/rust
- https://vercel.com/docs/functions/runtimes
- https://vercel.com/docs/postgres
- https://docs.rs/sqlx/latest/sqlx/
- https://www.postgresql.org/docs/
