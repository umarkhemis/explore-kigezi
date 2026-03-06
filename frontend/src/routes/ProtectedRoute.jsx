import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, isHost, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner center />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role === 'host' && !isHost && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (role === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
