import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import VeterinarianDashboard from './pages/veterinarian/VeterinarianDashboard';
import WilayaDashboard from './pages/wilaya/WilayaDashboard';
import MinistryDashboard from './pages/ministry/MinistryDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import { getCurrentUser } from './services/dbService';

/**
 * Root redirection:
 * - Unauthenticated users are redirected directly to /login
 * - Authenticated users are routed to their designated institutional portal
 */
function RootRedirect() {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const roleRedirects = {
    VETERINARIAN: '/veterinarian',
    WILAYA_INSPECTOR: '/wilaya',
    MINISTRY_ADMIN: '/ministry',
    MINISTRY: '/ministry',
    SYSTEM_ADMIN: '/admin',
    ADMIN: '/admin',
  };

  const target = roleRedirects[user.role] || '/login';
  return <Navigate to={target} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#f4f6f8] text-slate-900 selection:bg-dhis-200 selection:text-dhis-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-5">
          <Routes>
            {/* Root Route: Login wall for unauthenticated users */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Role 1: Veterinarian Portal */}
            <Route
              path="/veterinarian/*"
              element={
                <ProtectedRoute allowedRoles={['VETERINARIAN']}>
                  <VeterinarianDashboard />
                </ProtectedRoute>
              }
            />

            {/* Role 2: Wilaya Inspector Portal */}
            <Route
              path="/wilaya/*"
              element={
                <ProtectedRoute allowedRoles={['WILAYA_INSPECTOR']}>
                  <WilayaDashboard />
                </ProtectedRoute>
              }
            />

            {/* Role 3: Ministry Central Direction Portal */}
            <Route
              path="/ministry/*"
              element={
                <ProtectedRoute allowedRoles={['MINISTRY_ADMIN', 'MINISTRY']}>
                  <MinistryDashboard />
                </ProtectedRoute>
              }
            />

            {/* Role 4: System Administration Portal */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['SYSTEM_ADMIN', 'ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
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
