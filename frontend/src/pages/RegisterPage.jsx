

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm]       = useState({ first_name: '', last_name: '', email: '', password: '', password2: '', role: 'tourist', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) { toast.error('Passwords do not match.'); return; }
    if (form.password.length < 8)         { toast.error('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to Explore Kigezi, ${user.first_name}! 🎉`);
      navigate(user.role === 'host' ? '/host/dashboard' : '/experiences');
    } catch (err) {
      const errors = err.response?.data || {};
      const msg = Object.values(errors).flat()[0] || 'Registration failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kigezi-bg flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-serif font-bold text-2xl text-primary">
            <span className="text-3xl">🌍</span> Explore Kigezi
          </Link>
          <h1 className="font-serif text-3xl font-bold text-kigezi-text mt-4 mb-2">Create Account</h1>
          <p className="text-kigezi-muted">Join thousands of cultural explorers</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-kigezi-text mb-2 text-sm">First Name *</label>
                <input type="text" required value={form.first_name}
                  onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                  placeholder="First name" className="input-field" />
              </div>
              <div>
                <label className="block font-semibold text-kigezi-text mb-2 text-sm">Last Name *</label>
                <input type="text" required value={form.last_name}
                  onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                  placeholder="Last name" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-kigezi-text mb-2 text-sm">Email *</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com" className="input-field" />
            </div>
            <div>
              <label className="block font-semibold text-kigezi-text mb-2 text-sm">Phone Number</label>
              <input type="tel" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+256 700 000 000" className="input-field" />
            </div>
            <div>
              <label className="block font-semibold text-kigezi-text mb-2 text-sm">Password *</label>
              <input type="password" required value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Min. 8 characters" className="input-field" />
            </div>
            <div>
              <label className="block font-semibold text-kigezi-text mb-2 text-sm">Confirm Password *</label>
              <input type="password" required value={form.password2}
                onChange={e => setForm(f => ({ ...f, password2: e.target.value }))}
                placeholder="Repeat password" className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? '⏳ Creating account…' : 'Create Account 🌍'}
            </button>
          </form>
          <p className="mt-5 text-center text-kigezi-muted text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
          <p className="mt-2 text-center text-kigezi-muted text-sm">
            Want to share your culture?{' '}
            <Link to="/host/register" className="text-accent font-semibold hover:underline">Become a host</Link>
          </p>
        </div>
      </div>
    </div>
  );
}