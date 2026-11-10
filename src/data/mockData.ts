import { Category, Report, AuditLog } from '../types';

export const BANDAR_LAMPUNG_DISTRICTS = [
  'Bumi Waras',
  'Enggal',
  'Kedamaian',
  'Kedaton',
  'Kemiling',
  'Labuhan Ratu',
  'Langkapura',
  'Panjang',
  'Rajabasa',
  'Sukabumi',
  'Sukarame',
  'Tanjung Karang Barat',
  'Tanjung Karang Pusat',
  'Tanjung Karang Timur',
  'Tanjung Senang',
  'Teluk Betung Barat',
  'Teluk Betung Selatan',
  'Teluk Betung Timur',
  'Teluk Betung Utara',
  'Way Halim'
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-jalan',
    name: 'Jalan Rusak & Lubang',
    opd: 'Dinas Bina Marga & Bina Konstruksi (BMBK)',
    activeReports: 142,
    targetSlaHours: 24,
    icon: 'construction',
    description: 'Aspal berlubang, amblas, jembatan rusak, dan trotoar pecah.'
  },
  {
    id: 'cat-sampah',
    name: 'Sampah & TPS Liar',
    opd: 'Dinas Lingkungan Hidup (DLH)',
    activeReports: 89,
    targetSlaHours: 12,
    icon: 'delete_sweep',
    description: 'Penumpukan sampah liar, TPS meluap, dan pembersihan sungai/saluran.'
  },
  {
    id: 'cat-pju',
    name: 'Lampu PJU Padam',
    opd: 'Dinas Perhubungan (Dishub)',
    activeReports: 63,
    targetSlaHours: 24,
    icon: 'lightbulb',
    description: 'Penerangan Jalan Umum mati, tiang miring, atau korsleting kabel PJU.'
  },
  {
    id: 'cat-drainase',
    name: 'Drainase & Genangan Air',
    opd: 'Dinas SDA & Pemukiman',
    activeReports: 37,
    targetSlaHours: 48,
    icon: 'water_damage',
    description: 'Saluran tersumbat sedimen lumpur, gorong-gorong pecah, dan genangan jalan.'
  },
  {
    id: 'cat-taman',
    name: 'Taman & Fasilitas Kota',
    opd: 'Dinas Perumahan & Kawasan Permukiman',
    activeReports: 21,
    targetSlaHours: 48,
    icon: 'park',
    description: 'Pohon pelindung rawan tumbang, bangku taman rusak, dan fasilitas publik.'
  },
  {
    id: 'cat-trantibum',
    name: 'Ketertiban & Trantibum',
    opd: 'Satpol PP Kota Bandar Lampung',
    activeReports: 18,
    targetSlaHours: 6,
    icon: 'local_police',
    description: 'Gangguan ketertiban umum, PKL menutup akses vital, dan pelanggaran perda.'
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'BDL-2026-0892',
    publicTicketId: 'TKT-BDL-2026-0892',
    title: 'Aspal Amblas & Lubang Berdiameter 40cm Dekat Lampu Merah MBK',
    description: 'Terdapat lubang jalan cukup dalam (sekitar 12-15 cm) akibat hujan deras semalam di lajur kiri mengarah Rajabasa, tepat 50 meter sebelum lampu merah simpang Mall Boemi Kedaton. Pagi ini sudah ada 2 pengendara motor hampir terjatuh saat jam sibuk kerja karena menghindari lubang secara mendadak. Mohon segera ditindaklanjuti penambalan aspal darurat hotmix oleh dinas PU sebelum timbul korban kecelakaan fatal.',
    categoryId: 'cat-jalan',
    categoryName: 'Jalan Rusak & Lubang',
    opd: 'Dinas Bina Marga & Bina Konstruksi (BMBK)',
    district: 'Kedaton',
    subdistrict: 'Labuhan Ratu',
    referencePoint: 'Sekitar 50 meter sebelum lampu merah simpang Mall Boemi Kedaton, seberang halte bus',
    coordinates: {
      lat: -5.3789,
      lng: 105.2514,
      address: 'Jl. ZA. Pagar Alam, Labuhan Ratu, Kec. Kedaton, Kota Bandar Lampung'
    },
    isAnonymous: false,
    reporterName: 'Rahmat Hidayat',
    reporterPhone: '0812-****-4491',
    reporterNikVerified: true,
    status: 'DIAJUKAN',
    priority: 'MENDESAK',
    slaRemaining: '45 Menit',
    createdAt: '24 Okt 2026, 09:15 WIB',
    evidencePhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    exifData: {
      camera: 'Xiaomi 13T (24mm f/1.9)',
      dateTime: '24 Okt 2026 08:58 WIB',
      lat: -5.3789,
      lng: 105.2514,
      isAntiHoaxValid: true
    },
    statusHistories: [
      {
        id: 'sh-1',
        status: 'DIAJUKAN',
        changedAt: '24 Okt 2026 09:15 WIB',
        actor: 'Rahmat Hidayat (Warga)',
        notes: 'Laporan diajukan melalui portal web SIAP LAPOR dengan koordinat GPS valid.'
      }
    ]
  },
  {
    id: 'BDL-2026-0891',
    publicTicketId: 'TKT-BDL-2026-0891',
    title: 'Tumpukan Sampah Liar Dekat Pasar Kangkung Menutup Trotoar',
    description: 'Timbunan sampah pasar basah meluber hingga memakan bahu jalan dan trotoar pejalan kaki sepanjang 10 meter. Menimbulkan bau menyengat bagi pengguna jalan.',
    categoryId: 'cat-sampah',
    categoryName: 'Sampah & TPS Liar',
    opd: 'Dinas Lingkungan Hidup (DLH)',
    district: 'Bumi Waras',
    referencePoint: 'Samping pos retribusi Pasar Kangkung, Jl. Hasanudin',
    coordinates: {
      lat: -5.4412,
      lng: 105.2631,
      address: 'Jl. Hasanudin, Pasar Kangkung, Kec. Bumi Waras'
    },
    isAnonymous: true,
    reporterName: 'Warga Bumi Waras (Anonim)',
    reporterPhone: '0857-****-1289',
    reporterNikVerified: true,
    status: 'DIVERIFIKASI',
    priority: 'SEDANG',
    slaRemaining: '1 Jam 20 Mnt',
    createdAt: '24 Okt 2026 08:42 WIB',
    evidencePhotoUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    exifData: {
      camera: 'Samsung Galaxy A54',
      dateTime: '24 Okt 2026 08:35 WIB',
      lat: -5.4412,
      lng: 105.2631,
      isAntiHoaxValid: true
    },
    statusHistories: [
      {
        id: 'sh-2-1',
        status: 'DIAJUKAN',
        changedAt: '24 Okt 2026 08:42 WIB',
        actor: 'Sistem',
        notes: 'Tiket masuk antrean verifikasi DLH.'
      },
      {
        id: 'sh-2-2',
        status: 'DIVERIFIKASI',
        changedAt: '24 Okt 2026 09:00 WIB',
        actor: 'Admin Putri (Diskominfo)',
        notes: 'Validasi berkas & verifikasi kewenangan Pemkot BDL.'
      }
    ]
  },
  {
    id: 'BDL-2026-0890',
    publicTicketId: 'TKT-BDL-2026-0890',
    title: 'Lampu PJU Padam 4 Titik Menjelang Simpang Tugu Juang',
    description: 'Penerangan jalan padam berurutan sepanjang 200 meter menyebabkan ruas jalan sangat gelap dan membahayakan pengendara malam.',
    categoryId: 'cat-pju',
    categoryName: 'Lampu PJU Padam',
    opd: 'Dinas Perhubungan (Dishub)',
    district: 'Kedaton',
    referencePoint: 'Depan ruko percetakan Teuku Umar dekat simpang tugu',
    coordinates: {
      lat: -5.3985,
      lng: 105.2589,
      address: 'Jl. Teuku Umar, Kec. Kedaton'
    },
    isAnonymous: false,
    reporterName: 'Deni Kurniawan',
    reporterPhone: '0813-****-8821',
    reporterNikVerified: true,
    status: 'DITUGASKAN',
    priority: 'SEDANG',
    slaRemaining: '2 Jam 00 Mnt',
    createdAt: '24 Okt 2026 07:55 WIB',
    evidencePhotoUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80',
    exifData: {
      camera: 'iPhone 13',
      dateTime: '24 Okt 2026 07:40 WIB',
      lat: -5.3985,
      lng: 105.2589,
      isAntiHoaxValid: true
    },
    assignment: {
      sptNumber: 'SPT-DISHUB-2026-0428',
      opd: 'Dinas Perhubungan (Dishub)',
      teamName: 'Tim Teknisi PJU Regu 1',
      officerName: 'Budi Santoso',
      officerNip: '19850612 201001 1 005',
      vehiclePlate: 'BE 9044 AZ',
      assignedAt: '24 Okt 2026 08:30 WIB',
      targetDeadline: '24 Okt 2026 18:00 WIB',
      instructions: 'Lakukan perbaikan modul trafo dan penggantian bohlam LED 120W.'
    },
    statusHistories: [
      { id: 'sh-3-1', status: 'DIAJUKAN', changedAt: '24 Okt 2026 07:55 WIB', actor: 'Deni Kurniawan' },
      { id: 'sh-3-2', status: 'DIVERIFIKASI', changedAt: '24 Okt 2026 08:15 WIB', actor: 'Admin Rian' },
      { id: 'sh-3-3', status: 'DITUGASKAN', changedAt: '24 Okt 2026 08:30 WIB', actor: 'Admin Rian', notes: 'Diterbitkan SPT Dishub No. 0428' }
    ]
  },
  {
    id: 'BDL-2026-0889',
    publicTicketId: 'TKT-BDL-2026-0889',
    title: 'Drainase Meluap Saat Hujan di Jl. Ryacudu Sukarame',
    description: 'Gorong-gorong tersumbat sampah ranting kayu dan endapan tanah liat sehingga air meluap ke aspal setinggi mata kaki.',
    categoryId: 'cat-drainase',
    categoryName: 'Drainase & Genangan Air',
    opd: 'Dinas SDA & Pemukiman',
    district: 'Sukarame',
    referencePoint: 'Seberang kampus UIN RIL gerbang selatan',
    coordinates: {
      lat: -5.3855,
      lng: 105.2982,
      address: 'Jl. Letnan Jenderal Ryacudu, Kec. Sukarame'
    },
    isAnonymous: false,
    reporterName: 'Siti Sarah',
    reporterPhone: '0821-****-9011',
    reporterNikVerified: true,
    status: 'DIAJUKAN',
    priority: 'BIASA',
    slaRemaining: '3 Jam 15 Mnt',
    createdAt: '24 Okt 2026 06:30 WIB',
    evidencePhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=800&q=80',
    exifData: {
      camera: 'Oppo Reno 8',
      dateTime: '24 Okt 2026 06:20 WIB',
      lat: -5.3855,
      lng: 105.2982,
      isAntiHoaxValid: true
    },
    statusHistories: [
      { id: 'sh-4-1', status: 'DIAJUKAN', changedAt: '24 Okt 2026 06:30 WIB', actor: 'Siti Sarah' }
    ]
  },
  {
    id: 'BDL-2026-102',
    publicTicketId: 'TKT-BDL-2026-102',
    title: 'Perbaikan Jalan Berlubang Raden Intan',
    description: 'Penambalan aspal pada badan jalan utama yang berlubang.',
    categoryId: 'cat-jalan',
    categoryName: 'Jalan Rusak & Lubang',
    opd: 'Dinas Bina Marga & Bina Konstruksi (BMBK)',
    district: 'Enggal',
    referencePoint: 'Jl. Raden Intan dekat bundaran Tugu Adipura',
    coordinates: {
      lat: -5.4218,
      lng: 105.2588,
      address: 'Jl. Raden Intan, Kec. Enggal'
    },
    isAnonymous: false,
    reporterName: 'Agus Pratama',
    reporterPhone: '0811-****-3321',
    reporterNikVerified: true,
    status: 'SELESAI',
    priority: 'MENDESAK',
    slaRemaining: '0 Menit (Tuntas)',
    createdAt: '22 Okt 2026 10:00 WIB',
    evidencePhotoUrl: 'https://images.unsplash.com/photo-1584463699039-4aa8d99c5c74?auto=format&fit=crop&w=800&q=80',
    exifData: {
      camera: 'Samsung S23',
      dateTime: '22 Okt 2026 09:45 WIB',
      lat: -5.4218,
      lng: 105.2588,
      isAntiHoaxValid: true
    },
    assignment: {
      sptNumber: 'SPT-BMBK-2026-0988',
      opd: 'Dinas Bina Marga & Bina Konstruksi (BMBK)',
      teamName: 'URC Dinas Bina Marga Wilayah Enggal',
      officerName: 'Supriyadi',
      officerNip: '19810319 200801 1 002',
      vehiclePlate: 'BE 9011 AZ',
      assignedAt: '22 Okt 2026 11:00 WIB',
      targetDeadline: '23 Okt 2026 11:00 WIB',
      instructions: 'Penambalan hotmix 4 cm jalan protokol.'
    },
    workUpdate: {
      beforePhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      afterPhotoUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80',
      completionNotes: 'Penambalan aspal hotmix 4 cm telah tuntas dalam 24 jam. Lalu lintas lancar kembali.',
      hotmixTons: 1.8,
      tackCoatDrums: 1,
      crewCount: 5,
      completedAt: '23 Okt 2026 09:30 WIB',
      verifiedCoordinates: { lat: -5.4218, lng: 105.2588 }
    },
    statusHistories: [
      { id: 'sh-102-1', status: 'DIAJUKAN', changedAt: '22 Okt 2026 10:00 WIB', actor: 'Agus Pratama' },
      { id: 'sh-102-2', status: 'DIVERIFIKASI', changedAt: '22 Okt 2026 10:45 WIB', actor: 'Admin Diskominfo' },
      { id: 'sh-102-3', status: 'DITUGASKAN', changedAt: '22 Okt 2026 11:00 WIB', actor: 'Admin Diskominfo' },
      { id: 'sh-102-4', status: 'DIPROSES', changedAt: '22 Okt 2026 14:00 WIB', actor: 'URC BMBK Enggal' },
      { id: 'sh-102-5', status: 'SELESAI', changedAt: '23 Okt 2026 09:30 WIB', actor: 'URC BMBK Enggal', notes: 'Hotmix 4 cm tuntas.' }
    ]
  },
  {
    id: 'BDL-2026-115',
    publicTicketId: 'TKT-BDL-2026-115',
    title: 'Pembersihan Sampah Liar & Drainase Way Halim',
    description: 'Pembersihan tumpukan sampah dan pengerukan sedimen parit.',
    categoryId: 'cat-sampah',
    categoryName: 'Sampah & TPS Liar',
    opd: 'Dinas Lingkungan Hidup (DLH)',
    district: 'Way Halim',
    referencePoint: 'Dekat pasar Way Halim jalur 2',
    coordinates: {
      lat: -5.3912,
      lng: 105.2741,
      address: 'Kec. Way Halim, Kota Bandar Lampung'
    },
    isAnonymous: false,
    reporterName: 'Lestari Handayani',
    reporterPhone: '0852-****-5512',
    reporterNikVerified: true,
    status: 'DIPROSES',
    priority: 'SEDANG',
    slaRemaining: '3 Jam Tersisa',
    createdAt: '23 Okt 2026 14:00 WIB',
    evidencePhotoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    exifData: {
      camera: 'Realme 11',
      dateTime: '23 Okt 2026 13:45 WIB',
      lat: -5.3912,
      lng: 105.2741,
      isAntiHoaxValid: true
    },
    assignment: {
      sptNumber: 'SPT-DLH-2026-0312',
      opd: 'Dinas Lingkungan Hidup (DLH)',
      teamName: 'Regu Kuning DLH (2 Dump Truck)',
      officerName: 'Suryono',
      officerNip: '19790514 200701 1 004',
      vehiclePlate: 'BE 9421 BZ',
      assignedAt: '23 Okt 2026 15:00 WIB',
      targetDeadline: '24 Okt 2026 15:00 WIB',
      instructions: 'Pengangkutan 2 rit dump truck sampah liar dan penyemprotan desinfektan aroma.'
    },
    statusHistories: [
      { id: 'sh-115-1', status: 'DIAJUKAN', changedAt: '23 Okt 2026 14:00 WIB', actor: 'Lestari' },
      { id: 'sh-115-2', status: 'DIVERIFIKASI', changedAt: '23 Okt 2026 14:30 WIB', actor: 'Admin Diskominfo' },
      { id: 'sh-115-3', status: 'DITUGASKAN', changedAt: '23 Okt 2026 15:00 WIB', actor: 'Admin DLH' },
      { id: 'sh-115-4', status: 'DIPROSES', changedAt: '24 Okt 2026 08:00 WIB', actor: 'Regu Kuning DLH', notes: 'Armada sedang beroperasi di lokasi.' }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '24 Okt 2026, 09:22 WIB',
    event: 'Prioritas dinaikkan menjadi Mendesak oleh analisis resiko kemacetan simpang MBK',
    actor: 'SLA Guard Engine',
    source: 'Server SPBE Diskominfo',
    hashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  },
  {
    id: 'log-2',
    timestamp: '24 Okt 2026, 09:18 WIB',
    event: 'Koordinat GPS (-5.3789, 105.2514) tervalidasi di dalam polygon batas Kota Bandar Lampung',
    actor: 'Geofence Engine',
    source: 'Bappeda GIS Service',
    hashSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
  },
  {
    id: 'log-3',
    timestamp: '24 Okt 2026, 09:15 WIB',
    event: 'Laporan #BDL-2026-0892 diterima dari warga terotentikasi NIK Dukcapil',
    actor: 'Sistem Otomasi SPBE',
    source: 'Gateway SIAP LAPOR',
    hashSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
  }
];

