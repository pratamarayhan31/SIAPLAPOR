import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { maskSensitiveData } from '../../utils/security';
import { X, Search, CheckCircle2, Clock, AlertCircle, MapPin, User, Shield, Camera, FileCheck2, ArrowRight, ShieldCheck } from 'lucide-react';

export const TrackTicketModal: React.FC = () => {
  const { trackingModalTicket, closeTrackingModal, reports } = useApp();
  const [searchInput, setSearchInput] = useState(trackingModalTicket || '');

  React.useEffect(() => {
    if (trackingModalTicket !== null) {
      setSearchInput(trackingModalTicket);
    }
  }, [trackingModalTicket]);

  if (trackingModalTicket === null) return null;

  const currentQuery = searchInput.trim().toUpperCase();

  // Pencarian aman (Security Hardened - CWE-639 / SEC-VULN-02):
  // Memerlukan kecocokan tiket penuh atau identifikasi nomor unik minimal 3-4 karakter spesifik,
  // serta menolak pencarian umum (seperti 'BDL' atau '2026') yang membocorkan data warga lain.
  const report = reports.find((r) => {
    if (!currentQuery || currentQuery.length < 3) return false;
    // Blokir query wildcard umum
    if (['BDL', 'TKT', '2026', 'LAPOR'].includes(currentQuery)) return false;

    const idUpper = r.id.toUpperCase();
    const tktUpper = r.publicTicketId.toUpperCase();
    return (
      tktUpper === currentQuery ||
      idUpper === currentQuery ||
      tktUpper === `TKT-${currentQuery}` ||
      idUpper.endsWith(`-${currentQuery}`) ||
      (currentQuery.length >= 3 && idUpper.endsWith(currentQuery))
    );
  });

  const stages = [
    { key: 'DIAJUKAN', label: '1. Diajukan', desc: 'Warga mengisi form digital & pin GPS' },
    { key: 'DIVERIFIKASI', label: '2. Diverifikasi', desc: 'Validasi kelengkapan berkas Diskominfo' },
    { key: 'DITUGASKAN', label: '3. Ditugaskan', desc: 'Penerbitan SPT ke dinas terkait' },
    { key: 'DIPROSES', label: '4. Diproses', desc: 'Regu teknis bertugas di lokasi' },
    { key: 'SELESAI', label: '5. Selesai', desc: 'Pekerjaan rampung & dokumentasi valid' }
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'DIAJUKAN': return 0;
      case 'DIVERIFIKASI': return 1;
      case 'DITUGASKAN': return 2;
      case 'DIPROSES': return 3;
      case 'SELESAI': return 4;
      default: return 0;
    }
  };

  const currentStageIndex = report ? getStageIndex(report.status) : -1;
  const isRejected = report?.status === 'DITOLAK';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled reactively by searchInput state
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-dark/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="bg-primary text-white p-6 flex items-center justify-between border-b border-primary-container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Pelacakan Status Pengaduan Warga</h3>
              <p className="text-xs text-blue-200">Sistem Informasi SIAP LAPOR Kota Bandar Lampung</p>
            </div>
          </div>
          <button
            onClick={closeTrackingModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Search box if opened empty or to search another */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Masukkan nomor tiket (contoh: TKT-BDL-2026-0892 atau BDL-2026-102)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 font-mono text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-secondary hover:bg-secondary-dark text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
            >
              Lacak
            </button>
          </form>

          {/* Quick test pills */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-slate-500 font-medium">Contoh uji cepat:</span>
            <button
              onClick={() => setSearchInput('102')}
              className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-mono font-medium border border-emerald-200"
            >
              #TKT-BDL-2026-102 (Selesai)
            </button>
            <button
              onClick={() => setSearchInput('115')}
              className="px-2.5 py-1 rounded-md bg-blue-50 text-secondary hover:bg-blue-100 font-mono font-medium border border-blue-200"
            >
              #TKT-BDL-2026-115 (Diproses)
            </button>
            <button
              onClick={() => setSearchInput('0892')}
              className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 hover:bg-amber-100 font-mono font-medium border border-amber-200"
            >
              #BDL-2026-0892 (MBK)
            </button>
          </div>

          {report ? (
            <div className="space-y-6">
              {/* Report Header Card */}
              <div className="bg-surface-soft p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-primary text-white font-bold tracking-wider">
                    {report.publicTicketId}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                      report.status === 'SELESAI'
                        ? 'bg-emerald-100 text-emerald-800'
                        : report.status === 'DIPROSES'
                        ? 'bg-blue-100 text-blue-800'
                        : report.status === 'DITUGASKAN'
                        ? 'bg-purple-100 text-purple-800'
                        : report.status === 'DITOLAK'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {report.status === 'SELESAI' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {report.status === 'DIPROSES' && <Clock className="w-3.5 h-3.5" />}
                    {report.status === 'DITOLAK' && <AlertCircle className="w-3.5 h-3.5" />}
                    Status: {report.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-primary leading-snug">{report.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{report.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span className="truncate">{report.coordinates.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>OPD: <strong>{report.opd}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Pelapor: <strong>{report.isAnonymous ? 'Warga (Anonim)' : maskSensitiveData(report.reporterName, 'name')}</strong></span>
                  </div>
                </div>
              </div>

              {/* 5-Stage Stepper Tracker */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Progres Tindak Lanjut SOP
                </h5>

                {isRejected ? (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      Laporan Ditolak
                    </div>
                    <p className="text-xs text-rose-700">
                      Alasan: {report.rejectionReason || 'Tidak memenuhi kriteria validasi yurisdiksi atau bukti visual tidak memadai.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 relative">
                    {stages.map((stg, idx) => {
                      const isPast = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      return (
                        <div
                          key={stg.key}
                          className={`p-3 rounded-xl border text-xs transition-all ${
                            isCurrent
                              ? 'bg-blue-50 border-secondary ring-2 ring-secondary/20 shadow-sm'
                              : isPast
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                              : 'bg-slate-50 border-slate-200 opacity-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                isPast ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <div className="font-bold text-slate-900">{stg.label.split('. ')[1]}</div>
                          <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                            {stg.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Assignment / Officer details if available */}
              {report.assignment && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-secondary" />
                      Surat Perintah Tugas (SPT) Diterbitkan
                    </span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-300 font-semibold text-primary">
                      {report.assignment.sptNumber}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                    <div>Pelaksana: <strong>{report.assignment.teamName}</strong></div>
                    <div>Petugas: <strong>{report.assignment.officerName}</strong> ({report.assignment.officerNip})</div>
                    <div>Kendaraan Dinas: <strong>{report.assignment.vehiclePlate}</strong></div>
                    <div>Instruksi: <span className="italic">{report.assignment.instructions}</span></div>
                  </div>
                </div>
              )}

              {/* Photos: Before & After */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Dokumentasi Lapangan
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Foto Awal (Warga / Geotagged)
                    </span>
                    <div className="h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                      <img
                        src={report.evidencePhotoUrl}
                        alt="Bukti awal"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        GPS EXIF Valid
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Foto Hasil Tindak Lanjut (Petugas)
                    </span>
                    {report.workUpdate?.afterPhotoUrl ? (
                      <div className="h-44 rounded-xl overflow-hidden border border-emerald-300 bg-emerald-50 relative group">
                        <img
                          src={report.workUpdate.afterPhotoUrl}
                          alt="Hasil selesai"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-2 left-2 bg-emerald-900/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded font-mono">
                          SELESAI 100%
                        </span>
                      </div>
                    ) : (
                      <div className="h-44 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                        <Clock className="w-8 h-8 text-slate-300 mb-1 animate-spin" />
                        <span className="text-xs font-medium">Dalam proses pengerjaan fisik</span>
                        <span className="text-[11px] text-slate-400 mt-1">
                          Foto sesudah akan otomatis diunggah oleh regu teknisi URC setelah tuntas.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {report.workUpdate?.completionNotes && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <p className="font-semibold mb-0.5">Catatan Resmi Penyelesaian:</p>
                    <p>{report.workUpdate.completionNotes}</p>
                    {report.workUpdate.hotmixTons && (
                      <p className="mt-1 font-mono text-[11px] text-emerald-800">
                        Realisasi: {report.workUpdate.hotmixTons} ton hotmix • {report.workUpdate.tackCoatDrums} drum tack coat • {report.workUpdate.crewCount} personel.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Status History Timeline */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Riwayat Aktivitas & Validasi
                </h5>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                  {report.statusHistories.map((hist) => (
                    <div key={hist.id} className="p-3 flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-slate-800">{hist.actor}</div>
                        <div className="text-slate-600 mt-0.5">{hist.notes || `Perubahan status menjadi ${hist.status}`}</div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0">{hist.changedAt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-700">Tiket Tidak Ditemukan</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Nomor tiket "{currentQuery}" tidak terdaftar dalam sistem. Pastikan format nomor benar (contoh: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">TKT-BDL-2026-102</code>).
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200 text-xs">
          <span className="text-slate-500">
            Layanan pengaduan terenkripsi standar SPBE Kota Bandar Lampung
          </span>
          <button
            onClick={closeTrackingModal}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-medium text-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

