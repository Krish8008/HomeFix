import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const SERVICES = [
  { id: 'plumbing', name: '🔧 Plumbing' }, { id: 'electrician', name: '⚡ Electrician' },
  { id: 'carpenter', name: '🪚 Carpenter' }, { id: 'painting', name: '🎨 Painting' },
  { id: 'cleaning', name: '🧹 Deep Cleaning' }, { id: 'ac_repair', name: '❄️ AC Repair' },
  { id: 'appliance_repair', name: '🔌 Appliance Repair' }, { id: 'pest_control', name: '🐛 Pest Control' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function RegisterTechnician() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', city: '', area: '',
    serviceCategory: '', experience: '', hourlyRate: '', bio: '',
    skills: '', availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const toggleDay = (day) => {
    const days = form.availableDays.includes(day)
      ? form.availableDays.filter(d => d !== day)
      : [...form.availableDays, day];
    setForm({ ...form, availableDays: days });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        experience: parseInt(form.experience) || 0,
        hourlyRate: parseInt(form.hourlyRate),
      };
      const res = await authAPI.registerTechnician(payload);
      login(res.data.token, res.data.user, res.data.technicianProfile);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>🛠️</div>
          <h1 style={styles.title}>Join as Technician</h1>
          <p style={styles.subtitle}>Start earning with HomeFix</p>
        </div>

        {/* Step Indicator */}
        <div style={styles.steps}>
          {[1,2].map(s => (
            <div key={s} style={styles.stepWrap}>
              <div style={{ ...styles.stepDot, ...(step >= s ? styles.stepDotActive : {}) }}>{s}</div>
              <div style={styles.stepLabel}>{s === 1 ? 'Personal Info' : 'Professional Info'}</div>
            </div>
          ))}
          <div style={styles.stepLine} />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-control" placeholder="Your full name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input className="form-control" type="password" placeholder="Min 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} minLength={6} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-control" placeholder="+91 XXXXX XXXXX" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input className="form-control" placeholder="City name" value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Area / Locality</label>
                <input className="form-control" placeholder="Your service area" value={form.area}
                  onChange={e => setForm({ ...form, area: e.target.value })} />
              </div>
              <button type="button" className="btn btn-primary" style={styles.submitBtn}
                onClick={() => { if (!form.name||!form.email||!form.password||!form.phone||!form.city) { setError('Fill all required fields'); return; } setError(''); setStep(2); }}>
                Next Step →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label>Service Category</label>
                <select className="form-control" value={form.serviceCategory}
                  onChange={e => setForm({ ...form, serviceCategory: e.target.value })} required>
                  <option value="">Select your service</option>
                  {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Experience (Years)</label>
                  <input className="form-control" type="number" min="0" max="50" placeholder="0"
                    value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Hourly Rate (₹)</label>
                  <input className="form-control" type="number" min="50" placeholder="200"
                    value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Bio / About Yourself</label>
                <textarea className="form-control" placeholder="Describe your expertise and experience..."
                  value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
              </div>
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input className="form-control" placeholder="e.g. Pipe fitting, Water heater, Drainage"
                  value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Available Days</label>
                <div style={styles.daysGrid}>
                  {DAYS.map(day => (
                    <button type="button" key={day}
                      style={{ ...styles.dayBtn, ...(form.availableDays.includes(day) ? styles.dayBtnActive : {}) }}
                      onClick={() => toggleDay(day)}>
                      {day.slice(0,3)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Registering...' : '🎉 Complete Registration'}
                </button>
              </div>
            </>
          )}
        </form>

        <div style={styles.links}>
          <span style={styles.linkText}>Already registered? </span>
          <Link to="/login" style={styles.link}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  card: {
    background: 'white', borderRadius: 24, padding: '48px 40px',
    width: '100%', maxWidth: 520, boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
  },
  logoWrap: { textAlign: 'center', marginBottom: 28 },
  logo: { fontSize: 48, marginBottom: 8 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 28, color: '#1A1A2E', marginBottom: 4 },
  subtitle: { color: '#6B7280', fontSize: 15 },
  steps: {
    display: 'flex', justifyContent: 'center', gap: 48, marginBottom: 32, position: 'relative',
  },
  stepLine: {
    position: 'absolute', top: 16, left: '25%', right: '25%',
    height: 2, background: '#E5E7EB', zIndex: 0,
  },
  stepWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 1 },
  stepDot: {
    width: 32, height: 32, borderRadius: '50%', background: '#E5E7EB',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, color: '#9CA3AF',
  },
  stepDotActive: { background: '#FF5C35', color: 'white' },
  stepLabel: { fontSize: 12, color: '#6B7280', fontWeight: 500 },
  error: {
    background: '#FEE2E2', border: '1px solid #FECACA', color: '#991B1B',
    borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14,
  },
  submitBtn: { width: '100%', justifyContent: 'center', marginTop: 4, padding: '14px' },
  daysGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  dayBtn: {
    padding: '7px 14px', borderRadius: 50, fontSize: 13, fontWeight: 500,
    border: '2px solid #E5E7EB', background: 'transparent', cursor: 'pointer',
    color: '#6B7280', transition: 'all 0.15s',
  },
  dayBtnActive: { background: '#FF5C35', borderColor: '#FF5C35', color: 'white' },
  links: { textAlign: 'center', marginTop: 24, fontSize: 14 },
  linkText: { color: '#6B7280' },
  link: { color: '#FF5C35', textDecoration: 'none', fontWeight: 500 },
};
