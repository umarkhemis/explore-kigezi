


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { getHostExperiences, deleteExperience, toggleExperienceStatus } from '../../services/hostService';
import toast from 'react-hot-toast';

export default function HostExperiencesPage() {
  const { isHost } = useAuth();
  const navigate   = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (!isHost) { navigate('/login'); return; }
    load();
  }, [isHost, navigate]);

  const load = async () => {
    setLoading(true);
    const data = await getHostExperiences();
    setExperiences(Array.isArray(data) ? data : data?.results || []);
    setLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteExperience(id);
      toast.success('Experience deleted.');
      load();
    } catch { toast.error('Could not delete experience.'); }
  };

  const handleToggle = async (id, current) => {
    try {
      await toggleExperienceStatus(id, !current);
      toast.success(`Experience ${!current ? 'activated' : 'deactivated'}.`);
      load();
    } catch { toast.error('Could not update status.'); }
  };

  if (loading) return <div className="min-h-screen bg-kigezi-bg"><Navbar /><LoadingSpinner center size="lg" /></div>;

  return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="pt-16 md:pt-18">
        <div className="bg-primary py-10">
          <div className="page-wrapper flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-white mb-1">My Experiences</h1>
              <p className="text-white/75">Manage your cultural offerings</p>
            </div>
            <Link to="/host/experiences/new" className="bg-secondary hover:bg-secondary-dark text-white px-5 py-2.5 rounded-xl font-semibold transition-colors">
              + New Experience
            </Link>
          </div>
        </div>

        <div className="page-wrapper py-8">
          {experiences.length === 0 ? (
            <EmptyState icon="🎭" title="No experiences yet"
              message="Create your first cultural experience and start welcoming travellers to Kigezi!"
              actionLabel="Create Experience" actionTo="/host/experiences/new" />
          ) : (
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id} className="card p-5 flex flex-col sm:flex-row gap-5">
                  <img src={exp.cover_image || 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=200&q=70'}
                    alt={exp.title}
                    className="w-full sm:w-36 h-28 sm:h-24 rounded-xl object-cover flex-shrink-0"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=200&q=70'; }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif font-bold text-kigezi-text line-clamp-1">{exp.title}</h3>
                      <Badge variant={exp.is_active ? 'active' : 'inactive'} label={exp.is_active ? 'Active' : 'Inactive'} />
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-kigezi-muted mb-3">
                      <span>{exp.category?.icon} {exp.category?.name || 'Uncategorised'}</span>
                      <span>UGX {Number(exp.price_per_person).toLocaleString()} / person</span>
                      <span>📋 {exp.total_bookings || 0} bookings</span>
                      <span>⭐ {Number(exp.average_rating || 0).toFixed(1)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/host/experiences/${exp.id}/edit`}
                        className="btn-outline text-sm py-1.5 px-4">✏️ Edit</Link>
                      <button onClick={() => handleToggle(exp.id, exp.is_active)}
                        className={`text-sm py-1.5 px-4 rounded-xl font-semibold border-2 transition-all
                          ${exp.is_active
                            ? 'border-yellow-400 text-yellow-600 hover:bg-yellow-50'
                            : 'border-green-400 text-green-600 hover:bg-green-50'}`}>
                        {exp.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <Link to={`/experiences/${exp.id}`}
                        className="text-sm py-1.5 px-4 rounded-xl border-2 border-kigezi-border text-kigezi-muted hover:border-primary hover:text-primary transition-all">
                        👁 Preview
                      </Link>
                      <button onClick={() => handleDelete(exp.id, exp.title)}
                        className="text-sm py-1.5 px-4 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 transition-all">
                        🗑 Delete
                      </button>
                    </div>
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