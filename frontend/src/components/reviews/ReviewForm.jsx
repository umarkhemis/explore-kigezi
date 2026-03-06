

import React, { useState } from 'react';
import StarRating from '../ui/StarRating';
import { createReview } from '../../services/reviewService';
import toast from 'react-hot-toast';

export default function ReviewForm({ bookingReference, onSuccess }) {
  const [form, setForm] = useState({
    booking_reference: bookingReference || '',
    overall_rating: 0,
    authenticity_rating: 5,
    value_rating: 5,
    host_friendliness_rating: 5,
    comment: '',
    would_recommend: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.overall_rating === 0) {
      toast.error('Please select an overall rating.');
      return;
    }
    if (form.comment.trim().length < 20) {
      toast.error('Please write at least 20 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await createReview(form);
      toast.success('Review submitted! Thank you 🙏');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Overall Rating */}
      <div>
        <label className="block font-semibold text-kigezi-text mb-2">Overall Rating *</label>
        <StarRating value={form.overall_rating} onChange={v => setForm(f => ({...f, overall_rating: v}))} size="lg" showValue={false} />
      </div>

      {/* Sub-ratings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { key: 'authenticity_rating',      label: '🎭 Authenticity' },
          { key: 'value_rating',             label: '💰 Value for Money' },
          { key: 'host_friendliness_rating', label: '🤝 Host Friendliness' },
        ].map(r => (
          <div key={r.key} className="bg-kigezi-bg rounded-xl p-3">
            <label className="block text-sm font-medium text-kigezi-text mb-2">{r.label}</label>
            <StarRating value={form[r.key]} onChange={v => setForm(f => ({...f, [r.key]: v}))} size="md" showValue />
          </div>
        ))}
      </div>

      {/* Comment */}
      <div>
        <label className="block font-semibold text-kigezi-text mb-2">Your Review *</label>
        <textarea
          value={form.comment}
          onChange={e => setForm(f => ({...f, comment: e.target.value}))}
          placeholder="Share your experience... What did you love? What was memorable?"
          className="input-field resize-none"
          rows={4}
          required
        />
        <p className="text-kigezi-muted text-xs mt-1">{form.comment.length} characters (minimum 20)</p>
      </div>

      {/* Would Recommend */}
      <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4">
        <input type="checkbox" id="recommend" checked={form.would_recommend}
          onChange={e => setForm(f => ({...f, would_recommend: e.target.checked}))}
          className="w-5 h-5 accent-primary rounded" />
        <label htmlFor="recommend" className="text-kigezi-text font-medium cursor-pointer">
          ✅ I would recommend this experience to others
        </label>
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Submitting…' : 'Submit Review 🌟'}
      </button>
    </form>
  );
}