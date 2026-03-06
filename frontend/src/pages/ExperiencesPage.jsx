import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DemoModeBanner from '../components/ui/DemoModeBanner';
import { getExperiences } from '../services/experienceService';

const MOCK = [
  { id: 1, title: 'Kiga Dance & Drumming Workshop', category_name: 'Music & Dance', district: 'Kabale', price_per_person: 80000, duration_hours: 3, cover_image: null, host_name: 'Amina Byarugaba' },
  { id: 2, title: 'Traditional Bakiga Cooking Class', category_name: 'Culinary', district: 'Rubanda', price_per_person: 60000, duration_hours: 4, cover_image: null, host_name: 'Grace Kamugisha' },
  { id: 3, title: 'Batwa Cultural Heritage Walk', category_name: 'Heritage Tour', district: 'Kisoro', price_per_person: 120000, duration_hours: 6, cover_image: null, host_name: 'David Turyahabwe' },
  { id: 4, title: 'Kigezi Highland Hike & Storytelling', category_name: 'Nature & Hiking', district: 'Kabale', price_per_person: 100000, duration_hours: 5, cover_image: null, host_name: 'John Musiimenta' },
];

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getExperiences()
      .then((data) => setExperiences(Array.isArray(data) ? data : data.results || []))
      .catch(() => { setExperiences(MOCK); setDemo(true); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = experiences.filter(
    (e) =>
      !search ||
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.district?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-kigezi-bg flex flex-col">
      <Navbar />
      <div className="pt-16">
        <div className="bg-primary py-10">
          <div className="page-wrapper">
            <h1 className="font-serif text-3xl font-bold text-white mb-1">Cultural Experiences</h1>
            <p className="text-white/70">Discover authentic Bakiga traditions across Kigezi</p>
          </div>
        </div>

        <div className="page-wrapper py-8">
          {demo && <DemoModeBanner />}
          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search experiences or districts…"
              className="input-field max-w-sm"
            />
          </div>

          {loading ? (
            <LoadingSpinner center />
          ) : filtered.length === 0 ? (
            <p className="text-center text-kigezi-muted py-12">No experiences found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((exp) => (
                <Link
                  key={exp.id}
                  to={`/experiences/${exp.id}`}
                  className="card overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="h-44 bg-primary-100 flex items-center justify-center text-5xl">
                    {exp.cover_image ? (
                      <img src={exp.cover_image} alt={exp.title} className="w-full h-full object-cover" />
                    ) : (
                      '🌿'
                    )}
                  </div>
                  <div className="p-5">
                    <span className="badge bg-primary-100 text-primary text-xs mb-2 inline-block">
                      {exp.category_name || exp.category}
                    </span>
                    <h3 className="font-serif font-bold text-kigezi-text mb-1 group-hover:text-primary transition-colors line-clamp-2">
                      {exp.title}
                    </h3>
                    <p className="text-kigezi-muted text-sm mb-3">
                      📍 {exp.district} · ⏱ {exp.duration_hours}h · 👤 {exp.host_name}
                    </p>
                    <div className="font-bold text-primary">
                      UGX {Number(exp.price_per_person).toLocaleString()} <span className="text-kigezi-muted font-normal text-sm">/ person</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
