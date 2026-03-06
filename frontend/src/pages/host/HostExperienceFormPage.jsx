import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  createExperience,
  updateExperience,
  getCategories,
} from '../../services/hostService';
import { getExperience } from '../../services/experienceService';

const DISTRICTS = ['Kabale', 'Kisoro', 'Rubanda', 'Rukungiri', 'Kanungu', 'Rukiga'];
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const MOCK_CATS = [
  { id: 1, name: 'Music & Dance' }, { id: 2, name: 'Culinary' },
  { id: 3, name: 'Heritage Tour' }, { id: 4, name: 'Nature & Hiking' },
  { id: 5, name: 'Craft Workshop' }, { id: 6, name: 'Agriculture' },
];

const INITIAL_FORM = {
  title: '', category: '', description: '', district: '', location: '',
  meeting_point: '', duration_hours: 2, price_per_person: '',
  min_group_size: 1, max_group_size: 10,
  available_days: [], whats_included: [''], what_to_bring: [''],
  cover_image: null,
};

export default function HostExperienceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(INITIAL_FORM);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    getCategories().catch(() => MOCK_CATS).then(setCategories);
    if (isEdit) {
      getExperience(id)
        .then((exp) => {
          setForm({
            title: exp.title || '',
            category: exp.category || '',
            description: exp.description || '',
            district: exp.district || '',
            location: exp.location || '',
            meeting_point: exp.meeting_point || '',
            duration_hours: exp.duration_hours || 2,
            price_per_person: exp.price_per_person || '',
            min_group_size: exp.min_group_size || 1,
            max_group_size: exp.max_group_size || 10,
            available_days: exp.available_days || [],
            whats_included: exp.whats_included?.length ? exp.whats_included : [''],
            what_to_bring: exp.what_to_bring?.length ? exp.what_to_bring : [''],
            cover_image: null,
          });
          if (exp.cover_image) setImagePreview(exp.cover_image);
        })
        .catch(() => toast.error('Failed to load experience.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter((d) => d !== day)
        : [...prev.available_days, day],
    }));
  };

  const updateList = (field, idx, val) => {
    setForm((prev) => {
      const list = [...prev[field]];
      list[idx] = val;
      return { ...prev, [field]: list };
    });
  };

  const addListItem = (field) => setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));

  const removeListItem = (field, idx) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, cover_image: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.description.length < 100) {
      toast.error('Description must be at least 100 characters.');
      return;
    }
    setSubmitting(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'cover_image') { if (v) data.append(k, v); }
      else if (Array.isArray(v)) data.append(k, JSON.stringify(v));
      else data.append(k, v);
    });
    try {
      if (isEdit) await updateExperience(id, data);
      else await createExperience(data);
      toast.success(`Experience ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate('/host/experiences');
    } catch (err) {
      const errs = err.response?.data;
      const msg = typeof errs === 'object' ? Object.values(errs).flat().join(' ') : 'Failed to save experience.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const DynamicList = ({ field, placeholder }) => (
    <div className="space-y-2">
      {form[field].map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateList(field, idx, e.target.value)}
            placeholder={placeholder}
            className="input-field flex-1"
          />
          {form[field].length > 1 && (
            <button type="button" onClick={() => removeListItem(field, idx)} className="text-red-500 hover:text-red-700 px-2">✕</button>
          )}
        </div>
      ))}
      <button type="button" onClick={() => addListItem(field)} className="text-sm text-primary font-semibold hover:underline">
        + Add item
      </button>
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-kigezi-bg"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="pt-16">
        <div className="bg-primary py-10">
          <div className="page-wrapper">
            <h1 className="font-serif text-3xl font-bold text-white mb-1">
              {isEdit ? 'Edit Experience' : 'Create New Experience'}
            </h1>
          </div>
        </div>

        <div className="page-wrapper py-8">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="card p-6 space-y-4">
              <h2 className="font-serif font-bold text-kigezi-text">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium text-kigezi-text mb-1">Title</label>
                <input type="text" value={form.title} onChange={set('title')} className="input-field" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-kigezi-text mb-1">Category</label>
                  <select value={form.category} onChange={set('category')} className="input-field" required>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-kigezi-text mb-1">District</label>
                  <select value={form.district} onChange={set('district')} className="input-field" required>
                    <option value="">Select district</option>
                    {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-kigezi-text mb-1">
                  Description <span className="text-kigezi-muted font-normal">(min 100 characters — {form.description.length})</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={5}
                  className="input-field resize-none"
                  required
                  minLength={100}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-kigezi-text mb-1">Location (village/area)</label>
                  <input type="text" value={form.location} onChange={set('location')} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-kigezi-text mb-1">Meeting Point</label>
                  <input type="text" value={form.meeting_point} onChange={set('meeting_point')} className="input-field" />
                </div>
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-serif font-bold text-kigezi-text">Pricing & Logistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-kigezi-text mb-1">Duration (hours, 1–12)</label>
                  <input type="number" value={form.duration_hours} onChange={set('duration_hours')} className="input-field" min={1} max={12} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-kigezi-text mb-1">Price per Person (UGX)</label>
                  <input type="number" value={form.price_per_person} onChange={set('price_per_person')} className="input-field" min={1000} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-kigezi-text mb-1">Min Group Size</label>
                  <input type="number" value={form.min_group_size} onChange={set('min_group_size')} className="input-field" min={1} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-kigezi-text mb-1">Max Group Size</label>
                  <input type="number" value={form.max_group_size} onChange={set('max_group_size')} className="input-field" min={1} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-kigezi-text mb-2">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <label key={day} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.available_days.includes(day)}
                        onChange={() => toggleDay(day)}
                        className="accent-primary w-4 h-4"
                      />
                      <span className="text-sm text-kigezi-text capitalize">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-serif font-bold text-kigezi-text">Details</h2>
              <div>
                <label className="block text-sm font-medium text-kigezi-text mb-2">What's Included</label>
                <DynamicList field="whats_included" placeholder="e.g. Refreshments" />
              </div>
              <div>
                <label className="block text-sm font-medium text-kigezi-text mb-2">What to Bring</label>
                <DynamicList field="what_to_bring" placeholder="e.g. Comfortable shoes" />
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="font-serif font-bold text-kigezi-text">Cover Image</h2>
              {imagePreview && (
                <img src={imagePreview} alt="preview" className="w-full h-48 object-cover rounded-lg border border-kigezi-border" />
              )}
              <input type="file" accept="image/*" onChange={handleImage} className="input-field" />
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => navigate('/host/experiences')} className="btn-outline flex-1">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? 'Saving…' : isEdit ? 'Update Experience' : 'Create Experience'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
