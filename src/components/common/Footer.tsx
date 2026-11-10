import React from 'react';
import { Phone, Mail, MapPin, Building2, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-dark text-slate-300 border-t border-primary-container text-sm">
      {/* Upper Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: System info & partnership */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl text-white tracking-tight">SIAP LAPOR</span>
            <span className="text-[10px] bg-secondary/40 text-blue-200 border border-secondary/50 px-1.5 py-0.5 rounded font-mono">
              v1.4
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sistem Informasi Aduan dan Pelaporan Masyarakat Kota Bandar Lampung terintegrasi Organisasi Perangkat Daerah (OPD) berbasis respons cepat dan transparansi publik.
          </p>
          <div className="pt-2 border-t border-white/10 text-xs space-y-1">
            <p className="font-semibold text-white">Inisiasi Riset Akademik:</p>
            <p className="text-slate-300 font-medium">Rayhan Pratama (23311140 - SI23DX)</p>
            <p className="text-slate-400">Dosen Pembimbing: Dr. Erliyan Redy Susanto, M.Kom.</p>
          </div>
        </div>

        {/* Col 2: Kontak Pelayanan Darurat & Aduan */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" /> Kontak Pelayanan
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <span className="font-semibold text-amber-400">Layanan Siaga 24 Jam:</span>
              <span className="bg-red-600/80 text-white px-2 py-0.5 rounded font-bold font-mono">112</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-300">WhatsApp Aduan:</span>
              <a href="https://wa.me/628117200112" target="_blank" rel="noreferrer" className="text-secondary-light hover:underline font-mono">
                +62 811-7200-112
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <a href="mailto:pengaduan@bandarlampungkota.go.id" className="hover:text-white transition-colors">
                pengaduan@bandarlampungkota.go.id
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Sekretariat & Pusat Riset */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" /> Lokasi Sekretariat
          </h4>
          <div className="space-y-3 text-xs text-slate-400">
            <div>
              <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-secondary-light" /> Sekretariat Pemkot:
              </p>
              <p className="mt-0.5">
                Gedung PTSP Pemkot Bandar Lampung, Jl. Drs. Warsito No. 1, Teluk Betung, Kota Bandar Lampung 35211
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-rose-400" /> Pusat Riset Smart City UTI:
              </p>
              <p className="mt-0.5">
                Universitas Teknokrat Indonesia, Jl. H. ZA. Pagar Alam No. 9-11, Kedaton, Bandar Lampung
              </p>
            </div>
          </div>
        </div>

        {/* Col 4: Standar Keamanan & Regulasi */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-secondary-light" /> Keamanan & Regulasi
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Arsitektur SPBE Terstandarisasi</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Prinsip Keamanan Siber ISO 27001</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Perlindungan Data Pribadi (UU PDP)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Validasi Anti-Hoax EXIF Geotagging</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mandatory Copyright Bar */}
      <div className="bg-black/40 border-t border-white/5 py-5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p className="font-medium text-slate-300">
            Copyright©2026 by Rayhan Pratama dan Dr. Erliyan Redy Susanto, M.Kom
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Kolaborasi Riset Smart Governance Pemkot Bandar Lampung & UTI</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-rose-400">
              Karya Putra Daerah <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

