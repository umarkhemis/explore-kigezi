import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';

const STATUS_TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const MOCK_BOOKINGS = [
  { id: 1, booking_reference: 'EK-001-2025', tourist_name: 'Sarah Johnson', tourist_email: 'sarah@example.com', booking_date: '2025-12-15', total_price: '240000', platform_commission: '36000', host_payout_amount: '204000', status: 'completed', payment_status: 'paid', experience_detail: { title: 'Kiga Dance & Drumming Workshop' }, created_at: '2025-12-01' },
  { id: 2, booking_reference: 'EK-002-2025', tourist_name: 'James Mutebi', tourist_email: 'james@example.com', booking_date: '2025-12-18', total_price: '180000', platform_commission: '27000', host_payout_amount: '153000', status: 'confirmed', payment_status: 'paid', experience_detail: { title: 'Traditional Bakiga Cooking Class' }, created_at: '2025-12-05' },
  { id: 3, booking_reference: 'EK-003-2025', tourist_name: 'Emma Wilson', tourist_email: 'emma@example.com', booking_date: '2025-12-20', total_price: '360000', platform_commission: '54000', host_payout_amount: '306000', status: 'pending', payment_status: 'pending', experience_detail: { title: 'Batwa Cultural Heritage Walk' }, created_at: '2025-12-10' },
];

export default function AdminBookingsPage() {
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search,    setSearch]    = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/bookings/admin/all/');
        setBookings(Array.isArray(data) ? data : data.results || []);
      } catch {
        setBookings(MOCK_BOOKINGS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = bookings
    .filter(b => activeTab === 'all' || b.status === activeTab)
    .filter(b => !search ||
      b.booking_reference?.toLowerCase().includes(search.toLowerCase()) ||
      b.tourist_name?.toLowerCase().includes(search.toLowerCase())
    );

  const totalRevenue    = bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + Number(b.total_price || 0), 0);
  const platformRevenue = bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + Number(b.platform_commission || 0), 0);

  return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="pt-16 md:pt-18">
        <div className="bg-primary py-10">
          <div className="page-wrapper">
            <h1 className="font-serif text-3xl font-bold text-white mb-1">All Bookings</h1>
            <p className="text-white/70">{bookings.length} total bookings on the platform</p>
          </div>
        </div>

        <div className="page-wrapper py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Revenue',    value: `UGX ${Math.round(totalRevenue / 1000)}K`,    icon: '💰', color: 'text-green-600' },
              { label: 'Platform Revenue', value: `UGX ${Math.round(platformRevenue / 1000)}K`, icon: '📊', color: 'text-primary' },
              { label: 'Total Bookings',   value: bookings.length,                              icon: '📅', color: 'text-primary' },
              { label: 'Completed',        value: bookings.filter(b => b.status === 'completed').length, icon: '✅', color: 'text-green-600' },
            ].map(s => (
              <div key={s.label} className="card p-5">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className={`font-serif text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-kigezi-muted text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-5">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {STATUS_TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full font-semibold text-xs transition-all whitespace-nowrap
                    ${activeTab === tab ? 'bg-primary text-white' : 'bg-white text-kigezi-muted border border-kigezi-border hover:text-primary'}`}> 
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search by reference or tourist…" className="input-field sm:w-72" />
          </div>

          {loading ? <LoadingSpinner center /> : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-kigezi-bg text-kigezi-muted text-xs uppercase tracking-wide">
                      <th className="text-left p-4">Reference</th>
                      <th className="text-left p-4">Tourist</th>
                      <th className="text-left p-4">Experience</th>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Revenue</th>
                      <th className="text-left p-4">Commission</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-kigezi-border">
                    {filtered.map(b => {
                      const exp = b.experience_detail || b.experience;
                      return (
                        <tr key={b.id} className="hover:bg-kigezi-bg/40 transition-colors">
                          <td className="p-4 font-mono text-primary text-xs">{b.booking_reference}</td>
                          <td className="p-4">
                            <div className="font-semibold text-kigezi-text">{b.tourist_name}</div>
                            <div className="text-kigezi-muted text-xs">{b.tourist_email}</div>
                          </td>
                          <td className="p-4 text-kigezi-text max-w-[150px]">
                            <div className="truncate text-xs">{exp?.title || '—'}</div>
                          </td>
                          <td className="p-4 text-kigezi-muted text-xs whitespace-nowrap">{b.booking_date}</td>
                          <td className="p-4 font-semibold text-primary text-xs whitespace-nowrap">
                            UGX {Number(b.total_price || 0).toLocaleString()}
                          </td>
                          <td className="p-4 text-xs text-kigezi-muted whitespace-nowrap">
                            UGX {Number(b.platform_commission || 0).toLocaleString()}
                          </td>
                          <td className="p-4"><Badge label={b.status} variant={b.status} /></td>
                          <td className="p-4"><Badge label={b.payment_status} variant={b.payment_status} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-12 text-kigezi-muted">No bookings found.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}