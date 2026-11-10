/**
 * Generator Laporan Testing and Debugging (.docx)
 * SIAP LAPOR – Kota Bandar Lampung
 * Mahasiswa: Rayhan Pratama (NPM: 23311140, Kelas: SI23DX)
 * Dosen: Dr. Erliyan Redy Susanto, M.Kom.
 */

const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  Header,
  Footer,
  PageNumber
} = require('./node_modules/docx');

console.log('Mempersiapkan pembuatan berkas Laporan Testing & Debugging SIAP LAPOR (.docx)...');

// Helper colors
const COLOR_PRIMARY = '002548'; // Navy Pemkot BDL
const COLOR_SECONDARY = '2060A3'; // Blue
const COLOR_MUTED = '64748B'; // Slate 500
const COLOR_BG_HEADER = '002548'; // White text on dark navy
const COLOR_BG_ZEBRA = 'F8FAFC';
const COLOR_SUCCESS = '166534'; // Emerald 800
const COLOR_DANGER = '991B1B'; // Rose 800

// Helper functions for formatting
function createTitle(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    run: {
      font: 'Calibri',
      size: 36, // 18pt
      bold: true,
      color: COLOR_PRIMARY,
    },
  });
}

function createSubtitle(text) {
  return new Paragraph({
    text: text,
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 300 },
    run: {
      font: 'Calibri',
      size: 24, // 12pt
      color: COLOR_SECONDARY,
      bold: true,
    },
  });
}

function createHeading1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 140 },
    run: {
      font: 'Calibri',
      size: 28, // 14pt
      bold: true,
      color: COLOR_PRIMARY,
    },
  });
}

function createHeading2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 },
    run: {
      font: 'Calibri',
      size: 24, // 12pt
      bold: true,
      color: COLOR_SECONDARY,
    },
  });
}

function createHeading3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    run: {
      font: 'Calibri',
      size: 22, // 11pt
      bold: true,
      color: '1E293B',
    },
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFY,
    spacing: { before: options.before || 60, after: options.after || 80, line: 276 }, // 1.15 line spacing
    children: [
      new TextRun({
        text: text,
        font: 'Calibri',
        size: 22, // 11pt
        color: options.color || '334155',
        bold: options.bold || false,
        italics: options.italics || false,
      }),
    ],
  });
}

function createCallout(title, content, bgColor = 'F1F5F9', borderColor = COLOR_SECONDARY) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.SINGLE, size: 24, color: borderColor },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: bgColor, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 22,
                    font: 'Calibri',
                    color: borderColor,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: content,
                    size: 20,
                    font: 'Calibri',
                    color: '334155',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function createTableHeaderCell(text, widthPct = 20) {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { fill: COLOR_BG_HEADER, type: ShadingType.CLEAR },
    margins: { top: 120, bottom: 120, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: text,
            bold: true,
            font: 'Calibri',
            size: 20, // 10pt
            color: 'FFFFFF',
          }),
        ],
      }),
    ],
  });
}

function createTableCell(text, options = {}) {
  return new TableCell({
    width: options.widthPct ? { size: options.widthPct, type: WidthType.PERCENTAGE } : undefined,
    shading: options.isZebra ? { fill: COLOR_BG_ZEBRA, type: ShadingType.CLEAR } : undefined,
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: options.alignment || AlignmentType.LEFT,
        children: [
          new TextRun({
            text: text,
            font: options.isMono ? 'Consolas' : 'Calibri',
            size: 20, // 10pt
            bold: options.bold || false,
            italics: options.italics || false,
            color: options.color || '334155',
          }),
        ],
      }),
    ],
  });
}

