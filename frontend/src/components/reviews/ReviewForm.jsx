import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function ReviewForm({ bookingReference, experienceId, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { booking_reference: bookingReference, rating: 5 },
  });
  const rating = watch('rating');

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await api.post('/api/reviews/', {
        ...values,
        experience: experienceId,
        rating: Number(values.rating),
      });
      toast.success('Review submitted — thank you!');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('booking_reference')} />

      <div>
        <label className="block text-sm font-medium text-kigezi-text mb-1">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input type="radio" value={n} {...register('rating', { required: true })} className="sr-only" />
              <span className={`text-2xl transition-transform hover:scale-110 ${Number(rating) >= n ? 'text-secondary' : 'text-gray-300'}`}>
                ★
              </span>
            </label>
          ))}
        </div>
        {errors.rating && <p className="text-red-500 text-xs mt-1">Please select a rating.</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-kigezi-text mb-1">Your Review</label>
        <textarea
          {...register('comment', { required: 'Please write a review.' })}
          rows={4}
          placeholder="Share your experience with other travellers…"
          className="input-field resize-none"
        />
        {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>}
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
}
