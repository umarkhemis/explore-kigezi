import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { register } from '../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', password2: '' });
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const errs = err.response?.data;
      const msg = typeof errs === 'object' ? Object.values(errs).flat().join(' ') : 'Registration failed.';
      toast.error(msg);
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
            <div className="text-4xl mb-3">🌿</div>
            <h1 className="font-serif text-3xl font-bold text-kigezi-text">Create Account</h1>
            <p className="text-kigezi-muted mt-1">Join thousands of cultural travellers</p>
          </div>
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-kigezi-text mb-1">First Name</label>
                  <input type="text" value={form.first_name} onChange={set('first_name')} placeholder="First name" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-kigezi-text mb-1">Last Name</label>
                  <input type="text" value={form.last_name} onChange={set('last_name')} placeholder="Last name" className="input-field" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-kigezi-text mb-1">Email</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-kigezi-text mb-1">Password</label>
                <input type="password" value={form.password} onChange={set('password')} placeholder="At least 8 characters" className="input-field" required minLength={8} />
              </div>
              <div>
                <label className="block text-sm font-medium text-kigezi-text mb-1">Confirm Password</label>
                <input type="password" value={form.password2} onChange={set('password2')} placeholder="Repeat password" className="input-field" required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-sm text-kigezi-muted mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
            </p>
            <p className="text-center text-sm text-kigezi-muted mt-2">
              Want to host?{' '}
              <Link to="/host/register" className="text-secondary font-semibold hover:underline">Register as Host</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
