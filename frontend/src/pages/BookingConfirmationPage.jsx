

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { getBookingByReference } from '../services/bookingService';

export default function BookingConfirmationPage() {
  const { reference } = useParams();
  const location       = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    if (!booking) {
      getBookingByReference(reference).then(setBooking);
    }
  }, [reference, booking]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exp = booking?.experience_detail || booking?.experience;

  return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="page-wrapper max-w-2xl">
          {/* Success Header */}
          <div className="card p-10 text-center mb-6">
            {/* Animated checkmark */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <span className="text-5xl">✅</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-kigezi-text mb-2">
              Booking Confirmed! 🎉
            </h1>
            <p className="text-kigezi-muted text-lg">
              Your cultural adventure is booked. Get ready for an unforgettable experience!
            </p>

            {/* Reference */}
            <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-5 mt-6">
              <div className="text-sm text-kigezi-muted mb-1">Your Booking Reference</div>
              <div className="font-serif text-3xl font-bold text-primary tracking-wider">
                {reference}
              </div>
              <button onClick={handleCopy}
                className="mt-3 text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1 mx-auto">
                {copied ? '✓ Copied!' : '📋 Copy Reference'}
              </button>
            </div>
          </div>

          {/* Booking Details */}
          {booking && (
            <div className="card p-6 mb-6">
              <h2 className="font-serif text-xl font-bold text-kigezi-text mb-4">Booking Details</h2>
              <div className="flex gap-4 mb-4">
                {exp?.cover_image && (
                  <img src={exp.cover_image} alt={exp.title}
                    className="w-24 h-20 rounded-xl object-cover flex-shrink-0"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400'; }} />
                )}
                <div>
                  <h3 className="font-bold text-kigezi-text">{exp?.title}</h3>
                  <p className="text-kigezi-muted text-sm">
                    Hosted by {exp?.host?.full_name || exp?.host_name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: '📅 Date',        value: booking.booking_date },
                  { label: '👥 Group Size',   value: `${booking.group_size} person${booking.group_size > 1 ? 's' : ''}` },
                  { label: '💰 Total Paid',   value: booking.price_formatted || `UGX ${Number(booking.total_price).toLocaleString()}` },
                  { label: '💳 Payment',      value: booking.payment_method?.toUpperCase().replace('_', ' ') },
                  { label: '📋 Status',       value: booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) },
                ].map(item => (
                  <div key={item.label} className="bg-kigezi-bg rounded-xl p-3">
                    <div className="text-kigezi-muted text-xs mb-1">{item.label}</div>
                    <div className="font-semibold text-kigezi-text">{item.value}</div>
                  </div>
                ))}
              </div>

              {exp?.meeting_point && (
                <div className="mt-4 bg-yellow-50 rounded-xl p-4">
                  <div className="font-semibold text-kigezi-text text-sm mb-1">📍 Meeting Point</div>
                  <p className="text-kigezi-muted text-sm">{exp.meeting_point}</p>
                </div>
              )}
            </div>
          )}

          {/* What's Next */}
          <div className="card p-6 mb-6">
            <h2 className="font-serif text-xl font-bold text-kigezi-text mb-4">What's Next?</h2>
            <div className="space-y-4">
              {[
                { step: '1', icon: '📋', title: 'Save Your Reference', desc: `Keep your reference number: ${reference}` },
                { step: '2', icon: '📱', title: 'Host Has Been Notified', desc: 'Your cultural host has received an SMS notification and will confirm shortly.' },
                { step: '3', icon: '📍', title: 'Show Up Ready', desc: 'Arrive at the meeting point on time with your booking reference.' },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    {item.step}
                  </div>
                  <div>
                    <div className="font-semibold text-kigezi-text">{item.icon} {item.title}</div>
                    <div className="text-kigezi-muted text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/my-bookings" className="btn-primary flex-1 text-center">
              View My Bookings
            </Link>
            <Link to="/experiences" className="btn-outline flex-1 text-center">
              Browse More Experiences
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}