import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [technicianProfile, setTechnicianProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser && savedUser !== 'undefined') {
        setUser(JSON.parse(savedUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const savedTech = localStorage.getItem('technicianProfile');
        if (savedTech && savedTech !== 'undefined') {
          setTechnicianProfile(JSON.parse(savedTech));
        }
      }
    } catch (err) {
      console.log('Auth restore error:', err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token, userData, techProfile = null) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    if (techProfile) {
      localStorage.setItem('technicianProfile', JSON.stringify(techProfile));
      setTechnicianProfile(techProfile);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('technicianProfile');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setTechnicianProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, technicianProfile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);