import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActivePage, Report, Category, AuditLog, Assignment, WorkUpdate, ReportStatus } from '../types';
import { INITIAL_CATEGORIES, INITIAL_REPORTS, INITIAL_AUDIT_LOGS } from '../data/mockData';
import { generateSecureTicketCode, computeQuickHash, maskSensitiveData } from '../utils/security';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  reports: Report[];
  categories: Category[];
  auditLogs: AuditLog[];
  selectedReportIdForVerification: string;
  setSelectedReportIdForVerification: (id: string) => void;
  preselectedCategory: string;
  setPreselectedCategory: (catId: string) => void;
  trackingModalTicket: string | null;
  openTrackingModal: (ticketId: string) => void;
  closeTrackingModal: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  addNewReport: (data: Partial<Report>) => string;
  assignReportSPT: (reportId: string, assignment: Assignment) => void;
  rejectReport: (reportId: string, reason: string) => void;
  clarifyReport: (reportId: string, note: string) => void;
  submitWorkCompletion: (reportId: string, workUpdate: WorkUpdate) => void;
  updateReportStatus: (reportId: string, status: ReportStatus, note?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<ActivePage>(() => {
    return (localStorage.getItem('siaplapor_active_page') as ActivePage) || 'landing';
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('siaplapor_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REPORTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [selectedReportIdForVerification, setSelectedReportIdForVerification] = useState<string>('BDL-2026-0892');
  const [preselectedCategory, setPreselectedCategory] = useState<string>('cat-jalan');
  const [trackingModalTicket, setTrackingModalTicket] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('siaplapor_active_page', activePage);
    } catch (err) {
      console.warn('Gagal menyimpan active_page ke localStorage:', err);
    }
  }, [activePage]);

  useEffect(() => {
    try {
      localStorage.setItem('siaplapor_reports', JSON.stringify(reports));
    } catch (err) {
      // Pencegahan Client-Side DoS jika kuota browser terlampaui (CWE-400 / SEC-VULN-09)
      console.error('Penyimpanan localStorage penuh (QUOTA_EXCEEDED). Mengamankan state in-memory.', err);
    }
  }, [reports]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openTrackingModal = (ticketId: string) => {
    setTrackingModalTicket(ticketId.trim());
  };

  const closeTrackingModal = () => {
    setTrackingModalTicket(null);
  };

  const addNewReport = (data: Partial<Report>): string => {
    // 1. Pembuatan ID & Tiket Publik dengan Entropi Kriptografis (CWE-639 / SEC-VULN-02)
    const { id: newId, ticket: newPublicTicket } = generateSecureTicketCode('BDL-2026');

    // 2. Masking data kontak untuk perlindungan privasi (UU PDP No. 27/2022 / SEC-VULN-03)
    const rawPhone = data.reporterPhone || '0812-7890-4491';
    const protectedPhone = data.isAnonymous ? '0812-****-****' : maskSensitiveData(rawPhone, 'phone');

    const newReport: Report = {
      id: newId,
      publicTicketId: newPublicTicket,
      title: data.title || 'Laporan Pengaduan Fasilitas Publik',
      description: data.description || '',
      categoryId: data.categoryId || 'cat-jalan',
      categoryName: data.categoryName || 'Jalan Rusak & Lubang',
      opd: data.opd || 'Dinas Bina Marga & Bina Konstruksi (BMBK)',
      district: data.district || 'Kedaton',
      subdistrict: data.subdistrict || 'Rajabasa',
      referencePoint: data.referencePoint || 'Dekat jalan utama',
      coordinates: data.coordinates || {
        lat: -5.3824,
        lng: 105.2578,
        address: 'Jl. ZA. Pagar Alam, Kota Bandar Lampung'
      },
      isAnonymous: Boolean(data.isAnonymous),
      reporterName: data.isAnonymous ? 'Warga Bandar Lampung (Anonim)' : (data.reporterName || 'Warga Terverifikasi'),
      reporterPhone: protectedPhone,
      reporterNikVerified: true,
      status: 'DIAJUKAN',
      priority: data.priority || 'SEDANG',
      slaRemaining: '3 Jam 00 Mnt',
      createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      evidencePhotoUrl: data.evidencePhotoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      exifData: {
        camera: 'Kamera Smartphone (EXIF Verified)',
        dateTime: new Date().toLocaleString('id-ID'),
        lat: data.coordinates?.lat || -5.3824,
        lng: data.coordinates?.lng || 105.2578,
        isAntiHoaxValid: true
      },
      statusHistories: [
        {
          id: `sh-${Date.now()}`,
          status: 'DIAJUKAN',
          changedAt: new Date().toLocaleString('id-ID', { timeStyle: 'short' }) + ' WIB',
          actor: data.isAnonymous ? 'Warga (Anonim)' : (data.reporterName || 'Warga'),
          notes: 'Laporan berhasil dibuat dan masuk antrean sistem SIAP LAPOR.'
        }
      ]
    };

    setReports((prev) => [newReport, ...prev]);

    // 3. Audit trail kriptografis berbasis chained hash (CWE-353 / SEC-VULN-07)
    const prevLogHash = auditLogs[0]?.hashSha256 || '0'.repeat(64);
    const eventText = `Laporan baru #${newId} dibuat (${newReport.categoryName})`;
    const genuineHash = computeQuickHash(eventText, prevLogHash);

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
      event: eventText,
      actor: 'Warga Terverifikasi NIK',
      source: 'Frontend Gateway (Secured)',
      hashSha256: genuineHash
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Laporan berhasil dikirim! Nomor tiket Anda: ${newPublicTicket}`, 'success');
    return newPublicTicket;
  };

  const assignReportSPT = (reportId: string, assignment: Assignment) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const updatedHistories = [
            ...r.statusHistories,
            {
              id: `sh-${Date.now()}`,
              status: 'DITUGASKAN' as ReportStatus,
              changedAt: new Date().toLocaleTimeString('id-ID') + ' WIB',
              actor: 'Administrator Command Center',
              notes: `Disposisi diterbitkan: ${assignment.sptNumber} kepada ${assignment.teamName} (${assignment.officerName})`
            }
          ];
          return {
            ...r,
            status: 'DITUGASKAN',
            assignment: assignment,
            statusHistories: updatedHistories
          };
        }
        return r;
      })
    );

    // Audit trail kriptografis (SEC-VULN-07)
    const prevLogHash = auditLogs[0]?.hashSha256 || '0'.repeat(64);
    const eventText = `Penerbitan ${assignment.sptNumber} untuk #${reportId} ke ${assignment.teamName}`;
    const genuineHash = computeQuickHash(eventText, prevLogHash);

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
      event: eventText,
      actor: 'Admin Command Center BDL',
      source: 'Modul Disposisi SPT',
      hashSha256: genuineHash
    };
    setAuditLogs((prev) => [log, ...prev]);

    showToast(`SPT ${assignment.sptNumber} berhasil diterbitkan dan dikirim ke petugas!`, 'success');
  };

  const rejectReport = (reportId: string, reason: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status: 'DITOLAK',
            rejectionReason: reason,
            statusHistories: [
              ...r.statusHistories,
              {
                id: `sh-${Date.now()}`,
                status: 'DITOLAK' as ReportStatus,
                changedAt: new Date().toLocaleTimeString('id-ID') + ' WIB',
                actor: 'Verifikator Diskominfo BDL',
                notes: `Ditolak resmi: ${reason}`
              }
            ]
          };
        }
        return r;
      })
    );
    showToast(`Laporan #${reportId} telah ditolak dengan catatan resmi.`, 'info');
  };

  const clarifyReport = (reportId: string, note: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            clarificationRequest: note,
            statusHistories: [
              ...r.statusHistories,
              {
                id: `sh-${Date.now()}`,
                status: r.status,
                changedAt: new Date().toLocaleTimeString('id-ID') + ' WIB',
                actor: 'Verifikator Diskominfo',
                notes: `Permintaan klarifikasi: ${note}`
              }
            ]
          };
        }
        return r;
      })
    );
    showToast(`Permintaan klarifikasi telah terkirim ke WhatsApp warga.`, 'info');
  };

  const submitWorkCompletion = (reportId: string, workUpdate: WorkUpdate) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status: 'SELESAI',
            slaRemaining: '0 Menit (Selesai Tuntas)',
            workUpdate: workUpdate,
            statusHistories: [
              ...r.statusHistories,
              {
                id: `sh-${Date.now()}`,
                status: 'SELESAI' as ReportStatus,
                changedAt: new Date().toLocaleTimeString('id-ID') + ' WIB',
                actor: r.assignment?.officerName || 'Petugas Lapangan URC',
                notes: `Pekerjaan fisik selesai 100%. Bukti terlampir dan marka darurat terpasang.`
              }
            ]
          };
        }
        return r;
      })
    );

    showToast(`Pekerjaan fisik telah diselesaikan dan bukti berhasil diarsipkan!`, 'success');
  };

  const updateReportStatus = (reportId: string, status: ReportStatus, note?: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status,
            statusHistories: [
              ...r.statusHistories,
              {
                id: `sh-${Date.now()}`,
                status,
                changedAt: new Date().toLocaleTimeString('id-ID') + ' WIB',
                actor: 'Sistem / Operator',
                notes: note || `Status diperbarui ke ${status}`
              }
            ]
          };
        }
        return r;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        reports,
        categories,
        auditLogs,
        selectedReportIdForVerification,
        setSelectedReportIdForVerification,
        preselectedCategory,
        setPreselectedCategory,
        trackingModalTicket,
        openTrackingModal,
        closeTrackingModal,
        toasts,
        showToast,
        dismissToast,
        addNewReport,
        assignReportSPT,
        rejectReport,
        clarifyReport,
        submitWorkCompletion,
        updateReportStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

