

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ExperienceCard from '../components/experiences/ExperienceCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import DemoModeBanner from '../components/ui/DemoModeBanner';
import { getCategories, getFeaturedExperiences, isUsingMockData } from '../services/experienceService';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1920&q=80';

const STATS = [
  { value: '20+', label: 'Cultural Hosts' },
  { value: '6',   label: 'Experience Types' },
  { value: '3',   label: 'Districts' },
  { value: '100%', label: 'Authentic' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '🔍', title: 'Browse Experiences', desc: 'Explore authentic Bakiga cultural experiences filtered by category, location, and budget.' },
  { step: '02', icon: '📅', title: 'Book & Pay Securely', desc: 'Choose your date, group size, and pay via MTN Mobile Money, Airtel Money, or card.' },
  { step: '03', icon: '🤝', title: 'Meet Your Cultural Host', desc: 'Show up at the meeting point and immerse yourself in genuine Kiga culture with your host.' },
];

const TESTIMONIALS = [
  { name: 'Sarah Johnson', country: '🇬🇧 United Kingdom', photo: 'https://i.pravatar.cc/80?img=5',  rating: 5, text: 'The dance workshop with Amara was the highlight of my entire Uganda trip. Pure joy from start to finish!' },
  { name: 'James Omondi',  country: '🇰🇪 Kenya',         photo: 'https://i.pravatar.cc/80?img=33', rating: 5, text: "Grace's cooking experience was unforgettable. I learned to make kalo and now cook it at home in Nairobi!" },
  { name: 'Maria Santos',  country: '🇧🇷 Brazil',        photo: 'https://i.pravatar.cc/80?img=9',  rating: 5, text: "Robert's village tour gave me a real window into Kiga life. This is exactly what authentic travel means." },
];

export default function HomePage() {
  const [categories, setCategories]     = useState([]);
  const [featured,   setFeatured]       = useState([]);
  const [loading,    setLoading]        = useState(true);
  const [searchQuery, setSearchQuery]   = useState('');
  const [usingMock,  setUsingMock]      = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const [cats, feats] = await Promise.all([getCategories(), getFeaturedExperiences()]);
      setCategories(Array.isArray(cats) ? cats : []);
      setFeatured(Array.isArray(feats) ? feats : feats?.results || []);
      setUsingMock(isUsingMockData());
      setLoading(false);
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/experiences${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-kigezi-bg">
      {usingMock && <DemoModeBanner />}
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <img src={HERO_IMAGE} alt="Kigezi landscape"
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <span>🇺🇬</span> Kigezi Region, Uganda
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6">
            Discover the<br />
            <span className="text-secondary">Soul of Kigezi</span>
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with authentic Bakiga cultural experiences — dance, food, crafts, and traditions
            passed down through generations in the beautiful hills of Uganda.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-10">
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search experiences, e.g. 'Kiga dance'…"
              className="flex-1 px-5 py-3.5 rounded-xl text-kigezi-text placeholder-gray-400 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button type="submit"
              className="bg-accent hover:bg-accent-dark text-white px-7 py-3.5 rounded-xl font-semibold transition-colors whitespace-nowrap">
              Search 🔍
            </button>
          </form>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/experiences" className="bg-primary hover:bg-primary-600 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-btn">
              Explore Experiences
            </Link>
            <Link to="/host/register" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3.5 rounded-xl font-semibold transition-all duration-200">
              Become a Host
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-8">
        <div className="page-wrapper">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <div className="font-serif text-3xl font-bold text-secondary">{s.value}</div>
                <div className="text-white/80 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="page-wrapper">
          <div className="text-center mb-12">
            <h2 className="section-title">Explore by Experience</h2>
            <p className="section-subtitle">Six authentic ways to connect with Bakiga culture</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} to={`/experiences?category=${cat.slug}`}
                className="card p-5 text-center hover:-translate-y-2 transition-all duration-300 group">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="font-semibold text-kigezi-text text-sm group-hover:text-primary transition-colors">
                  {cat.name}
                </div>
                {cat.experience_count > 0 && (
                  <div className="text-kigezi-muted text-xs mt-1">
                    {cat.experience_count} experience{cat.experience_count !== 1 ? 's' : ''}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EXPERIENCES ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="page-wrapper">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title">Top Cultural Experiences</h2>
              <p className="section-subtitle">Handpicked by our community</p>
            </div>
            <Link to="/experiences" className="btn-outline hidden sm:inline-flex">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [1,2,3].map(i => <SkeletonCard key={i} />)
              : featured.map(exp => <ExperienceCard key={exp.id} experience={exp} />)
            }
          </div>
          <div className="text-center mt-10 sm:hidden">
            <Link to="/experiences" className="btn-primary">View All Experiences</Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-kigezi-bg">
        <div className="page-wrapper">
          <div className="text-center mb-14">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to your cultural adventure</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="card p-8 text-center relative group hover:-translate-y-1 transition-all duration-300">
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="absolute top-4 right-4 text-6xl font-serif font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                  {step.step}
                </div>
                <h3 className="font-serif text-xl font-bold text-kigezi-text mb-3">{step.title}</h3>
                <p className="text-kigezi-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────���───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="page-wrapper">
          <div className="text-center mb-14">
            <h2 className="section-title">What Travellers Say</h2>
            <p className="section-subtitle">Real experiences, real stories</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-7">
                <div className="text-secondary text-2xl mb-3">{'★'.repeat(t.rating)}</div>
                <p className="text-kigezi-text leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-kigezi-border pt-4">
                  <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-kigezi-text text-sm">{t.name}</div>
                    <div className="text-kigezi-muted text-xs">{t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOST CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary">
        <div className="page-wrapper">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="font-serif text-4xl font-bold mb-5">
                Are You a Cultural Custodian?
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Share your Bakiga heritage with curious travellers from around the world.
                Earn income, preserve your culture, and build connections that last a lifetime.
              </p>
              <ul className="space-y-3 mb-8">
                {['Earn UGX 85,000–150,000+ per booking', 'Keep 85% of every booking fee', 'Build your cultural legacy', 'Join 20+ verified cultural hosts'].map(b => (
                  <li key={b} className="flex items-center gap-3 text-white/90">
                    <span className="text-secondary font-bold">✓</span> {b}
                  </li>
                ))}
              </ul>
              <Link to="/host/register"
                className="inline-block bg-secondary hover:bg-secondary-dark text-white px-8 py-3.5 rounded-xl font-semibold transition-colors">
                Join as a Host →
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=700&q=80"
                alt="Cultural host"
                className="rounded-2xl shadow-2xl w-full h-80 object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4">
                <div className="text-2xl font-serif font-bold text-primary">UGX 9M+</div>
                <div className="text-kigezi-muted text-sm">paid to hosts monthly</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}