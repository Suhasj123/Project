import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});

// Interceptor to attach Authorization Token to every outgoing HTTP request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('prep_ai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
