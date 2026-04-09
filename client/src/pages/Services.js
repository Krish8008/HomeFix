import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceAPI } from '../utils/api';

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => { serviceAPI.getAll().then(r => setServices(r.data)); }, []);

  return (
    <div>
      <div style={styles.header}>
        <div className="container">
          <h1 style={styles.title}>Our Services</h1>
          <p style={styles.subtitle}>Professional home services by verified experts</p>
        </div>
      </div>
      <div style={styles.body}>
        <div className="container">
          <div style={styles.grid}>
            {services.map(service => (
              <div key={service.id} style={styles.card}>
                <div style={{ ...styles.iconWrap, background: service.color + '18' }}>
                  <span style={styles.icon}>{service.icon}</span>
                </div>
                <h2 style={styles.name}>{service.name}</h2>
                <p style={styles.desc}>{service.description}</p>
                <div style={styles.features}>
                  {['Verified Pros', 'Same Day', 'Best Price', '24/7 Support'].map(f => (
                    <span key={f} style={styles.feature}>✓ {f}</span>
                  ))}
                </div>
                <Link to={`/technicians?category=${service.id}`}
                  style={{ ...styles.btn, background: service.color }}>
                  Find {service.name} Experts →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    background: 'linear-gradient(135deg, #1A1A2E, #0F3460)',
    padding: '60px 0 40px', color: 'white',
  },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 40, color: 'white', marginBottom: 8 },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 17 },
  body: { padding: '60px 0' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 28,
  },
  card: {
    background: 'white', borderRadius: 20, padding: 28,
    boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  iconWrap: {
    width: 72, height: 72, borderRadius: 18,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  icon: { fontSize: 34 },
  name: { fontFamily: 'Syne, sans-serif', fontSize: 22, marginBottom: 8, color: '#1A1A2E' },
  desc: { color: '#6B7280', fontSize: 14, lineHeight: 1.6, marginBottom: 18 },
  features: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  feature: {
    background: '#F3F4F6', color: '#374151', borderRadius: 50,
    padding: '4px 10px', fontSize: 12, fontWeight: 500,
  },
  btn: {
    display: 'block', textAlign: 'center', color: 'white',
    padding: '12px 20px', borderRadius: 50, textDecoration: 'none',
    fontWeight: 600, fontSize: 14, transition: 'opacity 0.2s',
  },
};
