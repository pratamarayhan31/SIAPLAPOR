import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { TrackTicketModal } from './components/common/TrackTicketModal';
import { ToastContainer } from './components/common/Toast';
import { LandingPage } from './components/pages/LandingPage';
import { CitizenReportForm } from './components/pages/CitizenReportForm';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { AdminVerification } from './components/pages/AdminVerification';
import { OfficerDashboard } from './components/pages/OfficerDashboard';

const AppContent: React.FC = () => {
  const { activePage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-surface-soft text-slate-800">
      {/* Interactive Role Switcher Banner */}
      <RoleSwitcher />

      {/* Main Header */}
      <Header />

      {/* Page Content View */}
      <div className="flex-1">
        {activePage === 'landing' && <LandingPage />}
        {activePage === 'citizen-form' && <CitizenReportForm />}
        {activePage === 'admin-dashboard' && <AdminDashboard />}
        {activePage === 'admin-verification' && <AdminVerification />}
        {activePage === 'officer-dashboard' && <OfficerDashboard />}
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals & Toasts */}
      <TrackTicketModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

