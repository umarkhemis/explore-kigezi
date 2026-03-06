import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import ReviewForm from '../components/reviews/ReviewForm';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DemoModeBanner from '../components/ui/DemoModeBanner';
import { getMyBookings, cancelBooking } from '../services/bookingService';

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const MOCK_BOOKINGS = [
  {
    id: 1,
    booking_reference: 'EK-101-2025',
    booking_date: '2025-12-20',
    group_size: 2,
    total_price: '160000',
    status: 'confirmed',
    has_review: false,
    experience_detail: { id: 1, title: 'Kiga Dance & Drumming Workshop', cover_image: null },
  },
  {
    id: 2,
    booking_reference: 'EK-102-2025',
    booking_date: '2025-11-10',
    group_size: 3,
    total_price: '240000',
    status: 'completed',
    has_review: false,
    experience_detail: { id: 2, title: 'Traditional Bakiga Cooking Class', cover_image: null },
  },
  {
    id: 3,
    booking_reference: 'EK-103-2025',
    booking_date: '2025-10-05',
    group_size: 1,
    total_price: '80000',
    status: 'cancelled',
    has_review: false,
    experience_detail: { id: 1, title: 'Kiga Dance & Drumming Workshop', cover_image: null },
  },
];

const TAB_FILTERS = {
  All: () => true,
  Upcoming: (b) => ['pending', 'confirmed'].includes(b.status),
  Completed: (b) => b.status === 'completed',
  Cancelled: (b) => b.status === 'cancelled',
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [reviewModal, setReviewModal] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const load = () => {
    setLoading(true);
    getMyBookings()
      .then((data) => setBookings(Array.isArray(data) ? data : data.results || []))
      .catch(() => { setBookings(MOCK_BOOKINGS); setDemo(true); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled.');
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
    } catch {
      toast.error('Could not cancel booking. Please try again.');
    } finally {
      setCancelling(null);
    }
  };

  const filtered = bookings.filter(TAB_FILTERS[activeTab] || TAB_FILTERS.All);

  return (
    <div className="min-h-screen bg-kigezi-bg flex flex-col">
      <Navbar />
      <div className="pt-16">
        <div className="bg-primary py-10">
          <div className="page-wrapper">
            <h1 className="font-serif text-3xl font-bold text-white mb-1">My Bookings</h1>
            <p className="text-white/70">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="page-wrapper py-8">
          {demo && <DemoModeBanner />}

          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all whitespace-nowrap
                  ${activeTab === tab ? 'bg-primary text-white' : 'bg-white text-kigezi-muted border border-kigezi-border hover:text-primary'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSpinner center />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="🗓️"
              title="No bookings yet"
              message="Your upcoming and past bookings will appear here."
              ctaLabel="Browse Experiences"
              ctaTo="/experiences"
            />
          ) : (
            <div className="space-y-4">
              {filtered.map((booking) => {
                const exp = booking.experience_detail || booking.experience || {};
                const isUpcoming = ['pending', 'confirmed'].includes(booking.status);
                const canReview = booking.status === 'completed' && !booking.has_review;
                return (
                  <div key={booking.id} className="card p-5 flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-24 h-20 sm:h-24 bg-primary-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                      {exp.cover_image ? (
                        <img src={exp.cover_image} alt={exp.title} className="w-full h-full object-cover" />
                      ) : '🌿'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <h3 className="font-serif font-bold text-kigezi-text truncate">{exp.title || 'Cultural Experience'}</h3>
                        <Badge label={booking.status} variant={booking.status} />
                      </div>
                      <div className="text-sm text-kigezi-muted space-y-0.5">
                        <p>📅 {booking.booking_date} · 👥 {booking.group_size} person{booking.group_size !== 1 ? 's' : ''}</p>
                        <p className="font-semibold text-primary">UGX {Number(booking.total_price).toLocaleString()}</p>
                        <p className="font-mono text-xs text-kigezi-muted">{booking.booking_reference}</p>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 sm:w-32">
                      {isUpcoming && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancelling === booking.id}
                          className="border border-red-300 text-red-600 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {cancelling === booking.id ? 'Cancelling…' : 'Cancel'}
                        </button>
                      )}
                      {canReview && (
                        <button
                          onClick={() => setReviewModal(booking)}
                          className="btn-outline text-sm py-1.5"
                        >
                          Leave Review
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

      <Modal
        isOpen={!!reviewModal}
        onClose={() => setReviewModal(null)}
        title="Leave a Review"
      >
        {reviewModal && (
          <ReviewForm
            bookingReference={reviewModal.booking_reference}
            experienceId={reviewModal.experience_detail?.id || reviewModal.experience}
            onSuccess={() => {
              setReviewModal(null);
              setBookings((prev) =>
                prev.map((b) => (b.id === reviewModal.id ? { ...b, has_review: true } : b))
              );
              toast.success('Review submitted!');
            }}
          />
        )}
      </Modal>

      <Footer />
    </div>
  );
}
