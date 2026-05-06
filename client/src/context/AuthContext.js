import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [technicianProfile, setTechnicianProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const savedTech = localStorage.getItem('technicianProfile');
      if (savedTech) setTechnicianProfile(JSON.parse(savedTech));
    }
    setLoading(false);
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
