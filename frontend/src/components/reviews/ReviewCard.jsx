

import React, { useState } from 'react';
import StarRating from '../ui/StarRating';
import { format } from 'date-fns';
import { respondToReview } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ReviewCard({ review, onUpdate }) {
  const { isHost } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText]         = useState('');
  const [submitting, setSubmitting]       = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await respondToReview(review.id, replyText);
      toast.success('Response posted!');
      setShowReplyForm(false);
      if (onUpdate) onUpdate();
    } catch {
      toast.error('Failed to post response.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {review.tourist_photo
            ? <img src={review.tourist_photo} alt={review.tourist_name}
                className="w-10 h-10 rounded-full object-cover" />
            : <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                {(review.tourist_name?.[0] || 'T').toUpperCase()}
              </div>
          }
          <div>
            <div className="font-semibold text-kigezi-text">{review.tourist_name}</div>
            <div className="text-kigezi-muted text-xs">
              {review.created_at ? format(new Date(review.created_at), 'MMM d, yyyy') : ''}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StarRating value={review.overall_rating} size="sm" showValue={false} />
          <span className="text-sm font-bold text-kigezi-text">{review.overall_rating}.0</span>
        </div>
      </div>

      {/* Sub-ratings */}
      <div className="grid grid-cols-3 gap-3 mb-4 bg-kigezi-bg rounded-xl p-3">
        {[
          { label: 'Authenticity', val: review.authenticity_rating },
          { label: 'Value',        val: review.value_rating },
          { label: 'Host',         val: review.host_friendliness_rating },
        ].map(r => (
          <div key={r.label} className="text-center">
            <div className="text-xs text-kigezi-muted mb-1">{r.label}</div>
            <div className="font-bold text-primary text-sm">{r.val}/5</div>
          </div>
        ))}
      </div>

      {/* Comment */}
      <p className="text-kigezi-text text-sm leading-relaxed mb-3">"{review.comment}"</p>

      {/* Would recommend */}
      {review.would_recommend && (
        <div className="flex items-center gap-1 text-green-600 text-xs font-medium mb-3">
          <span>✓</span> Would recommend this experience
        </div>
      )}

      {/* Host response */}
      {review.host_response && (
        <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-4 mt-3">
          <div className="text-xs font-semibold text-primary mb-1">🏠 Host Response</div>
          <p className="text-kigezi-text text-sm">{review.host_response}</p>
        </div>
      )}

      {/* Host reply button */}
      {isHost && !review.host_response && (
        <div className="mt-3">
          {!showReplyForm ? (
            <button onClick={() => setShowReplyForm(true)}
              className="text-primary text-sm font-medium hover:underline">
              Reply to this review
            </button>
          ) : (
            <div className="space-y-2">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a response to this review..."
                className="input-field text-sm resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button onClick={handleReply} disabled={submitting}
                  className="btn-primary text-sm py-2 px-4">
                  {submitting ? 'Posting…' : 'Post Response'}
                </button>
                <button onClick={() => setShowReplyForm(false)}
                  className="text-kigezi-muted text-sm py-2 px-4 hover:text-kigezi-text">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}