import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { technicianAPI, bookingAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const TIME_SLOTS = [
  '08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM', '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM', '06:00 PM - 08:00 PM',
];

export default function BookingForm() {
  const { technicianId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tech, setTech] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    problemDescription: '',
    appointmentDate: '',
    timeSlot: '',
    address: '',
    city: user?.city || '',
    notes: '',
  });

  useEffect(() => {
    technicianAPI.getById(technicianId).then(r => setTech(r.data));
  }, [technicianId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bookingAPI.create({
        ...form,
        technician: technicianId,
        serviceCategory: tech.serviceCategory,
      });
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  if (success) return (
    <div style={styles.successPage}>
      <div style={styles.successCard}>
        <div style={styles.successIcon}>🎉</div>
        <h2 style={styles.successTitle}>Booking Confirmed!</h2>
        <p style={styles.successText}>Your appointment has been successfully booked. The technician will confirm shortly.</p>
        <div style={styles.successBtns}>
          <button className="btn btn-primary" onClick={() => navigate('/my-bookings')}>View My Bookings</button>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div className="container">
          <h1 style={styles.title}>Book Appointment</h1>
          <p style={styles.subtitle}>Fill in the details to schedule your service</p>
        </div>
      </div>

      <div className="container">
        <div style={styles.body}>
          <div style={styles.formSection}>
            <form onSubmit={handleSubmit}>
              <div style={styles.formCard}>
                <h3 style={styles.formTitle}>📋 Problem Details</h3>
                <div className="form-group">
                  <label>Describe the Problem *</label>
                  <textarea
                    className="form-control"
                    placeholder="e.g. Water is leaking from under the kitchen sink, started 2 days ago..."
                    value={form.problemDescription}
                    onChange={e => setForm({ ...form, problemDescription: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div style={styles.formCard}>
                <h3 style={styles.formTitle}>📅 Schedule</h3>
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input
                    className="form-control"
                    type="date"
                    min={minDateStr}
                    value={form.appointmentDate}
                    onChange={e => setForm({ ...form, appointmentDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Time Slot *</label>
                  <div style={styles.timeGrid}>
                    {TIME_SLOTS.map(slot => (
                      <button type="button" key={slot}
                        style={{ ...styles.timeSlot, ...(form.timeSlot === slot ? styles.timeSlotActive : {}) }}
                        onClick={() => setForm({ ...form, timeSlot: slot })}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.formCard}>
                <h3 style={styles.formTitle}>📍 Your Address</h3>
                <div className="form-group">
                  <label>Full Address *</label>
                  <textarea
                    className="form-control"
                    placeholder="House no., Street, Area, Landmark..."
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    className="form-control"
                    placeholder="Your city"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Additional Notes</label>
                  <input
                    className="form-control"
                    placeholder="Any specific instructions..."
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={styles.submitBtn} disabled={loading || !form.timeSlot}>
                {loading ? 'Booking...' : '✅ Confirm Booking'}
              </button>
            </form>
          </div>

          {/* Technician Summary */}
          {tech && (
            <div style={styles.summary}>
              <div style={styles.summaryCard}>
                <h3 style={styles.summaryTitle}>Booking Summary</h3>
                <div style={styles.techInfo}>
                  <div style={styles.techAvatar}>{tech.user?.name?.charAt(0)}</div>
                  <div>
                    <div style={styles.techName}>{tech.user?.name}</div>
                    <div style={styles.techService}>{tech.serviceCategory?.replace('_', ' ')}</div>
                    <div style={styles.techRating}>⭐ {tech.rating > 0 ? tech.rating : 'New'} • {tech.totalJobs} jobs</div>
                  </div>
                </div>
                <div style={styles.summaryDetails}>
                  <div style={styles.summaryRow}>
                    <span>Hourly Rate</span>
                    <span style={styles.summaryValue}>₹{tech.hourlyRate}/hr</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Location</span>
                    <span style={styles.summaryValue}>{tech.city}</span>
                  </div>
                  {form.appointmentDate && (
                    <div style={styles.summaryRow}>
                      <span>Date</span>
                      <span style={styles.summaryValue}>{new Date(form.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}
                  {form.timeSlot && (
                    <div style={styles.summaryRow}>
                      <span>Time</span>
                      <span style={styles.summaryValue}>{form.timeSlot}</span>
                    </div>
                  )}
                </div>
                <div style={styles.summaryNote}>
                  💡 Final cost will be determined after the technician assesses the problem.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#F8F7F4' },
  header: {
    background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
    padding: '60px 0 40px',
  },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 36, color: 'white', marginBottom: 6 },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  body: {
    padding: '40px 0 80px',
    display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start',
  },
  formSection: {},
  formCard: {
    background: 'white', borderRadius: 16, padding: 28,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20,
  },
  formTitle: { fontFamily: 'Syne, sans-serif', fontSize: 18, marginBottom: 20, color: '#1A1A2E' },
  timeGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 },
  timeSlot: {
    padding: '12px', borderRadius: 10, border: '2px solid #E5E7EB',
    background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 500,
    color: '#374151', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif',
  },
  timeSlotActive: { background: '#FF5C35', borderColor: '#FF5C35', color: 'white' },
  submitBtn: { width: '100%', justifyContent: 'center' },
  summary: { position: 'sticky', top: 88 },
  summaryCard: {
    background: 'white', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  summaryTitle: { fontFamily: 'Syne, sans-serif', fontSize: 18, marginBottom: 20, color: '#1A1A2E' },
  techInfo: { display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #F3F4F6' },
  techAvatar: {
    width: 52, height: 52, borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF5C35, #FFB800)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, flexShrink: 0,
  },
  techName: { fontWeight: 700, fontSize: 16, marginBottom: 2 },
  techService: { color: '#6B7280', fontSize: 13, textTransform: 'capitalize', marginBottom: 4 },
  techRating: { color: '#6B7280', fontSize: 13 },
  summaryDetails: {},
  summaryRow: {
    display: 'flex', justifyContent: 'space-between', padding: '10px 0',
    fontSize: 14, borderBottom: '1px solid #F9FAFB', color: '#6B7280',
  },
  summaryValue: { fontWeight: 600, color: '#1A1A2E' },
  summaryNote: {
    background: '#FFF7ED', borderRadius: 10, padding: 14,
    fontSize: 13, color: '#92400E', marginTop: 16, lineHeight: 1.5,
  },
  successPage: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#F8F7F4', padding: 24,
  },
  successCard: {
    background: 'white', borderRadius: 24, padding: 48, textAlign: 'center',
    maxWidth: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
  },
  successIcon: { fontSize: 72, marginBottom: 20 },
  successTitle: { fontFamily: 'Syne, sans-serif', fontSize: 28, color: '#1A1A2E', marginBottom: 12 },
  successText: { color: '#6B7280', fontSize: 15, lineHeight: 1.7, marginBottom: 28 },
  successBtns: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
};
