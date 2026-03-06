import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { registerHost } from '../../services/hostService';

const LANGUAGES = ['Rukiga', 'English', 'Swahili', 'French'];
const STEPS = ['Personal Info', 'Cultural Profile', 'Review & Submit'];

const INITIAL = {
  first_name: '', last_name: '', email: '', phone: '', password: '', password2: '',
  bio: '', years_of_experience: '', languages_spoken: [],
  profile_photo: null, id_document: null,
  agree_terms: false,
};

export default function HostRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const toggleLang = (lang) => {
    setForm((prev) => ({
      ...prev,
      languages_spoken: prev.languages_spoken.includes(lang)
        ? prev.languages_spoken.filter((l) => l !== lang)
        : [...prev.languages_spoken, lang],
    }));
  };

  const handleFile = (field) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, [field]: file }));
    if (field === 'profile_photo') {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const next = (e) => {
    e.preventDefault();
    if (step === 0 && form.password !== form.password2) {
      toast.error('Passwords do not match.');
      return;
    }
    setStep((s) => Math.min(s + 1, 2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.agree_terms) { toast.error('Please accept the terms.'); return; }
    setSubmitting(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'languages_spoken') data.append(k, JSON.stringify(v));
      else if (v instanceof File) data.append(k, v);
      else if (v !== null && v !== undefined) data.append(k, v);
    });
    try {
      await registerHost(data);
      toast.success('Application submitted! We will review it shortly.');
      navigate('/host/dashboard');
    } catch (err) {
      const errs = err.response?.data;
      const msg = typeof errs === 'object' ? Object.values(errs).flat().join(' ') : 'Registration failed.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-kigezi-bg flex flex-col">
      <Navbar />
      <div className="pt-16">
        <div className="bg-primary py-10">
          <div className="page-wrapper">
            <h1 className="font-serif text-3xl font-bold text-white mb-1">Become a Host</h1>
            <p className="text-white/70">Share your Bakiga heritage with the world</p>
          </div>
        </div>

        <div className="page-wrapper py-8">
          <div className="max-w-xl mx-auto">
            {/* Step indicator */}
            <div className="flex items-center mb-8">
              {STEPS.map((label, i) => (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                      ${i < step ? 'bg-primary text-white' : i === step ? 'bg-primary text-white ring-4 ring-primary/30' : 'bg-kigezi-border text-kigezi-muted'}`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs mt-1 hidden sm:block ${i === step ? 'text-primary font-semibold' : 'text-kigezi-muted'}`}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-primary' : 'bg-kigezi-border'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="card p-8">
              {/* Step 1 */}
              {step === 0 && (
                <form onSubmit={next} className="space-y-4">
                  <h2 className="font-serif text-xl font-bold text-kigezi-text mb-4">Personal Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-kigezi-text mb-1">First Name</label>
                      <input type="text" value={form.first_name} onChange={set('first_name')} className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-kigezi-text mb-1">Last Name</label>
                      <input type="text" value={form.last_name} onChange={set('last_name')} className="input-field" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-kigezi-text mb-1">Email</label>
                    <input type="email" value={form.email} onChange={set('email')} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-kigezi-text mb-1">Phone</label>
                    <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+256 7XX XXX XXX" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-kigezi-text mb-1">Password</label>
                    <input type="password" value={form.password} onChange={set('password')} className="input-field" required minLength={8} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-kigezi-text mb-1">Confirm Password</label>
                    <input type="password" value={form.password2} onChange={set('password2')} className="input-field" required />
                  </div>
                  <button type="submit" className="btn-primary w-full">Next →</button>
                </form>
              )}

              {/* Step 2 */}
              {step === 1 && (
                <form onSubmit={next} className="space-y-4">
                  <h2 className="font-serif text-xl font-bold text-kigezi-text mb-4">Cultural Profile</h2>
                  <div>
                    <label className="block text-sm font-medium text-kigezi-text mb-1">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={set('bio')}
                      rows={4}
                      placeholder="Tell us about your Bakiga heritage…"
                      className="input-field resize-none"
                      required
                      minLength={50}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-kigezi-text mb-1">Years of Experience</label>
                    <input type="number" value={form.years_of_experience} onChange={set('years_of_experience')} className="input-field" min={0} max={50} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-kigezi-text mb-2">Languages Spoken</label>
                    <div className="flex flex-wrap gap-3">
                      {LANGUAGES.map((lang) => (
                        <label key={lang} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.languages_spoken.includes(lang)}
                            onChange={() => toggleLang(lang)}
                            className="accent-primary w-4 h-4"
                          />
                          <span className="text-sm text-kigezi-text">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-kigezi-text mb-1">Profile Photo</label>
                    {photoPreview && (
                      <img src={photoPreview} alt="preview" className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-primary" />
                    )}
                    <input type="file" accept="image/*" onChange={handleFile('profile_photo')} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-kigezi-text mb-1">ID Document</label>
                    <input type="file" accept=".pdf,image/*" onChange={handleFile('id_document')} className="input-field" required />
                    <p className="text-xs text-kigezi-muted mt-1">National ID or Passport (PDF or image)</p>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(0)} className="btn-outline flex-1">← Back</button>
                    <button type="submit" className="btn-primary flex-1">Next →</button>
                  </div>
                </form>
              )}

              {/* Step 3 — Review */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="font-serif text-xl font-bold text-kigezi-text mb-4">Review & Submit</h2>
                  <div className="bg-kigezi-bg rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-kigezi-muted">Name</span>
                      <span className="font-medium text-kigezi-text">{form.first_name} {form.last_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kigezi-muted">Email</span>
                      <span className="font-medium text-kigezi-text">{form.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kigezi-muted">Phone</span>
                      <span className="font-medium text-kigezi-text">{form.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kigezi-muted">Experience</span>
                      <span className="font-medium text-kigezi-text">{form.years_of_experience} year{Number(form.years_of_experience) !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kigezi-muted">Languages</span>
                      <span className="font-medium text-kigezi-text">{form.languages_spoken.join(', ') || '—'}</span>
                    </div>
                    <div>
                      <span className="text-kigezi-muted">Bio</span>
                      <p className="text-kigezi-text mt-1 line-clamp-3">{form.bio}</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kigezi-muted">Profile Photo</span>
                      <span className="font-medium text-kigezi-text">{form.profile_photo?.name || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kigezi-muted">ID Document</span>
                      <span className="font-medium text-kigezi-text">{form.id_document?.name || '—'}</span>
                    </div>
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.agree_terms}
                      onChange={set('agree_terms')}
                      className="accent-primary w-4 h-4 mt-0.5"
                    />
                    <span className="text-sm text-kigezi-text">
                      I agree to the Explore Kigezi{' '}
                      <a href="#" className="text-primary underline">Terms of Service</a>{' '}
                      and{' '}
                      <a href="#" className="text-primary underline">Host Guidelines</a>.
                    </span>
                  </label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1">← Back</button>
                    <button type="submit" disabled={submitting || !form.agree_terms} className="btn-primary flex-1">
                      {submitting ? 'Submitting…' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
