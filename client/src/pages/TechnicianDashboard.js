import React, { useState, useEffect } from 'react';
import { bookingAPI, technicianAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#D97706', bg: '#FEF3C7' },
  confirmed: { label: 'Confirmed', color: '#2563EB', bg: '#DBEAFE' },
  in_progress: { label: 'In Progress', color: '#7C3AED', bg: '#EDE9FE' },
  completed: { label: 'Completed', color: '#059669', bg: '#D1FAE5' },
  cancelled: { label: 'Cancelled', color: '#DC2626', bg: '#FEE2E2' },
};

const NEXT_STATUS = {
  pending: 'confirmed',
  confirmed: 'in_progress',
  in_progress: 'completed',
};

const NEXT_LABEL = {
  pending: '✅ Confirm',
  confirmed: '▶ Start Job',
  in_progress: '🏁 Mark Complete',
};

export default function TechnicianDashboard() {
  const { user, technicianProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [finalCostModal, setFinalCostModal] = useState(null);
  const [finalCost, setFinalCost] = useState('');

  const fetchData = async () => {
    try {
      const res = await bookingAPI.getTechnicianBookings();
      setBookings(res.data);
      if (technicianProfile) setAvailable(technicianProfile.isAvailable);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusUpdate = async (booking, status) => {
    if (status === 'completed') {
      setFinalCostModal(booking);
      return;
    }
    setUpdating(booking._id);
    await bookingAPI.updateStatus(booking._id, { status });
    await fetchData();
    setUpdating(null);
  };

  const handleComplete = async () => {
    setUpdating(finalCostModal._id);
    await bookingAPI.updateStatus(finalCostModal._id, { status: 'completed', finalCost: parseFloat(finalCost) || 0 });
    setFinalCostModal(null); setFinalCost('');
    await fetchData();
    setUpdating(null);
  };

  const toggleAvailability = async () => {
    await technicianAPI.toggleAvailability();
    setAvailable(!available);
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    active: bookings.filter(b => ['confirmed','in_progress'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'completed').length,
    earned: bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.finalCost || 0), 0),
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div className="container">
          <div style={styles.headerContent}>
            <div>
              <h1 style={styles.title}>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
              <p style={styles.subtitle}>Manage your bookings and availability</p>
            </div>
            <div style={styles.availToggle}>
              <span style={styles.availLabel}>Availability:</span>
              <button
                style={{ ...styles.toggleBtn, background: available ? '#10B981' : '#EF4444' }}
                onClick={toggleAvailability}>
                {available ? '🟢 Available' : '🔴 Unavailable'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={styles.body}>
        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Bookings', value: stats.total, icon: '📋', color: '#3B82F6' },
            { label: 'Pending', value: stats.pending, icon: '⏳', color: '#F59E0B' },
            { label: 'Active Jobs', value: stats.active, icon: '🔨', color: '#8B5CF6' },
            { label: 'Completed', value: stats.completed, icon: '✅', color: '#10B981' },
            { label: 'Total Earned', value: `₹${stats.earned.toLocaleString()}`, icon: '💰', color: '#FF5C35' },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: s.color + '18', color: s.color }}>{s.icon}</div>
              <div>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={styles.filterTabs}>
          {['all', 'pending', 'confirmed', 'in_progress', 'completed'].map(f => (
            <button key={f}
              style={{ ...styles.filterTab, ...(filter === f ? styles.filterTabActive : {}) }}
              onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>📭</div>
            <h3>No bookings here</h3>
            <p style={{ color: '#6B7280' }}>New bookings will appear here</p>
          </div>
        ) : (
          <div style={styles.bookingsList}>
            {filtered.map(booking => {
              const sc = STATUS_CONFIG[booking.status];
              const nextStatus = NEXT_STATUS[booking.status];
              return (
                <div key={booking._id} style={styles.bookingCard}>
                  <div style={styles.bookingHeader}>
                    <div>
                      <div style={styles.bookingId}>#{booking._id.slice(-6).toUpperCase()}</div>
                      <div style={styles.bookingService}>{booking.serviceCategory?.replace('_', ' ')}</div>
                    </div>
                    <div style={{ ...styles.statusBadge, color: sc.color, background: sc.bg }}>{sc.label}</div>
                  </div>

                  {/* Customer Info */}
                  <div style={styles.customerInfo}>
                    <div style={styles.customerAvatar}>{booking.user?.name?.charAt(0)}</div>
                    <div>
                      <div style={styles.customerName}>{booking.user?.name}</div>
                      <div style={styles.customerContact}>
                        📞 {booking.user?.phone || 'Not provided'} &nbsp;&nbsp; 📧 {booking.user?.email}
                      </div>
                    </div>
                  </div>

                  <div style={styles.problemBox}>{booking.problemDescription}</div>

                  <div style={styles.bookingMeta}>
                    <span>📅 {new Date(booking.appointmentDate).toLocaleDateString('en-IN', { day:'numeric',month:'short',year:'numeric' })}</span>
                    <span>⏰ {booking.timeSlot}</span>
                    <span>📍 {booking.address}, {booking.city}</span>
                    {booking.finalCost > 0 && <span>💰 ₹{booking.finalCost}</span>}
                  </div>

                  {nextStatus && (
                    <div style={styles.actionRow}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStatusUpdate(booking, nextStatus)}
                        disabled={updating === booking._id}>
                        {updating === booking._id ? '...' : NEXT_LABEL[booking.status]}
                      </button>
                      {booking.status === 'pending' && (
                        <button className="btn btn-sm" style={styles.declineBtn}
                          onClick={() => bookingAPI.updateStatus(booking._id, { status: 'cancelled' }).then(fetchData)}>
                          Decline
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Final Cost Modal */}
      {finalCostModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Mark Job Complete</h3>
            <p style={styles.modalSub}>Enter the final amount charged for this job.</p>
            <div className="form-group">
              <label>Final Cost (₹)</label>
              <input className="form-control" type="number" min="0" placeholder="Enter amount"
                value={finalCost} onChange={e => setFinalCost(e.target.value)} autoFocus />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-outline" onClick={() => setFinalCostModal(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleComplete} style={{ flex: 1, justifyContent: 'center' }}>
                ✅ Complete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#F8F7F4' },
  header: {
    background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
    padding: '48px 0 36px',
  },
  headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 32, color: 'white', marginBottom: 4 },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 15 },
  availToggle: { display: 'flex', alignItems: 'center', gap: 12 },
  availLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  toggleBtn: {
    color: 'white', border: 'none', padding: '10px 20px',
    borderRadius: 50, fontWeight: 600, fontSize: 14, cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
  },
  body: { padding: '32px 0 80px' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 32,
  },
  statCard: {
    background: 'white', borderRadius: 14, padding: 20,
    display: 'flex', gap: 12, alignItems: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  statIcon: {
    width: 44, height: 44, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
  },
  statValue: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22 },
  statLabel: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  filterTabs: { display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  filterTab: {
    padding: '9px 18px', borderRadius: 50, border: '2px solid #E5E7EB',
    background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#6B7280',
  },
  filterTabActive: { background: '#FF5C35', borderColor: '#FF5C35', color: 'white' },
  bookingsList: { display: 'flex', flexDirection: 'column', gap: 16 },
  bookingCard: {
    background: 'white', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  bookingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  bookingId: { color: '#9CA3AF', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 2 },
  bookingService: { fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, textTransform: 'capitalize' },
  statusBadge: { borderRadius: 50, padding: '6px 14px', fontSize: 12, fontWeight: 600 },
  customerInfo: { display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14, padding: '14px', background: '#F8F7F4', borderRadius: 10 },
  customerAvatar: {
    width: 40, height: 40, borderRadius: '50%', background: '#1A1A2E',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0,
  },
  customerName: { fontWeight: 600, fontSize: 15, marginBottom: 2 },
  customerContact: { color: '#6B7280', fontSize: 13 },
  problemBox: {
    background: '#FFFBF0', border: '1px solid #FDE68A', borderRadius: 10,
    padding: '12px 16px', color: '#78350F', fontSize: 14, lineHeight: 1.6, marginBottom: 14,
  },
  bookingMeta: { display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13, color: '#374151', marginBottom: 16, paddingTop: 14, borderTop: '1px solid #F3F4F6' },
  actionRow: { display: 'flex', gap: 12, alignItems: 'center' },
  declineBtn: {
    background: '#FEE2E2', color: '#DC2626', border: 'none',
    padding: '8px 16px', borderRadius: 50, fontSize: 13, fontWeight: 500, cursor: 'pointer',
  },
  empty: { textAlign: 'center', padding: 60, color: '#374151' },
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24,
  },
  modal: {
    background: 'white', borderRadius: 20, padding: 32, maxWidth: 420, width: '100%',
    boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
  },
  modalTitle: { fontFamily: 'Syne, sans-serif', fontSize: 22, marginBottom: 6 },
  modalSub: { color: '#6B7280', fontSize: 14, marginBottom: 20 },
};
