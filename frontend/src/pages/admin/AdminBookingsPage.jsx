


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { getAdminBookings, getAdminStats } from '../../services/adminService';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

export default function AdminBookingsPage() {
  const { isAdmin } = useAuth();
  const navigate    = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);

  useEffect(() => {
    if (!isAdmin) { navigate('/login'); return; }
    getAdminStats().then(setStats);
  }, [isAdmin, navigate]);

  useEffect(() => { loadBookings(); }, [page, search, statusFilter]);

  const loadBookings = async () => {
    setLoading(true);
    const params = { page, page_size: 15 };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    const data = await getAdminBookings(params);
    setBookings(Array.isArray(data) ? data : data?.results || []);
    setTotal(data?.count || 0);
    setLoading(false);
  };

  const STAT_CARDS = [
    { label: 'Total Bookings',    value: stats?.total_bookings   ?? '…', icon: '📋', color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Total Revenue',     value: stats?.total_revenue ? `UGX ${Number(stats.total_revenue).toLocaleString()}` : '…', icon: '💰', color: 'text-green-600',  bg: 'bg-green-50' },
    { label: 'Active Experiences',value: stats?.active_experiences ?? '…', icon: '🎭', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Verified Hosts',    value: stats?.verified_hosts   ?? '…', icon: '👥', color: 'text-primary',    bg: 'bg-primary/10' },
  ];

  return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="pt-16 md:pt-18">
        <div className="bg-primary py-10">
          <div className="page-wrapper">
            <h1 className="font-serif text-3xl font-bold text-white mb-1">Bookings & Revenue</h1>
            <p className="text-white/75">Platform-wide booking overview</p>
          </div>
        </div>

        <div className="page-wrapper py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map(s => (
              <div key={s.label} className={`card p-5 ${s.bg}`}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className={`text-xl font-bold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-kigezi-muted text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          {stats?.monthly_revenue?.length > 0 && (
            <div className="card p-6 mb-8">
              <h2 className="font-serif text-xl font-bold text-kigezi-text mb-5">Monthly Revenue (UGX)</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthly_revenue}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#2D6A4F" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8e4dc" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B6254' }} />
                    <YAxis tickFormatter={v => `${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 11, fill: '#6B6254' }} />
                    <Tooltip formatter={v => [`UGX ${Number(v).toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#2D6A4F" strokeWidth={2.5}
                      fill="url(#revenueGrad)" dot={{ fill: '#2D6A4F', r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <input type="text" placeholder="Search by reference, tourist name…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="input-field flex-1" />
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="input-field w-full sm:w-48">
              <option value="">All Statuses</option>
              {['pending','confirmed','completed','cancelled'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? <LoadingSpinner center /> : (
                <table className="w-full text-sm">
                  <thead className="bg-kigezi-bg border-b border-kigezi-border">
                    <tr>
                      {['Reference','Tourist','Experience','Date','Amount','Status','Payment'].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-semibold text-kigezi-text whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-kigezi-border">
                    {bookings.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-10 text-kigezi-muted">No bookings found.</td></tr>
                    ) : bookings.map(b => {
                      const exp = b.experience_detail || b.experience || {};
                      return (
                        <tr key={b.id} className="hover:bg-kigezi-bg/50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-primary font-semibold">{b.booking_reference}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-kigezi-text">{b.tourist_name}</div>
                            <div className="text-kigezi-muted text-xs">{b.tourist_email}</div>
                          </td>
                          <td className="px-4 py-3 max-w-[160px]">
                            <div className="truncate text-kigezi-text">{exp.title || '—'}</div>
                          </td>
                          <td className="px-4 py-3 text-kigezi-muted whitespace-nowrap">
                            {b.booking_date ? format(new Date(b.booking_date), 'MMM d, yyyy') : '—'}
                          </td>
                          <td className="px-4 py-3 font-semibold text-kigezi-text whitespace-nowrap">
                            {b.price_formatted || `UGX ${Number(b.total_price || 0).toLocaleString()}`}
                          </td>
                          <td className="px-4 py-3"><Badge variant={b.status} /></td>
                          <td className="px-4 py-3 text-kigezi-muted capitalize text-xs">
                            {(b.payment_method || '').replace('_', ' ')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            {/* Pagination */}
            {total > 15 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-kigezi-border">
                <span className="text-sm text-kigezi-muted">Showing {((page-1)*15)+1}–{Math.min(page*15,total)} of {total}</span>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="btn-outline text-sm py-1.5 px-3 disabled:opacity-40">← Prev</button>
                  <button disabled={page * 15 >= total} onClick={() => setPage(p => p + 1)}
                    className="btn-outline text-sm py-1.5 px-3 disabled:opacity-40">Next →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}