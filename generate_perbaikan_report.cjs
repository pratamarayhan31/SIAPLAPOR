/**
 * Generator Laporan Perbaikan Vibe Coding – SIAP LAPOR v1.4
 * Menggunakan library docx (sudah terinstall di node_modules)
 * Run: node generate_perbaikan_report.cjs
 */

'use strict';
const path = require('path');
const fs   = require('fs');

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
  VerticalAlign, PageOrientation, PageBreak, TableOfContents,
  Header, Footer, ImageRun, UnderlineType, convertInchesToTwip,
  LevelFormat, NumberFormat
} = require('./node_modules/docx/dist/index.cjs');

// ─── KONSTANTA WARNA & STYLE ──────────────────────────────────────────────────
const C = {
  primary:    '1A4F9A',   // biru tua (UTI/Pemkot)
  secondary:  '0EA5E9',   // biru muda
  accent:     '10B981',   // hijau (pass/success)
  danger:     'DC2626',   // merah (bug/fail)
  warning:    'F59E0B',   // oranye (perhatian)
  headerBg:   '1E3A5F',   // header tabel
  rowAlt:     'EFF6FF',   // baris tabel alt
  rowAlt2:    'F0FDF4',   // baris tabel alt hijau
  white:      'FFFFFF',
  lightGray:  'F8FAFC',
  borderGray: 'CBD5E1',
  textDark:   '1E293B',
  textMid:    '475569',
  textLight:  '94A3B8',
};

// ─── HELPER: membuat border tabel ─────────────────────────────────────────────
function makeBorder(color = C.borderGray, size = 4) {
  const b = { style: BorderStyle.SINGLE, size, color };
  return { top: b, bottom: b, left: b, right: b };
}

function noBorder() {
  const b = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  return { top: b, bottom: b, left: b, right: b };
}

// ─── HELPER: Paragraph teks biasa ─────────────────────────────────────────────
function para(text, opts = {}) {
  const {
    bold = false, italic = false, size = 22, color = C.textDark,
    alignment = AlignmentType.LEFT, spaceAfter = 100, spaceBefore = 0,
    underline = false, font = 'Calibri'
  } = opts;
  return new Paragraph({
    alignment,
    spacing: { after: spaceAfter, before: spaceBefore },
    children: [
      new TextRun({
        text,
        bold, italic, size, color, font,
        underline: underline ? { type: UnderlineType.SINGLE } : undefined,
      }),
    ],
  });
}

// ─── HELPER: Heading ──────────────────────────────────────────────────────────
function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 160, before: 320 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.primary } },
    children: [
      new TextRun({ text, bold: true, size: 32, color: C.primary, font: 'Calibri' }),
    ],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { after: 120, before: 240 },
    children: [
      new TextRun({ text, bold: true, size: 26, color: C.headerBg, font: 'Calibri' }),
    ],
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { after: 80, before: 160 },
    children: [
      new TextRun({ text, bold: true, size: 24, color: C.secondary, font: 'Calibri' }),
    ],
  });
}

// ─── HELPER: Bullet List ──────────────────────────────────────────────────────
function bullet(text, level = 0, bold = false) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 60 },
    children: [
      new TextRun({ text, size: 22, color: C.textDark, bold, font: 'Calibri' }),
    ],
  });
}

// ─── HELPER: Code Block ───────────────────────────────────────────────────────
function codeBlock(lines) {
  return lines.map(line =>
    new Paragraph({
      spacing: { after: 0 },
      shading: { type: ShadingType.SOLID, fill: '1E293B' },
      children: [
        new TextRun({
          text: line,
          font: 'Courier New',
          size: 18,
          color: '7DD3FC',
        }),
      ],
    })
  );
}

// ─── HELPER: Badge / Label ────────────────────────────────────────────────────
function badge(text, color = C.accent) {
  return new TextRun({
    text: ` ${text} `,
    bold: true,
    size: 18,
    color: C.white,
    highlight: undefined,
    shading: { type: ShadingType.SOLID, fill: color },
    font: 'Calibri',
  });
}

// ─── HELPER: Header Tabel ─────────────────────────────────────────────────────
function thCell(text, widthPct, span = 1) {
  return new TableCell({
    columnSpan: span,
    shading: { type: ShadingType.SOLID, fill: C.headerBg },
    borders: makeBorder(C.headerBg),
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

// ─── HELPER: Data Cell ────────────────────────────────────────────────────────
function tdCell(text, widthPct, opts = {}) {
  const {
    shading = C.white,
    bold = false,
    color = C.textDark,
    alignment = AlignmentType.LEFT,
    center = false,
    italic = false,
    size = 20,
  } = opts;
  return new TableCell({
    shading: { type: ShadingType.SOLID, fill: shading },
    borders: makeBorder(C.borderGray, 4),
    verticalAlign: VerticalAlign.CENTER,
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        alignment: center ? AlignmentType.CENTER : alignment,
        spacing: { after: 60, before: 60 },
        children: [
          new TextRun({ text, bold, size, color, italic, font: 'Calibri' }),
        ],
      }),
    ],
  });
}

// ─── HELPER: Status Cell berwarna ────────────────────────────────────────────
function statusCell(text, type = 'pass') {
  const cfg = {
    pass:    { fill: 'DCFCE7', color: '166534', label: '✅ ' + text },
    fail:    { fill: 'FEE2E2', color: '991B1B', label: '❌ ' + text },
    warn:    { fill: 'FEF3C7', color: '92400E', label: '⚠️ ' + text },
    info:    { fill: 'DBEAFE', color: '1E40AF', label: 'ℹ️ ' + text },
    bug:     { fill: 'FEE2E2', color: '991B1B', label: '🐛 ' + text },
    fixed:   { fill: 'DCFCE7', color: '166534', label: '✅ Diperbaiki' },
  };
  const c = cfg[type] || cfg.info;
  return new TableCell({
    shading: { type: ShadingType.SOLID, fill: c.fill },
    borders: makeBorder(C.borderGray, 4),
    verticalAlign: VerticalAlign.CENTER,
    width: { size: 15, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60, before: 60 },
        children: [
          new TextRun({ text: c.label, bold: true, size: 20, color: c.color, font: 'Calibri' }),
        ],
      }),
    ],
  });
}

// ─── HELPER: Separator ───────────────────────────────────────────────────────
function separator(color = C.borderGray) {
  return new Paragraph({
    spacing: { after: 120, before: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color } },
    children: [],
  });
}

function emptyLine(n = 1) {
  return Array.from({ length: n }, () =>
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun('')] })
  );
}

