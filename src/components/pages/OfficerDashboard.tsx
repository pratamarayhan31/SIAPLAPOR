import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HardHat, Truck, MapPin, CheckCircle2, Clock, Camera, 
  Send, Save, FileText, Navigation, Phone, ShieldCheck, 
  AlertTriangle, ArrowRight, Layers
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const { reports, submitWorkCompletion, showToast, openTrackingModal } = useApp();

  const officerTasks = reports.filter(
    (r) => r.status === 'DITUGASKAN' || r.status === 'DIPROSES' || r.status === 'SELESAI' || r.assignment
  );

  const [selectedTaskTicket, setSelectedTaskTicket] = useState<string>('BDL-2026-0892');

  const activeReport = reports.find((r) => r.id === selectedTaskTicket) || officerTasks[0] || reports[0];

  const currentStage = activeReport.status === 'SELESAI' ? 4 : (activeReport.status === 'DIPROSES' ? 3 : 2);

  // Work update form state
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80'
  );
  const [completionNotes, setCompletionNotes] = useState<string>(
    'Telah dilakukan penanganan fisik perbaikan lapangan dengan material standar teknis sesuai arahan pimpinan. Lokasi kini aman dan lancar kembali.'
  );
  const [hotmixTons, setHotmixTons] = useState<number>(2.5);
  const [tackCoatDrums, setTackCoatDrums] = useState<number>(1);
  const [crewCount, setCrewCount] = useState<number>(6);

  const sptCode = activeReport.assignment?.sptNumber || 'SPT-BMBK-2026-1049';
  const instructions = activeReport.assignment?.instructions || 'Lakukan penanganan fisik sesuai SOP dan pastikan arus lalu lintas tetap aman.';

  const handleFinishWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport) return;

    submitWorkCompletion(activeReport.id, {
      beforePhotoUrl: activeReport.evidencePhotoUrl,
      afterPhotoUrl: afterPhotoUrl,
      completionNotes: completionNotes,
      hotmixTons: Number(hotmixTons),
      tackCoatDrums: Number(tackCoatDrums),
      crewCount: Number(crewCount),
      completedAt: new Date().toLocaleTimeString('id-ID') + ' WIB',
      verifiedCoordinates: {
        lat: activeReport.coordinates.lat,
        lng: activeReport.coordinates.lng
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Officer Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-primary to-primary-container text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black shadow-lg">
              <HardHat className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PORTAL TEKNIS URC
                </span>
                <span className="text-xs text-slate-300 font-mono">Shift Pagi: 08:00 - 16:00 WIB</span>
              </div>
              <h1 className="text-2xl font-black text-white mt-0.5">
                Ahmad Fauzi (NIP. 19880415 201201 1 003)
              </h1>
              <p className="text-xs text-slate-300">
                Regu Reaksi Cepat URC 02 • Dinas Bina Marga & Bina Konstruksi (BMBK) Kota Bandar Lampung
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div>
              <span className="text-slate-400 block">Armada Dinas:</span>
              <span className="font-mono font-bold text-white text-sm">BE 9120 AZ (Dump Truck)</span>
            </div>
            <div className="border-l border-white/20 pl-4">
              <span className="text-slate-400 block">Status GPS Armada:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Aktif (±2.8m)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">Ditugaskan Hari Ini</span>
          <div className="text-2xl font-black font-mono text-primary">5 Tugas</div>
          <span className="text-[11px] text-rose-600 font-bold">2 Mendesak (SLA &lt;2 jam)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">Sedang Dikerjakan</span>
          <div className="text-2xl font-black font-mono text-secondary">2 Lokasi</div>
          <span className="text-[11px] text-slate-500 font-medium">Jl. ZA. Pagar Alam & Teuku Umar</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">Menunggu Verifikasi</span>
          <div className="text-2xl font-black font-mono text-amber-600">1 Laporan</div>
          <span className="text-[11px] text-slate-500 font-medium">Tambal Aspal Jl. Raden Intan</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">Capaian Target Regu</span>
          <div className="text-2xl font-black font-mono text-emerald-600">80%</div>
          <span className="text-[11px] text-emerald-700 font-bold">4 dari 5 target harian</span>
        </div>
      </div>

      {/* Main Two-Pane View: SPT List + Active Work Order */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Assigned SPT List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
            <span>Daftar Surat Perintah Tugas (SPT)</span>
            <span className="font-mono text-secondary font-bold">{officerTasks.length} Tugas Aktif</span>
          </div>

          <div className="space-y-3">
            {officerTasks.map((task) => {
              const isSelected = selectedTaskTicket === task.id;
              const sptNumber = task.assignment?.sptNumber || `SPT-BMBK-2026-${task.id.slice(-4)}`;
              const isDone = task.status === 'SELESAI';
              const isInProgress = task.status === 'DIPROSES';
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskTicket(task.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-secondary ring-2 ring-secondary/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-primary">#{sptNumber}</span>
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : task.priority === 'MENDESAK'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isDone ? 'Selesai' : task.slaRemaining}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-secondary shrink-0" />
                    {task.district} • {task.referencePoint}
                  </p>
                  <div className="flex items-center justify-between text-[11px] mt-3 pt-2 border-t border-slate-100">
                    <span className="text-secondary font-semibold">{task.categoryName}</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-700'
                        : isInProgress
                        ? 'bg-blue-50 text-secondary'
                        : 'bg-purple-50 text-purple-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Field Work Sheet (SPT Details & Submission) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-6">
            {/* Header of Active SPT */}
            <div className="space-y-3 pb-5 border-b border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold bg-primary text-white px-3 py-1 rounded-lg">
                    {sptCode}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    activeReport.status === 'SELESAI'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {activeReport.status === 'SELESAI' ? 'Selesai Tuntas' : (activeReport.priority || 'Mendesak')}
                  </span>
                </div>
                <button
                  onClick={() => openTrackingModal(activeReport.id)}
                  className="text-xs font-bold text-secondary hover:underline"
                >
                  Lihat Tiket #{activeReport.id}
                </button>
              </div>

              <h3 className="text-lg font-black text-primary leading-snug">
                {activeReport.title}
              </h3>

              {/* Kadis Instructions Callout */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Instruksi Resmi Disposisi SPT:
                </p>
                <p className="leading-relaxed">
                  "{instructions}"
                </p>
              </div>

              {/* Navigation button */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-surface-soft p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">{activeReport.district} • {activeReport.referencePoint}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Posisi: {activeReport.coordinates.lat.toFixed(4)}° S, {activeReport.coordinates.lng.toFixed(4)}° E ({activeReport.coordinates.address})
                    </p>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${activeReport.coordinates.lat},${activeReport.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-secondary hover:bg-secondary-dark text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Buka Rute Navigasi
                </a>
              </div>
            </div>

            {/* 4-Step SOP Field Progress */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">
                Alur Tahapan Penanganan Lapangan:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <div className="flex items-center justify-between font-bold">
                    <span>1. Ditugaskan</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[10px] text-slate-500 block font-mono mt-1">09:30 WIB</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <div className="flex items-center justify-between font-bold">
                    <span>2. Tiba & Rambu</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[10px] text-slate-500 block font-mono mt-1">10:05 WIB</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  currentStage >= 3 ? 'bg-blue-50 border-secondary text-blue-950 font-bold' : 'bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span>3. Dikerjakan</span>
                    <Clock className="w-3.5 h-3.5 text-secondary animate-spin" />
                  </div>
                  <span className="text-[10px] text-secondary font-mono mt-1 block">Sedang Berjalan</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  activeReport.status === 'SELESAI' ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold' : 'bg-slate-50 text-slate-400'
                }`}>
                  <div className="flex items-center justify-between">
                    <span>4. Selesai</span>
                    {activeReport.status === 'SELESAI' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] block font-mono mt-1">
                    {activeReport.status === 'SELESAI' ? 'Tuntas 100%' : 'Menunggu Bukti'}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Upload Dual Bukti & Material Realization */}
            <form onSubmit={handleFinishWork} className="space-y-6">
              {/* Dual Photo Documentation */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-secondary" />
                  Dokumentasi Bukti Fisik Lapangan (Wajib Bergeotag)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Photo Before */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700">Foto SEBELUM (Kondisi Awal Warga)</span>
                    <div className="h-44 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100">
                      <img
                        src={activeReport.evidencePhotoUrl}
                        alt="Foto awal"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                        Lubang 40cm (Kedaton)
                      </span>
                    </div>
                  </div>

                  {/* Photo After */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Foto SESUDAH (Hasil Penanganan)</span>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                        GPS Valid (Kedaton)
                      </span>
                    </div>
                    <div className="h-44 rounded-xl overflow-hidden border-2 border-emerald-400 relative bg-emerald-50 group">
                      <img
                        src={afterPhotoUrl}
                        alt="Foto selesai"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5">
                        <span className="text-white text-[10px] font-mono">
                          Kamera URC • 24 Okt 2026, 11:20 WIB • GPS ±2.8m
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Notes Field */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">
                  Catatan Teknis Pengerjaan Lapangan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed"
                />
                <p className="text-[11px] text-slate-400">
                  Catatan ini akan otomatis masuk ke lembar notifikasi pelapor dan rekap arsip Pemkot.
                </p>
              </div>

              {/* Material Realization Grid */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">
                  Realisasi Material & Tim (Dinas BMBK):
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-surface-soft border border-slate-200 space-y-1">
                    <span className="text-slate-500 block">Hotmix Aspal (Ton)</span>
                    <input
                      type="number"
                      step="0.1"
                      value={hotmixTons}
                      onChange={(e) => setHotmixTons(Number(e.target.value))}
                      className="w-full p-1.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-surface-soft border border-slate-200 space-y-1">
                    <span className="text-slate-500 block">Tack Coat (Drum)</span>
                    <input
                      type="number"
                      value={tackCoatDrums}
                      onChange={(e) => setTackCoatDrums(Number(e.target.value))}
                      className="w-full p-1.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-surface-soft border border-slate-200 space-y-1">
                    <span className="text-slate-500 block">Jumlah Kru (Orang)</span>
                    <input
                      type="number"
                      value={crewCount}
                      onChange={(e) => setCrewCount(Number(e.target.value))}
                      className="w-full p-1.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => showToast('Draft pengerjaan fisik disimpan di tablet lapangan.', 'info')}
                  className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Simpan Draft Progres
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Kirim Bukti & Ajukan Penyelesaian Tiket Resmi
                </button>
              </div>
            </form>

            {/* Quick Dispatch Log of Today */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">
                Riwayat Log Respon Cepat Hari Ini (Diperbarui 11:25 WIB):
              </span>
              <div className="divide-y divide-slate-100 font-mono text-[11px] text-slate-600">
                <div className="py-1.5 flex justify-between">
                  <span>11:22 WIB • Foto penyelesaian berhasil diunggah; terverifikasi GPS Kedaton</span>
                  <span className="text-emerald-700 font-bold">#SPT-1049</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span>10:05 WIB • Armada tiba di lokasi MBK; pemasangan traffic cone & koordinasi lajur Dishub</span>
                  <span className="text-secondary font-bold">#SPT-1049</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span>09:30 WIB • Disposisi diterima; armada BE 9120 AZ bergerak dari posko induk BMBK</span>
                  <span className="text-slate-500 font-bold">#SPT-1049</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

