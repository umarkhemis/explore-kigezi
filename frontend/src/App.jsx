import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ExperiencesPage from './pages/ExperiencesPage';
import ExperienceDetailPage from './pages/ExperienceDetailPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

import HostRegisterPage from './pages/host/HostRegisterPage';
import HostDashboardPage from './pages/host/HostDashboardPage';
import HostExperiencesPage from './pages/host/HostExperiencesPage';
import HostExperienceFormPage from './pages/host/HostExperienceFormPage';

import AdminHostsPage from './pages/admin/AdminHostsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';

import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/experiences" element={<ExperiencesPage />} />
      <Route path="/experiences/:id" element={<ExperienceDetailPage />} />
      <Route
        path="/experiences/:id/book"
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/confirmation/:ref"
        element={
          <ProtectedRoute>
            <BookingConfirmationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/host/register" element={<HostRegisterPage />} />
      <Route
        path="/host/dashboard"
        element={
          <ProtectedRoute role="host">
            <HostDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/host/experiences"
        element={
          <ProtectedRoute role="host">
            <HostExperiencesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/host/experiences/new"
        element={
          <ProtectedRoute role="host">
            <HostExperienceFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/host/experiences/:id/edit"
        element={
          <ProtectedRoute role="host">
            <HostExperienceFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hosts"
        element={
          <ProtectedRoute role="admin">
            <AdminHostsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute role="admin">
            <AdminBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
