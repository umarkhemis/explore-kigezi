import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getExperience } from '../services/experienceService';
import { useAuth } from '../context/AuthContext';

const MOCK_EXP = {
  id: 1,
  title: 'Kiga Dance & Drumming Workshop',
  description: 'Immerse yourself in the vibrant world of Bakiga traditional dance and music. Led by award-winning cultural practitioner Amina Byarugaba, this workshop takes you through the history, meaning, and technique of Kiga drumming and dance forms.',
  category_name: 'Music & Dance',
  district: 'Kabale',
  location: 'Rushasha Village',
  meeting_point: 'Kabale Bus Park',
  duration_hours: 3,
  price_per_person: 80000,
  min_group_size: 2,
  max_group_size: 12,
  whats_included: ['Traditional drum lesson', 'Dance session', 'Cultural storytelling', 'Refreshments'],
  what_to_bring: ['Comfortable clothing', 'Water bottle', 'Camera'],
  available_days: ['saturday', 'sunday'],
  host_name: 'Amina Byarugaba',
  average_rating: 4.8,
  total_reviews: 14,
};

export default function ExperienceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExperience(id)
      .then(setExperience)
      .catch(() => setExperience(MOCK_EXP))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-kigezi-bg flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!experience) return null;

  return (
    <div className="min-h-screen bg-kigezi-bg flex flex-col">
      <Navbar />
      <div className="pt-16">
        <div className="h-64 md:h-80 bg-primary-100 flex items-center justify-center text-8xl">
          {experience.cover_image ? (
            <img src={experience.cover_image} alt={experience.title} className="w-full h-full object-cover" />
          ) : '🌿'}
        </div>

        <div className="page-wrapper py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="badge bg-primary-100 text-primary mb-2 inline-block">{experience.category_name}</span>
                <h1 className="font-serif text-3xl font-bold text-kigezi-text mb-2">{experience.title}</h1>
                <p className="text-kigezi-muted">
                  📍 {experience.district}, {experience.location} · ⏱ {experience.duration_hours}h · ⭐ {experience.average_rating} ({experience.total_reviews} reviews)
                </p>
              </div>
              <p className="text-kigezi-text leading-relaxed">{experience.description}</p>

              {experience.whats_included?.length > 0 && (
                <div>
                  <h3 className="font-serif font-bold text-kigezi-text mb-2">What's Included</h3>
                  <ul className="space-y-1">
                    {experience.whats_included.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-kigezi-text">
                        <span className="text-primary">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.what_to_bring?.length > 0 && (
                <div>
                  <h3 className="font-serif font-bold text-kigezi-text mb-2">What to Bring</h3>
                  <ul className="space-y-1">
                    {experience.what_to_bring.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-kigezi-text">
                        <span className="text-secondary">→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <div className="card p-6 sticky top-24">
                <div className="font-bold text-primary text-2xl mb-1">
                  UGX {Number(experience.price_per_person).toLocaleString()}
                  <span className="text-kigezi-muted font-normal text-sm"> / person</span>
                </div>
                <p className="text-kigezi-muted text-sm mb-4">
                  Group: {experience.min_group_size}–{experience.max_group_size} people
                </p>
                <p className="text-sm text-kigezi-muted mb-4">
                  🗓 Available: {experience.available_days?.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                </p>
                <p className="text-sm text-kigezi-muted mb-4">
                  📍 Meeting point: {experience.meeting_point}
                </p>
                {isAuthenticated ? (
                  <Link to={`/experiences/${experience.id}/book`} className="btn-primary w-full block text-center">
                    Book This Experience
                  </Link>
                ) : (
                  <Link to="/login" className="btn-primary w-full block text-center">
                    Sign In to Book
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