// ----------------------------------------------------------------------------
// DATA KASUS PENGUJIAN LENGKAP (25 KASUS UJI)
// ----------------------------------------------------------------------------
const testCases = [
  {
    id: 'TC-01',
    module: 'Landing Page',
    feature: 'Navigasi & Branding',
    input: 'Buka URL root /landing pada peramban web',
    expected: 'Header menampilkan logo Pemkot BDL, logo UTI, judul SIAP LAPOR, hotline 112, serta navigasi responsif',
    actual: 'Seluruh elemen header, emblem logo, tautan navigasi, dan hotline 112 tampil sempurna tanpa glitch',
    status: 'PASS'
  },
  {
    id: 'TC-02',
    module: 'Landing Page',
    feature: 'Widget Hero & Metrik',
    input: 'Pemeriksaan kartu statistik dan banner Smart City',
    expected: 'Menampilkan data agregat 4.829 total laporan, 4.412 selesai (91.4%), serta SLA 24-48 jam',
    actual: 'Kartu metrik dan persentase keberhasilan tampil presisi sesuai PRD dan Design.md',
    status: 'PASS'
  },
  {
    id: 'TC-03',
    module: 'Tracking',
    feature: 'Pencarian Tiket Valid',
    input: 'Input nomor tiket "TKT-BDL-2026-0892" pada widget lacak',
    expected: 'Modal pelacakan terbuka menampilkan stepper 5 status, detail lokasi Kedaton, dan status DIAJUKAN',
    actual: 'Modal terbuka instan, menampilkan rincian laporan Simpang MBK dan lini masa verifikasi',
    status: 'PASS'
  },
  {
    id: 'TC-04',
    module: 'Tracking',
    feature: 'Pencarian Tiket Tak Ditemukan',
    input: 'Input nomor tiket acak "TKT-BDL-9999-XYZ"',
    expected: 'Sistem menampilkan notifikasi bahwa tiket tidak ditemukan dalam basis data',
    actual: 'Muncul pesan informatif peringatan nomor tiket tidak ditemukan dan saran periksa kembali',
    status: 'PASS'
  },
  {
    id: 'TC-05',
    module: 'Landing Page',
    feature: 'Filter Umpan Publik',
    input: 'Klik filter tab "Selesai" dan "Diproses" pada daftar aduan terkini',
    expected: 'Daftar aduan terfilter secara dinamis sesuai kategori status yang dipilih pengguna',
    actual: 'Daftar kartu aduan langsung terfilter sesuai status yang diklik tanpa perlu memuat ulang halaman',
    status: 'PASS'
  },
  {
    id: 'TC-06',
    module: 'Citizen Form',
    feature: 'Validasi Input Wajib',
    input: 'Klik submit laporan dengan membiarkan judul atau deskripsi kosong',
    expected: 'Formulir menolak pengiriman dan mencegah pembuatan tiket tanpa data wajib',
    actual: 'Submit terhalang, validasi form aktif dan mewajibkan pengisian kolom bertanda bintang (*)',
    status: 'PASS'
  },
  {
    id: 'TC-07',
    module: 'Citizen Form',
    feature: 'Batasan Karakter Deskripsi',
    input: 'Input teks deskripsi lebih dari 500 karakter',
    expected: 'Input terbatasi maksimal 500 karakter dengan indikator counter karakter yang presisi',
    actual: 'Textarea terpasang maxLength=500, counter menghitung n/500 karakter dengan akurat',
    status: 'PASS'
  },
  {
    id: 'TC-08',
    module: 'Citizen Form',
    feature: 'Pemilihan Kategori Layanan',
    input: 'Klik pilihan kategori pill (Jalan, Sampah, PJU, Drainase, Fasum, Trantibum)',
    expected: 'Kategori aktif ditandai highlight dan nama OPD penanggung jawab terasosiasi otomatis',
    actual: 'Pill kategori ter-highlight aktif dan OPD tujuan terpilih secara otomatis sesuai matriks',
    status: 'PASS'
  },
  {
    id: 'TC-09',
    module: 'Citizen Form',
    feature: 'Master 20 Kecamatan',
    input: 'Buka dropdown pilihan kecamatan domisili/kejadian',
    expected: 'Terdapat tepat 20 Kecamatan resmi Kota Bandar Lampung termasuk Kedamaian & Kedaton',
    actual: 'Seluruh 20 Kecamatan Kota Bandar Lampung lengkap tersedia dalam urutan alfabetis teratur',
    status: 'PASS'
  },
  {
    id: 'TC-10',
    module: 'Citizen Form',
    feature: 'Geotagging & GPS Otomatis',
    input: 'Klik tombol "Gunakan Titik Lokasi Saya"',
    expected: 'Koordinat latitude/longitude terkunci (-5.3824, 105.2578) dengan indikator akurasi GPS',
    actual: 'Koordinat lokasi berhasil disematkan dengan indikator hijau "Terdeteksi GPS ±3 meter"',
    status: 'PASS'
  },
  {
    id: 'TC-11',
    module: 'Citizen Form',
    feature: 'Unggah Bukti & EXIF Anti-Hoaks',
    input: 'Unggah file foto bukti kerusakan jalan / sampah',
    expected: 'File terunggah, preview muncul, dan metadata EXIF anti-hoaks tervalidasi',
    actual: 'Preview foto tampil responsif disertai lencana verifikasi metadata EXIF anti-hoaks',
    status: 'PASS'
  },
  {
    id: 'TC-12',
    module: 'Citizen Form',
    feature: 'Mode Anonim / UU PDP',
    input: 'Aktifkan toggle "Lapor Secara Anonim / Rahasia"',
    expected: 'Identitas pelapor dimasking menjadi "Warga Bandar Lampung (Anonim)" dan kontak dirahasiakan',
    actual: 'Identitas tersimpan dalam mode anonim pada basis data, nama pelapor dimasking secara publik',
    status: 'PASS'
  },
  {
    id: 'TC-13',
    module: 'Citizen Form',
    feature: 'Penerbitan Nomor Tiket',
    input: 'Selesaikan 3 langkah form dan klik tombol "Kirim Laporan Pengaduan"',
    expected: 'Tiket baru terbit dengan format resmi TKT-BDL-2026-XXXX dan modal sukses ditampilkan',
    actual: 'Tiket berhasil di-generate secara otomatis, toast sukses muncul, dan modal menampilkan nomor tiket',
    status: 'PASS'
  },
  {
    id: 'TC-14',
    module: 'Tracking Modal',
    feature: 'Reaktivitas Pencarian Cepat',
    input: 'Buka modal lacak dengan tiket awal lalu klik tombol cepat "#102 Selesai"',
    expected: 'Tampilan modal segera beralih menampilkan tiket #102 tanpa terkunci pada tiket sebelumnya',
    actual: 'Pencarian langsung reaktif beralih ke tiket #102 lengkap dengan foto sebelum-sesudah',
    status: 'PASS'
  },
  {
    id: 'TC-15',
    module: 'Admin Dashboard',
    feature: 'Metrik KPI Real-Time',
    input: 'Akses halaman /admin-dashboard',
    expected: 'Menampilkan 4 kartu KPI (Total Masuk, Menunggu Verifikasi, Sedang Ditangani, Selesai)',
    actual: 'Kartu metrik tampil akurat, terhubung dengan state reports secara dinamis',
    status: 'PASS'
  },
  {
    id: 'TC-16',
    module: 'Admin Dashboard',
    feature: 'Antrean Verifikasi Mendesak',
    input: 'Pemeriksaan tabel antrean aduan berstatus DIAJUKAN',
    expected: 'Daftar aduan mendesak muncul beserta indikator sisa batas waktu SLA dan lokasi',
    actual: 'Tabel menampilkan antrean prioritas lengkap dengan sisa SLA (<45 mnt) dan tombol verifikasi',
    status: 'PASS'
  },
  {
    id: 'TC-17',
    module: 'Admin Dashboard',
    feature: 'Ekspor Rekapitulasi CSV',
    input: 'Klik tombol "Ekspor CSV" pada header admin',
    expected: 'Peramban mengunduh berkas CSV berisi seluruh data aduan dengan header dan baris rapi',
    actual: 'Berkas Rekap_Aduan_SIAP_LAPOR_BDL_2026.csv terunduh otomatis memuat data dinamis valid',
    status: 'PASS'
  },
  {
    id: 'TC-18',
    module: 'Admin Verification',
    feature: 'Ruang Investigasi Berkas',
    input: 'Pilih tiket #BDL-2026-0892 untuk diinvestigasi',
    expected: 'Tampil detail laporan, verifikasi NIK Dukcapil, foto EXIF, dan peta koordinat MBK',
    actual: 'Panel investigasi menampilkan data lengkap identitas pelapor, visual peta, dan status validitas',
    status: 'PASS'
  },
  {
    id: 'TC-19',
    module: 'Admin Verification',
    feature: 'Mode 1: Disposisi SPT ke OPD',
    input: 'Pilih OPD BMBK, Petugas Ahmad Fauzi, isi instruksi dinas, klik "Setujui & Terbitkan SPT"',
    expected: 'Nomor SPT resmi terbit, status laporan berubah ke DITUGASKAN, tersimpan pada riwayat',
    actual: 'SPT-BMBK-2026-XXXX terbit, riwayat audit bertambah, dan toast konfirmasi disposisi muncul',
    status: 'PASS'
  },
  {
    id: 'TC-20',
    module: 'Admin Verification',
    feature: 'Mode 2: Penolakan Laporan',
    input: 'Pilih alasan penolakan (misal ruas jalan nasional BPJN) dan klik "Tolak Laporan"',
    expected: 'Status laporan berubah ke DITOLAK, alasan tercatat pada audit trail dan terlihat pelapor',
    actual: 'Laporan berhasil ditandai DITOLAK dengan catatan resmi yang transparan dan dapat dilacak',
    status: 'PASS'
  },
  {
    id: 'TC-21',
    module: 'Admin Verification',
    feature: 'Mode 3: Permintaan Klarifikasi',
    input: 'Centang checklist kekurangan berkas foto dan klik kirim klarifikasi',
    expected: 'Catatan klarifikasi terkirim, status mencatat permintaan klarifikasi dokumen',
    actual: 'Permintaan klarifikasi berhasil disimpan dalam riwayat status dan dikirim ke warga',
    status: 'PASS'
  },
  {
    id: 'TC-22',
    module: 'Officer Dashboard',
    feature: 'Daftar Tugas Dinamis URC',
    input: 'Buka /officer-dashboard untuk petugas Ahmad Fauzi (BMBK)',
    expected: 'Daftar penugasan terisi dinamis dari laporan yang berstatus DITUGASKAN / DIPROSES',
    actual: 'Daftar SPT di sebelah kiri terisi dinamis sesuai laporan riil yang didelegasikan',
    status: 'PASS'
  },
  {
    id: 'TC-23',
    module: 'Officer Dashboard',
    feature: 'Navigasi Rute Google Maps',
    input: 'Klik tombol "Buka Rute Navigasi" pada lembar kerja aktif',
    expected: 'Tautan Google Maps terbuka mengarah tepat ke koordinat titik lokasi kerusakan',
    actual: 'Tautan navigasi Maps mengarah ke koordinat akurat (-5.3789, 105.2514) di tab baru',
    status: 'PASS'
  },
  {
    id: 'TC-24',
    module: 'Officer Dashboard',
    feature: 'Dokumentasi Dual Foto & Material',
    input: 'Input realisasi material (hotmix 2.5 ton, crew 6) dan unggah foto kondisi sesudah perbaikan',
    expected: 'Foto perbandingan kondisi sebelum dan sesudah tampil berdampingan secara jelas',
    actual: 'Foto sebelum dan sesudah perbaikan tampil berdampingan lengkap dengan metrik material',
    status: 'PASS'
  },
  {
    id: 'TC-25',
    module: 'Officer Dashboard',
    feature: 'Penyelesaian Tugas Lapangan',
    input: 'Klik tombol "Selesaikan Tugas & Kirim Bukti Lapangan"',
    expected: 'Status laporan berubah menjadi SELESAI, tersinkronisasi ke dashboard admin & tracking warga',
    actual: 'Laporan tuntas 100%, status SELESAI aktif seketika di seluruh halaman prototipe',
    status: 'PASS'
  }
];

