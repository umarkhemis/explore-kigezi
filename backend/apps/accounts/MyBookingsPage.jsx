



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import ReviewForm from '../components/reviews/ReviewForm';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DemoModeBanner from '../components/ui/DemoModeBanner';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import { isUsingMockData } from '../services/experienceService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

export default function MyBookingsPage() {
  const [bookings,    setBookings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [tab,         setTab]         = useState('All');
  const [reviewModal, setReviewModal] = useState({ open: false, bookingRef: null });
  const [usingMock,   setUsingMock]   = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    const data = await getMyBookings();
    setBookings(Array.isArray(data) ? data : data?.results || []);
    setUsingMock(isUsingMockData());
    setLoading(false);
  };

  useEffect(() => { loadBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled.');
      loadBookings();
    } catch {
      toast.error('Could not cancel booking.');
    }
  };

  const filtered = bookings.filter(b => {
    if (tab === 'All')       return true;
    if (tab === 'Upcoming')  return ['pending','confirmed'].includes(b.status);
    if (tab === 'Completed') return b.status === 'completed';
    if (tab === 'Cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="min-h-screen bg-kigezi-bg">
      {usingMock && <DemoModeBanner />}
      <Navbar />
      <div className="pt-16 md:pt-18">
        <div className="bg-primary py-10">
          <div className="page-wrapper">
            <h1 className="font-serif text-3xl font-bold text-white mb-1">My Bookings</h1>
            <p className="text-white/75">Manage all your cultural experience bookings</p>
          </div>
        </div>

        <div className="page-wrapper py-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-card mb-6 w-fit">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all
                  ${tab === t ? 'bg-primary text-white shadow-sm' : 'text-kigezi-muted hover:text-kigezi-text'}`}>
                {t}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner center /> : filtered.length === 0 ? (
            <EmptyState icon="🎭" title="No bookings found"
              message="You haven't booked any experiences yet. Explore Kigezi and book your first adventure!"
              actionLabel="Browse Experiences" actionTo="/experiences" />
          ) : (
            <div className="space-y-4">
              {filtered.map(b => {
                const exp = b.experience_detail || b.experience || {};
                const canCancel  = ['pending','confirmed'].includes(b.status);
                const canReview  = b.status === 'completed' && !b.has_review;
                return (
                  <div key={b.id} className="card p-5 flex flex-col sm:flex-row gap-5">
                    {/* Image */}
                    <img
                      src={exp.cover_image || 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=300&q=70'}
                      alt={exp.title}
                      className="w-full sm:w-32 h-28 sm:h-24 rounded-xl object-cover flex-shrink-0"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=300&q=70'; }}
                    />
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <Link to={`/experiences/${exp.id || b.experience}`}
                          className="font-serif font-bold text-kigezi-text hover:text-primary transition-colors line-clamp-1">
                          {exp.title || 'Experience'}
                        </Link>
                        <Badge variant={b.status} label={b.status?.charAt(0).toUpperCase() + b.status?.slice(1)} />
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-kigezi-muted mb-3">
                        <span>📅 {b.booking_date ? format(new Date(b.booking_date), 'MMM d, yyyy') : '—'}</span>
                        <span>👥 {b.group_size} person{b.group_size > 1 ? 's' : ''}</span>
                        <span>💰 {b.price_formatted || `UGX ${Number(b.total_price).toLocaleString()}`}</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{b.booking_reference}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {canCancel && (
                          <button onClick={() => handleCancel(b.id)}
                            className="text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                            Cancel Booking
                          </button>
                        )}
                        {canReview && (
                          <button onClick={() => setReviewModal({ open: true, bookingRef: b.booking_reference })}
                            className="btn-primary text-sm py-1.5 px-4">
                            ⭐ Leave Review
                          </button>
                        )}
                        {b.status === 'completed' && b.has_review && (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            ✓ Review submitted
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal open={reviewModal.open} onClose={() => setReviewModal({ open: false, bookingRef: null })}
        title="Leave a Review" size="lg">
        <ReviewForm
          bookingReference={reviewModal.bookingRef}
          onSuccess={() => { setReviewModal({ open: false, bookingRef: null }); loadBookings(); }}
        />
      </Modal>

      <Footer />
    </div>
  );
}