// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Role } from '../types/index';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Jika user belum terautentikasi, redirect ke halaman login
  if (!isAuthenticated) {
    // Menyimpan lokasi yang hendak dituju untuk redirect setelah login berhasil
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Jika allowedRoles diberikan, periksa apakah user memiliki role yang diizinkan
  if (allowedRoles && user) {
    const hasAllowedRole = allowedRoles.includes(user.role);
    if (!hasAllowedRole) {
      // Redirect ke halaman tidak diizinkan jika user tidak memiliki role yang sesuai
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Jika autentikasi berhasil dan role sesuai (jika diperlukan), tampilkan child routes
  return <Outlet />;
};

export default ProtectedRoute;