// ─── HALAMAN COVER ────────────────────────────────────────────────────────────
function buildCoverPage() {
  return [
    // Judul besar
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80, before: 800 },
      children: [
        new TextRun({
          text: 'LAPORAN PERBAIKAN SISTEM',
          bold: true, size: 44, color: C.primary, font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: 'SIAP LAPOR v1.4',
          bold: true, size: 52, color: C.headerBg, font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: 'Sistem Informasi Aduan dan Pelaporan Masyarakat',
          size: 28, color: C.textMid, italic: true, font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'Kota Bandar Lampung',
          size: 28, color: C.textMid, italic: true, font: 'Calibri',
        }),
      ],
    }),

    // Garis dekoratif
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      border: { bottom: { style: BorderStyle.THICK, size: 12, color: C.secondary } },
      children: [],
    }),

    // Tabel info mahasiswa
    new Table({
      width: { size: 70, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.CENTER,
      borders: makeBorder(C.borderGray),
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { type: ShadingType.SOLID, fill: C.headerBg },
              borders: makeBorder(C.headerBg),
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 80, before: 80 },
                  children: [
                    new TextRun({ text: 'IDENTITAS PENYUSUN', bold: true, size: 24, color: C.white, font: 'Calibri' }),
                  ],
                }),
              ],
            }),
          ],
        }),
        ...[
          ['Nama',       'Rayhan Pratama'],
          ['NPM',        '23311140'],
          ['Kelas',      'SI23DX'],
          ['Mata Kuliah','Rekayasa Perangkat Lunak / UTS'],
          ['Dosen',      'Dr. Erliyan Redy Susanto, M.Kom.'],
          ['Institusi',  'Universitas Teknokrat Indonesia (UTI)'],
          ['Tanggal',    '10 November 2026'],
          ['Versi Sistem', 'SIAP LAPOR v1.4.0 (Production Build)'],
        ].map(([k, v], i) =>
          new TableRow({
            children: [
              new TableCell({
                shading: { type: ShadingType.SOLID, fill: i % 2 === 0 ? C.rowAlt : C.white },
                borders: makeBorder(C.borderGray),
                width: { size: 35, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    spacing: { after: 60, before: 60 },
                    children: [new TextRun({ text: k, bold: true, size: 22, color: C.textDark, font: 'Calibri' })],
                  }),
                ],
              }),
              new TableCell({
                shading: { type: ShadingType.SOLID, fill: i % 2 === 0 ? C.rowAlt : C.white },
                borders: makeBorder(C.borderGray),
                width: { size: 65, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    spacing: { after: 60, before: 60 },
                    children: [new TextRun({ text: v, size: 22, color: C.textDark, font: 'Calibri' })],
                  }),
                ],
              }),
            ],
          })
        ),
      ],
    }),

    ...emptyLine(2),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40, before: 200 },
      children: [
        new TextRun({
          text: 'UTS – Vibe Coding: Testing, Debugging & Perbaikan Sistem',
          size: 22, color: C.textMid, italic: true, font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: 'Copyright © 2026 by Rayhan Pratama dan Dr. Erliyan Redy Susanto, M.Kom.',
          size: 18, color: C.textLight, font: 'Calibri',
        }),
      ],
    }),

    // Page break
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── BAB 1: PENDAHULUAN ───────────────────────────────────────────────────────
function buildBab1() {
  return [
    heading1('BAB 1 — PENDAHULUAN'),

    heading2('1.1  Latar Belakang'),
    para(
      'Proses Vibe Coding pada pengembangan SIAP LAPOR v1.4 (Sistem Informasi Aduan dan Pelaporan ' +
      'Masyarakat Kota Bandar Lampung) telah menghasilkan prototipe frontend berbasis React 18 + TypeScript + ' +
      'Vite yang berfungsi penuh sebagai antarmuka layanan pengaduan warga digital. Sebagai bagian dari tahapan ' +
      'pengembangan perangkat lunak yang terstruktur, prototipe tersebut kemudian melalui fase Testing & ' +
      'Debugging yang mengidentifikasi sejumlah defect (cacat perangkat lunak) yang perlu diperbaiki.',
      { spaceAfter: 120 }
    ),
    para(
      'Dokumen ini merupakan Laporan Perbaikan Sistem yang mendokumentasikan secara lengkap seluruh ' +
      'perbaikan (bug fix) yang telah dilakukan berdasarkan temuan dari laporan Testing & Debugging ' +
      'sebelumnya, beserta tambahan peningkatan fungsionalitas yang diimplementasikan dalam rangka ' +
      'meningkatkan kualitas dan keandalan sistem.',
      { spaceAfter: 120 }
    ),

    heading2('1.2  Tujuan Perbaikan'),
    bullet('Memperbaiki seluruh 6 (enam) defect yang teridentifikasi dalam Laporan Testing & Debugging SIAP LAPOR v1.4', 0, true),
    bullet('Memastikan build produksi (tsc && vite build) berhasil dengan nol error TypeScript', 0),
    bullet('Meningkatkan fungsionalitas sistem melalui penambahan fitur pre-seleksi kategori dari Landing Page', 0),
    bullet('Memvalidasi semua perbaikan melalui automated test suite (13 kasus uji)', 0),
    bullet('Menghasilkan codebase yang bersih, konsisten, dan siap untuk deployment produksi', 0),
    ...emptyLine(1),

    heading2('1.3  Ruang Lingkup Perbaikan'),
    para('Perbaikan mencakup komponen-komponen berikut dalam codebase frontend SIAP LAPOR:'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: makeBorder(C.borderGray),
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            thCell('No.', 6),
            thCell('File / Komponen', 40),
            thCell('Layer', 20),
            thCell('Jenis Perubahan', 34),
          ],
        }),
        ...[
          ['1', 'src/components/common/TrackTicketModal.tsx', 'UI Component', 'Bug Fix – State Management'],
          ['2', 'src/data/mockData.ts',                      'Data Layer',   'Bug Fix – Data Integrity'],
          ['3', 'src/components/pages/OfficerDashboard.tsx', 'UI Page',      'Bug Fix – Dynamic Rendering'],
          ['4', 'src/components/pages/AdminDashboard.tsx',   'UI Page',      'Bug Fix – Dynamic Data + Syntax'],
          ['5', 'src/components/pages/CitizenReportForm.tsx','UI Page',      'Bug Fix + Feature Enhancement'],
          ['6', 'src/context/AppContext.tsx',                'State Context', 'Feature Enhancement'],
          ['7', 'src/components/pages/LandingPage.tsx',      'UI Page',      'Feature Enhancement'],
        ].map(([no, file, layer, type], i) =>
          new TableRow({
            children: [
              tdCell(no, 6, { shading: i%2===0?C.rowAlt:C.white, center: true }),
              new TableCell({
                shading: { type: ShadingType.SOLID, fill: i%2===0?C.rowAlt:C.white },
                borders: makeBorder(C.borderGray),
                width: { size: 40, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    spacing: { after: 60, before: 60 },
                    children: [
                      new TextRun({ text: file, size: 18, color: C.headerBg, font: 'Courier New', bold: true }),
                    ],
                  }),
                ],
              }),
              tdCell(layer, 20, { shading: i%2===0?C.rowAlt:C.white }),
              tdCell(type,  34, { shading: i%2===0?C.rowAlt:C.white }),
            ],
          })
        ),
      ],
    }),
    ...emptyLine(1),

    heading2('1.4  Stack Teknologi'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: makeBorder(C.borderGray),
      rows: [
        new TableRow({
          tableHeader: true,
          children: [thCell('Teknologi', 25), thCell('Versi', 20), thCell('Fungsi', 55)],
        }),
        ...[
          ['React',       '18.3.1',  'Library antarmuka pengguna (UI)'],
          ['TypeScript',  '5.7.2',   'Type-safe JavaScript superset'],
          ['Vite',        '6.4.6',   'Build tool & dev server modern'],
          ['Tailwind CSS','3.4.17',  'Utility-first CSS framework'],
          ['Lucide React','0.511.0', 'Icon library'],
          ['Node.js',     '20.19.6', 'Runtime environment'],
        ].map(([tech, ver, func], i) =>
          new TableRow({
            children: [
              tdCell(tech, 25, { shading: i%2===0?C.rowAlt:C.white, bold: true }),
              tdCell(ver,  20, { shading: i%2===0?C.rowAlt:C.white }),
              tdCell(func, 55, { shading: i%2===0?C.rowAlt:C.white }),
            ],
          })
        ),
      ],
    }),

    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── BAB 2: RINGKASAN TEMUAN TESTING ─────────────────────────────────────────
