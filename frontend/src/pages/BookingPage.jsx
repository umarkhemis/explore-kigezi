

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { getExperience } from '../services/experienceService';
import { createBooking } from '../services/bookingService';
import toast from 'react-hot-toast';

const STEPS = ['Select', 'Your Details', 'Review & Pay'];
const NATIONALITIES = ['Ugandan','British','American','Kenyan','Tanzanian','Rwandan','German','French','Dutch','Australian','Canadian','Other'];

export default function BookingPage() {
  const { id }    = useParams();
  const location  = useLocation();
  const navigate  = useNavigate();

  const [step, setStep]         = useState(0);
  const [exp,  setExp]          = useState(location.state?.experience || null);
  const [loading, setLoading]   = useState(!exp);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    experience: id,
    booking_date: location.state?.date || '',
    group_size: location.state?.groupSize || 1,
    tourist_name: '',
    tourist_email: '',
    tourist_phone: '',
    tourist_nationality: '',
    special_requests: '',
    payment_method: 'mtn',
    mobile_money_phone: '',
  });

  useEffect(() => {
    if (!exp) {
      getExperience(id).then(data => { setExp(data); setLoading(false); });
    }
  }, [id, exp]);

  const totalPrice = exp ? Number(exp.price_per_person) * form.group_size : 0;

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const validateStep = () => {
    if (step === 0) {
      if (!form.booking_date) { toast.error('Please select a date.'); return false; }
      if (form.group_size < 1)  { toast.error('Group size must be at least 1.'); return false; }
    }
    if (step === 1) {
      if (!form.tourist_name.trim())  { toast.error('Please enter your name.'); return false; }
      if (!form.tourist_email.trim()) { toast.error('Please enter your email.'); return false; }
      if (!form.tourist_phone.trim()) { toast.error('Please enter your phone number.'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        experience: id,
        booking_date: form.booking_date,
        group_size: form.group_size,
        tourist_name: form.tourist_name,
        tourist_email: form.tourist_email,
        tourist_phone: form.tourist_phone,
        tourist_nationality: form.tourist_nationality,
        special_requests: form.special_requests,
        payment_method: form.payment_method,
      };
      const booking = await createBooking(payload);
      toast.success('Booking confirmed! 🎉');
      navigate(`/booking/confirmation/${booking.booking_reference}`, { state: { booking } });
    } catch (err) {
      const msg = err.response?.data?.detail
        || Object.values(err.response?.data || {})[0]
        || 'Booking failed. Please try again.';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-kigezi-bg flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-kigezi-bg">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="page-wrapper max-w-3xl">
          {/* Breadcrumb */}
          <div className="text-sm text-kigezi-muted mb-6">
            <Link to="/" className="hover:text-primary">Home</Link> /
            <Link to="/experiences" className="hover:text-primary mx-1">Experiences</Link> /
            <Link to={`/experiences/${id}`} className="hover:text-primary mx-1">{exp?.title}</Link> /
            <span className="text-kigezi-text"> Book</span>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-8">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all
                    ${i < step ? 'bg-green-500 text-white'
                      : i === step ? 'bg-primary text-white shadow-btn'
                      : 'bg-gray-200 text-kigezi-muted'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block
                    ${i === step ? 'text-primary' : 'text-kigezi-muted'}`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all
                    ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form */}
            <div className="md:col-span-2">
              <div className="card p-6">
                {/* STEP 0 — Date & Group */}
                {step === 0 && (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-kigezi-text mb-6">
                      Select Date & Group
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-semibold text-kigezi-text mb-2">📅 Booking Date *</label>
                        <input type="date" value={form.booking_date}
                          onChange={e => set('booking_date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="input-field" required />
                        {exp?.available_days?.length > 0 && (
                          <p className="text-kigezi-muted text-xs mt-1">
                            Available: {exp.available_days.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block font-semibold text-kigezi-text mb-2">
                          👥 Group Size ({exp?.min_group_size}–{exp?.max_group_size} people) *
                        </label>
                        <div className="flex items-center gap-4">
                          <button type="button"
                            onClick={() => set('group_size', Math.max(exp?.min_group_size || 1, form.group_size - 1))}
                            className="w-11 h-11 rounded-full border-2 border-primary text-primary text-xl font-bold hover:bg-primary hover:text-white transition-all">
                            −
                          </button>
                          <span className="text-3xl font-bold text-kigezi-text w-10 text-center">
                            {form.group_size}
                          </span>
                          <button type="button"
                            onClick={() => set('group_size', Math.min(exp?.max_group_size || 15, form.group_size + 1))}
                            className="w-11 h-11 rounded-full border-2 border-primary text-primary text-xl font-bold hover:bg-primary hover:text-white transition-all">
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 1 — Your Details */}
                {step === 1 && (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-kigezi-text mb-6">Your Details</h2>
                    <div className="space-y-4">
                      {[
                        { label: 'Full Name *',    field: 'tourist_name',  type: 'text',  placeholder: 'Your full name' },
                        { label: 'Email *',        field: 'tourist_email', type: 'email', placeholder: 'your@email.com' },
                        { label: 'Phone Number *', field: 'tourist_phone', type: 'tel',   placeholder: '+256 700 000 000' },
                      ].map(f => (
                        <div key={f.field}>
                          <label className="block font-semibold text-kigezi-text mb-2">{f.label}</label>
                          <input type={f.type} value={form[f.field]}
                            onChange={e => set(f.field, e.target.value)}
                            placeholder={f.placeholder}
                            className="input-field" required />
                        </div>
                      ))}
                      <div>
                        <label className="block font-semibold text-kigezi-text mb-2">Nationality</label>
                        <select value={form.tourist_nationality}
                          onChange={e => set('tourist_nationality', e.target.value)}
                          className="input-field">
                          <option value="">Select nationality</option>
                          {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-kigezi-text mb-2">Special Requests</label>
                        <textarea value={form.special_requests}
                          onChange={e => set('special_requests', e.target.value)}
                          placeholder="Any dietary requirements, accessibility needs, or special requests…"
                          className="input-field resize-none" rows={3} />
                      </div>
                    </div>
                    <p className="text-kigezi-muted text-xs mt-4 flex items-center gap-1">
                      🔒 Your details are secure and only shared with your host
                    </p>
                  </div>
                )}

                {/* STEP 2 — Review & Pay */}
                {step === 2 && (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-kigezi-text mb-6">Review & Pay</h2>

                    {/* Summary */}
                    <div className="bg-kigezi-bg rounded-2xl p-5 mb-6 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-kigezi-muted">Experience</span>
                        <span className="font-semibold text-kigezi-text text-right max-w-[200px]">{exp?.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-kigezi-muted">Date</span>
                        <span className="font-semibold">{form.booking_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-kigezi-muted">Group Size</span>
                        <span className="font-semibold">{form.group_size} person{form.group_size > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-kigezi-muted">Price per person</span>
                        <span className="font-semibold">UGX {Number(exp?.price_per_person).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base border-t border-kigezi-border pt-2 mt-2">
                        <span>Total</span>
                        <span className="text-primary">UGX {totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <h3 className="font-semibold text-kigezi-text mb-3">Payment Method</h3>
                    <div className="space-y-3 mb-5">
                      {[
                        { value: 'mtn',            label: 'MTN Mobile Money',   icon: '📱', desc: 'You will receive a prompt on your phone' },
                        { value: 'airtel',          label: 'Airtel Money',       icon: '📲', desc: 'Enter your Airtel number to pay' },
                        { value: 'pay_on_arrival',  label: 'Pay on Arrival',     icon: '💵', desc: 'Pay cash when you meet your host' },
                      ].map(pm => (
                        <label key={pm.value}
                          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                            ${form.payment_method === pm.value
                              ? 'border-primary bg-primary/5'
                              : 'border-kigezi-border hover:border-primary/40'}`}>
                          <input type="radio" name="payment_method" value={pm.value}
                            checked={form.payment_method === pm.value}
                            onChange={e => set('payment_method', e.target.value)}
                            className="mt-1 accent-primary" />
                          <div>
                            <div className="font-semibold text-kigezi-text">{pm.icon} {pm.label}</div>
                            <div className="text-kigezi-muted text-xs mt-0.5">{pm.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Mobile money phone input */}
                    {(form.payment_method === 'mtn' || form.payment_method === 'airtel') && (
                      <div className="mb-5">
                        <label className="block font-semibold text-kigezi-text mb-2">
                          {form.payment_method === 'mtn' ? 'MTN' : 'Airtel'} Mobile Money Number
                        </label>
                        <input type="tel"
                          value={form.mobile_money_phone}
                          onChange={e => set('mobile_money_phone', e.target.value)}
                          placeholder="e.g. 0771234567"
                          className="input-field" />
                        <p className="text-kigezi-muted text-xs mt-1">
                          📲 You will receive a prompt on this number to approve the payment
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-kigezi-border">
                  {step > 0
                    ? <button onClick={() => setStep(s => s - 1)}
                        className="btn-outline">← Back</button>
                    : <Link to={`/experiences/${id}`} className="btn-outline">← Back</Link>
                  }
                  {step < STEPS.length - 1
                    ? <button onClick={handleNext} className="btn-primary">Continue →</button>
                    : <button onClick={handleSubmit} disabled={submitting}
                        className="btn-accent px-8">
                        {submitting
                          ? '⏳ Processing…'
                          : `Confirm & Book — UGX ${totalPrice.toLocaleString()}`}
                      </button>
                  }
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="md:col-span-1">
              <div className="card p-5 sticky top-24">
                <img
                  src={exp?.cover_image}
                  alt={exp?.title}
                  className="w-full h-36 object-cover rounded-xl mb-4"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400&q=80'; }}
                />
                <h4 className="font-serif font-bold text-kigezi-text mb-2 line-clamp-2">{exp?.title}</h4>
                <div className="text-kigezi-muted text-xs space-y-1">
                  <div>📍 {exp?.location}</div>
                  <div>⏱ {exp?.duration_display}</div>
                  <div>👤 Host: {exp?.host?.full_name || exp?.host_name}</div>
                </div>
                <div className="mt-4 pt-4 border-t border-kigezi-border">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-kigezi-muted">
                      UGX {Number(exp?.price_per_person).toLocaleString()} × {form.group_size}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">UGX {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}