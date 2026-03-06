

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { getHostStats, getHostBookings, updateBookingStatus } from '../../services/hostService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function HostDashboardPage() {
  const { user, isHost } = useAuth();
  const navigate = useNavigate();
  const [stats,    setStats]    = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!isHost) { navigate('/login'); return; }
    const load = async () => {
      const [s, b] = await Promise.all([getHostStats(), getHostBookings({ page: 1, page_size: 5 })]);
      setStats(s);
      setBookings(Array.isArray(b) ? b : b?.results || []);
      setLoading(false);
    };
    load();
  }, [isHost, navigate]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status}!`);
      const b = await getHostBookings({ page: 1, page_size: 5 });
      setBookings(Array.isArray(b) ? b : b?.results || []);
    } catch {
      toast.error('Failed to update booking.');
    }
  };

  if (loading) return <div className="min-h-screen bg-kigezi-bg"><Navbar /><LoadingSpinner center size="lg" /></div>;

  const STATS = [
    { label: 'Total Bookings',     value: stats?.total_bookings  ?? 0, icon: '📋', color: 'text-blue-600',  bg: 'bg-blue-50' },
    { label: "This Month's Earnings", value: `UGX ${Number(stats?.monthly_earnings ?? 0).toLocaleString()}`, icon: '💰', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Average Rating',     value: Number(stats?.average_rating ?? 0).toFixed(1) + ' ★', icon: '⭐', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Total Reviews',      value: stats?.total_reviews   ?? 0, icon: '💬', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="pt-16 md:pt-18">
        {/* Header */}
        <div className="bg-primary py-10">
          <div className="page-wrapper">
            <h1 className="font-serif text-3xl font-bold text-white mb-1">
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="text-white/75">Here's what's happening with your experiences today.</p>
          </div>
        </div>

        <div className="page-wrapper py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map(s => (
              <div key={s.label} className={`card p-5 ${s.bg}`}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-kigezi-muted text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Bookings */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-xl font-bold text-kigezi-text">Recent Bookings</h2>
                  <Link to="/host/bookings" className="text-primary text-sm font-medium hover:underline">View All →</Link>
                </div>
                {bookings.length === 0 ? (
                  <p className="text-kigezi-muted text-center py-8">No bookings yet.</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.map(b => {
                      const exp = b.experience_detail || b.experience || {};
                      return (
                        <div key={b.id} className="flex items-center justify-between p-4 bg-kigezi-bg rounded-xl gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-kigezi-text text-sm truncate">
                              {b.tourist_name}
                            </div>
                            <div className="text-kigezi-muted text-xs truncate">
                              {exp.title || 'Experience'} · {b.booking_date ? format(new Date(b.booking_date), 'MMM d, yyyy') : ''}
                            </div>
                            <div className="text-kigezi-muted text-xs">
                              {b.group_size} pax · {b.price_formatted || `UGX ${Number(b.total_price).toLocaleString()}`}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant={b.status} />
                            {b.status === 'pending' && (
                              <button onClick={() => handleStatusUpdate(b.id, 'confirmed')}
                                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                                Confirm
                              </button>
                            )}
                            {b.status === 'confirmed' && (
                              <button onClick={() => handleStatusUpdate(b.id, 'completed')}
                                className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                                Complete
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <div className="card p-6">
                <h2 className="font-serif text-xl font-bold text-kigezi-text mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  {[
                    { to: '/host/experiences/new', icon: '➕', label: 'Create New Experience', color: 'bg-primary/10 text-primary hover:bg-primary/20' },
                    { to: '/host/experiences',     icon: '🎭', label: 'My Experiences',        color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
                    { to: '/host/bookings',        icon: '📋', label: 'All Bookings',          color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
                  ].map(link => (
                    <Link key={link.to} to={link.to}
                      className={`flex items-center gap-3 p-3 rounded-xl font-medium text-sm transition-colors ${link.color}`}>
                      <span className="text-xl">{link.icon}</span> {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="card p-6 bg-primary text-white">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="font-serif font-bold text-lg mb-2">Tips for Success</h3>
                <ul className="text-white/80 text-sm space-y-2">
                  <li>• Respond to booking inquiries within 24 hours</li>
                  <li>• Add high-quality photos to your experiences</li>
                  <li>• Keep your availability calendar updated</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}