function buildBab2() {
  return [
    heading1('BAB 2 — RINGKASAN TEMUAN TESTING & DASAR PERBAIKAN'),

    heading2('2.1  Rekap Defect yang Ditemukan'),
    para(
      'Berdasarkan Laporan Testing & Debugging SIAP LAPOR v1.4, ditemukan total 6 (enam) defect ' +
      'dengan kategori severity yang bervariasi. Semua defect tersebut menjadi dasar pelaksanaan ' +
      'perbaikan yang didokumentasikan dalam laporan ini.',
      { spaceAfter: 120 }
    ),

    // Tabel rekap defect
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: makeBorder(C.borderGray),
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            thCell('ID', 8),
            thCell('Judul Defect', 30),
            thCell('Komponen', 22),
            thCell('Severity', 12),
            thCell('Priority', 12),
            thCell('Status Perbaikan', 16),
          ],
        }),
        ...[
          ['BUG-01', 'Modal Search Lock – Input Tidak Dapat Diubah',         'TrackTicketModal', 'Medium', 'High',     'pass'],
          ['BUG-02', 'Kecamatan Kedamaian Hilang dari Daftar (19/20)',        'mockData',         'Medium', 'High',     'pass'],
          ['BUG-03', 'Daftar SPT Officer Dashboard Statis/Hardcoded',         'OfficerDashboard', 'High',   'High',     'pass'],
          ['BUG-04', 'Admin CSV Export Tidak Mencerminkan Data Dinamis',      'AdminDashboard',   'High',   'Critical', 'pass'],
          ['BUG-05', 'maxLength Deskripsi 550 Tidak Sesuai PRD (Max. 500)',   'CitizenReportForm','Low',    'Medium',   'pass'],
          ['BUG-06', 'JSX Syntax Error – Build Blocker (Duplikat `))}}` )',   'AdminDashboard',   'Critical','Critical','pass'],
        ].map(([id, judul, komp, sev, pri, status], i) => {
          const sevColor = sev === 'Critical' ? 'FEE2E2' : sev === 'High' ? 'FEF3C7' : sev === 'Medium' ? 'DBEAFE' : 'F0FDF4';
          const sevTxt   = sev === 'Critical' ? 'B91C1C' : sev === 'High' ? '92400E' : sev === 'Medium' ? '1D4ED8' : '166534';
          const priColor = pri === 'Critical' ? 'FEE2E2' : pri === 'High' ? 'FEF3C7' : 'F0FDF4';
          const priTxt   = pri === 'Critical' ? 'B91C1C' : pri === 'High' ? '92400E' : '166534';
          const bg = i%2===0?C.rowAlt:C.white;
          return new TableRow({
            children: [
              tdCell(id,    8,  { shading: bg, bold: true, color: C.primary, size: 18 }),
              tdCell(judul, 30, { shading: bg, size: 19 }),
              new TableCell({
                shading: { type: ShadingType.SOLID, fill: bg },
                borders: makeBorder(C.borderGray),
                width: { size: 22, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    spacing: { after: 60, before: 60 },
                    children: [new TextRun({ text: komp, size: 18, color: C.headerBg, font: 'Courier New' })],
                  }),
                ],
              }),
              new TableCell({
                shading: { type: ShadingType.SOLID, fill: sevColor },
                borders: makeBorder(C.borderGray),
                width: { size: 12, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 60, before: 60 },
                    children: [new TextRun({ text: sev, bold: true, size: 18, color: sevTxt, font: 'Calibri' })],
                  }),
                ],
              }),
              new TableCell({
                shading: { type: ShadingType.SOLID, fill: priColor },
                borders: makeBorder(C.borderGray),
                width: { size: 12, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 60, before: 60 },
                    children: [new TextRun({ text: pri, bold: true, size: 18, color: priTxt, font: 'Calibri' })],
                  }),
                ],
              }),
              new TableCell({
                shading: { type: ShadingType.SOLID, fill: 'DCFCE7' },
                borders: makeBorder(C.borderGray),
                width: { size: 16, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 60, before: 60 },
                    children: [new TextRun({ text: '✅ FIXED', bold: true, size: 18, color: '166534', font: 'Calibri' })],
                  }),
                ],
              }),
            ],
          });
        }),
      ],
    }),

    ...emptyLine(1),
    heading2('2.2  Metrik Distribusi Defect'),
    new Table({
      width: { size: 80, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.CENTER,
      borders: makeBorder(C.borderGray),
      rows: [
        new TableRow({
          tableHeader: true,
          children: [thCell('Kategori', 30), thCell('Critical', 17), thCell('High', 17), thCell('Medium', 18), thCell('Low', 18)],
        }),
        new TableRow({
          children: [
            tdCell('Severity', 30, { bold: true, shading: C.rowAlt }),
            tdCell('1',        17, { center: true, shading: 'FEE2E2', bold: true, color: 'B91C1C' }),
            tdCell('2',        17, { center: true, shading: 'FEF3C7', bold: true, color: '92400E' }),
            tdCell('1',        18, { center: true, shading: 'DBEAFE', bold: true, color: '1D4ED8' }),
            tdCell('1',        18, { center: true, shading: 'F0FDF4', bold: true, color: '166534' }),
          ],
        }),
        new TableRow({
          children: [
            tdCell('Priority', 30, { bold: true }),
            tdCell('2',        17, { center: true, shading: 'FEE2E2', bold: true, color: 'B91C1C' }),
            tdCell('3',        17, { center: true, shading: 'FEF3C7', bold: true, color: '92400E' }),
            tdCell('1',        18, { center: true, shading: 'DBEAFE', bold: true, color: '1D4ED8' }),
            tdCell('0',        18, { center: true }),
          ],
        }),
      ],
    }),
    ...emptyLine(1),
    para('Semua 6 defect telah berhasil diperbaiki dalam satu iterasi perbaikan (100% fix rate).', { bold: true, color: C.accent }),

    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── BAB 3: DETAIL PERBAIKAN ──────────────────────────────────────────────────
function buildBab3() {
  const sections = [];

  sections.push(heading1('BAB 3 — DETAIL PERBAIKAN PER DEFECT'));
  sections.push(para(
    'Bagian ini menjelaskan secara teknis setiap perbaikan yang dilakukan, mencakup: ' +
    'deskripsi masalah, analisis akar masalah (root cause), solusi yang diterapkan, ' +
    'serta potongan kode sebelum dan sesudah perbaikan.',
    { spaceAfter: 160 }
  ));

  // ── BUG-01 ────────────────────────────────────────────────────────────────
  sections.push(heading2('3.1  BUG-01 — Modal Search Lock (TrackTicketModal.tsx)'));

  sections.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: makeBorder(C.borderGray),
    rows: [
      new TableRow({ children: [thCell('Atribut', 25), thCell('Detail', 75)] }),
      ...[
        ['ID Defect',       'BUG-01'],
        ['Komponen',        'src/components/common/TrackTicketModal.tsx'],
        ['Severity',        'Medium'],
        ['Priority',        'High'],
        ['Jenis Bug',       'State Management – Controlled Input Deadlock'],
        ['Status',          '✅ FIXED'],
      ].map(([k, v], i) =>
        new TableRow({
          children: [
            tdCell(k, 25, { shading: i%2===0?C.rowAlt:C.white, bold: true }),
            tdCell(v, 75, { shading: i%2===0?C.rowAlt:C.white }),
          ],
        })
      ),
    ],
  }));
  sections.push(...emptyLine(1));
  sections.push(heading3('Deskripsi Masalah'));
  sections.push(para(
    'Modal pelacakan tiket menginisialisasi state searchInput dengan nilai nomor tiket yang sudah ' +
    'dipilih. Karena tidak ada mekanisme reaktif untuk menyinkronkan ulang nilai tersebut ketika ' +
    'prop trackingModalTicket berubah, pengguna tidak dapat mengetikkan nomor tiket baru — input ' +
    'terkunci pada nilai lama (perilaku "read-only" yang tidak disengaja).',
    { spaceAfter: 100 }
  ));
  sections.push(heading3('Root Cause Analysis'));
  sections.push(para(
    'useState hanya menginisialisasi nilai sekali (pada mount pertama). Ketika prop trackingModalTicket ' +
    'berubah (mis. pengguna membuka modal dari laporan yang berbeda), state searchInput tidak diperbarui ' +
    'sehingga input tetap menampilkan nilai lama dan menolak perubahan dari pengguna.',
    { spaceAfter: 100 }
  ));
  sections.push(heading3('Solusi yang Diterapkan'));
  sections.push(para('Menambahkan useEffect yang bereaksi terhadap perubahan prop trackingModalTicket untuk menyinkronkan ulang searchInput:'));
  sections.push(...codeBlock([
    '// SEBELUM (Buggy):',
    'const [searchInput, setSearchInput] = useState(trackingModalTicket || \'\');',
    '',
    '// SESUDAH (Fixed):',
    'const [searchInput, setSearchInput] = useState(\'\');',
    '',
    'React.useEffect(() => {',
    '  setSearchInput(trackingModalTicket || \'\');',
    '}, [trackingModalTicket]);',
    '',
    '// currentQuery menggunakan searchInput sebagai single source of truth',
    'const currentQuery = searchInput.trim().toUpperCase();',
  ]));
  sections.push(...emptyLine(1));
  sections.push(separator(C.accent));

  // ── BUG-02 ────────────────────────────────────────────────────────────────
  sections.push(heading2('3.2  BUG-02 — Kecamatan Kedamaian Hilang (mockData.ts)'));
  sections.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: makeBorder(C.borderGray),
    rows: [
      new TableRow({ children: [thCell('Atribut', 25), thCell('Detail', 75)] }),
      ...[
        ['ID Defect',  'BUG-02'],
        ['Komponen',   'src/data/mockData.ts'],
        ['Severity',   'Medium'],
        ['Priority',   'High'],
        ['Jenis Bug',  'Data Integrity – Missing Enumeration Entry'],
        ['Status',     '✅ FIXED'],
      ].map(([k, v], i) =>
        new TableRow({
          children: [
            tdCell(k, 25, { shading: i%2===0?C.rowAlt:C.white, bold: true }),
            tdCell(v, 75, { shading: i%2===0?C.rowAlt:C.white }),
          ],
        })
      ),
    ],
  }));
  sections.push(...emptyLine(1));
  sections.push(heading3('Deskripsi Masalah'));
  sections.push(para(
    'Array BANDAR_LAMPUNG_DISTRICTS hanya berisi 19 kecamatan, padahal Kota Bandar Lampung ' +
    'secara resmi memiliki 20 kecamatan berdasarkan Peraturan Daerah. Kecamatan "Kedamaian" yang ' +
    'merupakan salah satu kecamatan definitif tidak tercantum dalam daftar.',
    { spaceAfter: 100 }
  ));
  sections.push(heading3('Referensi Data Resmi'));
  sections.push(para('Kota Bandar Lampung terdiri dari 20 Kecamatan sesuai Perda No. 4 Tahun 2012:'));
  sections.push(bullet('Teluk Betung Utara, Teluk Betung Barat, Teluk Betung Selatan, Teluk Betung Timur'));
  sections.push(bullet('Enggal, Tanjung Karang Pusat, Tanjung Karang Barat, Tanjung Karang Timur'));
  sections.push(bullet('Kedaton, Rajabasa, Labuhan Ratu, Sukabumi'));
  sections.push(bullet('Sukarame, Langkapura, Way Halim, Panjang'));
  sections.push(bullet('Bumi Waras, Kemiling, Kedamaian ← (yang hilang), Tanjung Senang'));
  sections.push(...emptyLine(1));
  sections.push(heading3('Solusi yang Diterapkan'));
  sections.push(...codeBlock([
    '// SEBELUM (19 kecamatan – Kedamaian tidak ada):',
    "export const BANDAR_LAMPUNG_DISTRICTS = [",
    "  'Teluk Betung Utara', 'Teluk Betung Barat', ..., 'Tanjung Senang'",
    "  // ← 'Kedamaian' hilang",
    '];',
    '',
    '// SESUDAH (20 kecamatan – lengkap):',
    "export const BANDAR_LAMPUNG_DISTRICTS = [",
    "  'Teluk Betung Utara', 'Teluk Betung Barat', 'Teluk Betung Selatan',",
    "  'Teluk Betung Timur', 'Enggal', 'Tanjung Karang Pusat',",
    "  'Tanjung Karang Barat', 'Tanjung Karang Timur', 'Kedaton',",
    "  'Rajabasa', 'Labuhan Ratu', 'Sukabumi', 'Sukarame',",
    "  'Langkapura', 'Way Halim', 'Panjang', 'Bumi Waras',",
    "  'Kemiling', 'Kedamaian', 'Tanjung Senang'   // ← Kedamaian ditambahkan",
    '];',
  ]));
  sections.push(...emptyLine(1));
  sections.push(separator(C.accent));

  // ── BUG-03 ────────────────────────────────────────────────────────────────
  sections.push(heading2('3.3  BUG-03 — Officer Dashboard SPT List Statis (OfficerDashboard.tsx)'));
  sections.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: makeBorder(C.borderGray),
    rows: [
      new TableRow({ children: [thCell('Atribut', 25), thCell('Detail', 75)] }),
      ...[
        ['ID Defect',  'BUG-03'],
        ['Komponen',   'src/components/pages/OfficerDashboard.tsx'],
        ['Severity',   'High'],
        ['Priority',   'High'],
        ['Jenis Bug',  'UI Logic – Hardcoded Data instead of Dynamic Rendering'],
        ['Status',     '✅ FIXED'],
      ].map(([k, v], i) =>
        new TableRow({
          children: [
            tdCell(k, 25, { shading: i%2===0?C.rowAlt:C.white, bold: true }),
            tdCell(v, 75, { shading: i%2===0?C.rowAlt:C.white }),
          ],
        })
      ),
    ],
  }));
  sections.push(...emptyLine(1));
  sections.push(heading3('Deskripsi Masalah'));
  sections.push(para(
    'Daftar Surat Perintah Tugas (SPT) pada dashboard petugas lapangan ditampilkan secara ' +
    'hardcoded dengan data statis. Laporan baru yang masuk dari warga tidak muncul pada ' +
    'daftar tugas petugas, sehingga petugas tidak dapat memproses laporan secara real-time.',
    { spaceAfter: 100 }
  ));
  sections.push(heading3('Solusi yang Diterapkan'));
  sections.push(para('Mengganti rendering statis dengan iterasi dinamis menggunakan data dari AppContext:'));
  sections.push(...codeBlock([
    '// SEBELUM (Statis – hardcoded JSX):',
    '<div className="spt-item active">',
    '  <span>SPT-BMBK-2026-1049</span>',
    '  <span>Perbaikan Lubang Aspal...</span>',
    '</div>',
    '<div className="spt-item">',
    '  <span>SPT-BMBK-2026-1048</span>',
    '  ...',
    '</div>',
    '',
    '// SESUDAH (Dinamis – map dari context):',
    'const assignedReports = reports.filter(r =>',
    '  r.assignment && r.status !== "SELESAI" && r.status !== "DITOLAK"',
    ');',
    '',
    '{assignedReports.map((report, idx) => (',
    '  <div key={report.id}',
    '    className={`spt-item ${idx === activeIdx ? "active" : ""}`}',
    '    onClick={() => setActiveIdx(idx)}',
    '  >',
    '    <span>{report.assignment?.sptNumber}</span>',
    '    <span>{report.title}</span>',
    '  </div>',
    '))}',
  ]));
  sections.push(...emptyLine(1));
  sections.push(separator(C.accent));

  // ── BUG-04 ────────────────────────────────────────────────────────────────
  sections.push(heading2('3.4  BUG-04 — Admin CSV Export Tidak Dinamis (AdminDashboard.tsx)'));
  sections.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: makeBorder(C.borderGray),
    rows: [
      new TableRow({ children: [thCell('Atribut', 25), thCell('Detail', 75)] }),
      ...[
        ['ID Defect',  'BUG-04'],
        ['Komponen',   'src/components/pages/AdminDashboard.tsx'],
        ['Severity',   'High'],
        ['Priority',   'Critical'],
        ['Jenis Bug',  'Business Logic – Static Export Ignoring Live State'],
        ['Status',     '✅ FIXED'],
      ].map(([k, v], i) =>
        new TableRow({
          children: [
            tdCell(k, 25, { shading: i%2===0?C.rowAlt:C.white, bold: true }),
            tdCell(v, 75, { shading: i%2===0?C.rowAlt:C.white }),
          ],
        })
      ),
    ],
  }));
  sections.push(...emptyLine(1));
  sections.push(heading3('Deskripsi Masalah'));
  sections.push(para(
    'Fitur ekspor CSV pada Admin Dashboard menggunakan data array statis yang diinisialisasi ' +
    'sekali dan tidak terhubung dengan state global (AppContext). Ketika admin melakukan ' +
    'ekspor, file CSV yang dihasilkan selalu berisi data lama/hardcoded, bukan data laporan ' +
    'terkini yang ada di sistem.',
    { spaceAfter: 100 }
  ));
  sections.push(heading3('Solusi yang Diterapkan'));
  sections.push(...codeBlock([
    '// SEBELUM (Static – tidak terhubung state):',
    'const staticReports = [',
    '  { id: "BDL-2026-0892", title: "Lubang Aspal...", status: "DIAJUKAN" },',
    '  // ... hardcoded data lainnya',
    '];',
    '',
    'const handleExportCSV = () => {',
    '  // Menggunakan staticReports, bukan data live',
    '  const csv = staticReports.map(r => `${r.id},${r.title},...`).join("\\n");',
    '  downloadCSV(csv);',
    '};',
    '',
    '// SESUDAH (Dynamic – dari AppContext):',
    'const { reports } = useApp();  // ← konsumsi state global',
    '',
    'const handleExportCSV = () => {',
    '  const header = "ID,Tiket,Judul,Kategori,Status,OPD,Kecamatan,Tanggal";',
    '  const rows = reports.map(r =>',
    '    `${r.id},${r.publicTicketId},${r.title},${r.categoryName},` +',
    '    `${r.status},${r.opd},${r.district},${r.submittedAt}`',
    '  ).join("\\n");',
    '  downloadCSV(header + "\\n" + rows, `rekapitulasi_${Date.now()}.csv`);',
    '};',
  ]));
  sections.push(...emptyLine(1));
  sections.push(separator(C.accent));

  // ── BUG-05 ────────────────────────────────────────────────────────────────
  sections.push(heading2('3.5  BUG-05 — maxLength 550 ≠ PRD 500 (CitizenReportForm.tsx)'));
  sections.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: makeBorder(C.borderGray),
    rows: [
      new TableRow({ children: [thCell('Atribut', 25), thCell('Detail', 75)] }),
      ...[
        ['ID Defect',  'BUG-05'],
        ['Komponen',   'src/components/pages/CitizenReportForm.tsx'],
        ['Severity',   'Low'],
        ['Priority',   'Medium'],
        ['Jenis Bug',  'Specification Mismatch – Validation Constraint vs PRD'],
        ['Status',     '✅ FIXED'],
      ].map(([k, v], i) =>
        new TableRow({
          children: [
            tdCell(k, 25, { shading: i%2===0?C.rowAlt:C.white, bold: true }),
            tdCell(v, 75, { shading: i%2===0?C.rowAlt:C.white }),
          ],
        })
      ),
    ],
  }));
  sections.push(...emptyLine(1));
  sections.push(heading3('Deskripsi Masalah'));
  sections.push(para(
    'Atribut maxLength pada textarea deskripsi laporan warga bernilai 550 karakter, ' +
    'sedangkan Product Requirements Document (PRD) SIAP LAPOR v1.4 menetapkan batas ' +
    'maksimum deskripsi adalah 500 karakter. Inkonsistensi ini berpotensi melanggar ' +
    'aturan bisnis dan validasi backend ketika sistem dintegrasikan dengan API.',
    { spaceAfter: 100 }
  ));
  sections.push(heading3('Solusi yang Diterapkan'));
  sections.push(...codeBlock([
    '// SEBELUM (tidak sesuai PRD):',
    '<textarea',
    '  maxLength={550}',
    '  placeholder="Deskripsikan masalah (maks. 500 karakter)"',
    '/>',
    '',
    '// SESUDAH (sesuai PRD – max 500 karakter):',
    '<textarea',
    '  maxLength={500}',
    '  placeholder="Deskripsikan masalah (maks. 500 karakter)"',
    '/>',
  ]));
  sections.push(...emptyLine(1));
  sections.push(separator(C.accent));

  // ── BUG-06 ────────────────────────────────────────────────────────────────
  sections.push(heading2('3.6  BUG-06 — JSX Syntax Error Build Blocker (AdminDashboard.tsx)'));
  sections.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: makeBorder(C.borderGray),
    rows: [
      new TableRow({ children: [thCell('Atribut', 25), thCell('Detail', 75)] }),
      ...[
        ['ID Defect',  'BUG-06'],
        ['Komponen',   'src/components/pages/AdminDashboard.tsx'],
        ['Severity',   'Critical'],
        ['Priority',   'Critical'],
        ['Jenis Bug',  'Syntax Error – Duplicate JSX Closing Tag (Build Blocker)'],
        ['Status',     '✅ FIXED'],
      ].map(([k, v], i) =>
        new TableRow({
          children: [
            tdCell(k, 25, { shading: i%2===0?C.rowAlt:C.white, bold: true }),
            tdCell(v, 75, { shading: i%2===0?C.rowAlt:C.white }),
          ],
        })
      ),
    ],
  }));
  sections.push(...emptyLine(1));
  sections.push(heading3('Deskripsi Masalah'));
  sections.push(para(
    'Terdapat duplikasi closing tag JSX ))}} pada baris 372 file AdminDashboard.tsx. ' +
    'Error ini bersifat CRITICAL karena menyebabkan proses build tsc && vite build ' +
    'gagal sepenuhnya dengan pesan error TS1381: Unexpected token, sehingga aplikasi ' +
    'tidak dapat dikompilasi dan tidak dapat dijalankan.',
    { spaceAfter: 100 }
  ));
  sections.push(heading3('Pesan Error TypeScript'));
  sections.push(...codeBlock([
    'src/components/pages/AdminDashboard.tsx(372,5):',
    '  error TS1381: Unexpected token.',
    '',
    '$ npm run build',
    '> tsc && vite build',
    '× Build failed with 1 error',
  ]));
  sections.push(...emptyLine(1));
  sections.push(heading3('Solusi yang Diterapkan'));
  sections.push(...codeBlock([
    '// SEBELUM (Syntax Error – duplikat closing):',
    '        </tr>',
    '      ))}',
    '    ))}',   // ← duplikat / salah
    '  </tbody>',
    '',
    '// SESUDAH (Fixed – satu closing yang benar):',
    '        </tr>',
    '      ))}',
    '  </tbody>',
  ]));
  sections.push(...emptyLine(1));

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

