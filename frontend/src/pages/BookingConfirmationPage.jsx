import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getBooking } from '../services/bookingService';

export default function BookingConfirmationPage() {
  const { ref } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooking(ref)
      .then(setBooking)
      .catch(() => setBooking({ booking_reference: ref, status: 'pending' }))
      .finally(() => setLoading(false));
  }, [ref]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-kigezi-bg"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-kigezi-bg flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="font-serif text-2xl font-bold text-kigezi-text mb-2">Booking Confirmed!</h1>
          <p className="text-kigezi-muted mb-6">Your cultural experience has been booked. We can't wait to see you!</p>
          <div className="bg-kigezi-bg rounded-lg p-4 mb-6">
            <p className="text-sm text-kigezi-muted mb-1">Booking Reference</p>
            <p className="font-mono font-bold text-primary text-lg">{booking?.booking_reference}</p>
          </div>
          <div className="flex gap-3 flex-col">
            <Link to="/my-bookings" className="btn-primary">View My Bookings</Link>
            <Link to="/experiences" className="btn-outline">Browse More Experiences</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
