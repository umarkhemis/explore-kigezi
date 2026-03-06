

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, isHost, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.first_name || 'there'}! 👋`);
      if (user.role === 'host')  navigate('/host/dashboard');
      else if (user.role === 'admin') navigate('/admin/hosts');
      else navigate(from);
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.detail
        || 'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kigezi-bg flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-serif font-bold text-2xl text-primary">
            <span className="text-3xl">🌍</span> Explore Kigezi
          </Link>
          <h1 className="font-serif text-3xl font-bold text-kigezi-text mt-4 mb-2">Welcome back</h1>
          <p className="text-kigezi-muted">Sign in to your account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold text-kigezi-text mb-2">Email Address</label>
              <input type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                className="input-field" />
            </div>
            <div>
              <label className="block font-semibold text-kigezi-text mb-2">Password</label>
              <input type="password" required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Your password"
                className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? '⏳ Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-4 bg-secondary/10 rounded-xl text-sm">
            <div className="font-semibold text-kigezi-text mb-2">🔑 Demo Credentials</div>
            <div className="text-kigezi-muted space-y-1">
              <div>Tourist: <span className="font-mono">sarah@example.com</span> / <span className="font-mono">tourist123456</span></div>
              <div>Host: <span className="font-mono">amara@explorekigezi.com</span> / <span className="font-mono">host123456</span></div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-kigezi-muted text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">Sign up free</Link>
            </p>
            <p className="text-kigezi-muted text-sm mt-2">
              Want to host?{' '}
              <Link to="/host/register" className="text-accent font-semibold hover:underline">Join as a host</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}