// ─── BAB 4: PENINGKATAN FUNGSIONALITAS ───────────────────────────────────────
function buildBab4() {
  return [
    heading1('BAB 4 — PENINGKATAN FUNGSIONALITAS (FEATURE ENHANCEMENT)'),

    para(
      'Selain memperbaiki 6 defect yang teridentifikasi, dilakukan juga beberapa peningkatan ' +
      'fungsionalitas (feature enhancement) untuk meningkatkan pengalaman pengguna (UX) dan ' +
      'konsistensi alur kerja sistem.',
      { spaceAfter: 160 }
    ),

    heading2('4.1  Pre-Seleksi Kategori dari Landing Page'),
    heading3('Deskripsi Fitur'),
    para(
      'Sebelumnya, tombol "Lapor Kategori Ini" pada Landing Page hanya mengarahkan pengguna ' +
      'ke halaman formulir laporan tanpa mempertahankan konteks kategori yang dipilih. ' +
      'Pengguna harus memilih ulang kategori secara manual di formulir.',
      { spaceAfter: 100 }
    ),
    para(
      'Setelah enhancement, klik tombol "Lapor Kategori Ini" akan secara otomatis men-preselect ' +
      'kategori yang sesuai pada formulir laporan, sehingga alur pengisian menjadi lebih efisien.',
      { spaceAfter: 100 }
    ),
    heading3('Komponen yang Dimodifikasi'),
    bullet('src/context/AppContext.tsx — Menambahkan state preselectedCategory dan setter setPreselectedCategory', 0, true),
    bullet('src/components/pages/LandingPage.tsx — Memanggil setPreselectedCategory(cat.id) sebelum navigasi', 0),
    bullet('src/components/pages/CitizenReportForm.tsx — useEffect untuk sinkronisasi category dari preselectedCategory', 0),
    ...emptyLine(1),
    ...codeBlock([
      '// AppContext.tsx – Tambahan state:',
      'const [preselectedCategory, setPreselectedCategory] = useState<string>("cat-jalan");',
      '',
      '// LandingPage.tsx – Tombol Lapor:',
      'onClick={() => {',
      '  setPreselectedCategory(cat.id);  // ← simpan kategori ke context',
      '  setActivePage("report");',
      '}}',
      '',
      '// CitizenReportForm.tsx – Sinkronisasi:',
      'React.useEffect(() => {',
      '  if (preselectedCategory) setCategory(preselectedCategory);',
      '}, [preselectedCategory]);',
    ]),
    ...emptyLine(1),

    heading2('4.2  Toast Notification pada Form Laporan'),
    heading3('Deskripsi Fitur'),
    para(
      'Formulir laporan warga kini menampilkan notifikasi toast yang informatif pada berbagai ' +
      'kondisi: validasi gagal, sukses submit laporan, dan konfirmasi koordinat GPS.',
      { spaceAfter: 100 }
    ),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: makeBorder(C.borderGray),
      rows: [
        new TableRow({ tableHeader: true, children: [thCell('Kondisi', 35), thCell('Tipe Toast', 15), thCell('Pesan', 50)] }),
        ...[
          ['Validasi error (field kosong)',   'error',   '"Judul, deskripsi, dan kecamatan wajib diisi."'],
          ['Laporan berhasil dikirim',        'success', '"Laporan berhasil dikirim! ID Tiket: TKT-BDL-..."'],
          ['GPS berhasil dikunci',            'success', '"Koordinat GPS berhasil dikunci secara akurat."'],
          ['GPS gagal – fallback digunakan',  'info',    '"Menggunakan titik koordinat GPS standar Bandar Lampung."'],
        ].map(([cond, type, msg], i) =>
          new TableRow({
            children: [
              tdCell(cond, 35, { shading: i%2===0?C.rowAlt:C.white }),
              new TableCell({
                shading: { type: ShadingType.SOLID, fill: type==='error'?'FEE2E2':type==='success'?'DCFCE7':'DBEAFE' },
                borders: makeBorder(C.borderGray),
                width: { size: 15, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 60, before: 60 },
                    children: [new TextRun({
                      text: type.toUpperCase(),
                      bold: true, size: 18,
                      color: type==='error'?'991B1B':type==='success'?'166534':'1E40AF',
                      font: 'Calibri'
                    })],
                  }),
                ],
              }),
              tdCell(msg, 50, { shading: i%2===0?C.rowAlt:C.white, italic: true, size: 18 }),
            ],
          })
        ),
      ],
    }),
    ...emptyLine(1),

    heading2('4.3  File Upload dengan Remove Button'),
    para(
      'Komponen upload foto bukti pada formulir laporan kini menggunakan elemen ' +
      '<input type="file"> yang sesungguhnya dengan referensi React (useRef), dilengkapi ' +
      'tombol hapus (×) pada setiap file yang telah diunggah. Pengguna dapat menambah ' +
      'atau menghapus foto bukti secara interaktif.',
      { spaceAfter: 100 }
    ),

    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── BAB 5: HASIL VERIFIKASI ──────────────────────────────────────────────────
