import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { sanitizeCsvField } from '../../utils/security';
import { 
  LayoutDashboard, ShieldCheck, FileText, Users, MapPin, 
  Download, RefreshCw, AlertTriangle, ArrowUpRight, CheckCircle2, 
  Clock, Flame, HardHat, Radio, Eye, Send, BarChart3, Database
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { reports, setActivePage, setSelectedReportIdForVerification, openTrackingModal, showToast } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | 'month' | 'year'>('month');

  // Derive urgent reports dynamically from state
  const pendingReports = reports.filter((r) => r.status === 'DIAJUKAN' || r.status === 'DIVERIFIKASI');
  const urgentDisplayList = pendingReports.length > 0 ? pendingReports : reports.slice(0, 4);

  const weeklyTrend = [
    { day: 'Sen', in: 145, out: 130 },
    { day: 'Sel', in: 162, out: 148 },
    { day: 'Rab', in: 178, out: 160 },
    { day: 'Kam', in: 190, out: 175 },
    { day: 'Jum', in: 155, out: 140 },
    { day: 'Sab', in: 120, out: 110 },
    { day: 'Min', in: 95, out: 88 },
  ];

  const handleExportCSV = () => {
    // Sanitasi keamanan formula injection RFC-4180 (CWE-1236 / SEC-VULN-04)
    const headers = [
      'Nomor Tiket',
      'Kategori',
      'Judul',
      'Kecamatan',
      'Sisa SLA',
      'Status',
      'Pelapor',
      'Waktu Masuk'
    ].map(sanitizeCsvField).join(',');

    const rows = reports.map((r) => [
      sanitizeCsvField(r.id),
      sanitizeCsvField(r.categoryName),
      sanitizeCsvField(r.title),
      sanitizeCsvField(r.district),
      sanitizeCsvField(r.slaRemaining),
      sanitizeCsvField(r.status),
      sanitizeCsvField(r.reporterName),
      sanitizeCsvField(r.createdAt)
    ].join(',')).join('\n');

    const csvContent = '\uFEFF' + headers + '\n' + rows; // Tambahkan BOM UTF-8 untuk kompatibilitas Excel
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekap_Aduan_SIAP_LAPOR_BDL_2026_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Berkas Rekapitulasi CSV (Aman & Tervalidasi RFC-4180) berhasil diunduh!', 'success');
  };

  const handleVerifyItem = (id: string) => {
    setSelectedReportIdForVerification(id);
    setActivePage('admin-verification');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 288px Fixed Sidebar (Admin Portal BDL) */}
      <aside className="w-72 bg-primary text-slate-300 hidden xl:flex flex-col justify-between border-r border-primary-container shrink-0 p-6 space-y-6">
        <div className="space-y-6">
          {/* Admin Identity */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-white font-black text-lg">
              CC
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Portal Admin SPBE</h3>
              <p className="text-[11px] text-slate-400">Diskominfo Bandar Lampung</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Real-time Sync
              </span>
            </div>
          </div>

          {/* Menus */}
          <div className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 px-3">Modul Utama</span>
              <button
                onClick={() => setActivePage('admin-dashboard')}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-secondary text-white font-bold"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Ringkasan</span>
              </button>
              <button
                onClick={() => {
                  setSelectedReportIdForVerification('BDL-2026-0892');
                  setActivePage('admin-verification');
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-secondary-light" />
                  <span>Verifikasi & Disposisi</span>
                </div>
                <span className="bg-amber-400/20 text-amber-300 font-mono text-[10px] px-1.5 py-0.2 rounded font-bold">
                  12 Baru
                </span>
              </button>
              <button
                onClick={() => setActivePage('admin-verification')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Manajemen Seluruh Aduan</span>
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 px-3">Operasional & Lapangan</span>
              <button
                onClick={() => setActivePage('officer-dashboard')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"
              >
                <HardHat className="w-4 h-4 text-amber-400" />
                <span>Kesiapan Regu Lapangan</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-slate-300 transition-colors">
                <Radio className="w-4 h-4 text-slate-400" />
                <span>Kategori & Master OPD</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-slate-300 transition-colors">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Master 20 Kecamatan</span>
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 px-3">Sistem & Audit</span>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-slate-300 transition-colors">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Manajemen Pengguna</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-slate-300 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span>Ekspor & Rekapitulasi</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-slate-300 transition-colors">
                <Database className="w-4 h-4 text-slate-400" />
                <span>Log Aktivitas Audit SHA</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
            AU
          </div>
          <div className="truncate">
            <p className="font-bold text-white truncate">Admin Utama</p>
            <p className="text-[10px] text-slate-400">Command Center Diskominfo</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto max-w-7xl">
        {/* Top Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                SPBE LIVE
              </span>
              <span className="text-xs text-slate-500">Kamis, 24 Oktober 2026 • Server SPBE aktif, sinkronisasi real-time</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-primary mt-1">
              Selamat bertugas, Administrator Command Center
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Period switcher */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm font-semibold">
              <button
                onClick={() => setSelectedPeriod('7days')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPeriod === '7days' ? 'bg-primary text-white' : 'text-slate-600'
                }`}
              >
                7 Hari
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPeriod === 'month' ? 'bg-primary text-white' : 'text-slate-600'
                }`}
              >
                Bulan Ini (Okt 2026)
              </button>
              <button
                onClick={() => setSelectedPeriod('year')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPeriod === 'year' ? 'bg-primary text-white' : 'text-slate-600'
                }`}
              >
                Tahun 2026
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={() => showToast('Data dashboard telah disegarkan secara real-time.', 'info')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 shadow-sm"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* CSV Export */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-xl font-bold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Aduan Masuk */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Aduan Masuk
            </span>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black font-mono text-primary">4.829</div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center">
                +12% <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
              Rerata 158 aduan/hari dari 20 kecamatan
            </p>
          </div>

          {/* Menunggu Verifikasi */}
          <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-card space-y-2 bg-gradient-to-br from-white to-amber-50/30">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block flex items-center justify-between">
              Menunggu Verifikasi
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            </span>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black font-mono text-amber-700">34</div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                8 Urgent (&lt;3 jam)
              </span>
            </div>
            <p className="text-xs text-amber-900/70 pt-1 border-t border-amber-100">
              Prioritas PJU & Jalan: 21 antrean berkas
            </p>
          </div>

          {/* Sedang Ditangani */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-2">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">
              Sedang Ditangani OPD
            </span>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black font-mono text-secondary">383</div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                Disposisi SPT
              </span>
            </div>
            <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
              BMBK 142, DLH 120, Dishub 78, Satpol 43
            </p>
          </div>

          {/* Selesai & Tertangani */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-2">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
              Selesai & Tertangani
            </span>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black font-mono text-emerald-600">4.412</div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                91.3% Rasio
              </span>
            </div>
            <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
              Kepuasan 94.8% • SLA on-time 96.2%
            </p>
          </div>
        </div>

        {/* Urgent Verification Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-primary">
                  Antrean Laporan Perlu Verifikasi Cepat
                </h3>
                <p className="text-xs text-slate-500">4 memerlukan tindakan segera sebelum tenggat batas waktu SLA terlampaui</p>
              </div>
            </div>

            <button
              onClick={() => setActivePage('admin-verification')}
              className="text-xs font-bold text-secondary hover:text-secondary-dark flex items-center gap-1"
            >
              Buka Semua 12 Berkas <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-soft text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Tiket</th>
                  <th className="py-3 px-4">Waktu Masuk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Keluhan & Lokasi</th>
                  <th className="py-3 px-4">Sisa SLA</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {urgentDisplayList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {item.createdAt}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 line-clamp-1">{item.title}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-secondary shrink-0" />
                        {item.district} • {item.referencePoint}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-mono font-bold px-2.5 py-1 rounded-full ${
                          item.priority === 'MENDESAK'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {item.slaRemaining}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => openTrackingModal(item.id)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title="Lihat Detail"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleVerifyItem(item.id)}
                        className="bg-secondary hover:bg-secondary-dark text-white font-bold px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <span>Verifikasi & Disposisi</span>
                        <Send className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Weekly Trend Chart */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-primary flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-secondary" />
                  Tren Penanganan Laporan Mingguan
                </h3>
                <p className="text-xs text-slate-500">Perbandingan Aduan Masuk vs Aduan Selesai (Rerata SLA: 18.4 Jam)</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-secondary"></span> Masuk
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500"></span> Selesai
                </span>
              </div>
            </div>

            {/* Simulated Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 px-2">
              {weeklyTrend.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-36">
                    {/* Bar In */}
                    <div
                      style={{ height: `${(bar.in / 200) * 100}%` }}
                      className="w-1/2 bg-secondary/80 group-hover:bg-secondary rounded-t transition-all relative"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.in}
                      </span>
                    </div>
                    {/* Bar Out */}
                    <div
                      style={{ height: `${(bar.out / 200) * 100}%` }}
                      className="w-1/2 bg-emerald-500/80 group-hover:bg-emerald-500 rounded-t transition-all relative"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.out}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600">{bar.day}</span>
                </div>
              ))}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-surface-soft border border-slate-100">
                <span className="text-slate-400 block">Selesai Pekan Ini:</span>
                <span className="font-bold text-primary font-mono text-sm mt-0.5 block">782 aduan</span>
                <span className="text-[10px] text-emerald-600 font-semibold">↑ 9.4% efisiensi regu</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-soft border border-slate-100">
                <span className="text-slate-400 block">Waktu Respon Awal:</span>
                <span className="font-bold text-primary font-mono text-sm mt-0.5 block">42 menit</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Standar KemenPAN-RB</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-soft border border-slate-100">
                <span className="text-slate-400 block">Kecamatan Teraktif:</span>
                <span className="font-bold text-primary font-mono text-sm mt-0.5 block">Kedaton</span>
                <span className="text-[10px] text-amber-700 font-semibold">148 laporan</span>
              </div>
            </div>
          </div>

          {/* Right: GIS Heatmap & Fleet Readiness */}
          <div className="lg:col-span-5 space-y-6">
            {/* GIS Map Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-primary">Peta Sebaran Titik Panas</h3>
                  <p className="text-xs text-slate-500">Mode Satelit SPBE Kedaton High Alert</p>
                </div>
                <span className="text-xs font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-600" /> KEDATON HIGH
                </span>
              </div>

              {/* Map visual card */}
              <div className="h-44 rounded-xl overflow-hidden relative border border-slate-200 bg-slate-900 flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-60"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')` }}
                />
                <div className="absolute inset-0 bg-primary/50"></div>

                {/* Heatmap pulses */}
                <div className="relative z-10 flex items-center gap-8 text-xs font-mono">
                  <div className="flex flex-col items-center">
                    <span className="w-4 h-4 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="bg-black/70 text-white px-2 py-0.5 rounded mt-1 text-[10px]">Kedaton (148)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="bg-black/70 text-white px-2 py-0.5 rounded mt-1 text-[10px]">Rajabasa (94)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                    <span className="bg-black/70 text-white px-2 py-0.5 rounded mt-1 text-[10px]">Sukarame (82)</span>
                  </div>
                </div>

                <div className="absolute bottom-2 right-2">
                  <button className="bg-white/90 text-primary text-[10px] font-bold px-2 py-1 rounded shadow hover:bg-white">
                    Buka Peta Penuh GIS
                  </button>
                </div>
              </div>
            </div>

            {/* OPD Fleet Readiness */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <HardHat className="w-4 h-4 text-secondary" />
                Kesiapan Regu & OPD (Siaga 24 Jam)
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Dinas Bina Marga & Bina Konstruksi (BMBK)</span>
                    <span className="font-mono text-emerald-700">8 Regu (92% Aktif)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Dinas Lingkungan Hidup (DLH - Kebersihan)</span>
                    <span className="font-mono text-emerald-700">12 Regu Truk (88%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Dinas Perhubungan (Teknisi PJU)</span>
                    <span className="font-mono text-blue-700">5 Regu (74%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Satpol PP Kota Bandar Lampung</span>
                    <span className="font-mono text-slate-700">4 Regu Patroli (65%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-slate-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Verifier Activity Stream */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-3">
          <h3 className="font-bold text-sm text-primary flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            Aktivitas Verifikator & Petugas Terkini
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-surface-soft border border-slate-100 flex items-center justify-between">
              <span className="text-slate-700">
                <strong>Admin Rian</strong> memverifikasi berkas <code>#BDL-2026-0888</code>; disposisi diteruskan ke Dinas BMBK (Kec. Tanjung Karang Pusat).
              </span>
              <span className="text-slate-400 font-mono text-[11px] shrink-0 ml-4">5 menit lalu</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-soft border border-slate-100 flex items-center justify-between">
              <span className="text-slate-700">
                <strong>Petugas Ahmad (Dishub)</strong> mengunggah bukti penyelesaian penggantian bohlam PJU pada tiket <code>#BDL-2026-0870</code>.
              </span>
              <span className="text-slate-400 font-mono text-[11px] shrink-0 ml-4">18 menit lalu</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-soft border border-slate-100 flex items-center justify-between">
              <span className="text-slate-700">
                <strong>Admin Putri</strong> menolak tiket <code>#BDL-2026-0885</code> dengan alasan duplikasi laporan Jalan Teuku Umar.
              </span>
              <span className="text-slate-400 font-mono text-[11px] shrink-0 ml-4">35 menit lalu</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

