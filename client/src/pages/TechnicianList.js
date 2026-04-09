import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { technicianAPI } from '../utils/api';

const CATEGORIES = [
  { id: '', name: 'All Services' },
  { id: 'plumbing', name: '🔧 Plumbing' }, { id: 'electrician', name: '⚡ Electrician' },
  { id: 'carpenter', name: '🪚 Carpenter' }, { id: 'painting', name: '🎨 Painting' },
  { id: 'cleaning', name: '🧹 Cleaning' }, { id: 'ac_repair', name: '❄️ AC Repair' },
  { id: 'appliance_repair', name: '🔌 Appliances' }, { id: 'pest_control', name: '🐛 Pest Control' },
];

const Stars = ({ rating }) => (
  <span>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.round(rating) ? '#FFB800' : '#D1D5DB', fontSize: 14 }}>★</span>
    ))}
  </span>
);

export default function TechnicianList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const fetchTechs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (city) params.city = city;
      if (category) params.category = category;
      const res = await technicianAPI.getAll(params);
      setTechnicians(res.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTechs(); }, []);

  const handleFilter = () => {
    const p = {};
    if (city) p.city = city;
    if (category) p.category = category;
    setSearchParams(p);
    fetchTechs();
  };

  return (
    <div>
      <div style={styles.header}>
        <div className="container">
          <h1 style={styles.title}>Find Technicians</h1>
          <p style={styles.subtitle}>Browse verified professionals near you</p>
          <div style={styles.filterBar}>
            <select style={styles.filterSelect} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input
              style={styles.filterInput}
              placeholder="Enter city..."
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFilter()}
            />
            <button style={styles.filterBtn} onClick={handleFilter}>Search</button>
          </div>
        </div>
      </div>

      <div style={styles.body}>
        <div className="container">
          {/* Category Pills */}
          <div style={styles.pills}>
            {CATEGORIES.map(c => (
              <button key={c.id}
                style={{ ...styles.pill, ...(category === c.id ? styles.pillActive : {}) }}
                onClick={() => { setCategory(c.id); }}>
                {c.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={styles.loading}><div className="spinner" /></div>
          ) : technicians.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>🔍</div>
              <h3>No technicians found</h3>
              <p>Try a different city or service category</p>
            </div>
          ) : (
            <>
              <div style={styles.count}>{technicians.length} technician{technicians.length !== 1 ? 's' : ''} found</div>
              <div style={styles.grid}>
                {technicians.map(tech => (
                  <Link key={tech._id} to={`/technicians/${tech._id}`} style={styles.card}>
                    <div style={styles.cardTop}>
                      <div style={styles.avatar}>
                        {tech.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.info}>
                        <div style={styles.name}>{tech.user?.name}</div>
                        <div style={styles.service}>{tech.serviceCategory?.replace('_', ' ')}</div>
                        <div style={styles.ratingRow}>
                          <Stars rating={tech.rating} />
                          <span style={styles.ratingNum}>{tech.rating > 0 ? tech.rating : 'New'}</span>
                          <span style={styles.reviews}>({tech.totalReviews} reviews)</span>
                        </div>
                      </div>
                      <div style={styles.rate}>₹{tech.hourlyRate}<span style={styles.rateUnit}>/hr</span></div>
                    </div>

                    <div style={styles.cardMeta}>
                      <span style={styles.metaItem}>📍 {tech.city}{tech.area ? `, ${tech.area}` : ''}</span>
                      <span style={styles.metaItem}>💼 {tech.experience || 0}y exp</span>
                      <span style={styles.metaItem}>✅ {tech.totalJobs} jobs</span>
                    </div>

                    {tech.skills?.length > 0 && (
                      <div style={styles.skills}>
                        {tech.skills.slice(0, 3).map(s => (
                          <span key={s} style={styles.skill}>{s}</span>
                        ))}
                        {tech.skills.length > 3 && <span style={styles.skill}>+{tech.skills.length - 3}</span>}
                      </div>
                    )}

                    <div style={styles.cardFooter}>
                      <span style={{ ...styles.availability, color: tech.isAvailable ? '#059669' : '#DC2626' }}>
                        {tech.isAvailable ? '🟢 Available' : '🔴 Busy'}
                      </span>
                      <span style={styles.viewProfile}>View Profile →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
    padding: '60px 0 40px',
  },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 40, color: 'white', marginBottom: 8 },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 17, marginBottom: 28 },
  filterBar: {
    display: 'flex', gap: 12, maxWidth: 580, flexWrap: 'wrap',
  },
  filterSelect: {
    padding: '12px 16px', borderRadius: 10, border: 'none',
    fontSize: 14, fontFamily: 'DM Sans, sans-serif', background: 'white',
    color: '#374151', cursor: 'pointer', outline: 'none',
  },
  filterInput: {
    flex: 1, padding: '12px 16px', borderRadius: 10, border: 'none',
    fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', minWidth: 160,
  },
  filterBtn: {
    background: '#FF5C35', color: 'white', border: 'none',
    padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
  },
  body: { padding: '40px 0 80px' },
  pills: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  pill: {
    padding: '8px 16px', borderRadius: 50, fontSize: 13, fontWeight: 500,
    border: '2px solid #E5E7EB', background: 'white', cursor: 'pointer', color: '#374151',
    transition: 'all 0.15s',
  },
  pillActive: { background: '#FF5C35', borderColor: '#FF5C35', color: 'white' },
  count: { color: '#6B7280', fontSize: 14, marginBottom: 20 },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20,
  },
  card: {
    background: 'white', borderRadius: 16, padding: 20,
    textDecoration: 'none', color: 'inherit',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'all 0.2s', display: 'block',
    border: '2px solid transparent',
  },
  cardTop: { display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 },
  avatar: {
    width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #FF5C35, #FFB800)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20,
  },
  info: { flex: 1 },
  name: { fontWeight: 700, fontSize: 16, marginBottom: 2 },
  service: { color: '#6B7280', fontSize: 13, textTransform: 'capitalize', marginBottom: 5 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 6 },
  ratingNum: { fontWeight: 600, fontSize: 13 },
  reviews: { color: '#9CA3AF', fontSize: 12 },
  rate: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#FF5C35', flexShrink: 0 },
  rateUnit: { fontSize: 12, fontWeight: 400, color: '#9CA3AF' },
  cardMeta: { display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #F3F4F6' },
  metaItem: { color: '#6B7280', fontSize: 13 },
  skills: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  skill: {
    background: '#F3F4F6', color: '#374151', borderRadius: 50,
    padding: '3px 10px', fontSize: 12,
  },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  availability: { fontSize: 13, fontWeight: 500 },
  viewProfile: { color: '#FF5C35', fontSize: 13, fontWeight: 600 },
  loading: { display: 'flex', justifyContent: 'center', padding: '80px 0' },
  empty: { textAlign: 'center', padding: '80px 0', color: '#6B7280' },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
};
