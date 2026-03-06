import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { getHostExperiences, deleteExperience, toggleExperienceStatus } from '../../services/hostService';

const MOCK = [
  { id: 1, title: 'Kiga Dance & Drumming Workshop', category_name: 'Music & Dance', price_per_person: 80000, is_active: true, total_bookings: 12, cover_image: null },
  { id: 2, title: 'Traditional Bakiga Cooking Class', category_name: 'Culinary', price_per_person: 60000, is_active: true, total_bookings: 7, cover_image: null },
];

export default function HostExperiencesPage() {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    getHostExperiences()
      .then((data) => setExperiences(Array.isArray(data) ? data : data.results || []))
      .catch(() => setExperiences(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteExperience(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      toast.success('Experience deleted.');
    } catch {
      toast.error('Failed to delete experience.');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggle = async (id, current) => {
    setToggling(id);
    try {
      await toggleExperienceStatus(id, !current);
      setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, is_active: !current } : e)));
      toast.success(`Experience ${!current ? 'activated' : 'deactivated'}.`);
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="pt-16">
        <div className="bg-primary py-10">
          <div className="page-wrapper flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-white mb-1">My Experiences</h1>
              <p className="text-white/70">{experiences.length} experience{experiences.length !== 1 ? 's' : ''}</p>
            </div>
            <Link to="/host/experiences/new" className="bg-white text-primary font-bold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all">
              ➕ Add New Experience
            </Link>
          </div>
        </div>

        <div className="page-wrapper py-8">
          {loading ? (
            <LoadingSpinner center />
          ) : experiences.length === 0 ? (
            <EmptyState
              icon="🌿"
              title="No experiences yet"
              message="Create your first experience to start receiving bookings from travellers."
              ctaLabel="Create Experience"
              ctaTo="/host/experiences/new"
            />
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-20 h-16 bg-primary-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                    {exp.cover_image ? (
                      <img src={exp.cover_image} alt={exp.title} className="w-full h-full object-cover" />
                    ) : '🌿'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-kigezi-text mb-1 truncate">{exp.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-kigezi-muted">
                      <span className="badge bg-primary-100 text-primary">{exp.category_name}</span>
                      <span>UGX {Number(exp.price_per_person).toLocaleString()} / person</span>
                      <span>📅 {exp.total_bookings || 0} bookings</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge label={exp.is_active ? 'active' : 'inactive'} variant={exp.is_active ? 'active' : 'inactive'} />
                    <button
                      onClick={() => handleToggle(exp.id, exp.is_active)}
                      disabled={toggling === exp.id}
                      className="text-xs border border-kigezi-border text-kigezi-muted px-2.5 py-1 rounded-lg hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                    >
                      {exp.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => navigate(`/host/experiences/${exp.id}/edit`)}
                      className="text-xs bg-primary-100 text-primary px-2.5 py-1 rounded-lg font-semibold hover:bg-primary-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      disabled={deleting === exp.id}
                      className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deleting === exp.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
