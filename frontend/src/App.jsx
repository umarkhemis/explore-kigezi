

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages — Tourist
import HomePage           from './pages/HomePage';
import ExperiencesPage    from './pages/ExperiencesPage';
import ExperienceDetailPage from './pages/ExperienceDetailPage';
import BookingPage        from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MyBookingsPage     from './pages/MyBookingsPage';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';

// Pages — Host
import HostRegisterPage   from './pages/host/HostRegisterPage';
import HostDashboardPage  from './pages/host/HostDashboardPage';
import HostExperiencesPage from './pages/host/HostExperiencesPage';
import HostExperienceFormPage from './pages/host/HostExperienceFormPage';

// Pages — Admin
import AdminLoginPage     from './pages/admin/AdminLoginPage';
import AdminHostsPage     from './pages/admin/AdminHostsPage';
import AdminBookingsPage  from './pages/admin/AdminBookingsPage';

// ── Protected Route ────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole && !user?.is_superuser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/"                   element={<HomePage />} />
    <Route path="/experiences"        element={<ExperiencesPage />} />
    <Route path="/experiences/:id"    element={<ExperienceDetailPage />} />
    <Route path="/experiences/:id/book" element={<BookingPage />} />
    <Route path="/booking/confirmation/:reference" element={<BookingConfirmationPage />} />
    <Route path="/login"              element={<LoginPage />} />
    <Route path="/register"           element={<RegisterPage />} />
    <Route path="/host/register"      element={<HostRegisterPage />} />

    {/* Tourist Protected */}
    <Route path="/my-bookings" element={
      <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
    } />

    {/* Host Protected */}
    <Route path="/host/dashboard" element={
      <ProtectedRoute requiredRole="host"><HostDashboardPage /></ProtectedRoute>
    } />
    <Route path="/host/experiences" element={
      <ProtectedRoute requiredRole="host"><HostExperiencesPage /></ProtectedRoute>
    } />
    <Route path="/host/experiences/new" element={
      <ProtectedRoute requiredRole="host"><HostExperienceFormPage /></ProtectedRoute>
    } />
    <Route path="/host/experiences/:id/edit" element={
      <ProtectedRoute requiredRole="host"><HostExperienceFormPage /></ProtectedRoute>
    } />

    {/* Admin */}
    <Route path="/admin/login"    element={<AdminLoginPage />} />
    <Route path="/admin/hosts"    element={
      <ProtectedRoute requiredRole="admin"><AdminHostsPage /></ProtectedRoute>
    } />
    <Route path="/admin/bookings" element={
      <ProtectedRoute requiredRole="admin"><AdminBookingsPage /></ProtectedRoute>
    } />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#1A1A2E', color: '#fff', borderRadius: '12px' },
            success: { style: { background: '#2D6A4F' } },
            error:   { style: { background: '#DC2626' } },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}












// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider, useAuth } from './context/AuthContext';

// // Pages
// import HomePage                from './pages/HomePage';
// import ExperiencesPage         from './pages/ExperiencesPage';
// import ExperienceDetailPage    from './pages/ExperienceDetailPage';
// import BookingPage             from './pages/BookingPage';
// import BookingConfirmationPage from './pages/BookingConfirmationPage';
// import MyBookingsPage          from './pages/MyBookingsPage';
// import LoginPage               from './pages/LoginPage';
// import RegisterPage            from './pages/RegisterPage';
// import NotFoundPage            from './pages/NotFoundPage';

// // Host pages
// import HostRegisterPage        from './pages/host/HostRegisterPage';
// import HostDashboardPage       from './pages/host/HostDashboardPage';
// import HostExperiencesPage     from './pages/host/HostExperiencesPage';
// import HostExperienceFormPage  from './pages/host/HostExperienceFormPage';

// // Admin pages
// import AdminHostsPage          from './pages/admin/AdminHostsPage';
// import AdminBookingsPage       from './pages/admin/AdminBookingsPage';

// // Protected Route wrapper
// function ProtectedRoute({ children, requiredRole }) {
//   const { isAuthenticated, user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
//     </div>
//   );

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (requiredRole && user?.role !== requiredRole) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public */}
//       <Route path="/"            element={<HomePage />} />
//       <Route path="/experiences" element={<ExperiencesPage />} />
//       <Route path="/experiences/:id" element={<ExperienceDetailPage />} />
//       <Route path="/login"       element={<LoginPage />} />
//       <Route path="/register"    element={<RegisterPage />} />
//       <Route path="/host/register" element={<HostRegisterPage />} />

//       {/* Protected — any authenticated user */}
//       <Route path="/experiences/:id/book" element={
//         <ProtectedRoute><BookingPage /></ProtectedRoute>
//       } />
//       <Route path="/booking/confirmation/:reference" element={
//         <ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>
//       } />
//       <Route path="/my-bookings" element={
//         <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
//       } />

//       {/* Protected — Host only */}
//       <Route path="/host/dashboard" element={
//         <ProtectedRoute requiredRole="host"><HostDashboardPage /></ProtectedRoute>
//       } />
//       <Route path="/host/experiences" element={
//         <ProtectedRoute requiredRole="host"><HostExperiencesPage /></ProtectedRoute>
//       } />
//       <Route path="/host/experiences/new" element={
//         <ProtectedRoute requiredRole="host"><HostExperienceFormPage /></ProtectedRoute>
//       } />
//       <Route path="/host/experiences/:id/edit" element={
//         <ProtectedRoute requiredRole="host"><HostExperienceFormPage /></ProtectedRoute>
//       } />

//       {/* Protected — Admin only */}
//       <Route path="/admin/hosts" element={
//         <ProtectedRoute requiredRole="admin"><AdminHostsPage /></ProtectedRoute>
//       } />
//       <Route path="/admin/bookings" element={
//         <ProtectedRoute requiredRole="admin"><AdminBookingsPage /></ProtectedRoute>
//       } />

//       {/* 404 */}
//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppRoutes />
//         <Toaster
//           position="top-right"
//           toastOptions={{
//             duration: 4000,
//             style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px' },
//             success: { iconTheme: { primary: '#2D6A4F', secondary: '#fff' } },
//           }}
//         />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }