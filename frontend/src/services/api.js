import axios from 'axios';

let rawBaseURL = import.meta.env.VITE_API_BASE_URL || '/api';
if (rawBaseURL.startsWith('http')) {
  rawBaseURL = rawBaseURL.replace(/\/+$/, '');
  if (!rawBaseURL.endsWith('/api')) {
    rawBaseURL = `${rawBaseURL}/api`;
  }
}

const API = axios.create({
  baseURL: rawBaseURL
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
