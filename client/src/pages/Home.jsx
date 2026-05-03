import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { serviceAPI, technicianAPI } from '../utils/api';

const SERVICE_COLORS = {
  plumbing: '#3B82F6', electrician: '#F59E0B', carpenter: '#92400E',
  painting: '#EC4899', cleaning: '#10B981', ac_repair: '#06B6D4',
  appliance_repair: '#8B5CF6', pest_control: '#EF4444'
};

export default function Home() {
  const [services, setServices] = useState([]);
  const [topTechs, setTopTechs] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    serviceAPI.getAll().then(r => setServices(r.data));
    technicianAPI.getAll({ minRating: 4 }).then(r => setTopTechs(r.data.slice(0, 3)));
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (searchCategory) params.set('category', searchCategory);
    navigate(`/technicians?${params.toString()}`);
  };

  const stats = [
    { value: '2,500+', label: 'Verified Technicians' },
    { value: '15,000+', label: 'Jobs Completed' },
    { value: '50+', label: 'Cities Covered' },
    { value: '4.8★', label: 'Average Rating' },
  ];

  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🏆 India's #1 Home Service Platform</div>
          <h1 style={styles.heroTitle}>
            Fix Anything At<br />
            <span style={styles.heroAccent}>Your Home</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Connect instantly with verified plumbers, electricians, carpenters & more.<br />
            Book appointments in under 2 minutes.
          </p>

          {/* Search Bar */}
          <div style={styles.searchBox}>
            <select
              style={styles.searchSelect}
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
            >
              <option value="">All Services</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
              ))}
            </select>
            <div style={styles.searchDivider} />
            <input
              style={styles.searchInput}
              placeholder="Enter your city..."
              value={searchCity}
              onChange={e => setSearchCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button style={styles.searchBtn} onClick={handleSearch}>
              🔍 Search
            </button>
          </div>

          <div style={styles.heroTags}>
            {['Plumbing', 'Electrician', 'AC Repair', 'Carpenter', 'Cleaning'].map(tag => (
              <button
                key={tag}
                style={styles.heroTag}
                onClick={() => { setSearchCategory(tag.toLowerCase().replace(' ', '_')); handleSearch(); }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {stats.map((s, i) => (
            <div key={i} style={styles.statItem}>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Our Services</h2>
            <p style={styles.sectionSub}>Professional help for every home need</p>
          </div>
          <div style={styles.servicesGrid}>
            {services.map(service => (
              <Link
                key={service.id}
                to={`/technicians?category=${service.id}`}
                style={styles.serviceCard}
              >
                <div style={{ ...styles.serviceIconWrap, background: service.color + '18', color: service.color }}>
                  <span style={styles.serviceIcon}>{service.icon}</span>
                </div>
                <div style={styles.serviceName}>{service.name}</div>
                <div style={styles.serviceDesc}>{service.description}</div>
                <div style={{ ...styles.serviceArrow, color: service.color }}>Book Now →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.howSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>How It Works</h2>
            <p style={styles.sectionSub}>Get help in 3 simple steps</p>
          </div>
          <div style={styles.stepsGrid}>
            {[
              { step: '01', icon: '🔍', title: 'Search Service', desc: 'Choose the type of service you need and enter your city to find nearby technicians.' },
              { step: '02', icon: '📅', title: 'Book Appointment', desc: 'Pick a verified technician, select your preferred date and time slot, and confirm.' },
              { step: '03', icon: '✅', title: 'Problem Solved', desc: 'The technician arrives, fixes the issue, and you pay only after satisfaction.' },
            ].map((step, i) => (
              <div key={i} style={styles.stepCard}>
                <div style={styles.stepNumber}>{step.step}</div>
                <div style={styles.stepIcon}>{step.icon}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Technicians */}
      {topTechs.length > 0 && (
        <section style={styles.section}>
          <div className="container">
            <div style={{ ...styles.sectionHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h2 style={styles.sectionTitle}>Top Rated Technicians</h2>
                <p style={styles.sectionSub}>Trusted by thousands of homeowners</p>
              </div>
              <Link to="/technicians" style={styles.viewAll}>View All →</Link>
            </div>
            <div style={styles.techGrid}>
              {topTechs.map(tech => (
                <Link key={tech._id} to={`/technicians/${tech._id}`} style={styles.techCard}>
                  <div style={styles.techAvatar}>
                    {tech.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.techInfo}>
                    <div style={styles.techName}>{tech.user?.name}</div>
                    <div style={styles.techService}>{tech.serviceCategory?.replace('_', ' ')}</div>
                    <div style={styles.techMeta}>
                      <span style={styles.techRating}>⭐ {tech.rating || 'New'}</span>
                      <span style={styles.techJobs}>{tech.totalJobs} jobs</span>
                    </div>
                    <div style={styles.techCity}>📍 {tech.city}</div>
                  </div>
                  <div style={styles.techRate}>₹{tech.hourlyRate}/hr</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA for Technicians */}
      <section style={styles.ctaSection}>
        <div className="container">
          <div style={styles.ctaBox}>
            <div style={styles.ctaLeft}>
              <h2 style={styles.ctaTitle}>Are You a Technician?</h2>
              <p style={styles.ctaText}>Join thousands of skilled professionals earning more with HomeFix. Get regular work, flexible hours, and direct payments.</p>
              <div style={styles.ctaBenefits}>
                {['✅ Free registration', '✅ Verified badge', '✅ Regular job leads', '✅ Flexible timing'].map(b => (
                  <span key={b} style={styles.ctaBenefit}>{b}</span>
                ))}
              </div>
            </div>
            <Link to="/register-technician" style={styles.ctaBtn}>
              Join as Technician →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container">
          <div style={styles.footerGrid}>
            <div>
              <div style={styles.footerLogo}>🔧 Home<span style={{ color: '#FF5C35' }}>Fix</span></div>
              <p style={styles.footerTagline}>Your trusted home service partner across India.</p>
            </div>
            <div>
              <div style={styles.footerHeading}>Services</div>
              {['Plumbing', 'Electrician', 'Carpenter', 'Painting', 'AC Repair'].map(s => (
                <div key={s}><Link to={`/technicians?category=${s.toLowerCase()}`} style={styles.footerLink}>{s}</Link></div>
              ))}
            </div>
            <div>
              <div style={styles.footerHeading}>Company</div>
              {['About Us', 'Careers', 'Blog', 'Contact'].map(s => (
                <div key={s}><a href="#" style={styles.footerLink}>{s}</a></div>
              ))}
            </div>
            <div>
              <div style={styles.footerHeading}>Contact</div>
              <div style={styles.footerLink}>📧 support@homefix.in</div>
              <div style={styles.footerLink}>📞 1800-123-4567</div>
              <div style={styles.footerLink}>⏰ 24/7 Support</div>
            </div>
          </div>
          <div style={styles.footerBottom}>
            © 2024 HomeFix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh' },
  hero: {
    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
    minHeight: '90vh', display: 'flex', alignItems: 'center',
    position: 'relative', overflow: 'hidden',
    padding: '80px 24px',
  },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at 70% 50%, rgba(255,92,53,0.12) 0%, transparent 60%)',
  },
  heroContent: {
    maxWidth: 1200, margin: '0 auto', width: '100%',
    position: 'relative', zIndex: 1,
  },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,184,0,0.15)', border: '1px solid rgba(255,184,0,0.3)',
    color: '#FFB800', borderRadius: 50, padding: '6px 16px', fontSize: 13, fontWeight: 500,
    marginBottom: 24,
  },
  heroTitle: {
    fontFamily: 'Syne, sans-serif', fontWeight: 800,
    fontSize: 'clamp(40px, 6vw, 72px)', color: 'white', lineHeight: 1.1,
    marginBottom: 20,
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #FF5C35, #FFB800)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.7)', fontSize: 18, lineHeight: 1.7, marginBottom: 36,
    maxWidth: 560,
  },
  searchBox: {
    display: 'flex', alignItems: 'center',
    background: 'white', borderRadius: 60, overflow: 'hidden',
    maxWidth: 620, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    marginBottom: 24,
  },
  searchSelect: {
    border: 'none', outline: 'none', padding: '16px 20px',
    fontSize: 15, fontFamily: 'DM Sans, sans-serif',
    background: 'transparent', minWidth: 160, cursor: 'pointer',
    color: '#374151',
  },
  searchDivider: { width: 1, height: 28, background: '#E5E7EB' },
  searchInput: {
    border: 'none', outline: 'none', padding: '16px 20px',
    fontSize: 15, fontFamily: 'DM Sans, sans-serif', flex: 1,
    color: '#374151',
  },
  searchBtn: {
    background: 'linear-gradient(135deg, #FF5C35, #E04520)',
    color: 'white', border: 'none', padding: '14px 28px',
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif', borderRadius: '0 60px 60px 0',
    whiteSpace: 'nowrap',
  },
  heroTags: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  heroTag: {
    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.85)', borderRadius: 50, padding: '7px 16px',
    fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
    transition: 'all 0.2s',
  },
  statsSection: {
    background: '#FF5C35', padding: '24px',
  },
  statsGrid: {
    maxWidth: 1200, margin: '0 auto',
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
  },
  statItem: { textAlign: 'center', padding: '12px 20px' },
  statValue: { color: 'white', fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800 },
  statLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
  section: { padding: '80px 0' },
  sectionHeader: { textAlign: 'center', marginBottom: 48 },
  sectionTitle: { fontSize: 36, color: '#1A1A2E', marginBottom: 8 },
  sectionSub: { color: '#6B7280', fontSize: 16 },
  servicesGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20,
  },
  serviceCard: {
    background: 'white', borderRadius: 16, padding: 24,
    textDecoration: 'none', color: 'inherit',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'all 0.25s ease', display: 'block',
    border: '2px solid transparent',
  },
  serviceIconWrap: {
    width: 56, height: 56, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  serviceIcon: { fontSize: 26 },
  serviceName: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 6 },
  serviceDesc: { color: '#6B7280', fontSize: 13, lineHeight: 1.5, marginBottom: 12 },
  serviceArrow: { fontSize: 13, fontWeight: 600 },
  howSection: {
    background: '#1A1A2E', padding: '80px 0',
  },
  stepsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32,
  },
  stepCard: {
    background: 'rgba(255,255,255,0.05)', borderRadius: 20,
    padding: 32, border: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center',
  },
  stepNumber: {
    fontFamily: 'Syne, sans-serif', fontSize: 48, fontWeight: 800,
    color: 'rgba(255,92,53,0.2)', lineHeight: 1, marginBottom: 8,
  },
  stepIcon: { fontSize: 40, marginBottom: 16 },
  stepTitle: { color: 'white', fontSize: 20, marginBottom: 10 },
  stepDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7 },
  viewAll: {
    color: '#FF5C35', textDecoration: 'none', fontWeight: 600, fontSize: 15,
  },
  techGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
  },
  techCard: {
    background: 'white', borderRadius: 16, padding: 20,
    display: 'flex', alignItems: 'center', gap: 16,
    textDecoration: 'none', color: 'inherit',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'all 0.2s',
  },
  techAvatar: {
    width: 56, height: 56, borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF5C35, #FFB800)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22,
    flexShrink: 0,
  },
  techInfo: { flex: 1 },
  techName: { fontWeight: 600, fontSize: 16, marginBottom: 3 },
  techService: { color: '#6B7280', fontSize: 13, textTransform: 'capitalize', marginBottom: 6 },
  techMeta: { display: 'flex', gap: 12, marginBottom: 4 },
  techRating: { fontSize: 13, fontWeight: 500 },
  techJobs: { fontSize: 13, color: '#6B7280' },
  techCity: { fontSize: 13, color: '#6B7280' },
  techRate: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#FF5C35', flexShrink: 0 },
  ctaSection: { padding: '80px 0', background: '#F8F7F4' },
  ctaBox: {
    background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
    borderRadius: 24, padding: '48px 56px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32,
  },
  ctaLeft: { flex: 1 },
  ctaTitle: { color: 'white', fontSize: 32, marginBottom: 12 },
  ctaText: { color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.7, maxWidth: 480, marginBottom: 20 },
  ctaBenefits: { display: 'flex', flexWrap: 'wrap', gap: 12 },
  ctaBenefit: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  ctaBtn: {
    background: '#FF5C35', color: 'white', textDecoration: 'none',
    padding: '16px 32px', borderRadius: 50, fontWeight: 700,
    fontSize: 16, whiteSpace: 'nowrap',
    boxShadow: '0 8px 24px rgba(255,92,53,0.4)',
  },
  footer: { background: '#1A1A2E', padding: '64px 0 32px' },
  footerGrid: {
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48,
  },
  footerLogo: {
    fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24,
    color: 'white', marginBottom: 10,
  },
  footerTagline: { color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6 },
  footerHeading: { color: 'white', fontWeight: 700, marginBottom: 16, fontSize: 15 },
  footerLink: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 8, textDecoration: 'none', display: 'block' },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
    paddingTop: 24, color: 'rgba(255,255,255,0.3)', fontSize: 14, textAlign: 'center',
  },
};
