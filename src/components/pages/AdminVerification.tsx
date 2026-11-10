import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, AlertTriangle, FileText, CheckCircle2, XCircle, 
  HelpCircle, MapPin, Camera, Clock, User, Send, ChevronRight, 
  ExternalLink, Search, Filter, ShieldAlert, Sparkles, Truck
} from 'lucide-react';

export const AdminVerification: React.FC = () => {
  const { 
    reports, 
    selectedReportIdForVerification, 
    setSelectedReportIdForVerification, 
    assignReportSPT, 
    rejectReport, 
    clarifyReport,
    showToast,
    auditLogs
  } = useApp();

  const [activeTab, setActiveTab] = useState<'menunggu' | 'klarifikasi' | 'disposisi' | 'semua'>('menunggu');
  const [actionTab, setActionTab] = useState<'approve' | 'reject' | 'clarify'>('approve');

  // Form Disposisi State
  const [targetOpd, setTargetOpd] = useState<string>('Dinas Bina Marga & Bina Konstruksi (BMBK)');
  const [targetTeam, setTargetTeam] = useState<string>('URC Wilayah Kedaton – Regu 2');
  const [officerName, setOfficerName] = useState<string>('Ahmad Fauzi');
  const [officerNip, setOfficerNip] = useState<string>('19880415 201201 1 003');
  const [vehiclePlate, setVehiclePlate] = useState<string>('BE 9120 AZ');
  const [priority, setPriority] = useState<string>('Mendesak (<6 jam)');
  const [deadline, setDeadline] = useState<string>('2026-10-24 16:00');
  const [instructions, setInstructions] = useState<string>(
    'Segera lakukan penambalan darurat hotmix hari ini juga; koordinasikan dengan Satlantas Polresta & Dishub BDL bila perlu rekayasa lajur agar tidak macet di simpang MBK.'
  );

  // Form Reject State
  const [rejectReason, setRejectReason] = useState<string>('Bukan kewenangan Pemkot BDL (merupakan ruas jalan nasional BPJN)');
  const [rejectExplanation, setRejectExplanation] = useState<string>(
    'Terima kasih atas laporan Anda. Berdasarkan verifikasi tim teknis, ruas jalan tersebut berada di bawah wewenang Balai Pelaksanaan Jalan Nasional (BPJN). Laporan Anda telah kami teruskan melalui sistem koordinasi SP4N-LAPOR Provinsi.'
  );

  // Form Clarify State
  const [clarifyChecklist, setClarifyChecklist] = useState<string[]>(['Minta foto ulang dari jarak pandang lebih lebar (5-10 meter)']);

  // Active Report
  const currentReport = reports.find((r) => r.id === selectedReportIdForVerification) || reports[0];

  const handleApproveSPT = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReport) return;

    assignReportSPT(currentReport.id, {
      sptNumber: `SPT-BMBK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      opd: targetOpd,
      teamName: targetTeam,
      officerName: officerName,
      officerNip: officerNip,
      vehiclePlate: vehiclePlate,
      assignedAt: new Date().toLocaleTimeString('id-ID') + ' WIB',
      targetDeadline: deadline,
      instructions: instructions
    });
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReport) return;
    rejectReport(currentReport.id, `${rejectReason}. ${rejectExplanation}`);
  };

  const handleClarify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReport) return;
    clarifyReport(currentReport.id, clarifyChecklist.join('; '));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header bar */}
      <div className="bg-primary text-white rounded-2xl p-6 shadow-md border border-primary-container flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full">
              COMMAND & DISPATCH
            </span>
            <span className="text-xs text-blue-200">Rata-rata respon verifikasi: 18 menit</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Verifikasi & Disposisi Pengaduan Masuk
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Validasi bukti digital geotag, analisis kewenangan yurisdiksi, dan penerbitan Surat Perintah Tugas (SPT) resmi ke OPD.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => showToast('Daftar antrean verifikasi berhasil diekspor.', 'info')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            Ekspor Daftar
          </button>
          <button
            onClick={() => showToast('Fitur batch verifikasi aktif untuk 4 berkas siap proses.', 'info')}
            className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-bold transition-colors shadow-sm"
          >
            Verifikasi Batch
          </button>
        </div>
      </div>

      {/* Status Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('menunggu')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'menunggu'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Menunggu Verifikasi</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 text-[10px]">
              12
            </span>
          </button>

          <button
            onClick={() => setActiveTab('klarifikasi')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'klarifikasi'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Butuh Konfirmasi</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px]">
              3
            </span>
          </button>

          <button
            onClick={() => setActiveTab('disposisi')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'disposisi'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Siap Disposisi</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px]">
              8
            </span>
          </button>

          <button
            onClick={() => setActiveTab('semua')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === 'semua'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Semua Berkas (23)</span>
          </button>
        </div>

        {/* Quick Filter pills */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Filter:</span>
          <span className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-semibold">
            BMBK (Jalan & Jembatan)
          </span>
          <span className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-semibold">
            Kec. Kedaton
          </span>
        </div>
      </div>

      {/* Two-Pane Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Queue List (12 items) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
            <span>Antrean Masuk (Urut SLA Kritis)</span>
            <span>{reports.length} Laporan Tersedia</span>
          </div>

          <div className="space-y-2.5 max-h-[800px] overflow-y-auto pr-1">
            {reports.map((rep) => {
              const isSelected = rep.id === currentReport?.id;
              const isUrgent = rep.priority === 'MENDESAK';
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportIdForVerification(rep.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-white border-secondary ring-2 ring-secondary/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-slate-100">
                      {rep.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isUrgent
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {rep.slaRemaining}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-800 line-clamp-2 leading-snug">
                    {rep.title}
                  </h4>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                    <MapPin className="w-3 h-3 text-secondary shrink-0" />
                    <span className="truncate">{rep.coordinates.address}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[10px]">
                    <span className="font-semibold text-slate-600 truncate">{rep.opd}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                      GPS Valid
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Workspace (Investigation & Decision) */}
        <div className="lg:col-span-7 space-y-6">
          {currentReport ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-6">
              {/* Report Header Card */}
              <div className="space-y-3 pb-5 border-b border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold bg-primary text-white px-3 py-1 rounded-lg">
                      {currentReport.id}
                    </span>
                    <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Prioritas Tinggi (Jalur Padat)
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Diterima: {currentReport.createdAt}
                  </span>
                </div>

                <h3 className="text-lg font-black text-primary leading-snug">
                  {currentReport.title}
                </h3>

                {/* Verification Check Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-surface-soft p-3 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <p className="text-slate-400 font-medium">Pelapor:</p>
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-secondary" />
                      {currentReport.reporterName}
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1 rounded">
                        NIK Terverifikasi Dukcapil
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">Kontak: {currentReport.reporterPhone}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-400 font-medium">Kewenangan Yurisdiksi:</p>
                    <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Jalan Kota Bandar Lampung (Resmi Pemkot)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Bukan jalan nasional/provinsi; wilayah penanganan Dinas BMBK.
                    </p>
                  </div>
                </div>

                {/* Complaint Text */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Isi Aduan Warga:
                  </span>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                    "{currentReport.description}"
                  </div>
                </div>

                {/* Photo Evidence with EXIF Inspection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" /> Foto Bukti Lapangan
                    </span>
                    <div className="h-44 rounded-xl overflow-hidden border border-slate-200 relative group">
                      <img
                        src={currentReport.evidencePhotoUrl}
                        alt="Bukti foto"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-white text-[11px] font-mono">
                          EXIF Xiaomi 13T (24mm f/1.9)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Geotagging & Nearest Fleet Card */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-secondary" /> Geospasial & Posisi Regu
                    </span>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-surface-soft h-44 flex flex-col justify-between text-xs">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800">{currentReport.coordinates.address}</p>
                        <p className="font-mono text-[11px] text-slate-500">
                          Lat: {currentReport.coordinates.lat}, Lng: {currentReport.coordinates.lng} (Akurasi 3m)
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Truck className="w-3.5 h-3.5 text-emerald-700" />
                          Regu Terdekat: URC 02 Kedaton
                        </div>
                        <p className="text-slate-600">
                          Posisi saat ini di Jl. Teuku Umar (Jarak ±1.2 KM / Estimasi 4 menit tiba).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Decision Section (3 Modes) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-black text-sm text-primary uppercase tracking-wider">
                    Tindakan Verifikasi & Keputusan
                  </h4>

                  {/* Mode switcher tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setActionTab('approve')}
                      className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                        actionTab === 'approve'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-primary'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Setujui & Disposisi (SPT)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionTab('reject')}
                      className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                        actionTab === 'reject'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-primary'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Tolak
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionTab('clarify')}
                      className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                        actionTab === 'clarify'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-primary'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      Klarifikasi
                    </button>
                  </div>
                </div>

                {/* Mode 1: Setujui & Disposisi SPT */}
                {actionTab === 'approve' && (
                  <form onSubmit={handleApproveSPT} className="space-y-4 animate-fade-in text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">OPD Sasaran (Disposisi)</label>
                        <select
                          value={targetOpd}
                          onChange={(e) => setTargetOpd(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                        >
                          <option value="Dinas Bina Marga & Bina Konstruksi (BMBK)">
                            Dinas Bina Marga & Bina Konstruksi (BMBK)
                          </option>
                          <option value="Dinas Lingkungan Hidup (DLH)">Dinas Lingkungan Hidup (DLH)</option>
                          <option value="Dinas Perhubungan (Dishub)">Dinas Perhubungan (Dishub)</option>
                          <option value="Satpol PP">Satpol PP Kota BDL</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Regu Lapangan Pelaksana</label>
                        <select
                          value={targetTeam}
                          onChange={(e) => setTargetTeam(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                        >
                          <option value="URC Wilayah Kedaton – Regu 2">
                            URC Wilayah Kedaton – Regu 2 (Ahmad Fauzi) - Jarak 1.2 KM
                          </option>
                          <option value="URC Wilayah Kedaton – Regu 1">
                            URC Wilayah Kedaton – Regu 1 (Hendra Gunawan)
                          </option>
                          <option value="Tim Khusus Hotmix Sentral">
                            Tim Reaksi Khusus Hotmix Sentral BMBK
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Tingkat Prioritas</label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                        >
                          <option value="Mendesak (<6 jam)">Mendesak (&lt;6 jam)</option>
                          <option value="Sedang (24 jam)">Sedang (24 jam)</option>
                          <option value="Biasa (3 hari)">Biasa (3 hari)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Target Tenggat Waktu (SLA)</label>
                        <input
                          type="text"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Instruksi Kerja Khusus (Kadis / Verifikator)</label>
                      <textarea
                        rows={2}
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 leading-relaxed font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      <Send className="w-4 h-4" />
                      Kirim Disposisi & Terbitkan Surat Tugas (SPT) Resmi
                    </button>
                  </form>
                )}

                {/* Mode 2: Tolak Laporan */}
                {actionTab === 'reject' && (
                  <form onSubmit={handleReject} className="space-y-4 animate-fade-in text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Alasan Standar Penolakan (SOP BDL)</label>
                      <select
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                      >
                        <option value="Bukan kewenangan Pemkot BDL (merupakan ruas jalan nasional BPJN)">
                          Bukan kewenangan Pemkot BDL (Jalan Nasional / Provinsi)
                        </option>
                        <option value="Lokasi di luar batas administratif Kota Bandar Lampung">
                          Lokasi di luar batas administratif Kota Bandar Lampung
                        </option>
                        <option value="Laporan duplikat / sedang ditangani pada tiket lain">
                          Laporan duplikat / sedang ditangani pada tiket lain
                        </option>
                        <option value="Foto bukti tidak valid, buram, atau tidak menggambarkan kerusakan nyata">
                          Foto bukti tidak valid atau buram
                        </option>
                        <option value="Indikasi hoaks / data fiktif">Indikasi hoaks / data fiktif</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Penjelasan Santun untuk Warga</label>
                      <textarea
                        rows={3}
                        value={rejectExplanation}
                        onChange={(e) => setRejectExplanation(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      <XCircle className="w-4 h-4" />
                      Tolak Laporan dengan Alasan Resmi
                    </button>
                  </form>
                )}

                {/* Mode 3: Klarifikasi ke Warga */}
                {actionTab === 'clarify' && (
                  <form onSubmit={handleClarify} className="space-y-4 animate-fade-in text-xs">
                    <div className="space-y-2">
                      <label className="font-bold text-slate-700">Poin Klarifikasi yang Dibutuhkan:</label>
                      <div className="space-y-1.5">
                        {[
                          'Minta foto ulang dari jarak pandang lebih lebar (5-10 meter)',
                          'Konfirmasi nomor patokan rumah / pagar / bangunan terdekat',
                          'Minta kontak alternatif RT / tokoh warga setempat'
                        ].map((item, idx) => (
                          <label key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-surface-soft border border-slate-200 cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={idx === 0}
                              className="rounded text-secondary focus:ring-secondary/50"
                            />
                            <span className="text-slate-700 font-medium">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Kirim Permintaan Klarifikasi ke WhatsApp & Akun Warga
                    </button>
                  </form>
                )}
              </div>

              {/* Audit Log Trail SHA-256 */}
              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider block">
                  Log Jejak Berkas (Enkripsi SHA-256):
                </span>
                <div className="bg-surface-soft rounded-xl p-3 border border-slate-200 divide-y divide-slate-100 font-mono text-[11px] space-y-2">
                  {auditLogs.slice(0, 3).map((log) => (
                    <div key={log.id} className="pt-2 first:pt-0 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-700">{log.timestamp}</span>: {log.event} ({log.actor})
                      </div>
                      <span className="text-slate-400 text-[10px] truncate max-w-xs">
                        SHA: {log.hashSha256.substring(0, 16)}...
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Pilih laporan dari antrean di sebelah kiri untuk memulai pemeriksaan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

