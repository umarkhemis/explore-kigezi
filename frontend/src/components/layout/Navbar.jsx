

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const { isAuthenticated, user, logout, isHost, isAdmin } = useAuth();
  const location = useNavigate();
  const loc      = useLocation();

  const isHome = loc.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    location('/');
  };

  const navBase = isHome && !scrolled
    ? 'bg-transparent text-white'
    : 'bg-white text-kigezi-text shadow-md';

  const linkClass = isHome && !scrolled
    ? 'text-white/90 hover:text-white'
    : 'text-kigezi-muted hover:text-primary';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBase}`}>
      <div className="page-wrapper">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-serif font-bold text-xl">
            <span className="text-2xl">🌍</span>
            <span className={isHome && !scrolled ? 'text-white' : 'text-primary'}>
              Explore Kigezi
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/experiences" className={`font-medium transition-colors ${linkClass}`}>
              Experiences
            </Link>
            {!isAuthenticated && (
              <Link to="/host/register" className={`font-medium transition-colors ${linkClass}`}>
                Become a Host
              </Link>
            )}
            {isHost && (
              <Link to="/host/dashboard" className={`font-medium transition-colors ${linkClass}`}>
                Host Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin/hosts" className={`font-medium transition-colors ${linkClass}`}>
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {!isHost && !isAdmin && (
                  <Link to="/my-bookings"
                    className={`font-medium transition-colors ${linkClass}`}>
                    My Bookings
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  {user?.profile_photo
                    ? <img src={user.profile_photo} alt={user.first_name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-primary" />
                    : <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        {(user?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                      </div>
                  }
                  <span className={`text-sm font-medium ${isHome && !scrolled ? 'text-white' : 'text-kigezi-text'}`}>
                    {user?.first_name || 'Account'}
                  </span>
                </div>
                <button onClick={handleLogout}
                  className={`text-sm font-medium transition-colors ${linkClass}`}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login"
                  className={`font-medium transition-colors ${linkClass}`}>
                  Login
                </Link>
                <Link to="/register"
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200
                    ${isHome && !scrolled
                      ? 'bg-white text-primary hover:bg-primary-50'
                      : 'bg-primary text-white hover:bg-primary-600'}`}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`w-6 flex flex-col gap-1.5 transition-all ${isHome && !scrolled ? 'text-white' : 'text-kigezi-text'}`}>
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-kigezi-border shadow-lg">
          <div className="page-wrapper py-4 flex flex-col gap-4">
            <Link to="/experiences" onClick={() => setMenuOpen(false)}
              className="font-medium text-kigezi-text hover:text-primary py-2">
              Experiences
            </Link>
            {!isAuthenticated && (
              <Link to="/host/register" onClick={() => setMenuOpen(false)}
                className="font-medium text-kigezi-text hover:text-primary py-2">
                Become a Host
              </Link>
            )}
            {isHost && (
              <Link to="/host/dashboard" onClick={() => setMenuOpen(false)}
                className="font-medium text-kigezi-text hover:text-primary py-2">
                Host Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin/hosts" onClick={() => setMenuOpen(false)}
                className="font-medium text-kigezi-text hover:text-primary py-2">
                Admin Panel
              </Link>
            )}
            {isAuthenticated ? (
              <>
                {!isHost && !isAdmin && (
                  <Link to="/my-bookings" onClick={() => setMenuOpen(false)}
                    className="font-medium text-kigezi-text hover:text-primary py-2">
                    My Bookings
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="text-left font-medium text-red-500 py-2">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2 border-t border-kigezi-border">
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="btn-outline text-center">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="btn-primary text-center">Sign Up Free</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}