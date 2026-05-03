import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🔧</span>
          <span style={styles.logoText}>Home<span style={styles.logoAccent}>Fix</span></span>
        </Link>

        <div style={styles.links}>
          <Link to="/services" style={{ ...styles.link, ...(isActive('/services') ? styles.linkActive : {}) }}>Services</Link>
          <Link to="/technicians" style={{ ...styles.link, ...(isActive('/technicians') ? styles.linkActive : {}) }}>Find Technicians</Link>
          {user && user.role === 'user' && (
            <Link to="/my-bookings" style={{ ...styles.link, ...(isActive('/my-bookings') ? styles.linkActive : {}) }}>My Bookings</Link>
          )}
          {user && user.role === 'technician' && (
            <Link to="/dashboard" style={{ ...styles.link, ...(isActive('/dashboard') ? styles.linkActive : {}) }}>Dashboard</Link>
          )}
        </div>

        <div style={styles.actions}>
          {user ? (
            <div style={styles.userMenu}>
              <div style={styles.userAvatar} onClick={() => setMenuOpen(!menuOpen)}>
                <span style={styles.avatarText}>{user.name?.charAt(0).toUpperCase()}</span>
              </div>
              {menuOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <div style={styles.dropdownName}>{user.name}</div>
                    <div style={styles.dropdownRole}>{user.role}</div>
                  </div>
                  <hr style={styles.dropdownDivider} />
                  {user.role === 'user' && (
                    <Link to="/my-bookings" style={styles.dropdownItem} onClick={() => setMenuOpen(false)}>📋 My Bookings</Link>
                  )}
                  {user.role === 'technician' && (
                    <Link to="/dashboard" style={styles.dropdownItem} onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
                  )}
                  <button onClick={handleLogout} style={styles.dropdownItemBtn}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/services" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Services</Link>
          <Link to="/technicians" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Find Technicians</Link>
          {user ? (
            <>
              {user.role === 'user' && <Link to="/my-bookings" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Bookings</Link>}
              {user.role === 'technician' && <Link to="/dashboard" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>}
              <button onClick={handleLogout} style={styles.mobileLinkBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    background: '#1A1A2E',
    position: 'sticky', top: 0, zIndex: 1000,
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
  },
  container: {
    maxWidth: 1200, margin: '0 auto', padding: '0 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: 68,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    textDecoration: 'none',
  },
  logoIcon: { fontSize: 28 },
  logoText: {
    fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: 'white',
  },
  logoAccent: { color: '#FF5C35' },
  links: {
    display: 'flex', gap: 8,
    '@media(max-width:768px)': { display: 'none' },
  },
  link: {
    color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
    padding: '8px 14px', borderRadius: 50, fontSize: 14, fontWeight: 500,
    transition: 'all 0.2s',
  },
  linkActive: { color: 'white', background: 'rgba(255,255,255,0.1)' },
  actions: { display: 'flex', alignItems: 'center', gap: 12 },
  loginBtn: {
    color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
    padding: '8px 18px', fontSize: 14, fontWeight: 500,
  },
  registerBtn: {
    background: '#FF5C35', color: 'white', textDecoration: 'none',
    padding: '9px 20px', borderRadius: 50, fontSize: 14, fontWeight: 500,
    boxShadow: '0 4px 12px rgba(255,92,53,0.4)',
  },
  userMenu: { position: 'relative' },
  userAvatar: {
    width: 40, height: 40, borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF5C35, #FFB800)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
  avatarText: { color: 'white', fontWeight: 700, fontSize: 16 },
  dropdown: {
    position: 'absolute', top: 50, right: 0,
    background: 'white', borderRadius: 12, minWidth: 200,
    boxShadow: '0 8px 40px rgba(0,0,0,0.15)', overflow: 'hidden',
    zIndex: 100,
  },
  dropdownHeader: { padding: '16px 16px 12px' },
  dropdownName: { fontWeight: 600, fontSize: 15 },
  dropdownRole: { fontSize: 12, color: '#6B7280', textTransform: 'capitalize', marginTop: 2 },
  dropdownDivider: { border: 'none', borderTop: '1px solid #F3F4F6', margin: 0 },
  dropdownItem: {
    display: 'block', padding: '12px 16px', color: '#374151',
    textDecoration: 'none', fontSize: 14, transition: 'background 0.15s',
  },
  dropdownItemBtn: {
    display: 'block', width: '100%', textAlign: 'left',
    padding: '12px 16px', color: '#EF4444', background: 'none',
    border: 'none', fontSize: 14, cursor: 'pointer',
  },
  hamburger: {
    display: 'none', background: 'none', border: 'none',
    color: 'white', fontSize: 24, cursor: 'pointer',
  },
  mobileMenu: {
    background: '#16162A', padding: '12px 24px 20px',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  mobileLink: {
    color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
    padding: '10px 0', fontSize: 15, borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  mobileLinkBtn: {
    background: 'none', border: 'none', color: '#FF5C35',
    padding: '10px 0', fontSize: 15, textAlign: 'left', cursor: 'pointer',
  },
};
