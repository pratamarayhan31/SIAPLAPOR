import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, ShieldAlert, ArrowRight, CheckCircle2, Clock, AlertTriangle, 
  MapPin, ChevronDown, ChevronUp, Construction, Trash2, Lightbulb, 
  Droplet, Trees, Shield, Sparkles, PhoneCall, ExternalLink
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActivePage, openTrackingModal, categories, reports, setPreselectedCategory } = useApp();
  const [trackInput, setTrackInput] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [reportFilter, setReportFilter] = useState<'ALL' | 'SELESAI' | 'DIPROSES'>('ALL');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      openTrackingModal(trackInput.trim());
    } else {
      openTrackingModal('');
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'construction': return <Construction className="w-6 h-6 text-amber-500" />;
      case 'delete_sweep': return <Trash2 className="w-6 h-6 text-emerald-500" />;
      case 'lightbulb': return <Lightbulb className="w-6 h-6 text-yellow-500" />;
      case 'water_damage': return <Droplet className="w-6 h-6 text-blue-500" />;
      case 'park': return <Trees className="w-6 h-6 text-green-600" />;
      case 'local_police': return <Shield className="w-6 h-6 text-indigo-500" />;
      default: return <Construction className="w-6 h-6 text-secondary" />;
    }
  };

  const filteredReports = reports.filter((r) => {
    if (reportFilter === 'SELESAI') return r.status === 'SELESAI';
    if (reportFilter === 'DIPROSES') return r.status === 'DIPROSES' || r.status === 'DITUGASKAN';
    return true;
  });

  const faqs = [
    {
      q: 'Apakah identitas pelapor dijamin kerahasiaannya?',
      a: 'Ya. Tersedia opsi "Lapor Secara Anonim / Rahasia". NIK, nama, dan kontak pelapor terverifikasi dalam sistem terenkripsi standar SPBE dan tidak akan ditampilkan kepada publik maupun petugas lapangan.'
    },
    {
      q: 'Berapa lama batas waktu (SLA) penanganan laporan?',
      a: 'Verifikasi administratif dilakukan oleh administrator Diskominfo maksimal dalam 3 jam kerja. Tindak lanjut fisik di lapangan oleh OPD terkait rata-rata berlangsung antara 24 hingga 48 jam sesuai kategori tingkat keparahan.'
    },
    {
      q: 'Bagaimana cara memeriksa progres tindak lanjut aduan saya?',
      a: 'Gunakan nomor tiket resmi (contoh: TKT-BDL-2026-0892) pada kolom pelacakan mandiri di halaman utama ini. Anda dapat melihat lini masa 5 tahap serta foto sebelum dan sesudah perbaikan.'
    },
    {
      q: 'Apa yang dilakukan jika laporan berstatus Ditolak?',
      a: 'Admin Diskominfo akan menyertakan alasan penolakan secara transparan (seperti di luar kewenangan Pemkot BDL, jalan nasional/provinsi, atau duplikasi). Warga dapat mengajukan laporan baru dengan kelengkapan data yang disesuaikan.'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary via-primary-container to-primary text-white overflow-hidden pt-12 pb-20 px-4 sm:px-6">
        {/* Background glow & accents */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-tertiary/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/30 border border-secondary/40 text-blue-200 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Smart Governance Pemkot Bandar Lampung & UTI</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
                Suarakan Aspirasi, <br className="hidden sm:inline" />
                Bangun Kota Bandar Lampung Bersama <span className="text-secondary-light">SIAP LAPOR</span>
              </h1>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl">
                Kanal resmi pelaporan fasilitas umum dan lingkungan secara cepat, transparan, dan terintegrasi untuk mewujudkan Kota Bandar Lampung yang nyaman, tanggap darurat, dan modern.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActivePage('citizen-form')}
                  className="bg-secondary hover:bg-secondary-light text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2.5 shadow-lg shadow-secondary/40 transition-all hover:shadow-secondary/60 active:scale-95"
                >
                  Buat Laporan Sekarang
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    document.getElementById('alur-pengaduan')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-white/20 transition-all backdrop-blur-sm"
                >
                  Panduan & SOP Penanganan
                </button>
              </div>

              {/* Quick hotline indicator */}
              <div className="flex items-center gap-4 pt-4 text-xs text-slate-300 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Respon Awal Maks. 3 Jam</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Geotagging EXIF Terverifikasi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Call 112 Bebas Pulsa</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Self-Tracking Widget Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-md text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/40 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-primary">Lacak Tiket Aduan</h3>
                      <p className="text-xs text-slate-500">Cek status penanganan laporan Anda</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    ONLINE
                  </span>
                </div>

                <form onSubmit={handleTrackSubmit} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Nomor Tiket Aduan</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Contoh: TKT-BDL-2026-0892"
                        value={trackInput}
                        onChange={(e) => setTrackInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 font-mono text-sm tracking-wide bg-slate-50 focus:bg-white transition-all uppercase"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-sm"
                  >
                    <Search className="w-4 h-4" />
                    Lacak Status Laporan
                  </button>
                </form>

                {/* Quick test buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Coba cek contoh laporan demo:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => openTrackingModal('102')}
                      className="p-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-mono text-left border border-emerald-200 transition-colors"
                    >
                      <span className="font-bold block">#102 Selesai</span>
                      <span className="text-[10px] text-emerald-600">Raden Intan</span>
                    </button>
                    <button
                      onClick={() => openTrackingModal('115')}
                      className="p-2 rounded-lg bg-blue-50 text-secondary hover:bg-blue-100 font-mono text-left border border-blue-200 transition-colors"
                    >
                      <span className="font-bold block">#115 Diproses</span>
                      <span className="text-[10px] text-blue-600">Way Halim</span>
                    </button>
                  </div>
                  <button
                    onClick={() => openTrackingModal('0892')}
                    className="w-full p-2 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 font-mono text-xs text-left border border-amber-200 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold block">#BDL-2026-0892 (Simpang MBK)</span>
                      <span className="text-[10px] text-amber-700">Verifikasi Mendesak BMBK</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Section */}
      <section id="statistik-penanganan" className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10">
        <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-lg text-primary">Capaian Pelayanan Publik Kota Bandar Lampung</h3>
              <p className="text-xs text-slate-500">Transparansi kinerja respon Organisasi Perangkat Daerah (OPD) Pemkot</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Pemantauan Lapangan 20 Kecamatan: ONLINE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-surface-soft border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Total Aduan Diterima
              </span>
              <div className="text-3xl font-black text-primary font-mono mt-1">4.829</div>
              <p className="text-xs text-slate-600 mt-1">
                Aspirasi masyarakat terverifikasi sejak Januari 2026
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-soft border border-slate-100">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                Selesai Ditangani
              </span>
              <div className="text-3xl font-black text-emerald-600 font-mono mt-1">4.412</div>
              <p className="text-xs text-slate-600 mt-1">
                <strong>91.4% Tingkat Sukses</strong> penyelesaian tuntas berdokumentasi
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-soft border border-slate-100">
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider block">
                Rata-rata Durasi Penanganan
              </span>
              <div className="text-3xl font-black text-secondary font-mono mt-1">24 - 48 Jam</div>
              <p className="text-xs text-slate-600 mt-1">
                Standar Pelayanan Prima (SOP Reaksi Cepat URC)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Category Services Grid */}
      <section id="kategori-layanan" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">
            Kategori Pelayanan Publik
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
            Pilih Layanan Pengaduan Fasilitas Kota
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Setiap kategori langsung terhubung dengan unit reaksi cepat dinas terkait untuk penanganan tepat sasaran.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-surface-soft border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    SLA {cat.targetSlaHours} Jam
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-primary group-hover:text-secondary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {cat.opd}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  <strong className="text-primary font-mono">{cat.activeReports}</strong> laporan aktif
                </span>
                <button
                  onClick={() => {
                    setPreselectedCategory(cat.id);
                    setActivePage('citizen-form');
                  }}
                  className="text-xs font-bold text-secondary hover:text-secondary-dark flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  Lapor Kategori Ini
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5-Stage Infographic SOP Workflow */}
      <section id="alur-pengaduan" className="bg-primary text-white py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-secondary-light uppercase tracking-widest">
              Transparansi Pelayanan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Alur 5 Tahap Pengaduan Warga
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Setiap laporan warga diproses melalui verifikasi berjenjang hingga tuntas dengan bukti foto lapangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 backdrop-blur-sm">
              <span className="font-mono text-2xl font-black text-amber-400">01</span>
              <h4 className="font-bold text-sm text-white">Diajukan</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Warga mengisi formulir digital, menyematkan pin GPS, dan mengunggah foto bukti ber-EXIF.
              </p>
              <span className="inline-block text-[10px] font-mono bg-white/10 text-slate-300 px-2 py-0.5 rounded">
                Tiket Terbit Otomatis
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 backdrop-blur-sm">
              <span className="font-mono text-2xl font-black text-blue-400">02</span>
              <h4 className="font-bold text-sm text-white">Diverifikasi</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tim verifikator Diskominfo memvalidasi data dan yurisdiksi kewenangan Pemkot.
              </p>
              <span className="inline-block text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                Maksimal 3 Jam Kerja
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 backdrop-blur-sm">
              <span className="font-mono text-2xl font-black text-purple-400">03</span>
              <h4 className="font-bold text-sm text-white">Ditugaskan</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Penerbitan Surat Perintah Tugas (SPT) resmi ke pimpinan OPD dan koordinator lapangan.
              </p>
              <span className="inline-block text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                Disposisi Regu URC
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 backdrop-blur-sm">
              <span className="font-mono text-2xl font-black text-yellow-400">04</span>
              <h4 className="font-bold text-sm text-white">Diproses</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Regu teknis dan armada terjun langsung ke titik koordinat melakukan perbaikan fisik.
              </p>
              <span className="inline-block text-[10px] font-mono bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">
                Estimasi 1 - 2 Hari
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 backdrop-blur-sm">
              <span className="font-mono text-2xl font-black text-emerald-400">05</span>
              <h4 className="font-bold text-sm text-white">Selesai</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pekerjaan rampung disertai dokumentasi foto sesudah; pelapor menerima notifikasi hasil.
              </p>
              <span className="inline-block text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                Arsip Tertutup Resmi
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Catatan Status Ditolak:</strong> Laporan dapat ditolak bila mengandung unsur hoaks, duplikasi, di luar yurisdiksi Kota Bandar Lampung, atau minim bukti visual.
              </span>
            </div>
            <a
              href="#faq-section"
              className="text-secondary-light font-semibold hover:underline flex items-center gap-1"
            >
              Pelajari Kriteria Validasi <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Recent Public Reports Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-primary">Laporan Publik Terkini</h2>
            <p className="text-xs text-slate-500">Transparansi progres aduan yang sedang dan telah diselesaikan oleh OPD</p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 text-xs font-semibold">
            <button
              onClick={() => setReportFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                reportFilter === 'ALL' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-primary'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setReportFilter('SELESAI')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                reportFilter === 'SELESAI' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-primary'
              }`}
            >
              Selesai Ditangani
            </button>
            <button
              onClick={() => setReportFilter('DIPROSES')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                reportFilter === 'DIPROSES' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-primary'
              }`}
            >
              Sedang Diproses
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredReports.slice(0, 6).map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-card flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary bg-surface-soft px-2 py-0.5 rounded border border-slate-200">
                    {rep.publicTicketId}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      rep.status === 'SELESAI'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rep.status === 'DIPROSES' || rep.status === 'DITUGASKAN'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rep.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug">
                  {rep.title}
                </h4>

                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span className="truncate">Kec. {rep.district}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{rep.opd}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">{rep.createdAt}</span>
                <button
                  onClick={() => openTrackingModal(rep.id)}
                  className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                >
                  Lihat Detail <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Research & Smart City Collaboration Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-primary via-primary-container to-secondary text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest font-mono">
              Inovasi Smart Governance UTI x Pemkot BDL
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Sinergi Akademisi & Pemerintah untuk Kemajuan Kota Tapis Berseri
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Platform SIAP LAPOR dikembangkan melalui kolaborasi strategis Pemerintah Kota Bandar Lampung bersama peneliti dan talenta muda Universitas Teknokrat Indonesia (Kampus Sang Juara). Menghadirkan layanan publik yang akuntabel, terenkripsi, dan berbasis data geospasial presisi.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>100% Karya Mandiri Putra Daerah</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Standar Keamanan Siber ISO 27001</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Sinkronisasi Disposisi Real-Time</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-blue-200 font-mono">
              Disupervisi oleh: Rayhan Pratama (23311140) & Dr. Erliyan Redy Susanto, M.Kom.
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">FAQ</span>
          <h2 className="text-2xl font-extrabold text-primary">Pertanyaan Umum Warga</h2>
          <p className="text-xs text-slate-500">Hal-hal yang sering ditanyakan seputar mekanisme pelaporan dan tindak lanjut</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-secondary shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-surface-soft">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Emergency Callout Card */}
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-950">Menemukan Kejadian Darurat Kritis?</h4>
              <p className="text-xs text-amber-800">
                Pohon tumbang menutup jalan protokol, tiang listrik roboh, atau banjir bandang memerlukan penanganan instan.
              </p>
            </div>
          </div>
          <a
            href="tel:112"
            className="bg-accent-danger hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            Hubungi Siaga 112
          </a>
        </div>
      </section>
    </div>
  );
};

