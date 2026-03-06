

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const STEPS = ['Personal Info', 'Cultural Profile', 'Review & Submit'];
const LANGUAGES = ['Rukiga', 'English', 'Swahili', 'French', 'Kinyarwanda'];

export default function HostRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    password: '', password2: '',
    bio: '', years_of_experience: 1, languages_spoken: ['Rukiga', 'English'],
    profile_photo: null, id_document: null,
    agreed_to_terms: false,
  });

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const toggleLanguage = (lang) => {
    setForm(f => ({
      ...f,
      languages_spoken: f.languages_spoken.includes(lang)
        ? f.languages_spoken.filter(l => l !== lang)
        : [...f.languages_spoken, lang],
    }));
  };

  const validate = () => {
    if (step === 0) {
      if (!form.first_name || !form.last_name) { toast.error('Enter your full name.'); return false; }
      if (!form.email)    { toast.error('Enter your email.'); return false; }
      if (!form.phone)    { toast.error('Enter your phone number.'); return false; }
      if (form.password.length < 8) { toast.error('Password must be at least 8 characters.'); return false; }
      if (form.password !== form.password2) { toast.error('Passwords do not match.'); return false; }
    }
    if (step === 1) {
      if (form.bio.length < 50) { toast.error('Bio must be at least 50 characters.'); return false; }
      if (!form.id_document)    { toast.error('Please upload your ID document.'); return false; }
    }
    if (step === 2) {
      if (!form.agreed_to_terms) { toast.error('Please agree to the terms.'); return false; }
    }
    return true;
  };

  const handleNext = () => { if (validate()) setStep(s => s + 1); };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('first_name', form.first_name);
      fd.append('last_name',  form.last_name);
      fd.append('email',      form.email);
      fd.append('phone',      form.phone);
      fd.append('password',   form.password);
      fd.append('password2',  form.password2);
      fd.append('role',       'host');
      fd.append('bio',        form.bio);
      fd.append('years_of_experience', form.years_of_experience);
      fd.append('languages_spoken', JSON.stringify(form.languages_spoken));
      if (form.profile_photo) fd.append('profile_photo', form.profile_photo);
      if (form.id_document)   fd.append('id_document',   form.id_document);

      await api.post('/api/hosts/register/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Application submitted! We\'ll review and notify you shortly. 🎉');
      navigate('/login');
    } catch (err) {
      const errors = err.response?.data || {};
      const msg = Object.values(errors).flat()[0] || 'Registration failed.';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-kigezi-bg py-20 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-serif font-bold text-2xl text-primary">
            <span className="text-3xl">🌍</span> Explore Kigezi
          </Link>
          <h1 className="font-serif text-3xl font-bold text-kigezi-text mt-4 mb-2">Become a Cultural Host</h1>
          <p className="text-kigezi-muted">Share your Bakiga heritage with the world</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary text-white' : 'bg-gray-200 text-kigezi-muted'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-primary' : 'text-kigezi-muted'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="card p-8">
          {/* STEP 0 */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-kigezi-text mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-kigezi-text mb-2">First Name *</label>
                  <input type="text" value={form.first_name} onChange={e => set('first_name', e.target.value)}
                    placeholder="First name" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-kigezi-text mb-2">Last Name *</label>
                  <input type="text" value={form.last_name} onChange={e => set('last_name', e.target.value)}
                    placeholder="Last name" className="input-field" />
                </div>
              </div>
              {[
                { label: 'Email Address *', field: 'email', type: 'email', placeholder: 'your@email.com' },
                { label: 'Phone Number *',  field: 'phone', type: 'tel',   placeholder: '+256 700 000 000' },
                { label: 'Password *',      field: 'password',  type: 'password', placeholder: 'Min. 8 characters' },
                { label: 'Confirm Password *', field: 'password2', type: 'password', placeholder: 'Repeat password' },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-sm font-semibold text-kigezi-text mb-2">{f.label}</label>
                  <input type={f.type} value={form[f.field]} onChange={e => set(f.field, e.target.value)}
                    placeholder={f.placeholder} className="input-field" />
                </div>
              ))}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-serif text-xl font-bold text-kigezi-text mb-4">Cultural Profile</h2>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-kigezi-text mb-2">Your Bio / Cultural Story *</label>
                <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={5}
                  placeholder="Tell travellers about your Bakiga heritage, what you love about Kigezi culture, and what makes your experiences special… (min 50 chars)"
                  className="input-field resize-none" />
                <p className="text-xs text-kigezi-muted mt-1">{form.bio.length} / 50 minimum</p>
              </div>

              {/* Years of experience */}
              <div>
                <label className="block text-sm font-semibold text-kigezi-text mb-2">Years of Experience</label>
                <input type="number" min={0} max={50} value={form.years_of_experience}
                  onChange={e => set('years_of_experience', e.target.value)} className="input-field w-32" />
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-semibold text-kigezi-text mb-3">Languages Spoken</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all
                        ${form.languages_spoken.includes(lang)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-kigezi-text border-kigezi-border hover:border-primary'}`}>
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-semibold text-kigezi-text mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {photoPreview
                    ? <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                    : <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">👤</div>
                  }
                  <label className="btn-outline cursor-pointer text-sm">
                    Choose Photo
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) { set('profile_photo', file); setPhotoPreview(URL.createObjectURL(file)); }
                      }} />
                  </label>
                </div>
              </div>

              {/* ID Document */}
              <div>
                <label className="block text-sm font-semibold text-kigezi-text mb-2">National ID / Passport * (for verification)</label>
                <label className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                  ${form.id_document ? 'border-primary bg-primary/5' : 'border-kigezi-border hover:border-primary'}`}>
                  <span className="text-2xl">{form.id_document ? '✅' : '📄'}</span>
                  <div>
                    <div className="font-medium text-kigezi-text text-sm">
                      {form.id_document ? form.id_document.name : 'Upload ID Document'}
                    </div>
                    <div className="text-kigezi-muted text-xs">JPG, PNG or PDF — max 5MB</div>
                  </div>
                  <input type="file" accept="image/*,.pdf" className="hidden"
                    onChange={e => { if (e.target.files[0]) set('id_document', e.target.files[0]); }} />
                </label>
              </div>
            </div>
          )}

          {/* STEP 2 — Review */}
          {step === 2 && (
            <div>
              <h2 className="font-serif text-xl font-bold text-kigezi-text mb-5">Review Your Application</h2>
              <div className="space-y-3 text-sm mb-6">
                {[
                  { label: 'Name',       value: `${form.first_name} ${form.last_name}` },
                  { label: 'Email',      value: form.email },
                  { label: 'Phone',      value: form.phone },
                  { label: 'Languages',  value: form.languages_spoken.join(', ') },
                  { label: 'Experience', value: `${form.years_of_experience} years` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between bg-kigezi-bg rounded-xl px-4 py-3">
                    <span className="text-kigezi-muted">{item.label}</span>
                    <span className="font-semibold text-kigezi-text">{item.value}</span>
                  </div>
                ))}
                <div className="bg-kigezi-bg rounded-xl px-4 py-3">
                  <div className="text-kigezi-muted mb-1">Bio</div>
                  <div className="text-kigezi-text text-sm">{form.bio}</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800">
                <strong>📋 What happens next?</strong>
                <p className="mt-1">Our team will review your application and verify your ID within 2–3 business days. You'll receive an SMS and email notification when approved.</p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.agreed_to_terms}
                  onChange={e => set('agreed_to_terms', e.target.checked)}
                  className="w-5 h-5 accent-primary mt-0.5" />
                <span className="text-sm text-kigezi-text">
                  I agree to the <a href="#" className="text-primary underline">Host Guidelines</a> and{' '}
                  <a href="#" className="text-primary underline">Terms of Service</a>. I confirm all information provided is accurate.
                </span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-kigezi-border">
            {step > 0
              ? <button onClick={() => setStep(s => s - 1)} className="btn-outline">← Back</button>
              : <Link to="/" className="btn-outline">← Cancel</Link>
            }
            {step < STEPS.length - 1
              ? <button onClick={handleNext} className="btn-primary">Continue →</button>
              : <button onClick={handleSubmit} disabled={submitting} className="btn-primary px-8">
                  {submitting ? '⏳ Submitting…' : 'Submit Application 🌍'}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}