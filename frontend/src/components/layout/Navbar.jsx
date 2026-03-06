import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isHost, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-kigezi-border shadow-sm">
      <div className="page-wrapper flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-serif font-bold text-xl text-primary">
          <span>🏔️</span> Explore Kigezi
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/experiences" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-kigezi-text hover:text-primary'}`}>
            Experiences
          </NavLink>
          {isAuthenticated ? (
            <>
              {!isHost && !isAdmin && (
                <NavLink to="/my-bookings" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-kigezi-text hover:text-primary'}`}>
                  My Bookings
                </NavLink>
              )}
              {isHost && (
                <NavLink to="/host/dashboard" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-kigezi-text hover:text-primary'}`}>
                  Host Dashboard
                </NavLink>
              )}
              {isAdmin && (
                <NavLink to="/admin/hosts" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-kigezi-text hover:text-primary'}`}>
                  Admin
                </NavLink>
              )}
              <div className="flex items-center gap-3">
                <span className="text-sm text-kigezi-muted">
                  {user?.first_name || user?.email}
                </span>
                <button onClick={handleLogout} className="btn-outline text-sm py-1.5 px-4">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-kigezi-text hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-kigezi-text"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-kigezi-border bg-white py-3 px-4 space-y-2">
          <Link to="/experiences" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-kigezi-text hover:text-primary">Experiences</Link>
          {isAuthenticated ? (
            <>
              {!isHost && !isAdmin && <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-kigezi-text hover:text-primary">My Bookings</Link>}
              {isHost && <Link to="/host/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-kigezi-text hover:text-primary">Host Dashboard</Link>}
              {isAdmin && <Link to="/admin/hosts" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-kigezi-text hover:text-primary">Admin</Link>}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block py-2 text-sm text-red-600 w-full text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-kigezi-text hover:text-primary">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-primary font-semibold">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
