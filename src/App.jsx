import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import VeterinarianDashboard from './pages/veterinarian/VeterinarianDashboard';
import CaseEntryForm from './pages/veterinarian/CaseEntryForm';
import WilayaDashboard from './pages/wilaya/WilayaDashboard';
import MinistryDashboard from './pages/ministry/MinistryDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/veterinarian" element={<VeterinarianDashboard />} />
            <Route path="/veterinarian/new-declaration" element={<CaseEntryForm />} />
            <Route path="/wilaya/*" element={<WilayaDashboard />} />
            <Route path="/ministry/*" element={<MinistryDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </main>
        <footer className="border-t border-slate-200 bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 الجمهورية الجزائرية الديمقراطية الشعبية - نظام المراقبة الوبائية البيطرية</p>
            <p>Conçu selon les principes SDD-Pro & UI/UX Pro Max</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
