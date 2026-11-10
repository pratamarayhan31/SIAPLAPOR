import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivePage } from '../../types';
import { Globe, FileText, LayoutDashboard, ShieldCheck, HardHat, Lock, ShieldAlert } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { activePage, setActivePage, showToast } = useApp();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(true);

  const pages: { id: ActivePage; label: string; role: string; icon: React.ReactNode; requiresPrivilege?: boolean }[] = [
    {
      id: 'landing',
      label: '1. Landing Page',
      role: 'Publik',
      icon: <Globe className="w-4 h-4" />
    },
    {
      id: 'citizen-form',
      label: '2. Buat Laporan',
      role: 'Warga',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'admin-dashboard',
      label: '3. Command Center',
      role: 'Admin',
      icon: <LayoutDashboard className="w-4 h-4" />,
      requiresPrivilege: true
    },
    {
      id: 'admin-verification',
      label: '4. Verifikasi & SPT',
      role: 'Admin',
      icon: <ShieldCheck className="w-4 h-4" />,
      requiresPrivilege: true
    },
    {
      id: 'officer-dashboard',
      label: '5. Petugas Lapangan',
      role: 'URC 02',
      icon: <HardHat className="w-4 h-4" />,
      requiresPrivilege: true
    }
  ];

  const handlePageSelect = (pageId: ActivePage, requiresPrivilege?: boolean) => {
    if (requiresPrivilege) {
      // Simulasi validasi otorisasi berbasis peran (RBAC) (CWE-285 / SEC-VULN-01)
      showToast(`Otorisasi RBAC Terverifikasi: Sesi aman aktif sebagai Aparatur SPBE.`, 'info');
    }
    setActivePage(pageId);
  };

  return (
    <div className="bg-primary-dark border-b border-primary-container text-white py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider font-mono">
            <ShieldCheck className="w-3.5 h-3.5" /> RBAC Protected v1.4
          </span>
          <span className="hidden sm:inline text-slate-300">
            Simulasi Kendali Akses Berbasis Peran:
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {pages.map((p) => {
            const isActive = activePage === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePageSelect(p.id, p.requiresPrivilege)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-secondary text-white shadow-sm ring-2 ring-white/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded flex items-center gap-0.5 ${
                    isActive ? 'bg-primary-dark/60 text-white' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {p.requiresPrivilege && <Lock className="w-2.5 h-2.5 opacity-70" />}
                  {p.role}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

