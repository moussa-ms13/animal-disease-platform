import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import VeterinarianDashboard from './pages/veterinarian/VeterinarianDashboard';
import WilayaDashboard from './pages/wilaya/WilayaDashboard';
import MinistryDashboard from './pages/ministry/MinistryDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { getCurrentUser } from './services/dbService';

function RootRedirect() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  const roleRedirects = { VETERINARIAN:'/veterinarian', WILAYA_INSPECTOR:'/wilaya', MINISTRY_ADMIN:'/ministry', MINISTRY:'/ministry', SYSTEM_ADMIN:'/admin', ADMIN:'/admin' };
  return <Navigate to={roleRedirects[user.role] || '/login'} replace />;
}

export default function App() {
  return <BrowserRouter><Routes><Route path="/" element={<RootRedirect />} /><Route path="/login" element={<LoginPage />} /><Route path="/veterinarian/*" element={<ProtectedRoute allowedRoles={['VETERINARIAN']}><VeterinarianDashboard /></ProtectedRoute>} /><Route path="/wilaya/*" element={<ProtectedRoute allowedRoles={['WILAYA_INSPECTOR']}><WilayaDashboard /></ProtectedRoute>} /><Route path="/ministry/*" element={<ProtectedRoute allowedRoles={['MINISTRY_ADMIN','MINISTRY']}><MinistryDashboard /></ProtectedRoute>} /><Route path="/admin/*" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN','ADMIN']}><AdminDashboard /></ProtectedRoute>} /><Route path="*" element={<Navigate to="/login" replace />} /></Routes></BrowserRouter>;
}
