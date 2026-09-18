import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import VeterinarianDashboard from './pages/veterinarian/VeterinarianDashboard';
import WilayaDashboard from './pages/wilaya/WilayaDashboard';
import MinistryDashboard from './pages/ministry/MinistryDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import { getCurrentUser } from './services/dbService';

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

function MainLayout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8] text-slate-900 selection:bg-dhis-200 selection:text-dhis-900">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-5">
        {children}
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
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Default entrypoint */}
          <Route path="/" element={<RootRedirect />} />

          {/* Standalone full-screen split-screen login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Role-Based Protected Routes */}
          <Route
            path="/veterinarian/*"
            element={
              <ProtectedRoute allowedRoles={['VETERINARIAN']}>
                <VeterinarianDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wilaya/*"
            element={
              <ProtectedRoute allowedRoles={['WILAYA_INSPECTOR']}>
                <WilayaDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ministry/*"
            element={
              <ProtectedRoute allowedRoles={['MINISTRY_ADMIN', 'MINISTRY']}>
                <MinistryDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['SYSTEM_ADMIN', 'ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default fallback for any unmatched route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
