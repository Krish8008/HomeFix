import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { technicianAPI, reviewAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Stars = ({ rating, size = 16 }) => (
  <span>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.round(rating) ? '#FFB800' : '#D1D5DB', fontSize: size }}>★</span>
    ))}
  </span>
);

export default function TechnicianDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tech, setTech] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    Promise.all([
      technicianAPI.getById(id),
      reviewAPI.getByTechnician(id)
    ]).then(([techRes, reviewRes]) => {
      setTech(techRes.data);
      setReviews(reviewRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={styles.loading}><div className="spinner" /></div>;
  if (!tech) return <div style={styles.loading}><p>Technician not found</p></div>;

  const serviceBg = {
    plumbing: '#3B82F6', electrician: '#F59E0B', carpenter: '#92400E',
    painting: '#EC4899', cleaning: '#10B981', ac_repair: '#06B6D4',
    appliance_repair: '#8B5CF6', pest_control: '#EF4444'
  }[tech.serviceCategory] || '#FF5C35';

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={{ ...styles.hero, background: `linear-gradient(135deg, ${serviceBg}22, #1A1A2E)` }}>
        <div className="container">
          <div style={styles.heroContent}>
            <div style={styles.avatar}>
              {tech.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={styles.heroInfo}>
              <div style={styles.heroName}>{tech.user?.name}</div>
              <div style={styles.heroService}>{tech.serviceCategory?.replace('_', ' ').toUpperCase()}</div>
              <div style={styles.heroMeta}>
                <Stars rating={tech.rating} size={18} />
                <span style={styles.heroRating}>{tech.rating > 0 ? tech.rating : 'New'}</span>
                <span style={styles.heroReviews}>({tech.totalReviews} reviews)</span>
                <span style={styles.heroDot}>•</span>
                <span style={styles.heroJobs}>{tech.totalJobs} jobs done</span>
                <span style={styles.heroDot}>•</span>
                <span style={styles.heroExp}>{tech.experience || 0} yrs exp</span>
              </div>
              <div style={styles.heroCity}>📍 {tech.city}{tech.area ? `, ${tech.area}` : ''}</div>
            </div>
            <div style={styles.heroRight}>
              <div style={styles.rate}>₹{tech.hourlyRate}<span style={styles.rateUnit}>/hour</span></div>
              <span style={{ color: tech.isAvailable ? '#10B981' : '#EF4444', fontWeight: 600, fontSize: 15 }}>
                {tech.isAvailable ? '🟢 Available Now' : '🔴 Currently Busy'}
              </span>
              {user && user.role === 'user' && tech.isAvailable && (
                <Link to={`/book/${tech._id}`} style={styles.bookBtn}>
                  📅 Book Appointment
                </Link>
              )}
              {!user && (
                <Link to="/login" style={styles.bookBtn}>Login to Book</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div style={styles.body}>
          <div style={styles.mainContent}>
            {/* Tabs */}
            <div style={styles.tabs}>
              {['about', 'reviews'].map(tab => (
                <button key={tab} style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
                  onClick={() => setActiveTab(tab)}>
                  {tab === 'about' ? '📋 About' : `⭐ Reviews (${reviews.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'about' && (
              <div style={styles.section}>
                {tech.bio && (
                  <div style={styles.infoCard}>
                    <h3 style={styles.infoTitle}>About</h3>
                    <p style={styles.bioText}>{tech.bio}</p>
                  </div>
                )}

                {tech.skills?.length > 0 && (
                  <div style={styles.infoCard}>
                    <h3 style={styles.infoTitle}>Skills & Expertise</h3>
                    <div style={styles.skillsWrap}>
                      {tech.skills.map(s => <span key={s} style={styles.skillBadge}>{s}</span>)}
                    </div>
                  </div>
                )}

                <div style={styles.infoCard}>
                  <h3 style={styles.infoTitle}>Availability</h3>
                  <div style={styles.daysWrap}>
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
                      const full = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i];
                      const avail = tech.availableDays?.includes(full);
                      return (
                        <div key={d} style={{ ...styles.dayChip, ...(avail ? styles.dayChipActive : styles.dayChipOff) }}>
                          {d}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={styles.section}>
                {reviews.length === 0 ? (
                  <div style={styles.noReviews}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review._id} style={styles.reviewCard}>
                      <div style={styles.reviewHeader}>
                        <div style={styles.reviewAvatar}>{review.user?.name?.charAt(0)}</div>
                        <div>
                          <div style={styles.reviewName}>{review.user?.name}</div>
                          <div style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div style={{ marginLeft: 'auto' }}><Stars rating={review.rating} /></div>
                      </div>
                      {review.comment && <p style={styles.reviewComment}>{review.comment}</p>}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={styles.sidebar}>
            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>Quick Info</h3>
              {[
                { label: 'Service', value: tech.serviceCategory?.replace('_', ' ') },
                { label: 'Experience', value: `${tech.experience || 0} years` },
                { label: 'Jobs Done', value: tech.totalJobs },
                { label: 'Rating', value: tech.rating > 0 ? `${tech.rating}/5` : 'New' },
                { label: 'Hourly Rate', value: `₹${tech.hourlyRate}` },
                { label: 'City', value: tech.city },
              ].map(item => (
                <div key={item.label} style={styles.infoRow}>
                  <span style={styles.infoLabel}>{item.label}</span>
                  <span style={styles.infoValue}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>Contact</h3>
              <div style={styles.contactItem}>📧 {tech.user?.email}</div>
              {tech.user?.phone && <div style={styles.contactItem}>📞 {tech.user?.phone}</div>}
            </div>

            {user && user.role === 'user' && tech.isAvailable && (
              <Link to={`/book/${tech._id}`} style={styles.bookBtnSide}>
                📅 Book Appointment
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#F8F7F4' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  hero: { padding: '48px 0', borderBottom: '1px solid #E5E7EB' },
  heroContent: { display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' },
  avatar: {
    width: 100, height: 100, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #FF5C35, #FFB800)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 40,
    boxShadow: '0 8px 24px rgba(255,92,53,0.3)',
  },
  heroInfo: { flex: 1 },
  heroName: { fontFamily: 'Syne, sans-serif', fontSize: 32, color: '#1A1A2E', marginBottom: 4 },
  heroService: { color: '#FF5C35', fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 10 },
  heroMeta: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 },
  heroRating: { fontWeight: 700, fontSize: 15 },
  heroReviews: { color: '#6B7280', fontSize: 13 },
  heroDot: { color: '#D1D5DB' },
  heroJobs: { color: '#6B7280', fontSize: 13 },
  heroExp: { color: '#6B7280', fontSize: 13 },
  heroCity: { color: '#6B7280', fontSize: 14 },
  heroRight: { display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' },
  rate: { fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: '#FF5C35' },
  rateUnit: { fontSize: 14, fontWeight: 400, color: '#9CA3AF' },
  bookBtn: {
    background: '#FF5C35', color: 'white', textDecoration: 'none',
    padding: '14px 28px', borderRadius: 50, fontWeight: 700, fontSize: 15,
    boxShadow: '0 6px 20px rgba(255,92,53,0.35)', display: 'block', textAlign: 'center',
  },
  body: { padding: '40px 0 80px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 },
  mainContent: {},
  tabs: { display: 'flex', gap: 4, marginBottom: 24, background: 'white', borderRadius: 12, padding: 4, width: 'fit-content' },
  tab: {
    padding: '10px 20px', borderRadius: 10, border: 'none',
    fontSize: 14, fontWeight: 500, cursor: 'pointer',
    background: 'transparent', color: '#6B7280', transition: 'all 0.15s',
  },
  tabActive: { background: '#FF5C35', color: 'white' },
  section: { display: 'flex', flexDirection: 'column', gap: 20 },
  infoCard: {
    background: 'white', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  infoTitle: { fontFamily: 'Syne, sans-serif', fontSize: 18, marginBottom: 14, color: '#1A1A2E' },
  bioText: { color: '#374151', lineHeight: 1.7, fontSize: 15 },
  skillsWrap: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  skillBadge: {
    background: '#FFF0ED', color: '#FF5C35', borderRadius: 50,
    padding: '6px 14px', fontSize: 13, fontWeight: 500,
  },
  daysWrap: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  dayChip: {
    padding: '8px 14px', borderRadius: 50, fontSize: 13, fontWeight: 600,
  },
  dayChipActive: { background: '#D1FAE5', color: '#065F46' },
  dayChipOff: { background: '#F3F4F6', color: '#9CA3AF' },
  noReviews: { textAlign: 'center', padding: 40, color: '#6B7280', background: 'white', borderRadius: 16 },
  reviewCard: {
    background: 'white', borderRadius: 16, padding: 20,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16,
  },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 },
  reviewAvatar: {
    width: 36, height: 36, borderRadius: '50%', background: '#1A1A2E',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0,
  },
  reviewName: { fontWeight: 600, fontSize: 14 },
  reviewDate: { color: '#9CA3AF', fontSize: 12 },
  reviewComment: { color: '#374151', fontSize: 14, lineHeight: 1.6 },
  sidebar: { display: 'flex', flexDirection: 'column', gap: 20 },
  sideCard: {
    background: 'white', borderRadius: 16, padding: 20,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  sideTitle: { fontFamily: 'Syne, sans-serif', fontSize: 17, marginBottom: 16, color: '#1A1A2E' },
  infoRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0', borderBottom: '1px solid #F3F4F6', fontSize: 14,
  },
  infoLabel: { color: '#6B7280' },
  infoValue: { fontWeight: 600, textTransform: 'capitalize' },
  contactItem: { color: '#374151', fontSize: 14, padding: '6px 0' },
  bookBtnSide: {
    background: '#FF5C35', color: 'white', textDecoration: 'none',
    padding: '16px', borderRadius: 14, fontWeight: 700, fontSize: 16,
    textAlign: 'center', display: 'block',
    boxShadow: '0 6px 20px rgba(255,92,53,0.35)',
  },
};