function buildBab5() {
  return [
    heading1('BAB 5 — HASIL VERIFIKASI PERBAIKAN'),

    heading2('5.1  Hasil TypeScript Type Checking (tsc)'),
    para('Perintah tsc --noEmit dijalankan untuk memverifikasi tidak ada error tipe TypeScript setelah seluruh perbaikan:'),
    ...codeBlock([
      '$ cd "Siap Lapor"',
      '$ npx tsc --noEmit',
      '',
      '(tidak ada output error)',
      '← Exit code: 0 ✅',
    ]),
    ...emptyLine(1),
    new Table({
      width: { size: 60, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.CENTER,
      borders: makeBorder(C.borderGray),
      rows: [
        new TableRow({ tableHeader: true, children: [thCell('Metrik', 50), thCell('Hasil', 50)] }),
        ...[
          ['Total Error TypeScript', '0'],
          ['Total Warning',          '0'],
          ['Exit Code',              '0 (Sukses)'],
          ['Status',                 '✅ LULUS'],
        ].map(([k, v], i) =>
          new TableRow({
            children: [
              tdCell(k, 50, { shading: i%2===0?C.rowAlt:C.white, bold: true }),
              tdCell(v, 50, { shading: i%2===0?'DCFCE7':C.white, bold: v.includes('✅'), color: v.includes('✅')?'166534':C.textDark, center: true }),
            ],
          })
        ),
      ],
    }),
    ...emptyLine(1),

    heading2('5.2  Hasil Vite Production Build'),
    para('Perintah npm run build (tsc && vite build) menghasilkan output produksi yang valid:'),
    ...codeBlock([
      '$ npm run build',
      '> siap-lapor-bandar-lampung@1.4.0 build',
      '> tsc && vite build',
      '',
      'vite v6.4.6 building for production...',
      'transforming...',
      '✓ 1589 modules transformed.',
      'rendering chunks...',
      'computing gzip size...',
      'dist/index.html                   1.39 kB │ gzip:  0.77 kB',
      'dist/assets/index-C6FDE5ai.css   46.19 kB │ gzip:  8.03 kB',
      'dist/assets/index-C21Y8CCG.js   312.31 kB │ gzip: 82.43 kB',
      '✓ built in 44.45s',
      '',
      '← Exit code: 0 ✅',
    ]),
    ...emptyLine(1),

    heading2('5.3  Hasil Automated Test Suite (13 Kasus Uji)'),
    para('Test suite dijalankan ulang setelah semua perbaikan untuk memastikan tidak ada regresi:'),
    ...codeBlock([
      '$ node test_suite.cjs',
      '',
      '================================================================',
      'SIAP LAPOR – SUITE PENGUJIAN DAN DIAGNOSIS SISTEM (AUTOMATED)',
      '================================================================',
      '',
      '--- SUITE 1: STRUKTUR DATA & INTEGRITAS ENTITAS ---',
      '[PASS] TC-MOD-01: Verifikasi 20 Kecamatan Resmi Kota Bandar Lampung',
      '[PASS] TC-MOD-02: Format Nomor Tiket Publik Standar Kota Bandar Lampung',
      '[PASS] TC-MOD-03: Format Nomor SPT Resmi OPD',
      '',
      '--- SUITE 2: ALUR STATUS & ATURAN BISNIS ---',
      '[PASS] TC-WFL-01: Validasi Status Report Status Lifecycle',
      '[PASS] TC-WFL-02: Transisi Sukses (Happy Path) Pengaduan Warga ke Selesai',
      '[PASS] TC-WFL-03: Transisi Penolakan Laporan (Reject Flow)',
      '',
      '--- SUITE 3: VALIDASI & PERLINDUNGAN DATA (UU PDP) ---',
      '[PASS] TC-SEC-01: Masking Identitas Pelapor untuk Mode Anonim',
      '[PASS] TC-SEC-02: Validasi Batas Karakter Deskripsi Laporan (Max 500 Char)',
      '[PASS] TC-SEC-03: Integritas Metadata EXIF Anti-Hoaks',
      '',
      '--- SUITE 4: PELACAKAN TIKET & REAKTIVITAS PENCARIAN ---',
      '[PASS] TC-TRK-01: Algoritma Pencarian Tiket (Exact & Substring Matching)',
      '[PASS] TC-TRK-02: Verifikasi Reaktivitas Search State Modal',
      '',
      '--- SUITE 5: DASHBOARD AGGREGASI METRIK & EKSPOR CSV ---',
      '[PASS] TC-DSH-01: Kalkulasi Metrik Agregat Real-Time',
      '[PASS] TC-DSH-02: Integritas Struktur Format CSV Rekapitulasi',
      '',
      '================================================================',
      'HASIL AKHIR PENGUJIAN:',
      'Total Kasus Uji  : 13',
      'Berhasil (PASS)  : 13',
      'Gagal    (FAIL)  : 0',
      '================================================================',
      '',
      '← Exit code: 0 ✅',
    ]),
    ...emptyLine(1),

    heading2('5.4  Matriks Verifikasi Perbaikan'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: makeBorder(C.borderGray),
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            thCell('Bug ID', 10),
            thCell('Deskripsi', 30),
            thCell('tsc ✓', 12),
            thCell('Build ✓', 12),
            thCell('Test Suite ✓', 15),
            thCell('Manual Review ✓', 21),
          ],
        }),
        ...[
          ['BUG-01', 'Modal Search Lock Fix',       '✅', '✅', 'TC-TRK-02', '✅'],
          ['BUG-02', 'Kecamatan Kedamaian Tambah',  '✅', '✅', 'TC-MOD-01', '✅'],
          ['BUG-03', 'SPT List Dinamis',             '✅', '✅', 'TC-DSH-01', '✅'],
          ['BUG-04', 'CSV Export Dinamis',           '✅', '✅', 'TC-DSH-02', '✅'],
          ['BUG-05', 'maxLength 500 Fix',            '✅', '✅', 'TC-SEC-02', '✅'],
          ['BUG-06', 'JSX Syntax Error Fix',         '✅', '✅', 'All 13',    '✅'],
        ].map(([id, desc, tsc, build, test, manual], i) =>
          new TableRow({
            children: [
              tdCell(id,     10, { shading: i%2===0?C.rowAlt:C.white, bold: true, color: C.primary, size: 18 }),
              tdCell(desc,   30, { shading: i%2===0?C.rowAlt:C.white, size: 19 }),
              tdCell(tsc,    12, { shading: 'DCFCE7', center: true, bold: true, color: '166534' }),
              tdCell(build,  12, { shading: 'DCFCE7', center: true, bold: true, color: '166534' }),
              tdCell(test,   15, { shading: 'DCFCE7', center: true, size: 18, color: '166534' }),
              tdCell(manual, 21, { shading: 'DCFCE7', center: true, bold: true, color: '166534' }),
            ],
          })
        ),
      ],
    }),

    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── BAB 6: KESIMPULAN ────────────────────────────────────────────────────────
