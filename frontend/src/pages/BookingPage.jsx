import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getExperience } from '../services/experienceService';
import { createBooking } from '../services/bookingService';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ booking_date: '', group_size: 1, special_requests: '' });

  useEffect(() => {
    getExperience(id)
      .then(setExperience)
      .catch(() => setExperience({ id, title: 'Cultural Experience', price_per_person: 80000 }))
      .finally(() => setLoading(false));
  }, [id]);

  const total = experience ? form.group_size * experience.price_per_person : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const booking = await createBooking({
        experience: id,
        booking_date: form.booking_date,
        group_size: form.group_size,
        special_requests: form.special_requests,
      });
      toast.success('Booking confirmed!');
      navigate(`/booking/confirmation/${booking.booking_reference}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-kigezi-bg"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-kigezi-bg flex flex-col">
      <Navbar />
      <div className="pt-16">
        <div className="bg-primary py-8">
          <div className="page-wrapper">
            <h1 className="font-serif text-2xl font-bold text-white">Book Experience</h1>
            <p className="text-white/70 mt-1">{experience?.title}</p>
          </div>
        </div>
        <div className="page-wrapper py-8">
          <div className="max-w-lg mx-auto card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-kigezi-text mb-1">Date</label>
                <input
                  type="date"
                  value={form.booking_date}
                  onChange={(e) => setForm({ ...form, booking_date: e.target.value })}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kigezi-text mb-1">Group Size</label>
                <input
                  type="number"
                  value={form.group_size}
                  onChange={(e) => setForm({ ...form, group_size: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="input-field"
                  min={experience?.min_group_size || 1}
                  max={experience?.max_group_size || 20}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-kigezi-text mb-1">Special Requests (optional)</label>
                <textarea
                  value={form.special_requests}
                  onChange={(e) => setForm({ ...form, special_requests: e.target.value })}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Any dietary restrictions, accessibility needs, etc."
                />
              </div>
              <div className="bg-kigezi-bg rounded-lg p-4">
                <div className="flex justify-between text-sm text-kigezi-muted mb-1">
                  <span>UGX {Number(experience?.price_per_person).toLocaleString()} × {form.group_size}</span>
                  <span>UGX {Number(total).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-kigezi-text">
                  <span>Total</span>
                  <span className="text-primary">UGX {Number(total).toLocaleString()}</span>
                </div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Confirming…' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
