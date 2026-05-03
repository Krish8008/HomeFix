import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI, reviewAPI } from '../utils/api';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#D97706', bg: '#FEF3C7' },
  confirmed: { label: 'Confirmed', color: '#2563EB', bg: '#DBEAFE' },
  in_progress: { label: 'In Progress', color: '#7C3AED', bg: '#EDE9FE' },
  completed: { label: 'Completed', color: '#059669', bg: '#D1FAE5' },
  cancelled: { label: 'Cancelled', color: '#DC2626', bg: '#FEE2E2' },
};

function ReviewModal({ booking, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({ rating, comment, booking: booking._id, technician: booking.technician._id });
      onClose();
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h3 style={styles.modalTitle}>Rate Your Experience</h3>
        <p style={styles.modalSub}>How was the service by {booking.technician?.user?.name}?</p>
        <div style={styles.starsRow}>
          {[1,2,3,4,5].map(s => (
            <button key={s} style={{ ...styles.starBtn, color: s <= rating ? '#FFB800' : '#D1D5DB' }}
              onClick={() => setRating(s)}>★</button>
          ))}
        </div>
        <textarea className="form-control" placeholder="Share your experience (optional)..."
          value={comment} onChange={e => setComment(e.target.value)} rows={3} style={{ marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-outline" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getMyBookings();
      setBookings(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (window.confirm('Cancel this booking?')) {
      await bookingAPI.cancel(id);
      fetchBookings();
    }
  };

  const handleReviewSubmit = async (data) => {
    await reviewAPI.submit(data);
    fetchBookings();
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div className="container">
          <h1 style={styles.title}>My Bookings</h1>
          <p style={styles.subtitle}>Track all your service appointments</p>
        </div>
      </div>

      <div className="container" style={styles.body}>
        {/* Filter Tabs */}
        <div style={styles.filterTabs}>
          {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(f => (
            <button key={f}
              style={{ ...styles.filterTab, ...(filter === f ? styles.filterTabActive : {}) }}
              onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label}
              <span style={{ ...styles.filterCount, background: filter === f ? 'rgba(255,255,255,0.25)' : '#F3F4F6' }}>
                {f === 'all' ? bookings.length : bookings.filter(b => b.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div style={styles.loadingWrap}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📋</div>
            <h3>No bookings found</h3>
            <p style={{ color: '#6B7280', marginBottom: 20 }}>You haven't booked any services yet.</p>
            <Link to="/services" className="btn btn-primary">Browse Services</Link>
          </div>
        ) : (
          <div style={styles.bookingsList}>
            {filtered.map(booking => {
              const sc = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
              return (
                <div key={booking._id} style={styles.bookingCard}>
                  <div style={styles.bookingTop}>
                    <div style={styles.bookingIcon}>
                      {booking.serviceCategory === 'plumbing' ? '🔧' :
                       booking.serviceCategory === 'electrician' ? '⚡' :
                       booking.serviceCategory === 'carpenter' ? '🪚' :
                       booking.serviceCategory === 'painting' ? '🎨' :
                       booking.serviceCategory === 'cleaning' ? '🧹' :
                       booking.serviceCategory === 'ac_repair' ? '❄️' : '🔌'}
                    </div>
                    <div style={styles.bookingInfo}>
                      <div style={styles.bookingService}>
                        {booking.serviceCategory?.replace('_', ' ').toUpperCase()}
                      </div>
                      <div style={styles.bookingTech}>
                        by {booking.technician?.user?.name || 'Technician'}
                      </div>
                    </div>
                    <div style={{ ...styles.statusBadge, color: sc.color, background: sc.bg }}>
                      {sc.label}
                    </div>
                  </div>

                  <p style={styles.problem}>{booking.problemDescription}</p>

                  <div style={styles.bookingMeta}>
                    <span style={styles.metaItem}>
                      📅 {new Date(booking.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span style={styles.metaItem}>⏰ {booking.timeSlot}</span>
                    <span style={styles.metaItem}>📍 {booking.city}</span>
                    {booking.finalCost && <span style={styles.metaItem}>💰 ₹{booking.finalCost}</span>}
                  </div>

                  <div style={styles.bookingActions}>
                    <Link to={`/technicians/${booking.technician?._id}`} style={styles.actionLink}>
                      View Technician
                    </Link>
                    {booking.status === 'pending' && (
                      <button style={styles.cancelBtn} onClick={() => handleCancel(booking._id)}>
                        Cancel
                      </button>
                    )}
                    {booking.status === 'completed' && (
                      <button className="btn btn-primary btn-sm" onClick={() => setReviewBooking(booking)}>
                        ⭐ Leave Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
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
  body: { padding: '40px 0 80px' },
  filterTabs: { display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' },
  filterTab: {
    padding: '9px 16px', borderRadius: 50, border: '2px solid #E5E7EB',
    background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500,
    color: '#6B7280', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
  },
  filterTabActive: { background: '#FF5C35', borderColor: '#FF5C35', color: 'white' },
  filterCount: {
    borderRadius: 50, padding: '1px 7px', fontSize: 11, fontWeight: 700,
  },
  loadingWrap: { display: 'flex', justifyContent: 'center', padding: 60 },
  empty: { textAlign: 'center', padding: 80, color: '#374151' },
  emptyIcon: { fontSize: 72, marginBottom: 16 },
  bookingsList: { display: 'flex', flexDirection: 'column', gap: 16 },
  bookingCard: {
    background: 'white', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  bookingTop: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 },
  bookingIcon: {
    width: 48, height: 48, borderRadius: 12,
    background: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, flexShrink: 0,
  },
  bookingInfo: { flex: 1 },
  bookingService: { fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: 0.5, color: '#FF5C35' },
  bookingTech: { color: '#374151', fontSize: 15, fontWeight: 600 },
  statusBadge: {
    borderRadius: 50, padding: '6px 14px', fontSize: 12, fontWeight: 600,
  },
  problem: { color: '#6B7280', fontSize: 14, lineHeight: 1.6, marginBottom: 14 },
  bookingMeta: { display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16, paddingTop: 14, borderTop: '1px solid #F3F4F6' },
  metaItem: { color: '#374151', fontSize: 13 },
  bookingActions: { display: 'flex', gap: 12, alignItems: 'center' },
  actionLink: { color: '#FF5C35', fontSize: 14, fontWeight: 600, textDecoration: 'none' },
  cancelBtn: {
    background: 'none', border: 'none', color: '#EF4444',
    fontSize: 14, fontWeight: 500, cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24,
  },
  modal: {
    background: 'white', borderRadius: 20, padding: 32,
    maxWidth: 440, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
  },
  modalTitle: { fontFamily: 'Syne, sans-serif', fontSize: 22, marginBottom: 6 },
  modalSub: { color: '#6B7280', fontSize: 14, marginBottom: 20 },
  starsRow: { display: 'flex', gap: 8, marginBottom: 20 },
  starBtn: { background: 'none', border: 'none', fontSize: 36, cursor: 'pointer' },
};
