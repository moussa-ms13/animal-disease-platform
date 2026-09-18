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
      <div className="min-h-screen flex flex-col bg-[#f4f6f8] text-slate-900 selection:bg-dhis-200 selection:text-dhis-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-5">
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
        <footer className="border-t border-slate-200 bg-white py-3">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p className="font-medium text-slate-600">
              © 2026 الجمهورية الجزائرية الديمقراطية الشعبية — وزارة الفلاحة والتنمية الريفية
            </p>
            <p className="text-[11px] text-slate-400">
              Direction des Services Vétérinaires — Système d'Information Sanitaire Vétérinaire
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}