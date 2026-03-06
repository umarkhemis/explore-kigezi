


import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ExperienceCard from '../components/experiences/ExperienceCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';
import DemoModeBanner from '../components/ui/DemoModeBanner';
import { getExperiences, getCategories, isUsingMockData } from '../services/experienceService';

const DISTRICTS = ['Kabale','Kisoro','Rubanda','Rukungiri','Kanungu','Rukiga'];
const DURATIONS  = [
  { label: 'Under 2 hours', value: '1,2' },
  { label: 'Half day (3-4 hrs)', value: '3,4' },
  { label: 'Full day (6-8 hrs)', value: '6,8' },
];
const SORT_OPTIONS = [
  { label: 'Most Popular',       value: '-total_bookings' },
  { label: 'Highest Rated',      value: '-average_rating' },
  { label: 'Price: Low to High', value: 'price_per_person' },
  { label: 'Price: High to Low', value: '-price_per_person' },
  { label: 'Newest',             value: '-created_at' },
];

export default function ExperiencesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [experiences, setExperiences]   = useState([]);
  const [categories,  setCategories]    = useState([]);
  const [total,       setTotal]         = useState(0);
  const [loading,     setLoading]       = useState(true);
  const [filterOpen,  setFilterOpen]    = useState(false);
  const [usingMock,   setUsingMock]     = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    search:    searchParams.get('search')   || '',
    category:  searchParams.get('category') || '',
    districts: [],
    minPrice:  '',
    maxPrice:  '',
    ordering:  '-total_bookings',
    page:      1,
  });

  // Load categories once
  useEffect(() => {
    getCategories().then(cats => setCategories(Array.isArray(cats) ? cats : []));
  }, []);

  // Load experiences on filter change
  const loadExperiences = useCallback(async () => {
    setLoading(true);
    const params = {
      search:   filters.search   || undefined,
      category: filters.category || undefined,
      ordering: filters.ordering,
      page:     filters.page,
      min_price: filters.minPrice || undefined,
      max_price: filters.maxPrice || undefined,
    };
    if (filters.districts.length === 1) params.district = filters.districts[0].toLowerCase();

    const data = await getExperiences(params);
    if (data?.results) {
      setExperiences(data.results);
      setTotal(data.count || 0);
    } else if (Array.isArray(data)) {
      // mock fallback — client-side filter
      let filtered = [...data];
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(e =>
          e.title.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q)
        );
      }
      if (filters.category) {
        filtered = filtered.filter(e => e.category?.slug === filters.category);
      }
      if (filters.districts.length) {
        filtered = filtered.filter(e =>
          filters.districts.map(d => d.toLowerCase()).includes(e.district)
        );
      }
      setExperiences(filtered);
      setTotal(filtered.length);
    }
    setUsingMock(isUsingMockData());
    setLoading(false);
  }, [filters]);

  useEffect(() => { loadExperiences(); }, [loadExperiences]);

  const toggleDistrict = (d) => {
    setFilters(f => ({
      ...f,
      districts: f.districts.includes(d)
        ? f.districts.filter(x => x !== d)
        : [...f.districts, d],
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({ search:'', category:'', districts:[], minPrice:'', maxPrice:'', ordering:'-total_bookings', page:1 });
    setSearchParams({});
  };

  const activeFilterCount = [
    filters.category,
    ...filters.districts,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  // Filter Panel (shared for desktop sidebar + mobile drawer)
  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-semibold text-kigezi-text mb-3">Category</h4>
        <div className="space-y-2">
          <button
            onClick={() => setFilters(f => ({ ...f, category: '', page: 1 }))}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
              ${!filters.category ? 'bg-primary text-white' : 'hover:bg-primary/10 text-kigezi-text'}`}>
            All Categories
          </button>
          {categories.map(cat => (
            <button key={cat.id}
              onClick={() => setFilters(f => ({ ...f, category: cat.slug, page: 1 }))}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2
                ${filters.category === cat.slug ? 'bg-primary text-white' : 'hover:bg-primary/10 text-kigezi-text'}`}>
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* District */}
      <div>
        <h4 className="font-semibold text-kigezi-text mb-3">District</h4>
        <div className="space-y-2">
          {DISTRICTS.map(d => (
            <label key={d} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox"
                checked={filters.districts.includes(d)}
                onChange={() => toggleDistrict(d)}
                className="w-4 h-4 accent-primary rounded" />
              <span className="text-sm text-kigezi-text group-hover:text-primary transition-colors">{d}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-kigezi-text mb-3">Price (UGX)</h4>
        <div className="flex gap-2">
          <input type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value, page: 1 }))}
            className="input-field text-sm py-2" />
          <input type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value, page: 1 }))}
            className="input-field text-sm py-2" />
        </div>
      </div>

      {/* Clear */}
      {activeFilterCount > 0 && (
        <button onClick={clearFilters}
          className="w-full text-center text-sm text-red-500 hover:text-red-700 font-medium py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-kigezi-bg">
      {usingMock && <DemoModeBanner />}
      <Navbar />
      <div className="pt-16 md:pt-18">
        {/* Header */}
        <div className="bg-primary py-12">
          <div className="page-wrapper">
            <div className="text-white">
              <div className="text-sm text-white/60 mb-2">
                <Link to="/" className="hover:text-white">Home</Link> / Experiences
              </div>
              <h1 className="font-serif text-4xl font-bold mb-2">Cultural Experiences</h1>
              <p className="text-white/80">Authentic Bakiga culture in Kigezi, Uganda</p>
            </div>
          </div>
        </div>

        <div className="page-wrapper py-8">
          {/* Search + Sort bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-kigezi-muted">🔍</span>
              <input
                type="text"
                placeholder="Search experiences…"
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
                className="input-field pl-11"
              />
            </div>
            <select
              value={filters.ordering}
              onChange={e => setFilters(f => ({ ...f, ordering: e.target.value, page: 1 }))}
              className="input-field w-full sm:w-56">
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setFilterOpen(true)}
              className="sm:hidden btn-outline flex items-center justify-center gap-2">
              🎛 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>

          {/* Active filter chips */}
          {(filters.category || filters.districts.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {filters.category && (
                <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full flex items-center gap-1">
                  {categories.find(c => c.slug === filters.category)?.icon} {categories.find(c => c.slug === filters.category)?.name}
                  <button onClick={() => setFilters(f => ({ ...f, category: '', page: 1 }))} className="ml-1 font-bold">×</button>
                </span>
              )}
              {filters.districts.map(d => (
                <span key={d} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full flex items-center gap-1">
                  📍 {d}
                  <button onClick={() => toggleDistrict(d)} className="ml-1 font-bold">×</button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="card p-6 sticky top-20">
                <h3 className="font-serif font-bold text-kigezi-text text-lg mb-5">Filters</h3>
                <FilterPanel />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <p className="text-kigezi-muted text-sm">
                  {loading ? 'Loading…' : `Showing ${total} experience${total !== 1 ? 's' : ''}`}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
                </div>
              ) : experiences.length === 0 ? (
                <EmptyState
                  icon="🔍"
                  title="No experiences found"
                  message="Try adjusting your filters or search query."
                  actionLabel="Clear Filters"
                  actionTo="/experiences"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {experiences.map(exp => <ExperienceCard key={exp.id} experience={exp} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif font-bold text-xl">Filters</h3>
              <button onClick={() => setFilterOpen(false)} className="text-kigezi-muted text-2xl">×</button>
            </div>
            <FilterPanel />
            <button onClick={() => setFilterOpen(false)} className="btn-primary w-full mt-6">
              Show {total} Results
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}