import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../../services/dbService';

/**
 * Route protection wrapper enforcing authentication and role-based authorization.
 * @param {object} props
 * @param {string[]} [props.allowedRoles] - Specific roles allowed to access this route
 * @param {React.ReactNode} [props.children] - Child components to render when authorized
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const user = getCurrentUser();

  // 1. Unauthenticated -> Redirect to login wall
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role Authorization Check
  if (allowedRoles && allowedRoles.length > 0) {
    const isAuthorized = allowedRoles.includes(user.role);

    if (!isAuthorized) {
      // Map user role to their authorized home dashboard
      const roleLandingRoutes = {
        VETERINARIAN: '/veterinarian',
        WILAYA_INSPECTOR: '/wilaya',
        MINISTRY_ADMIN: '/ministry',
        MINISTRY: '/ministry',
        SYSTEM_ADMIN: '/admin',
        ADMIN: '/admin',
      };

      const fallbackRoute = roleLandingRoutes[user.role] || '/login';
      return <Navigate to={fallbackRoute} replace />;
    }
  }

  // 3. Authorized -> Render children or child routes
  return children ? children : <Outlet />;
}
