import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getHostStats, getHostBookings, updateBookingStatus } from '../../services/hostService';

const MOCK_STATS = { total_bookings: 24, monthly_earnings: 1920000, average_rating: 4.7, total_reviews: 18 };
const MOCK_BOOKINGS = [
  { id: 1, tourist_name: 'Sarah Johnson', booking_date: '2025-12-20', group_size: 2, total_price: '160000', status: 'pending', experience_detail: { title: 'Kiga Dance Workshop' } },
  { id: 2, tourist_name: 'James Mutebi', booking_date: '2025-12-22', group_size: 4, total_price: '320000', status: 'confirmed', experience_detail: { title: 'Bakiga Cooking Class' } },
  { id: 3, tourist_name: 'Emma Wilson', booking_date: '2025-11-10', group_size: 1, total_price: '80000', status: 'completed', experience_detail: { title: 'Kiga Dance Workshop' } },
];

const QUICK_LINKS = [
  { label: '➕ Create New Experience', to: '/host/experiences/new', cls: 'btn-primary' },
  { label: '🌿 View All Experiences', to: '/host/experiences', cls: 'btn-outline' },
  { label: '📅 View All Bookings', to: '/host/bookings', cls: 'btn-outline' },
];

export default function HostDashboardPage() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    Promise.all([
      getHostStats().catch(() => MOCK_STATS),
      getHostBookings({ page: 1, page_size: 5 }).catch(() => ({ results: MOCK_BOOKINGS })),
    ]).then(([s, b]) => {
      setStats(s);
      setBookings(Array.isArray(b) ? b : b.results || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      toast.success('Status updated!');
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  const STAT_CARDS = stats ? [
    { label: 'Total Bookings', value: stats.total_bookings, icon: '📅', color: 'text-primary' },
    { label: "This Month's Earnings", value: `UGX ${Math.round((stats.monthly_earnings || 0) / 1000)}K`, icon: '💰', color: 'text-green-600' },
    { label: 'Average Rating', value: `${stats.average_rating} ⭐`, icon: '⭐', color: 'text-secondary' },
    { label: 'Total Reviews', value: stats.total_reviews, icon: '💬', color: 'text-blue-600' },
  ] : [];

  return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="pt-16">
        <div className="bg-primary py-10">
          <div className="page-wrapper">
            <h1 className="font-serif text-3xl font-bold text-white mb-1">Host Dashboard</h1>
            <p className="text-white/70">Manage your experiences and bookings</p>
          </div>
        </div>

        <div className="page-wrapper py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-3">
              <div className="card p-4">
                <h3 className="font-semibold text-kigezi-text mb-3 text-sm uppercase tracking-wide">Navigation</h3>
                <nav className="space-y-1">
                  {[
                    { to: '/host/dashboard', label: '📊 Dashboard' },
                    { to: '/host/experiences', label: '🌿 My Experiences' },
                    { to: '/host/experiences/new', label: '➕ New Experience' },
                  ].map((link) => (
                    <Link key={link.to} to={link.to} className="block text-sm py-2 px-3 rounded-lg text-kigezi-text hover:bg-kigezi-bg hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-kigezi-text mb-3 text-sm uppercase tracking-wide">Quick Actions</h3>
                <div className="space-y-2">
                  {QUICK_LINKS.map((l) => (
                    <Link key={l.to} to={l.to} className={`${l.cls} block text-center text-sm py-2`}>{l.label}</Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className="lg:col-span-3 space-y-6">
              {/* Stats */}
              {loading ? <LoadingSpinner center /> : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {STAT_CARDS.map((s) => (
                      <div key={s.label} className="card p-5">
                        <div className="text-2xl mb-2">{s.icon}</div>
                        <div className={`font-serif text-2xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-kigezi-muted text-xs mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Bookings */}
                  <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-kigezi-border flex items-center justify-between">
                      <h2 className="font-serif font-bold text-kigezi-text">Recent Bookings</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-kigezi-bg text-kigezi-muted text-xs uppercase tracking-wide">
                            <th className="text-left p-4">Tourist</th>
                            <th className="text-left p-4">Experience</th>
                            <th className="text-left p-4">Date</th>
                            <th className="text-left p-4">Group</th>
                            <th className="text-left p-4">Total</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-kigezi-border">
                          {bookings.map((b) => (
                            <tr key={b.id} className="hover:bg-kigezi-bg/40 transition-colors">
                              <td className="p-4 font-semibold text-kigezi-text">{b.tourist_name}</td>
                              <td className="p-4 text-kigezi-muted text-xs max-w-[120px]">
                                <span className="truncate block">{b.experience_detail?.title || '—'}</span>
                              </td>
                              <td className="p-4 text-kigezi-muted text-xs whitespace-nowrap">{b.booking_date}</td>
                              <td className="p-4 text-center text-kigezi-muted">{b.group_size}</td>
                              <td className="p-4 font-semibold text-primary text-xs whitespace-nowrap">
                                UGX {Number(b.total_price).toLocaleString()}
                              </td>
                              <td className="p-4"><Badge label={b.status} variant={b.status} /></td>
                              <td className="p-4">
                                <div className="flex gap-1">
                                  {b.status === 'pending' && (
                                    <button
                                      onClick={() => handleStatus(b.id, 'confirmed')}
                                      disabled={updating === b.id}
                                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold hover:bg-blue-200 transition-colors disabled:opacity-50"
                                    >
                                      Confirm
                                    </button>
                                  )}
                                  {b.status === 'confirmed' && (
                                    <button
                                      onClick={() => handleStatus(b.id, 'completed')}
                                      disabled={updating === b.id}
                                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold hover:bg-green-200 transition-colors disabled:opacity-50"
                                    >
                                      Complete
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {bookings.length === 0 && (
                        <div className="text-center py-10 text-kigezi-muted">No recent bookings.</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
