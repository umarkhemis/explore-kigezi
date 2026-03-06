

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import StarRating from '../components/ui/StarRating';
import ReviewCard from '../components/reviews/ReviewCard';
import ExperienceCard from '../components/experiences/ExperienceCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DemoModeBanner from '../components/ui/DemoModeBanner';
import {
  getExperience, getExperienceReviews,
  getSimilarExperiences, isUsingMockData,
} from '../services/experienceService';

const TABS = ['Overview', 'Included', 'Reviews', 'Location'];

export default function ExperienceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exp,       setExp]       = useState(null);
  const [reviews,   setReviews]   = useState({ summary: {}, reviews: [] });
  const [similar,   setSimilar]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState('Overview');
  const [imgIndex,  setImgIndex]  = useState(0);
  const [usingMock, setUsingMock] = useState(false);

  // Booking sidebar state
  const [date,       setDate]      = useState('');
  const [groupSize,  setGroupSize] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [expData, reviewData, simData] = await Promise.all([
        getExperience(id),
        getExperienceReviews(id),
        getSimilarExperiences(id),
      ]);
      setExp(expData);
      setReviews(reviewData || { summary: {}, reviews: [] });
      setSimilar(Array.isArray(simData) ? simData : []);
      setUsingMock(isUsingMockData());
      setLoading(false);
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <LoadingSpinner center size="lg" />
    </div>
  );

  if (!exp) return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="page-wrapper py-20 text-center">
        <h2 className="font-serif text-2xl font-bold">Experience not found</h2>
        <Link to="/experiences" className="btn-primary mt-6 inline-block">Browse Experiences</Link>
      </div>
    </div>
  );

  const totalPrice = exp.price_per_person * groupSize;
  const images = exp.images?.length ? exp.images : [{ image_url: exp.cover_image }];
  const availableDays = exp.available_days || [];

  const handleBookNow = () => {
    if (!date) { alert('Please select a date first.'); return; }
    navigate(`/experiences/${id}/book`, { state: { date, groupSize, experience: exp } });
  };

  // Booking sidebar
  const BookingSidebar = () => (
    <div className="card p-6 sticky top-24">
      <div className="text-3xl font-bold text-primary mb-1">
        UGX {Number(exp.price_per_person).toLocaleString()}
      </div>
      <div className="text-kigezi-muted text-sm mb-5">per person</div>

      {/* Date */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-kigezi-text mb-2">📅 Select Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="input-field" />
      </div>

      {/* Group Size */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-kigezi-text mb-2">
          👥 Group Size ({exp.min_group_size}–{exp.max_group_size} people)
        </label>
        <div className="flex items-center gap-4">
          <button onClick={() => setGroupSize(g => Math.max(exp.min_group_size, g - 1))}
            className="w-10 h-10 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center">
            −
          </button>
          <span className="text-2xl font-bold text-kigezi-text w-8 text-center">{groupSize}</span>
          <button onClick={() => setGroupSize(g => Math.min(exp.max_group_size, g + 1))}
            className="w-10 h-10 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center">
            +
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-kigezi-bg rounded-xl p-4 mb-5 space-y-2 text-sm">
        <div className="flex justify-between text-kigezi-muted">
          <span>UGX {Number(exp.price_per_person).toLocaleString()} × {groupSize}</span>
          <span>UGX {totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-kigezi-text border-t border-kigezi-border pt-2">
          <span>Total</span>
          <span className="text-primary">UGX {totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <button onClick={handleBookNow}
        className="btn-accent w-full text-lg py-4 mb-3">
        Book Now →
      </button>
      <p className="text-center text-kigezi-muted text-xs">
        ✅ Free cancellation · No booking fee
      </p>

      {/* Available days */}
      <div className="mt-5 pt-5 border-t border-kigezi-border">
        <p className="text-xs font-semibold text-kigezi-text mb-2">Available Days:</p>
        <div className="flex flex-wrap gap-1">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
            const dayKey = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'][i];
            const avail  = availableDays.includes(dayKey);
            return (
              <span key={d} className={`text-xs px-2 py-1 rounded-md font-medium
                ${avail ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-300'}`}>
                {d}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-kigezi-bg">
      {usingMock && <DemoModeBanner />}
      <Navbar />
      <div className="pt-16 md:pt-18">
        {/* Image Gallery */}
        <div className="bg-black">
          <div className="page-wrapper">
            <div className="relative h-72 md:h-[480px] overflow-hidden rounded-b-2xl">
              <img
                src={images[imgIndex]?.image_url || exp.cover_image}
                alt={exp.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setImgIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${i === imgIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
                  ))}
                </div>
              )}
              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {images.slice(0,4).map((img, i) => (
                    <button key={i} onClick={() => setImgIndex(i)}
                      className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all
                        ${i === imgIndex ? 'border-white' : 'border-transparent opacity-70'}`}>
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="page-wrapper py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-1 min-w-0">
              {/* Breadcrumb */}
              <div className="text-sm text-kigezi-muted mb-3">
                <Link to="/" className="hover:text-primary">Home</Link> /
                <Link to="/experiences" className="hover:text-primary mx-1">Experiences</Link> /
                <span className="text-kigezi-text"> {exp.title}</span>
              </div>

              {/* Category + Title */}
              {exp.category && (
                <div className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full mb-3">
                  {exp.category.icon} {exp.category.name}
                </div>
              )}
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-kigezi-text mb-4">
                {exp.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-kigezi-muted text-sm mb-6">
                <div className="flex items-center gap-1">
                  <StarRating value={Number(exp.average_rating)} size="sm" showValue />
                  <span>({exp.total_reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">📍 {exp.location}</div>
                <div className="flex items-center gap-1">⏱ {exp.duration_display}</div>
                <div className="flex items-center gap-1">👥 Up to {exp.max_group_size} people</div>
              </div>

              {/* Host card */}
              <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card mb-6">
                {exp.host?.profile_photo
                  ? <img src={exp.host.profile_photo} alt={exp.host.full_name}
                      className="w-14 h-14 rounded-full object-cover" />
                  : <div className="w-14 h-14 rounded-full bg-primary/20 text-primary font-bold text-xl flex items-center justify-center">
                      {(exp.host?.full_name?.[0] || 'H').toUpperCase()}
                    </div>
                }
                <div>
                  <div className="font-bold text-kigezi-text">{exp.host?.full_name || exp.host_name}</div>
                  {exp.host?.is_verified && (
                    <div className="text-primary text-xs font-semibold flex items-center gap-1">
                      ✓ Verified Cultural Host
                    </div>
                  )}
                  {exp.host?.bio && (
                    <p className="text-kigezi-muted text-sm line-clamp-2 mt-1">{exp.host.bio}</p>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-kigezi-border mb-6">
                <div className="flex gap-0 overflow-x-auto">
                  {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all whitespace-nowrap
                        ${tab === t
                          ? 'border-primary text-primary'
                          : 'border-transparent text-kigezi-muted hover:text-kigezi-text'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {tab === 'Overview' && (
                <div>
                  <p className="text-kigezi-text leading-relaxed text-base">{exp.description}</p>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-kigezi-bg rounded-xl p-4">
                      <div className="font-semibold text-kigezi-text mb-2">📅 Duration</div>
                      <div className="text-kigezi-muted">{exp.duration_display}</div>
                    </div>
                    <div className="bg-kigezi-bg rounded-xl p-4">
                      <div className="font-semibold text-kigezi-text mb-2">📍 Meeting Point</div>
                      <div className="text-kigezi-muted">{exp.meeting_point}</div>
                    </div>
                    <div className="bg-kigezi-bg rounded-xl p-4">
                      <div className="font-semibold text-kigezi-text mb-2">👥 Group Size</div>
                      <div className="text-kigezi-muted">{exp.min_group_size}–{exp.max_group_size} people</div>
                    </div>
                    <div className="bg-kigezi-bg rounded-xl p-4">
                      <div className="font-semibold text-kigezi-text mb-2">🗺 District</div>
                      <div className="text-kigezi-muted capitalize">{exp.district}</div>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'Included' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-kigezi-text mb-3">✅ What's Included</h3>
                    <ul className="space-y-2">
                      {(exp.whats_included || []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-kigezi-text text-sm">
                          <span className="text-green-500 font-bold mt-0.5">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-kigezi-text mb-3">🎒 What to Bring</h3>
                    <ul className="space-y-2">
                      {(exp.what_to_bring || []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-kigezi-text text-sm">
                          <span className="text-blue-400 font-bold mt-0.5">→</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {tab === 'Reviews' && (
                <div>
                  {/* Summary */}
                  {reviews.summary?.total > 0 && (
                    <div className="card p-6 mb-6">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="font-serif text-5xl font-bold text-primary">
                            {Number(reviews.summary.average).toFixed(1)}
                          </div>
                          <StarRating value={reviews.summary.average} size="md" showValue={false} />
                          <div className="text-kigezi-muted text-sm mt-1">
                            {reviews.summary.total} reviews
                          </div>
                        </div>
                        <div className="flex-1">
                          {[5,4,3,2,1].map(star => {
                            const count = reviews.summary.breakdown?.[star] || 0;
                            const pct = reviews.summary.total
                              ? Math.round((count / reviews.summary.total) * 100) : 0;
                            return (
                              <div key={star} className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-kigezi-muted w-3">{star}</span>
                                <span className="text-secondary text-xs">★</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-2">
                                  <div className="bg-secondary h-2 rounded-full transition-all"
                                    style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-xs text-kigezi-muted w-6">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {reviews.summary.would_recommend_pct > 0 && (
                        <div className="mt-4 pt-4 border-t border-kigezi-border text-sm text-green-600 font-medium">
                          ✓ {reviews.summary.would_recommend_pct}% of guests would recommend this experience
                        </div>
                      )}
                    </div>
                  )}
                  <div className="space-y-4">
                    {reviews.reviews?.length
                      ? reviews.reviews.map(r => <ReviewCard key={r.id} review={r} />)
                      : <p className="text-kigezi-muted text-center py-8">No reviews yet. Be the first!</p>
                    }
                  </div>
                </div>
              )}

              {tab === 'Location' && (
                <div>
                  <div className="bg-kigezi-bg rounded-2xl p-6 mb-4">
                    <h3 className="font-semibold text-kigezi-text mb-2">📍 Meeting Point</h3>
                    <p className="text-kigezi-muted">{exp.meeting_point}</p>
                  </div>
                  <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
                    <div className="text-center text-kigezi-muted">
                      <div className="text-4xl mb-2">🗺️</div>
                      <p>Map view — integrate Google Maps with your API key</p>
                      <p className="text-sm mt-1">District: <strong>{exp.district}</strong></p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column — Desktop Booking Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <BookingSidebar />
            </div>
          </div>

          {/* Similar Experiences */}
          {similar.length > 0 && (
            <div className="mt-14">
              <h2 className="font-serif text-2xl font-bold text-kigezi-text mb-6">
                Similar Experiences
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map(s => <ExperienceCard key={s.id} experience={s} />)}
              </div>
            </div>
          )}
        </div>

        {/* Mobile sticky booking bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-kigezi-border p-4 z-40 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-bold text-primary text-lg">
                UGX {Number(exp.price_per_person).toLocaleString()}
              </span>
              <span className="text-kigezi-muted text-sm"> / person</span>
            </div>
            <StarRating value={Number(exp.average_rating)} size="sm" />
          </div>
          <button
            onClick={() => navigate(`/experiences/${id}/book`)}
            className="btn-accent w-full">
            Book Now — UGX {totalPrice.toLocaleString()}
          </button>
        </div>
      </div>
      <div className="pb-24 lg:pb-0">
        <Footer />
      </div>
    </div>
  );
}