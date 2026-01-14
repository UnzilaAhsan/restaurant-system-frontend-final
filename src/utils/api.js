import axios from 'axios';

// Fixed: Removed extra .com from fallback URL
const API_URL = process.env.REACT_APP_API_URL || 'https://restaurant-system-6.onrender.com';

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

// Enhanced response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (!error.response) {
      // Network error
      console.error('Network Error: Unable to connect to backend');
      return Promise.reject(new Error('Unable to connect to server. Please check your connection.'));
    }
    
    // Handle specific HTTP status codes
    const { status } = error.response;
    
    if (status === 401) {
      console.log('Unauthorized - redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (status === 404) {
      console.error('Endpoint not found:', error.config.url);
    } else if (status === 500) {
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);

export default api;