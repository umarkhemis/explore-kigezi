


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { createExperience, updateExperience } from '../../services/hostService';
import { getExperience, getCategories } from '../../services/experienceService';
import toast from 'react-hot-toast';

const DISTRICTS  = ['Kabale','Kisoro','Rubanda','Rukungiri','Kanungu','Rukiga'];
const WEEKDAYS   = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

const EMPTY = {
  title: '', category: '', description: '', district: 'kabale',
  location: '', meeting_point: '', duration_hours: 2,
  price_per_person: '', min_group_size: 1, max_group_size: 10,
  available_days: ['saturday','sunday'],
  whats_included: [''], what_to_bring: [''],
  cover_image: null,
};

export default function HostExperienceFormPage() {
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();
  const { isHost } = useAuth();

  const [form,       setForm]       = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);

  useEffect(() => {
    if (!isHost) { navigate('/login'); return; }
    getCategories().then(cats => setCategories(Array.isArray(cats) ? cats : []));
    if (isEdit) {
      getExperience(id).then(data => {
        if (data) {
          setForm({
            title: data.title || '',
            category: data.category?.id || data.category || '',
            description: data.description || '',
            district: data.district || 'kabale',
            location: data.location || '',
            meeting_point: data.meeting_point || '',
            duration_hours: data.duration_hours || 2,
            price_per_person: data.price_per_person || '',
            min_group_size: data.min_group_size || 1,
            max_group_size: data.max_group_size || 10,
            available_days: data.available_days || [],
            whats_included: data.whats_included?.length ? data.whats_included : [''],
            what_to_bring: data.what_to_bring?.length ? data.what_to_bring : [''],
            cover_image: null,
          });
          if (data.cover_image) setImgPreview(data.cover_image);
        }
        setLoading(false);
      });
    }
  }, [id, isEdit, isHost, navigate]);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      available_days: f.available_days.includes(day)
        ? f.available_days.filter(d => d !== day)
        : [...f.available_days, day],
    }));
  };

  const updateList = (field, idx, val) => {
    setForm(f => {
      const arr = [...f[field]];
      arr[idx] = val;
      return { ...f, [field]: arr };
    });
  };
  const addListItem    = (field) => setForm(f => ({ ...f, [field]: [...f[field], ''] }));
  const removeListItem = (field, idx) => setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())          { toast.error('Title is required.'); return; }
    if (!form.category)              { toast.error('Please select a category.'); return; }
    if (form.description.length < 50) { toast.error('Description must be at least 50 characters.'); return; }
    if (!form.price_per_person)      { toast.error('Price is required.'); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'cover_image') { if (val) fd.append(key, val); }
        else if (key === 'whats_included' || key === 'what_to_bring' || key === 'available_days') {
          fd.append(key, JSON.stringify(val.filter(v => v.trim())));
        }
        else fd.append(key, val);
      });

      if (isEdit) {
        await updateExperience(id, fd);
        toast.success('Experience updated! ✅');
      } else {
        await createExperience(fd);
        toast.success('Experience created! 🎉');
      }
      navigate('/host/experiences');
    } catch (err) {
      const errors = err.response?.data || {};
      const msg = Object.values(errors).flat()[0] || 'Save failed.';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-kigezi-bg"><Navbar /><LoadingSpinner center size="lg" /></div>;

  return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="pt-16 md:pt-18">
        <div className="bg-primary py-10">
          <div className="page-wrapper">
            <div className="text-sm text-white/60 mb-2">
              <Link to="/host/experiences" className="hover:text-white">My Experiences</Link> / {isEdit ? 'Edit' : 'New'}
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">
              {isEdit ? 'Edit Experience' : 'Create New Experience'}
            </h1>
          </div>
        </div>

        <div className="page-wrapper py-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="card p-8 space-y-6">

            {/* Title */}
            <div>
              <label className="block font-semibold text-kigezi-text mb-2">Experience Title *</label>
              <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. Traditional Kiga Dance Workshop" className="input-field" required />
            </div>

            {/* Category + District */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-kigezi-text mb-2">Category *</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className="input-field" required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-kigezi-text mb-2">District *</label>
                <select value={form.district} onChange={e => set('district', e.target.value)} className="input-field">
                  {DISTRICTS.map(d => <option key={d} value={d.toLowerCase()}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-kigezi-text mb-2">Description *</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Describe your experience in detail — what travellers will do, see, learn and feel… (min 50 chars)"
                className="input-field resize-none" rows={5} required />
              <p className="text-xs text-kigezi-muted mt-1">{form.description.length} characters</p>
            </div>

            {/* Location + Meeting Point */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-kigezi-text mb-2">Location / Village</label>
                <input type="text" value={form.location} onChange={e => set('location', e.target.value)}
                  placeholder="e.g. Kabale Town Centre" className="input-field" />
              </div>
              <div>
                <label className="block font-semibold text-kigezi-text mb-2">Meeting Point</label>
                <input type="text" value={form.meeting_point} onChange={e => set('meeting_point', e.target.value)}
                  placeholder="e.g. Kabale Bus Park Gate" className="input-field" />
              </div>
            </div>

            {/* Duration + Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-kigezi-text mb-2">Duration (hours) *</label>
                <input type="number" min={1} max={12} value={form.duration_hours}
                  onChange={e => set('duration_hours', Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="block font-semibold text-kigezi-text mb-2">Price per Person (UGX) *</label>
                <input type="number" min={0} value={form.price_per_person}
                  onChange={e => set('price_per_person', e.target.value)}
                  placeholder="e.g. 85000" className="input-field" required />
              </div>
            </div>

            {/* Group size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-kigezi-text mb-2">Min Group Size</label>
                <input type="number" min={1} value={form.min_group_size}
                  onChange={e => set('min_group_size', Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="block font-semibold text-kigezi-text mb-2">Max Group Size</label>
                <input type="number" min={1} value={form.max_group_size}
                  onChange={e => set('max_group_size', Number(e.target.value))} className="input-field" />
              </div>
            </div>

            {/* Available Days */}
            <div>
              <label className="block font-semibold text-kigezi-text mb-3">Available Days</label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map(day => (
                  <button key={day} type="button" onClick={() => toggleDay(day)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all capitalize
                      ${form.available_days.includes(day)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-kigezi-text border-kigezi-border hover:border-primary'}`}>
                    {day.slice(0,3).charAt(0).toUpperCase() + day.slice(1,3)}
                  </button>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div>
              <label className="block font-semibold text-kigezi-text mb-3">✅ What's Included</label>
              <div className="space-y-2">
                {form.whats_included.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={item}
                      onChange={e => updateList('whats_included', i, e.target.value)}
                      placeholder={`Included item ${i + 1}`} className="input-field flex-1" />
                    {form.whats_included.length > 1 && (
                      <button type="button" onClick={() => removeListItem('whats_included', i)}
                        className="text-red-400 hover:text-red-600 px-2">✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addListItem('whats_included')}
                  className="text-primary text-sm font-medium hover:underline">+ Add item</button>
              </div>
            </div>

            {/* What to Bring */}
            <div>
              <label className="block font-semibold text-kigezi-text mb-3">🎒 What to Bring</label>
              <div className="space-y-2">
                {form.what_to_bring.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={item}
                      onChange={e => updateList('what_to_bring', i, e.target.value)}
                      placeholder={`e.g. Comfortable shoes`} className="input-field flex-1" />
                    {form.what_to_bring.length > 1 && (
                      <button type="button" onClick={() => removeListItem('what_to_bring', i)}
                        className="text-red-400 hover:text-red-600 px-2">✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addListItem('what_to_bring')}
                  className="text-primary text-sm font-medium hover:underline">+ Add item</button>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block font-semibold text-kigezi-text mb-3">Cover Image</label>
              {imgPreview && (
                <img src={imgPreview} alt="Preview"
                  className="w-full h-48 object-cover rounded-xl mb-3" />
              )}
              <label className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                ${form.cover_image ? 'border-primary bg-primary/5' : 'border-kigezi-border hover:border-primary'}`}>
                <span className="text-2xl">🖼️</span>
                <div>
                  <div className="font-medium text-kigezi-text text-sm">
                    {form.cover_image ? form.cover_image.name : 'Upload cover image'}
                  </div>
                  <div className="text-kigezi-muted text-xs">JPG or PNG, recommended 1200×800px</div>
                </div>
                <input type="file" accept="image/*" className="hidden"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) { set('cover_image', file); setImgPreview(URL.createObjectURL(file)); }
                  }} />
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t border-kigezi-border">
              <Link to="/host/experiences" className="btn-outline">Cancel</Link>
              <button type="submit" disabled={submitting} className="btn-primary px-10">
                {submitting ? '⏳ Saving…' : isEdit ? 'Save Changes ✅' : 'Create Experience 🎉'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}