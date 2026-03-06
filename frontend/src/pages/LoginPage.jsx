import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.first_name || user.email}!`);
      if (user.is_staff || user.is_superuser) navigate('/admin/hosts');
      else if (user.is_host || user.role === 'host') navigate('/host/dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kigezi-bg flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🏔️</div>
            <h1 className="font-serif text-3xl font-bold text-kigezi-text">Welcome Back</h1>
            <p className="text-kigezi-muted mt-1">Sign in to your Explore Kigezi account</p>
          </div>
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-kigezi-text mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kigezi-text mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Your password"
                  className="input-field"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-kigezi-border">
              <p className="text-sm text-kigezi-muted text-center mb-3">Demo credentials:</p>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                {[
                  { role: 'Tourist', email: 'tourist@demo.com', pw: 'demo1234' },
                  { role: 'Host', email: 'host@demo.com', pw: 'demo1234' },
                  { role: 'Admin', email: 'admin@demo.com', pw: 'demo1234' },
                ].map((d) => (
                  <button
                    key={d.role}
                    onClick={() => setForm({ email: d.email, password: d.pw })}
                    className="border border-kigezi-border rounded p-1.5 hover:border-primary hover:text-primary transition-colors"
                  >
                    <div className="font-semibold">{d.role}</div>
                    <div className="text-kigezi-muted truncate">{d.email}</div>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-kigezi-muted mt-5">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
