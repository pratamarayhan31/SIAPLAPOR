export type ReportStatus = 'DIAJUKAN' | 'DIVERIFIKASI' | 'DITUGASKAN' | 'DIPROSES' | 'SELESAI' | 'DITOLAK';

export type PriorityLevel = 'BIASA' | 'SEDANG' | 'MENDESAK';

export interface Category {
  id: string;
  name: string;
  opd: string;
  activeReports: number;
  targetSlaHours: number;
  icon: string;
  description?: string;
}

export interface ReportAttachment {
  id: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  isExifVerified: boolean;
  cameraModel?: string;
  capturedAt?: string;
}

export interface StatusHistory {
  id: string;
  status: ReportStatus;
  changedAt: string;
  actor: string;
  notes?: string;
}

export interface Assignment {
  sptNumber: string;
  opd: string;
  teamName: string;
  officerName: string;
  officerNip: string;
  vehiclePlate: string;
  assignedAt: string;
  targetDeadline: string;
  instructions: string;
}

export interface WorkUpdate {
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  completionNotes: string;
  hotmixTons?: number;
  tackCoatDrums?: number;
  crewCount?: number;
  completedAt: string;
  verifiedCoordinates: { lat: number; lng: number };
}

export interface Report {
  id: string; // e.g. BDL-2026-0892
  publicTicketId: string; // e.g. TKT-BDL-2026-0892
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  opd: string;
  district: string; // Kecamatan
  subdistrict?: string; // Kelurahan
  referencePoint: string;
  coordinates: {
    lat: number;
    lng: number;
    address: string;
  };
  isAnonymous: boolean;
  reporterName: string;
  reporterPhone: string;
  reporterNikVerified: boolean;
  status: ReportStatus;
  priority: PriorityLevel;
  slaRemaining: string;
  createdAt: string;
  evidencePhotoUrl: string;
  exifData: {
    camera: string;
    dateTime: string;
    lat: number;
    lng: number;
    isAntiHoaxValid: boolean;
  };
  assignment?: Assignment;
  workUpdate?: WorkUpdate;
  rejectionReason?: string;
  clarificationRequest?: string;
  statusHistories: StatusHistory[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  source: string;
  hashSha256: string;
}

export type ActivePage = 'landing' | 'citizen-form' | 'admin-dashboard' | 'admin-verification' | 'officer-dashboard';