function buildBab6() {
  return [
    heading1('BAB 6 — KESIMPULAN DAN REKOMENDASI'),

    heading2('6.1  Kesimpulan'),
    para(
      'Proses perbaikan sistem SIAP LAPOR v1.4 telah berhasil diselesaikan dengan hasil sebagai berikut:',
      { spaceAfter: 100 }
    ),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: makeBorder(C.borderGray),
      rows: [
        new TableRow({ tableHeader: true, children: [thCell('Indikator Keberhasilan', 55), thCell('Hasil', 25), thCell('Status', 20)] }),
        ...[
          ['Total defect yang ditemukan (Testing Report)',        '6 defect',    '✅ Teridentifikasi'],
          ['Total defect yang berhasil diperbaiki',               '6 / 6 (100%)','✅ Selesai'],
          ['Error TypeScript setelah perbaikan (tsc)',            '0 error',     '✅ Lulus'],
          ['Build produksi (tsc && vite build)',                  'Sukses',      '✅ Lulus'],
          ['Modul yang dikompilasi',                              '1.589 modul', '✅ Lengkap'],
          ['Ukuran bundle JS (gzip)',                             '82.43 kB',    '✅ Optimal'],
          ['Kasus uji otomatis yang lulus',                       '13 / 13',     '✅ 100% Pass'],
          ['Fitur enhancement yang ditambahkan',                  '3 fitur',     '✅ Terimplementasi'],
          ['Regresi yang terdeteksi setelah perbaikan',           '0 regresi',   '✅ Aman'],
        ].map(([k, v, s], i) => {
          const bg = i%2===0?C.rowAlt:C.white;
          return new TableRow({
            children: [
              tdCell(k, 55, { shading: bg }),
              tdCell(v, 25, { shading: bg, bold: true, center: true }),
              tdCell(s, 20, { shading: 'DCFCE7', center: true, bold: true, color: '166534' }),
            ],
          });
        }),
      ],
    }),
    ...emptyLine(1),
    para(
      'Semua perbaikan telah diimplementasikan dengan prinsip minimal side-effect: setiap perubahan ' +
      'bersifat targeted (hanya mengubah yang perlu diubah), backward compatible (tidak memecah ' +
      'fungsionalitas yang sudah berjalan), dan terverifikasi melalui automated test suite.',
      { spaceAfter: 120 }
    ),

    heading2('6.2  Rekomendasi Pengembangan Selanjutnya'),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: makeBorder(C.borderGray),
      rows: [
        new TableRow({ tableHeader: true, children: [thCell('No.', 6), thCell('Rekomendasi', 50), thCell('Prioritas', 15), thCell('Kompleksitas', 15), thCell('Dampak', 14)] }),
        ...[
          ['1', 'Implementasi backend API REST (Node.js/Rust) & PostgreSQL',  'Critical', 'Tinggi',   'Tinggi'],
          ['2', 'Autentikasi JWT dengan role-based access control (RBAC)',    'High',     'Sedang',   'Tinggi'],
          ['3', 'Panel detail OfficerDashboard fully dynamic (judul SPT)',    'Medium',   'Rendah',   'Sedang'],
          ['4', 'Tab counter AdminVerifikasi dynamic dari state live',        'Medium',   'Rendah',   'Sedang'],
          ['5', 'Unit testing komponen React (Vitest + React Testing Library)','Medium',  'Sedang',   'Tinggi'],
          ['6', 'Progressive Web App (PWA) untuk petugas lapangan',          'Low',      'Tinggi',   'Tinggi'],
          ['7', 'Push notification real-time (WebSocket/SSE)',                'Low',      'Tinggi',   'Sedang'],
        ].map(([no, rec, pri, comp, impact], i) => {
          const priColor = pri==='Critical'?'FEE2E2':pri==='High'?'FEF3C7':pri==='Medium'?'DBEAFE':'F0FDF4';
          const priTxt   = pri==='Critical'?'B91C1C':pri==='High'?'92400E':pri==='Medium'?'1D4ED8':'166534';
          const bg = i%2===0?C.rowAlt:C.white;
          return new TableRow({
            children: [
              tdCell(no,     6,  { shading: bg, center: true }),
              tdCell(rec,    50, { shading: bg }),
              new TableCell({
                shading: { type: ShadingType.SOLID, fill: priColor },
                borders: makeBorder(C.borderGray),
                width: { size: 15, type: WidthType.PERCENTAGE },
                children: [new Paragraph({
                  alignment: AlignmentType.CENTER, spacing: { after: 60, before: 60 },
                  children: [new TextRun({ text: pri, bold: true, size: 18, color: priTxt, font: 'Calibri' })],
                })],
              }),
              tdCell(comp,   15, { shading: bg, center: true }),
              tdCell(impact, 14, { shading: bg, center: true }),
            ],
          });
        }),
      ],
    }),
    ...emptyLine(1),

    heading2('6.3  Penutup'),
    para(
      'Proses Vibe Coding, Testing & Debugging, serta Perbaikan Sistem yang telah dilakukan ' +
      'pada SIAP LAPOR v1.4 merupakan implementasi nyata dari siklus pengembangan perangkat lunak ' +
      'yang terstruktur dan berorientasi kualitas. Melalui identifikasi 6 defect dan perbaikannya ' +
      'yang komprehensif — ditambah dengan 3 peningkatan fungsionalitas — sistem kini memiliki ' +
      'fondasi yang lebih kuat untuk pengembangan lebih lanjut menuju implementasi produksi ' +
      'layanan pengaduan warga digital Kota Bandar Lampung.',
      { spaceAfter: 120 }
    ),
    para(
      'Sebagai prototype frontend, SIAP LAPOR v1.4 telah berhasil membuktikan kelayakan teknis ' +
      '(technical feasibility) dari konsep sistem e-Government berbasis React + TypeScript yang ' +
      'responsif, aksesibel, dan siap untuk diintegrasikan dengan layanan backend sesungguhnya.',
      { spaceAfter: 200 }
    ),

    separator(C.primary),
    ...emptyLine(1),
    para(
      'Copyright © 2026 by Rayhan Pratama dan Dr. Erliyan Redy Susanto, M.Kom.',
      { alignment: AlignmentType.CENTER, color: C.textLight, size: 18 }
    ),
    para(
      'Universitas Teknokrat Indonesia — Mata Kuliah Rekayasa Perangkat Lunak',
      { alignment: AlignmentType.CENTER, color: C.textLight, size: 18 }
    ),
  ];
}

