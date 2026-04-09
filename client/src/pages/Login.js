import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.token, res.data.user, res.data.technicianProfile);
      navigate(res.data.user.role === 'technician' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>🔧</div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your HomeFix account</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              className="form-control"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.links}>
          <span style={styles.linkText}>Don't have an account? </span>
          <Link to="/register" style={styles.link}>Register as User</Link>
          <span style={styles.linkText}> or </span>
          <Link to="/register-technician" style={styles.link}>Join as Technician</Link>
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
    width: '100%', maxWidth: 440,
    boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
  },
  logoWrap: { textAlign: 'center', marginBottom: 32 },
  logo: { fontSize: 48, marginBottom: 12 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 28, color: '#1A1A2E', marginBottom: 6 },
  subtitle: { color: '#6B7280', fontSize: 15 },
  error: {
    background: '#FEE2E2', border: '1px solid #FECACA', color: '#991B1B',
    borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14,
  },
  submitBtn: { width: '100%', justifyContent: 'center', marginTop: 8, padding: '14px' },
  links: { textAlign: 'center', marginTop: 24, fontSize: 14 },
  linkText: { color: '#6B7280' },
  link: { color: '#FF5C35', textDecoration: 'none', fontWeight: 500 },
};
