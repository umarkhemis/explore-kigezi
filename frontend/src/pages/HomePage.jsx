import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const FEATURES = [
  { icon: '🥁', title: 'Kiga Dance & Drumming', desc: 'Feel the rhythm of ancestral Bakiga music.' },
  { icon: '🍲', title: 'Traditional Cooking', desc: 'Learn to prepare authentic Kigezi dishes.' },
  { icon: '🌄', title: 'Scenic Hikes', desc: 'Trek through stunning highlands and valleys.' },
  { icon: '🏺', title: 'Craft Workshops', desc: 'Master traditional weaving and pottery.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-kigezi-bg flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 via-primary to-primary-600 text-white pt-28 pb-20">
        <div className="page-wrapper text-center">
          <div className="text-5xl mb-4">🏔️</div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Discover Authentic<br />Bakiga Culture
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Connect with local hosts in Kigezi, Uganda for unforgettable cultural experiences — from traditional dances and cooking to scenic highlands hikes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/experiences" className="bg-white text-primary font-bold px-7 py-3 rounded-lg shadow-btn hover:bg-gray-50 transition-all">
              Browse Experiences
            </Link>
            <Link to="/host/register" className="btn-outline border-white text-white hover:bg-white hover:text-primary px-7 py-3">
              Become a Host
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="page-wrapper py-16">
        <h2 className="section-title text-center mb-2">Immersive Experiences</h2>
        <p className="section-subtitle text-center mb-10">Handpicked cultural journeys with verified local hosts.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-serif font-bold text-kigezi-text mb-2">{f.title}</h3>
              <p className="text-kigezi-muted text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/experiences" className="btn-primary">View All Experiences</Link>
        </div>
      </section>

      {/* Host CTA */}
      <section className="bg-secondary/10 border-y border-secondary/20 py-14">
        <div className="page-wrapper flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="section-title mb-3">Share Your Heritage</h2>
            <p className="text-kigezi-muted mb-5">
              Are you a Bakiga cultural practitioner? Join our network of verified hosts and earn income while sharing your traditions with curious travellers from around the world.
            </p>
            <Link to="/host/register" className="btn-accent">Become a Host</Link>
          </div>
          <div className="text-6xl">🌿</div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