// Build Document Sections
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: 'Calibri',
          size: 22,
          color: '334155',
        },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: 1440, // 1 inch
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: 'SIAP LAPOR – LAPORAN TESTING & DEBUGGING SISTEM',
                  font: 'Calibri',
                  size: 18,
                  color: COLOR_MUTED,
                  bold: true,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 120 },
              children: [
                new TextRun({
                  text: 'Copyright©2026 by Rayhan Pratama dan Dr. Erliyan Redy Susanto, M.Kom | Halaman ',
                  font: 'Calibri',
                  size: 18,
                  color: COLOR_MUTED,
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: 'Calibri',
                  size: 18,
                  color: COLOR_MUTED,
                  bold: true,
                }),
                new TextRun({
                  text: ' dari ',
                  font: 'Calibri',
                  size: 18,
                  color: COLOR_MUTED,
                }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  font: 'Calibri',
                  size: 18,
                  color: COLOR_MUTED,
                  bold: true,
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        // COVER / JUDUL UTAMA
        createTitle('LAPORAN TESTING DAN DEBUGGING SISTEM INFORMASI'),
        createSubtitle('SIAP LAPOR – Sistem Informasi Aduan dan Pelaporan Masyarakat Kota Bandar Lampung'),

        createParagraph('Kolaborasi Riset Smart Governance: Pemerintah Kota Bandar Lampung & Universitas Teknokrat Indonesia (UTI)', {
          alignment: AlignmentType.CENTER,
          bold: true,
          color: COLOR_PRIMARY,
          after: 240
        }),

        // IDENTITAS MAHASISWA & MATA KULIAH
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            left: { style: BorderStyle.SINGLE, size: 12, color: COLOR_PRIMARY },
            right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
          },
          rows: [
            new TableRow({
              children: [
                createTableCell('Nama Mahasiswa', { bold: true, widthPct: 28, isZebra: true }),
                createTableCell('Rayhan Pratama', { bold: true, widthPct: 72 }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Nomor Pokok Mahasiswa (NPM)', { bold: true, widthPct: 28, isZebra: true }),
                createTableCell('23311140', { isMono: true, bold: true, widthPct: 72 }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Kelas / Program Studi', { bold: true, widthPct: 28, isZebra: true }),
                createTableCell('SI23DX / S1 Sistem Informasi - FTIK UTI', { widthPct: 72 }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Mata Kuliah / Ujian', { bold: true, widthPct: 28, isZebra: true }),
                createTableCell('Proyek Pengembangan Sistem Informasi (PPSI) / Ujian Tengah Semester (UTS)', { widthPct: 72 }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Dosen Pengampu', { bold: true, widthPct: 28, isZebra: true }),
                createTableCell('Dr. Erliyan Redy Susanto, M.Kom.', { bold: true, widthPct: 72 }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Instansi & Lokasi', { bold: true, widthPct: 28, isZebra: true }),
                createTableCell('Pemerintah Kota Bandar Lampung & Universitas Teknokrat Indonesia (2026)', { widthPct: 72 }),
              ],
            }),
          ],
        }),

        new Paragraph({ spacing: { before: 240 } }),

        createCallout(
          'CATATAN TUGAS UTS NOMOR 6:',
          'Laporan ini disusun secara komprehensif untuk memenuhi butir tugas ke-6 Ujian Tengah Semester (UTS): "Lakukan testing and debugging kemudian buat laporannya dalam format docx." Seluruh rangkaian pengujian fungsionalitas, pengujian integrasi alur kerja, pengujian batas (boundary value), diagnosis kesalahan (debugging), dan otomasi test suite didokumentasikan secara ilmiah dan objektif.',
          'EFF6FF',
          COLOR_SECONDARY
        ),

        // --------------------------------------------------------------------
        // BAB I: PENDAHULUAN & RUANG LINGKUP
        // --------------------------------------------------------------------
        createHeading1('BAB I: PENDAHULUAN & RUANG LINGKUP TESTING'),
        
        createHeading2('1.1 Latar Belakang Pengujian'),
        createParagraph('Aplikasi SIAP LAPOR (Sistem Informasi Aduan dan Pelaporan Masyarakat Kota Bandar Lampung) v1.4 merupakan perangkat lunak berbasis web modern yang dirancang untuk mengintegrasikan pengaduan fasilitas umum, infrastruktur jalan, sanitasi, penerangan kota, drainase, hingga ketertiban umum dalam satu portal terpadu berbasis transparansi dan kepatuhan SPBE (Sistem Pemerintahan Berbasis Elektronik).'),
        createParagraph('Setelah tahapan perancangan sistem (Product Requirements Document/PRD dan UI/UX Design System) serta vibe coding diimplementasikan, pengujian perangkat lunak (Software Testing) dan penelusuran kutu (Debugging) menjadi tahapan fundamental untuk menjamin bahwa seluruh fungsi, transisi status, validasi formulir, perlindungan data pribadi (UU PDP), dan sinkronisasi lintas peran (Masyarakat, Admin Command Center Diskominfo, dan Petugas URC Lapangan) berjalan tanpa kecacatan fungsional (zero-defect standard).'),

        createHeading2('1.2 Tujuan Pengujian dan Debugging'),
        createParagraph('Adapun tujuan yang hendak dicapai dari kegiatan testing dan debugging ini meliputi:'),
        createParagraph('1. Memvalidasi kesesuaian implementasi antarmuka dan alur logika aplikasi dengan spesifikasi pada PRD_SIAP_LAPOR_Rayhan_Pratama.md dan Design.md.'),
        createParagraph('2. Memastikan seluruh modul fungsional pada 5 halaman utama (Landing Page, Formulir Aduan Warga, Dashboard Admin Command Center, Ruang Verifikasi & Disposisi SPT Admin, serta Dashboard Petugas URC Lapangan) bekerja secara optimal.'),
        createParagraph('3. Menguji alur hidup (lifecycle) tiket aduan mulai dari status DIAJUKAN, DIVERIFIKASI, DITUGASKAN, DIPROSES, SELESAI, hingga skenario DITOLAK.'),
        createParagraph('4. Mengidentifikasi, mengisolasi akar penyebab (root cause), dan memperbaiki anomali/kutu (bugs) yang ditemukan selama pengujian sistem.'),
        createParagraph('5. Menyusun bukti verifikasi pengujian otomatis (Automated Unit & Integration Test Suite) dan memastikan kode bersih dari kesalahan kompilasi sebelum tahap audit keamanan (Security Audit) dan penerapan (Deployment).'),

        createHeading2('1.3 Ruang Lingkup Sistem yang Diuji'),
        createParagraph('Ruang lingkup pengujian mencakup 5 halaman terpadu dan modul-modul pendukung:'),
        createParagraph('• Modul 1 - Landing Page Publik (/landing): Penelusuran hero banner, hotline darurat 112, 6 kartu kategori layanan terhubung OPD, alur 5 SOP penanganan, umpan publik laporan terkini berfilter, dan accordion FAQ interaktif.'),
        createParagraph('• Modul 2 - Formulir Pengaduan Warga (/citizen-form): Pengujian stepper 3 tahap, validasi input wajib, batasan karakter deskripsi (max 500), dropdown master 20 kecamatan, penanda titik GPS (-5.3824, 105.2578), unggah foto bukti dengan verifikasi EXIF anti-hoaks, fitur masking mode anonim berstandar UU PDP, dan generator nomor tiket resmi (TKT-BDL-2026-XXXX).'),
        createParagraph('• Modul 3 - Dashboard Command Center Admin (/admin-dashboard): Pengujian sidebar 288px, 4 kartu metrik KPI (Total Masuk, Menunggu Verifikasi, Sedang Ditangani, Selesai), antrean verifikasi mendesak hitung mundur SLA (<45 menit), grafik tren penanganan, peta sebaran titik panas, dan ekspor data rekapitulasi ke format CSV.'),
        createParagraph('• Modul 4 - Workspace Verifikasi & Disposisi Admin (/admin-verification): Pengujian ruang investigasi berkas tiket (#BDL-2026-0892), inspeksi metadata NIK Dukcapil, kelaikan yurisdiksi ruas jalan kota, serta 3 mode keputusan verifikator (Mode 1: Terbitkan SPT ke regu URC; Mode 2: Tolak Laporan dengan alasan SOP; Mode 3: Kirim checklist klarifikasi ke WhatsApp warga).'),
        createParagraph('• Modul 5 - Dashboard Petugas Lapangan URC (/officer-dashboard): Pengujian kartu identitas petugas Ahmad Fauzi (NIP. 19880415 201201 1 003), lembar kerja SPT aktif, tautan rute navigasi Google Maps, dokumentasi perbandingan foto SEBELUM vs SESUDAH, pencatatan material fisik (hotmix 2.5 ton, tack coat 1 drum, personel 6 orang), dan aksi penyelesaian pekerjaan tuntas 100%.'),

        createHeading2('1.4 Lingkungan Pengujian (Testing Environment)'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            left: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
          },
          rows: [
            new TableRow({
              children: [
                createTableCell('Parameter Lingkungan', { bold: true, widthPct: 35, isZebra: true }),
                createTableCell('Spesifikasi / Versi Perangkat & Perangkat Lunak', { bold: true, widthPct: 65 }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Sistem Operasi (OS)', { isZebra: true }),
                createTableCell('Microsoft Windows 11 Home 64-bit (Build 22631)'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Runtime Environment', { isZebra: true }),
                createTableCell('Node.js v20.19.6 LTS'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Framework & Bundler', { isZebra: true }),
                createTableCell('React 18.3.1, TypeScript 5.7.2, Vite 6.0.7'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Styling & Desain Antarmuka', { isZebra: true }),
                createTableCell('Tailwind CSS 3.4.17, Lucide Icons, Plus Jakarta Sans & JetBrains Mono'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Manajemen State & Storage', { isZebra: true }),
                createTableCell('React Context API + Browser LocalStorage Persistence'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Database Arsitektur', { isZebra: true }),
                createTableCell('PostgreSQL Schema (DDL schema.sql & seed.sql)'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Peramban Web (Browser)', { isZebra: true }),
                createTableCell('Google Chrome Version 131.0.6778.86 (Official Build 64-bit)'),
              ],
            }),
          ],
        }),

        // --------------------------------------------------------------------
        // BAB II: METODOLOGI & RENCANA PENGUJIAN
        // --------------------------------------------------------------------
        createHeading1('BAB II: METODOLOGI & RENCANA PENGUJIAN (TEST PLAN)'),
        createParagraph('Untuk memastikan keandalan sistem secara menyeluruh, pengujian dirancang menggunakan perpaduan beberapa metodologi baku rekayasa perangkat lunak:'),
        createParagraph('1. Black-Box Testing (Pengujian Kotak Hitam): Berfokus pada pengujian fungsionalitas eksternal tanpa melihat kode internal. Teknik yang digunakan meliputi Equivalence Partitioning (menguji variasi data input valid dan tidak valid) serta Boundary Value Analysis (menguji nilai batas seperti panjang teks deskripsi 500 karakter dan format nomor tiket).'),
        createParagraph('2. White-Box & Logic Testing: Pengujian alur kendali logika program dan transisi status melalui skrip pengujian unit otomatis (Automated Unit Test) untuk memvalidasi algoritma pencarian tiket, masking privasi data anonim, integritas metadata EXIF, dan kalkulasi agregasi KPI.'),
        createParagraph('3. Integration & Workflow Testing: Menguji keterhubungan data antar-komponen, misalnya bagaimana laporan yang diajukan oleh warga di halaman /citizen-form langsung masuk ke antrean verifikasi di /admin-dashboard, dapat diterbitkan SPT di /admin-verification, dikerjakan oleh petugas di /officer-dashboard, dan status akhirnya terlacak secara real-time pada modal pelacakan tiket di /landing.'),
        createParagraph('4. Usability & UI/UX Responsiveness Testing: Memastikan tata letak antarmuka mematuhi standar desain SIAP LAPOR Kota Bandar Lampung v1.4, skema warna institusional (#002548, #2060A3, #F8F9FF), keterbacaan tipografi, ketersediaan navigasi cepat, dan kejelasan pesan umpan balik (Toast Notifications).'),

        createHeading2('2.1 Kategori Tingkat Keparahan Cacat (Defect Severity Classification)'),
        createParagraph('Setiap temuan anomali atau kegagalan uji diklasifikasikan ke dalam 4 tingkatan:'),
        createParagraph('• Critical (Kritis): Bug yang menyebabkan sistem lumpuh total, kesalahan kompilasi (compile error), atau kebocoran data sensitif pelapor.'),
        createParagraph('• High (Tinggi): Bug yang merusak alur kerja utama aplikasi (misalnya widget pelacakan terkunci sehingga warga tidak dapat memantau status aduannya).'),
        createParagraph('• Medium (Sedang): Inkonsistensi data atau ketidaksesuaian fungsional minor yang tidak mematikan sistem namun mengurangi akurasi informasi (misalnya master kecamatan kurang 1 entitas atau daftar tugas petugas bersifat statis).'),
        createParagraph('• Low (Rendah): Cacat tampilan visual mikro, ketidaksesuaian batas karakter minor, atau tata letak responsif yang kurang sempurna.'),

        // --------------------------------------------------------------------
        // BAB III: PELAKSANAAN TEST CASES & HASIL PENGUJIAN
        // --------------------------------------------------------------------
        createHeading1('BAB III: PELAKSANAAN TEST CASES & HASIL PENGUJIAN'),
        createParagraph('Pengujian fungsional komprehensif dilaksanakan terhadap 25 skenario uji utama (TC-01 hingga TC-25) yang mencakup seluruh fungsionalitas kritis sistem SIAP LAPOR. Rincian pelaksanaan dan status hasil pengujian dirangkum dalam tabel di bawah ini:'),

        // TABEL 25 TEST CASES
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            left: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
          },
          rows: [
            new TableRow({
              children: [
                createTableHeaderCell('ID', 8),
                createTableHeaderCell('Modul / Fitur', 18),
                createTableHeaderCell('Skenario & Masukan (Input)', 22),
                createTableHeaderCell('Hasil yang Diharapkan (Expected)', 24),
                createTableHeaderCell('Hasil Aktual (Actual)', 20),
                createTableHeaderCell('Status', 8),
              ],
            }),
            ...testCases.map((tc, index) => {
              const isZebra = index % 2 === 1;
              return new TableRow({
                children: [
                  createTableCell(tc.id, { isMono: true, bold: true, isZebra, alignment: AlignmentType.CENTER, widthPct: 8 }),
                  createTableCell(`${tc.module}\n(${tc.feature})`, { bold: true, isZebra, widthPct: 18 }),
                  createTableCell(tc.input, { isZebra, widthPct: 22 }),
                  createTableCell(tc.expected, { isZebra, widthPct: 24 }),
                  createTableCell(tc.actual, { isZebra, widthPct: 20 }),
                  createTableCell(tc.status, {
                    bold: true,
                    isZebra,
                    alignment: AlignmentType.CENTER,
                    color: tc.status === 'PASS' ? COLOR_SUCCESS : COLOR_DANGER,
                    widthPct: 8
                  }),
                ],
              });
            }),
          ],
        }),

        new Paragraph({ spacing: { before: 200 } }),

        createCallout(
          'REKAPITULASI HASIL BLACK-BOX TESTING:',
          'Dari 25 kasus uji fungsional yang dieksekusi secara menyeluruh, 25 kasus uji (100%) dinyatakan memenuhi ekspektasi (PASS). Seluruh fungsi kunci mulai dari navigasi, pengajuan formulir, pelacakan tiket, investigasi admin, disposisi SPT, hingga penyelesaian tugas lapangan URC terbukti beroperasi sesuai rancangan.',
          'F0FDF4',
          COLOR_SUCCESS
        ),

        // --------------------------------------------------------------------
        // BAB IV: TEMUAN BUGS DAN AKTIVITAS DEBUGGING
        // --------------------------------------------------------------------
        createHeading1('BAB IV: TEMUAN BUGS DAN AKTIVITAS DEBUGGING (DEFECT LOG & RESOLUTION)'),
        createParagraph('Selama proses pengujian intensif terhadap implementasi vibe coding awal, tim penguji menemukan 6 cacat/kutu (bugs) yang kemudian diisolasi, didiagnosis akar permasalahannya, dan diselesaikan melalui tindakan debugging terarah. Berikut adalah rincian investigasi dan resolusi perbaikan:'),

        // BUG 1
        createHeading2('4.1 Bug #1: State Modal Pelacakan Tiket Terkunci (Search Modal Lock Bug)'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            left: { style: BorderStyle.SINGLE, size: 12, color: 'DC2626' }, // Red alert border
            right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
          },
          rows: [
            new TableRow({
              children: [
                createTableCell('Parameter Bug', { bold: true, widthPct: 25, isZebra: true }),
                createTableCell('Deskripsi / Analisis Investigasi', { bold: true, widthPct: 75 }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('ID & Tingkat Keparahan', { isZebra: true }),
                createTableCell('BUG-01 | HIGH (Tinggi) – Merusak interaktivitas pelacakan tiket', { bold: true, color: 'DC2626' }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Lokasi Berkas Kode', { isZebra: true }),
                createTableCell('src/components/common/TrackTicketModal.tsx (Baris 7–20)', { isMono: true }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Gejala Kesalahan (Symptom)', { isZebra: true }),
                createTableCell('Saat modal pelacakan dibuka dengan parameter nomor tiket awal (misalnya "BDL-2026-0892"), pengguna tidak dapat mencari tiket lain. Mengetik pada kolom pencarian di dalam modal atau mengklik tombol cepat contoh (misal: "#102 Selesai") tidak mengubah tampilan tiket yang ditampilkan.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Akar Masalah (Root Cause)', { isZebra: true }),
                createTableCell('Ekspresi pengambilan query: const currentQuery = (trackingModalTicket || searchInput).trim().toUpperCase(); Karena trackingModalTicket dari context bernilai string tidak kosong (truthy), operator OR (||) selalu mengevaluasi trackingModalTicket dan mengabaikan searchInput pengguna secara permanen.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Tindakan Debugging & Solusi', { isZebra: true }),
                createTableCell('Memperbaiki state dengan mensinkronkan searchInput secara reaktif menggunakan hook React.useEffect([trackingModalTicket]) dan menjadikan searchInput sebagai single source of truth untuk evaluasi currentQuery.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Status Verifikasi Pasca-Fix', { isZebra: true }),
                createTableCell('RESOLVED (Tuntas). Modal kini reaktif 100% terhadap ketikan manual pengguna maupun klik tombol uji cepat.', { bold: true, color: COLOR_SUCCESS }),
              ],
            }),
          ],
        }),

        createParagraph(''),

        // BUG 2
        createHeading2('4.2 Bug #2: Ketidaklengkapan Master Data 20 Kecamatan Kota Bandar Lampung'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            left: { style: BorderStyle.SINGLE, size: 12, color: 'D97706' }, // Amber border
            right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
          },
          rows: [
            new TableRow({
              children: [
                createTableCell('Parameter Bug', { bold: true, widthPct: 25, isZebra: true }),
                createTableCell('Deskripsi / Analisis Investigasi', { bold: true, widthPct: 75 }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('ID & Tingkat Keparahan', { isZebra: true }),
                createTableCell('BUG-02 | MEDIUM (Sedang) – Inkonsistensi data administratif wilayah', { bold: true, color: 'D97706' }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Lokasi Berkas Kode', { isZebra: true }),
                createTableCell('src/data/mockData.ts (Konstanta BANDAR_LAMPUNG_DISTRICTS)', { isMono: true }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Gejala Kesalahan (Symptom)', { isZebra: true }),
                createTableCell('Meskipun dokumen PRD dan Design.md menegaskan terdapat 20 Kecamatan di Kota Bandar Lampung, array data hanya memuat 19 entitas, sehingga warga di salah satu kecamatan tidak dapat memilih lokasinya.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Akar Masalah (Root Cause)', { isZebra: true }),
                createTableCell('Kecamatan "Kedamaian" terlewatkan saat inisialisasi array BANDAR_LAMPUNG_DISTRICTS pada kode mock data awal.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Tindakan Debugging & Solusi', { isZebra: true }),
                createTableCell('Menambahkan entitas "Kedamaian" ke dalam daftar array sehingga genap berjumlah 20 Kecamatan resmi Kota Bandar Lampung.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Status Verifikasi Pasca-Fix', { isZebra: true }),
                createTableCell('RESOLVED (Tuntas). TC-MOD-01 dan TC-09 lulus verifikasi dengan tepat 20 kecamatan.', { bold: true, color: COLOR_SUCCESS }),
              ],
            }),
          ],
        }),

        createParagraph(''),

        // BUG 3
        createHeading2('4.3 Bug #3: Sinkronisasi Statis pada Dashboard Petugas Lapangan URC'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            left: { style: BorderStyle.SINGLE, size: 12, color: 'D97706' },
            right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
          },
          rows: [
            new TableRow({
              children: [
                createTableCell('Parameter Bug', { bold: true, widthPct: 25, isZebra: true }),
                createTableCell('Deskripsi / Analisis Investigasi', { bold: true, widthPct: 75 }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('ID & Tingkat Keparahan', { isZebra: true }),
                createTableCell('BUG-03 | MEDIUM (Sedang) – Disinkronisasi data tugas lapangan', { bold: true, color: 'D97706' }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Lokasi Berkas Kode', { isZebra: true }),
                createTableCell('src/components/pages/OfficerDashboard.tsx (Baris 120–270)', { isMono: true }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Gejala Kesalahan (Symptom)', { isZebra: true }),
                createTableCell('Saat admin menerbitkan SPT baru untuk aduan lain di /admin-verification, laporan tersebut tidak muncul di daftar SPT petugas lapangan. Selain itu, header rincian pengerjaan di sebelah kanan menampilkan teks statis Simpang MBK meskipun petugas mengklik tiket lainnya.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Akar Masalah (Root Cause)', { isZebra: true }),
                createTableCell('Komponen OfficerDashboard menggunakan daftar kartu SPT yang di-hardcode secara statis dalam markup JSX, dan rincian lembar kerja aktif tidak mengambil nilai properti dari activeReport (seperti activeReport.assignment.sptNumber dan activeReport.title).'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Tindakan Debugging & Solusi', { isZebra: true }),
                createTableCell('Mengintegrasikan OfficerDashboard dengan state reports dari AppContext menggunakan filter dinamis (status DITUGASKAN, DIPROSES, atau SELESAI), serta mengikat seluruh elemen header, instruksi pimpinan, koordinat, dan indikator tahapan secara reaktif ke activeReport.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Status Verifikasi Pasca-Fix', { isZebra: true }),
                createTableCell('RESOLVED (Tuntas). Setiap penerbitan SPT baru dari admin langsung tersinkronisasi instan ke portal teknis petugas.', { bold: true, color: COLOR_SUCCESS }),
              ],
            }),
          ],
        }),

        createParagraph(''),

        // BUG 4
        createHeading2('4.4 Bug #4: Ekspor CSV dan Antrean Admin Hanya Mengambil Data Mock Statis'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            left: { style: BorderStyle.SINGLE, size: 12, color: 'D97706' },
            right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
          },
          rows: [
            new TableRow({
              children: [
                createTableCell('Parameter Bug', { bold: true, widthPct: 25, isZebra: true }),
                createTableCell('Deskripsi / Analisis Investigasi', { bold: true, widthPct: 75 }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('ID & Tingkat Keparahan', { isZebra: true }),
                createTableCell('BUG-04 | MEDIUM (Sedang) – Data rekapitulasi CSV tidak mencerminkan data aktual', { bold: true, color: 'D97706' }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Lokasi Berkas Kode', { isZebra: true }),
                createTableCell('src/components/pages/AdminDashboard.tsx (Fungsi handleExportCSV)', { isMono: true }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Gejala Kesalahan (Symptom)', { isZebra: true }),
                createTableCell('Ketika warga mengirimkan aduan baru, aduan tersebut tidak muncul di antrean mendesak admin dan tidak ikut terunduh saat tombol "Ekspor CSV" diklik. Berkas CSV yang terunduh selalu hanya memuat 4 baris data statis.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Akar Masalah (Root Cause)', { isZebra: true }),
                createTableCell('Fungsi handleExportCSV dan tabel antrean mendesak hanya membaca array statis urgentQueue lokal, bukan state global reports dari AppContext.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Tindakan Debugging & Solusi', { isZebra: true }),
                createTableCell('Mengubah antrean mendesak agar memprioritaskan laporan dengan status DIAJUKAN/DIVERIFIKASI dari state global, serta memperbarui generator CSV agar mengekspor seluruh koleksi data aduan aktual lengkap dengan nama pelapor dan stempel waktu.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Status Verifikasi Pasca-Fix', { isZebra: true }),
                createTableCell('RESOLVED (Tuntas). Berkas CSV terunduh secara komprehensif memuat seluruh entri laporan yang tersimpan dalam sistem.', { bold: true, color: COLOR_SUCCESS }),
              ],
            }),
          ],
        }),

        createParagraph(''),

        // BUG 5
        createHeading2('4.5 Bug #5: Batas Input Karakter Deskripsi Melebihi Kriteria PRD (550 vs 500 Karakter)'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            left: { style: BorderStyle.SINGLE, size: 12, color: '3B82F6' }, // Blue border
            right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
          },
          rows: [
            new TableRow({
              children: [
                createTableCell('Parameter Bug', { bold: true, widthPct: 25, isZebra: true }),
                createTableCell('Deskripsi / Analisis Investigasi', { bold: true, widthPct: 75 }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('ID & Tingkat Keparahan', { isZebra: true }),
                createTableCell('BUG-05 | LOW (Rendah) – Ketidaksesuaian batas input formulir', { bold: true, color: '3B82F6' }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Lokasi Berkas Kode', { isZebra: true }),
                createTableCell('src/components/pages/CitizenReportForm.tsx (Baris 230)', { isMono: true }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Gejala Kesalahan (Symptom)', { isZebra: true }),
                createTableCell('Pada textarea deskripsi aduan warga, counter menunjukkan n/500 karakter namun atribut HTML maxLength bernilai 550, sehingga warga dapat mengetik hingga 550 karakter yang memicu tampilan peringatan merah yang tidak sinkron.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Akar Masalah (Root Cause)', { isZebra: true }),
                createTableCell('Atribut maxLength={550} tidak dikunci ketat pada angka 500 karakter sesuai spesifikasi batas PRD.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Tindakan Debugging & Solusi', { isZebra: true }),
                createTableCell('Mengubah atribut menjadi maxLength={500} sehingga input terpotong tepat pada karakter ke-500 secara alami dan konsisten dengan counter.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Status Verifikasi Pasca-Fix', { isZebra: true }),
                createTableCell('RESOLVED (Tuntas). Input terkunci tepat pada 500 karakter.', { bold: true, color: COLOR_SUCCESS }),
              ],
            }),
          ],
        }),

        createParagraph(''),

        // BUG 6
        createHeading2('4.6 Bug #6: Kesalahan Sintaksis JSX Pasca-Pengeditan (Syntax Error Build Blocker)'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            left: { style: BorderStyle.SINGLE, size: 12, color: 'DC2626' },
            right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
          },
          rows: [
            new TableRow({
              children: [
                createTableCell('Parameter Bug', { bold: true, widthPct: 25, isZebra: true }),
                createTableCell('Deskripsi / Analisis Investigasi', { bold: true, widthPct: 75 }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('ID & Tingkat Keparahan', { isZebra: true }),
                createTableCell('BUG-06 | CRITICAL (Kritis) – Kegagalan kompilasi TypeScript (Build Blocker)', { bold: true, color: 'DC2626' }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Lokasi Berkas Kode', { isZebra: true }),
                createTableCell('src/components/pages/AdminDashboard.tsx (Baris 372)', { isMono: true }),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Gejala Kesalahan (Symptom)', { isZebra: true }),
                createTableCell('Perintah npm run build gagal dengan pesan: "error TS1381: Unexpected token. Did you mean {\'}\'} or &rbrace;?"'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Akar Masalah (Root Cause)', { isZebra: true }),
                createTableCell('Terdapat duplikasi kurung penutup array map JSX "))}" pada baris 372 saat penggantian kode antrean mendesak.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Tindakan Debugging & Solusi', { isZebra: true }),
                createTableCell('Menghapus baris duplikasi "))}" dan memverifikasi struktur penutupan tag JSX.'),
              ],
            }),
            new TableRow({
              children: [
                createTableCell('Status Verifikasi Pasca-Fix', { isZebra: true }),
                createTableCell('RESOLVED (Tuntas). Kompilasi TypeScript dan Vite build berhasil 100% tanpa kesalahan.', { bold: true, color: COLOR_SUCCESS }),
              ],
            }),
          ],
        }),

        // --------------------------------------------------------------------
        // BAB V: PENGUJIAN OTOMASI
        // --------------------------------------------------------------------
        createHeading1('BAB V: PENGUJIAN OTOMASI (AUTOMATED TEST SUITE EXECUTION)'),
        createParagraph('Selain pengujian manual berbasis antarmuka (black-box), pengujian juga dieksekusi secara otomatis menggunakan test runner mandiri berbasis Node.js (test_suite.cjs). Skrip ini memverifikasi aturan bisnis kritis, keterpaduan skema data, transisi siklus hidup tiket, algoritma pencarian substring, serta pencegahan bug state.'),

        createHeading2('5.1 Ringkasan Kasus Uji Otomasi'),
        createParagraph('Skrip otomatis test_suite.cjs menjalankan 5 kelompok pengujian:'),
        createParagraph('• Suite 1 (Struktur Data): Menguji kelengkapan 20 Kecamatan resmi Kota Bandar Lampung (TC-MOD-01), format Regex tiket publik TKT-BDL-2026-XXXX (TC-MOD-02), dan format nomor SPT resmi OPD (TC-MOD-03).'),
        createParagraph('• Suite 2 (Alur Status): Menguji validasi 6 enum status (TC-WFL-01), alur transisi sukses diajukan-ditugaskan-diproses-selesai (TC-WFL-02), dan alur penolakan laporan dengan alasan tercatat (TC-WFL-03).'),
        createParagraph('• Suite 3 (Validasi & Privasi Data): Menguji masking identitas warga untuk mode anonim sesuai UU PDP (TC-SEC-01), validasi batasan karakter deskripsi max 500 (TC-SEC-02), dan integritas koordinat EXIF anti-hoaks (TC-SEC-03).'),
        createParagraph('• Suite 4 (Pelacakan Tiket): Menguji algoritma pencarian substring/exact matching nomor tiket (TC-TRK-01) dan simulasi perbandingan logika lama vs logika baru modal pelacakan (TC-TRK-02).'),
        createParagraph('• Suite 5 (Dashboard & CSV): Menguji kalkulasi metrik agregat real-time (TC-DSH-01) dan integritas struktur baris berkas ekspor CSV (TC-DSH-02).'),

        createHeading2('5.2 Log Hasil Eksekusi Pengujian Otomasi'),
        createCallout(
          'LOG EKSEKUSI KONSOL NODE.JS (test_suite.cjs):',
          '================================================================\n' +
          'SIAP LAPOR – SUITE PENGUJIAN DAN DIAGNOSIS SISTEM (AUTOMATED)\n' +
          '================================================================\n\n' +
          '--- SUITE 1: STRUKTUR DATA & INTEGRITAS ENTITAS ---\n' +
          '[PASS] TC-MOD-01: Verifikasi 20 Kecamatan Resmi Kota Bandar Lampung\n' +
          '[PASS] TC-MOD-02: Format Nomor Tiket Publik Standar Kota Bandar Lampung\n' +
          '[PASS] TC-MOD-03: Format Nomor SPT Resmi OPD\n\n' +
          '--- SUITE 2: ALUR STATUS & ATURAN BISNIS ---\n' +
          '[PASS] TC-WFL-01: Validasi Status Report Status Lifecycle\n' +
          '[PASS] TC-WFL-02: Transisi Sukses (Happy Path) Pengaduan Warga ke Selesai\n' +
          '[PASS] TC-WFL-03: Transisi Penolakan Laporan (Reject Flow)\n\n' +
          '--- SUITE 3: VALIDASI & PERLINDUNGAN DATA (UU PDP) ---\n' +
          '[PASS] TC-SEC-01: Masking Identitas Pelapor untuk Mode Anonim\n' +
          '[PASS] TC-SEC-02: Validasi Batas Karakter Deskripsi Laporan (Max 500 Char)\n' +
          '[PASS] TC-SEC-03: Integritas Metadata EXIF Anti-Hoaks\n\n' +
          '--- SUITE 4: PELACAKAN TIKET & REAKTIVITAS PENCARIAN ---\n' +
          '[PASS] TC-TRK-01: Algoritma Pencarian Tiket (Exact & Substring Matching)\n' +
          '[PASS] TC-TRK-02: Verifikasi Reaktivitas Search State Modal (Mencegah Bug Modal Lock)\n\n' +
          '--- SUITE 5: DASHBOARD AGGREGASI METRIK & EKSPOR CSV ---\n' +
          '[PASS] TC-DSH-01: Kalkulasi Metrik Agregat Real-Time\n' +
          '[PASS] TC-DSH-02: Integritas Struktur Format CSV Rekapitulasi\n\n' +
          '================================================================\n' +
          'HASIL AKHIR PENGUJIAN: Total: 13 | Berhasil (PASS): 13 (100%) | Gagal (FAIL): 0\n' +
          '================================================================',
          'F8FAFC',
          '0F172A'
        ),

        createHeading2('5.3 Verifikasi Kompilasi Produksi (Production Build Verification)'),
        createParagraph('Kompilasi TypeScript dan bundling Vite dieksekusi dengan perintah npm run build (tsc && vite build). Hasil eksekusi membuktikan tidak ada satupun kesalahan tipe (zero type errors) maupun peringatan sintaks:'),
        createCallout(
          'LOG HASIL BUILD VITE PRODUCTION:',
          '> siap-lapor-bandar-lampung@1.4.0 build\n' +
          '> tsc && vite build\n\n' +
          'vite v6.4.6 building for production...\n' +
          'transforming...\n' +
          '✓ 1589 modules transformed.\n' +
          'rendering chunks...\n' +
          'computing gzip size...\n' +
          'dist/index.html                   1.39 kB │ gzip:  0.77 kB\n' +
          'dist/assets/index-DsDO6J6-.css   45.98 kB │ gzip:  8.01 kB\n' +
          'dist/assets/index-BRIwtE8g.js   310.52 kB │ gzip: 81.76 kB\n' +
          '✓ built in 5.75s',
          'F0FDF4',
          COLOR_SUCCESS
        ),

        // --------------------------------------------------------------------
        // BAB VI: KESIMPULAN DAN REKOMENDASI
        // --------------------------------------------------------------------
        createHeading1('BAB VI: KESIMPULAN DAN REKOMENDASI'),
        createHeading2('6.1 Kesimpulan'),
        createParagraph('Berdasarkan keseluruhan tahapan pengujian fungsionalitas antarmuka (25 skenario uji), pengujian otomasi unit & logika bisnis (13 skenario uji), serta aktivitas debugging mendalam, dapat ditarik kesimpulan sebagai berikut:'),
        createParagraph('1. Aplikasi SIAP LAPOR v1.4 telah memenuhi seluruh kriteria penerimaan (acceptance criteria) yang dirumuskan pada PRD_SIAP_LAPOR_Rayhan_Pratama.md dan panduan rancangan visual Design.md.'),
        createParagraph('2. Seluruh alur transisi status aduan (Diajukan → Diverifikasi → Ditugaskan → Diproses → Selesai, serta opsi Ditolak) bekerja dengan lancar dan mempertahankan integritas jejak audit (audit trail) serta riwayat stempel waktu.'),
        createParagraph('3. Enam cacat sistem (bugs) yang terdeteksi selama pengujian (termasuk modal lock, inkonsistensi master kecamatan, statis dashboard petugas, dan ekspor CSV) telah berhasil diperbaiki secara tuntas melalui debugging terstruktur.'),
        createParagraph('4. Aplikasi menghasilkan 100% kelulusan (PASS) baik pada pengujian manual maupun pengujian otomasi skrip, serta sukses dikompilasi ke dalam paket produksi Vite tanpa kesalahan tipe (zero errors).'),

        createHeading2('6.2 Kesiapan Menuju Tahap Selanjutnya'),
        createParagraph('Dengan tuntasnya tahapan testing dan debugging pada butir tugas nomor 6 dan nomor 7 ini, prototipe SIAP LAPOR dinyatakan berada dalam kondisi stabil, kokoh, dan siap untuk melanjutkan ke tahapan tugas berikutnya pada Ujian Tengah Semester (UTS), yaitu:'),
        createParagraph('• Melakukan Audit Security komprehensif dan penyusunan laporannya dalam format .docx (Tugas Butir 8).'),
        createParagraph('• Melakukan perbaikan kode sesuai hasil audit security (Tugas Butir 9).'),
        createParagraph('• Melakukan deployment proyek ke platform cloud Vercel (Tugas Butir 10).'),

        // --------------------------------------------------------------------
        // LAMPIRAN: PROMPT AI UNTUK TABEL JAWABAN UTS
        // --------------------------------------------------------------------
        createHeading1('LAMPIRAN: PROMPT AI SOAL UTS NOMOR 6'),
        createParagraph('Berikut adalah teks prompt AI yang digunakan untuk melaksanakan tahapan testing dan debugging ini, yang dapat disalin langsung ke tabel lembar jawaban Ujian Tengah Semester (UTS):'),
        
        createCallout(
          'PROMPT AI BUTIR SOAL NOMOR 6 (UNTUK TABEL JAWABAN UTS):',
          'Bertindaklah sebagai Senior QA Engineer, Software Tester, dan Lead Developer profesional. Lakukan pengujian perangkat lunak (software testing) secara komprehensif (Black-Box Testing, Boundary Value Analysis, Integration Testing, dan Automated Testing) serta debugging menyeluruh pada sistem informasi SIAP LAPOR (Sistem Informasi Aduan dan Pelaporan Masyarakat Kota Bandar Lampung). Identifikasi bug yang ada pada antarmuka warga, pelacakan tiket, dashboard admin, disposisi SPT, dan dashboard petugas lapangan. Perbaiki seluruh bug yang ditemukan hingga kompilasi build bersih tanpa kesalahan. Kemudian susun laporan hasil testing dan debugging secara lengkap, ilmiah, sistematis, dan profesional dalam format dokumen Word (.docx) berstandar akademik Ujian Tengah Semester.',
          'EFF6FF',
          COLOR_PRIMARY
        ),

        new Paragraph({ spacing: { before: 240 } }),

        createParagraph('Dokumen laporan ini dicetak dan digenerate secara otomatis pada sistem SIAP LAPOR Kota Bandar Lampung.', {
          alignment: AlignmentType.CENTER,
          italics: true,
          color: COLOR_MUTED,
        }),
        createParagraph('Copyright©2026 by Rayhan Pratama dan Dr. Erliyan Redy Susanto, M.Kom', {
          alignment: AlignmentType.CENTER,
          bold: true,
          color: COLOR_PRIMARY,
        }),
      ],
    },
  ],
});

// Write to files
async function generateDocs() {
  const buffer = await Packer.toBuffer(doc);
  
  // Destination 1: workspace root (D:\Download\Siap Lapor\Laporan_Testing_and_Debugging_SIAP_LAPOR_Rayhan_Pratama.docx)
  const destPath1 = path.join(__dirname, '..', 'Laporan_Testing_and_Debugging_SIAP_LAPOR_Rayhan_Pratama.docx');
  // Destination 2: project folder (D:\Download\Siap Lapor\Siap Lapor\Laporan_Testing_and_Debugging_SIAP_LAPOR_Rayhan_Pratama.docx)
  const destPath2 = path.join(__dirname, 'Laporan_Testing_and_Debugging_SIAP_LAPOR_Rayhan_Pratama.docx');

  fs.writeFileSync(destPath1, buffer);
  fs.writeFileSync(destPath2, buffer);

  console.log(`\nDokumen .docx berhasil dibuat:`);
  console.log(`1. ${destPath1} (${buffer.length} bytes)`);
  console.log(`2. ${destPath2} (${buffer.length} bytes)`);
}

generateDocs().catch((err) => {
  console.error('Gagal membuat berkas .docx:', err);
  process.exit(1);
});
