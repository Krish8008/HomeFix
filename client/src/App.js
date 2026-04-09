import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterTechnician from './pages/RegisterTechnician';
import Services from './pages/Services';
import TechnicianList from './pages/TechnicianList';
import TechnicianDetail from './pages/TechnicianDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import TechnicianDashboard from './pages/TechnicianDashboard';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

const TechRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  return user?.role === 'technician' ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-technician" element={<RegisterTechnician />} />
        <Route path="/services" element={<Services />} />
        <Route path="/technicians" element={<TechnicianList />} />
        <Route path="/technicians/:id" element={<TechnicianDetail />} />
        <Route path="/book/:technicianId" element={<PrivateRoute><BookingForm /></PrivateRoute>} />
        <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        <Route path="/dashboard" element={<TechRoute><TechnicianDashboard /></TechRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