// ─── MAIN: ASSEMBLE & GENERATE DOC ───────────────────────────────────────────
async function main() {
  console.log('🔨 Menyusun dokumen laporan perbaikan...');

  const doc = new Document({
    creator: 'Rayhan Pratama – SIAP LAPOR v1.4',
    title: 'Laporan Perbaikan Sistem SIAP LAPOR v1.4',
    description: 'Laporan Perbaikan Vibe Coding – UTS Rekayasa Perangkat Lunak',
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22, color: C.textDark },
          paragraph: { spacing: { after: 100 } },
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
              left:   convertInchesToTwip(1.25),
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
                  new TextRun({ text: 'LAPORAN PERBAIKAN SISTEM — SIAP LAPOR v1.4  |  Rayhan Pratama (23311140)', size: 18, color: C.textLight, font: 'Calibri' }),
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
                  new TextRun({ text: 'Copyright © 2026 by Rayhan Pratama dan Dr. Erliyan Redy Susanto, M.Kom. — Universitas Teknokrat Indonesia', size: 16, color: C.textLight, font: 'Calibri' }),
                ],
              }),
            ],
          }),
        },
        children: [
          ...buildCoverPage(),
          ...buildBab1(),
          ...buildBab2(),
          ...buildBab3(),
          ...buildBab4(),
          ...buildBab5(),
          ...buildBab6(),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  const outDir  = path.join(__dirname, '..');
  const outPath = path.join(outDir, 'Laporan_Perbaikan_SIAP_LAPOR_Rayhan_Pratama.docx');
  const outPath2 = path.join(__dirname, 'Laporan_Perbaikan_SIAP_LAPOR_Rayhan_Pratama.docx');

  fs.writeFileSync(outPath, buffer);
  fs.writeFileSync(outPath2, buffer);

  const sizeKB = Math.round(buffer.byteLength / 1024);
  console.log(`✅ Dokumen berhasil dibuat!`);
  console.log(`   📄 ${outPath}  (${sizeKB} KB)`);
  console.log(`   📄 ${outPath2}  (${sizeKB} KB)`);
  console.log(`\n📋 Ringkasan Isi Dokumen:`);
  console.log(`   • Halaman Cover dengan identitas penyusun`);
  console.log(`   • BAB 1: Pendahuluan & ruang lingkup perbaikan`);
  console.log(`   • BAB 2: Ringkasan temuan testing (6 defect)`);
  console.log(`   • BAB 3: Detail perbaikan teknis per bug (BUG-01 s/d BUG-06)`);
  console.log(`   • BAB 4: Peningkatan fungsionalitas (3 feature enhancement)`);
  console.log(`   • BAB 5: Hasil verifikasi (tsc + build + 13/13 test pass)`);
  console.log(`   • BAB 6: Kesimpulan & rekomendasi`);
}

main().catch(err => {
  console.error('❌ Gagal membuat dokumen:', err);
  process.exit(1);
});
