import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api'; // Import the api utility

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Logging in with:', email);
      
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      
      if (response.data.success) {
        const { token, ...userData } = response.data;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set user state
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Fallback to demo data for development
      const demoUsers = {
        'admin@example.com': {
          _id: 'admin123',
          username: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          salary: 75000,
          rank: 'executive',
          phone: '+1 (555) 123-4567',
          address: '123 Admin Street, New York, NY'
        },
        'staff@example.com': {
          _id: 'staff123',
          username: 'Staff Member',
          email: 'staff@example.com',
          role: 'staff',
          salary: 45000,
          rank: 'senior',
          phone: '+1 (555) 987-6543',
          address: '456 Staff Avenue, New York, NY'
        },
        'customer@example.com': {
          _id: 'customer123',
          username: 'John Customer',
          email: 'customer@example.com',
          role: 'customer',
          phone: '+1 (555) 555-5555',
          address: '789 Customer Road, New York, NY'
        }
      };
      
      if (demoUsers[email] && password === 'password123') {
        const userData = demoUsers[email];
        const token = 'demo-token-' + Date.now();
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        return { 
          success: true, 
          user: userData,
          message: 'Using demo mode (backend not available)'
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Check your connection.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      
      if (response.data.success) {
        const { token, ...userInfo } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
        
        return { success: true, user: userInfo };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};