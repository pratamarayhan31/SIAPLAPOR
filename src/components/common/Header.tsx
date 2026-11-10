import React from 'react';
import { useApp } from '../../context/AppContext';
import { PhoneCall, Shield, AlertTriangle, PlusCircle, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const { setActivePage, openTrackingModal } = useApp();

  return (
    <header className="bg-primary text-white border-b border-primary-container shadow-md sticky top-[41px] z-40 transition-all">
      {/* Top emergency micro-bar */}
      <div className="bg-primary-dark/80 px-4 py-1.5 border-b border-white/10 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" /> Data Pelapor Terlindungi & Terenkripsi
            </span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="hidden md:inline text-white/70">
              Kanal Resmi Pelayanan Publik Kolaborasi Pemkot Bandar Lampung & Universitas Teknokrat Indonesia
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-300 font-semibold flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" /> Darurat Kota?
            </span>
            <a
              href="tel:112"
              className="bg-accent-danger hover:bg-red-700 text-white px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 transition-transform active:scale-95"
            >
              <PhoneCall className="w-3 h-3" /> Call Center 112
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Logos & Brand */}
        <div 
          onClick={() => setActivePage('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Emblem Badges */}
          <div className="flex items-center gap-1.5">
            {/* Pemkot Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center p-1 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-lg bg-primary flex flex-col items-center justify-center text-[8px] font-bold text-amber-300 leading-tight border border-amber-400/50">
                <span>BDL</span>
                <span className="text-[6px] text-white">PEMKOT</span>
              </div>
            </div>
            {/* UTI Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center p-1 shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-lg bg-white flex flex-col items-center justify-center text-[8px] font-black text-rose-700 leading-tight">
                <span>UTI</span>
                <span className="text-[6px] text-slate-600 font-bold">JUARA</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                SIAP <span className="text-secondary-light">LAPOR</span>
              </h1>
              <span className="text-[10px] bg-secondary/40 text-blue-200 border border-secondary/50 px-1.5 py-0.5 rounded font-mono font-medium">
                v1.4
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium tracking-wide">
              Kota Bandar Lampung <span className="text-white/40">•</span> Smart City Service
            </p>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-200">
          <button
            onClick={() => setActivePage('landing')}
            className="hover:text-white transition-colors"
          >
            Beranda
          </button>
          <button
            onClick={() => openTrackingModal('')}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" /> Lacak Aduan
          </button>
          <button
            onClick={() => {
              setActivePage('landing');
              setTimeout(() => {
                document.getElementById('kategori-layanan')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-white transition-colors"
          >
            Kategori
          </button>
          <button
            onClick={() => {
              setActivePage('landing');
              setTimeout(() => {
                document.getElementById('statistik-penanganan')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-white transition-colors"
          >
            Statistik
          </button>
          <button
            onClick={() => {
              setActivePage('landing');
              setTimeout(() => {
                document.getElementById('alur-pengaduan')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-white transition-colors"
          >
            Panduan SOP
          </button>
          <button
            onClick={() => {
              setActivePage('landing');
              setTimeout(() => {
                document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-white transition-colors"
          >
            FAQ
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('citizen-form')}
            className="bg-secondary hover:bg-secondary-light text-white font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-secondary/30 transition-all hover:shadow-secondary/50 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Buat Laporan Baru</span>
            <span className="sm:hidden">Lapor</span>
          </button>
        </div>
      </div>
    </header>
  );
};

