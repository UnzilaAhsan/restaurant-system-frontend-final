import axios from 'axios';

// Use environment variable with fallback
const API_URL = process.env.REACT_APP_API_URL || 'https://restaurant-system-nce0.onrender.com.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.log('Network error - backend might be down');
    }
    
    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      console.log('Request timeout');
    }
    
    return Promise.reject(error);
  }
);

export default api;