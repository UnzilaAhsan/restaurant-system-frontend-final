import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://restaurant-system-6.onrender.com';

const ReservationContext = createContext();

export const useReservation = () => useContext(ReservationContext);

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReservations = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/reservations`, { 
        params,
        timeout: 10000
      });
      setReservations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      // Return empty array for demo mode
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (reservationData) => {
    try {
      const response = await axios.post(`${API_URL}/api/reservations`, reservationData, {
        timeout: 10000
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating reservation:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error creating reservation' 
      };
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      const response = await axios.put(`${API_URL}/api/reservations/${id}/status`, { status }, {
        timeout: 10000
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating reservation:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error updating reservation' 
      };
    }
  };

  const cancelReservation = async (id) => {
    try {
      await axios.put(`${API_URL}/api/reservations/${id}/cancel`, {}, {
        timeout: 10000
      });
      return { success: true };
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error cancelling reservation' 
      };
    }
  };

  const value = {
    reservations,
    loading,
    fetchReservations,
    createReservation,
    updateReservationStatus,
    cancelReservation
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};