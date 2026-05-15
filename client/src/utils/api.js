import axios from 'axios';

const API = axios.create({ 
  baseURL: `${process.env.REACT_APP_API_URL}/api` 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  registerTechnician: (data) => API.post('/auth/register-technician', data),
};

export const technicianAPI = {
  getAll: (params) => API.get('/technicians', { params }),
  getById: (id) => API.get(`/technicians/${id}`),
  updateProfile: (data) => API.put('/technicians/profile', data),
  toggleAvailability: () => API.patch('/technicians/availability'),
};

export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings/my-bookings'),
  getTechnicianBookings: () => API.get('/bookings/technician-bookings'),
  updateStatus: (id, data) => API.patch(`/bookings/${id}/status`, data),
  cancel: (id) => API.delete(`/bookings/${id}`),
  getById: (id) => API.get(`/bookings/${id}`),
};

export const serviceAPI = {
  getAll: () => API.get('/services'),
};

export const reviewAPI = {
  submit: (data) => API.post('/reviews', data),
  getByTechnician: (id) => API.get(`/reviews/technician/${id}`),
};

export const paymentAPI = {
  createOrder: (data) => API.post('/payment/create-order', data),
  verify: (data) => API.post('/payment/verify', data),
};

export default API;