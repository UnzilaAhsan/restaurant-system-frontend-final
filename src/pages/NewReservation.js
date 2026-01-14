import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Snackbar,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
  Chair as ChairIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon  // Changed: Added proper InfoIcon import
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const NewReservation = () => {
  const [step, setStep] = useState(0);
  const [tables, setTables] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: '18:00',
    partySize: 2,
    specialRequests: ''
  });
  const [selectedTable, setSelectedTable] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error, info } = useToast();

  // Get API URL from environment or use Render URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://restaurant-system-6.onrender.com';

  useEffect(() => {
    fetchTables();
    
    // Pre-fill customer info if logged in
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.username || '',
        customerEmail: user.email || '',
        customerPhone: user.phone || prev.customerPhone || '',
        specialRequests: prev.specialRequests || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (step === 2) {
      checkAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, step]);

  const fetchTables = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tables`);
      if (response.data.success) {
        setTables(response.data.data || []);
      } else {
        // Use demo tables if API fails
        setTables(getDemoTables());
        info('Using demo tables data');
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
      // Use demo tables as fallback
      setTables(getDemoTables());
      info('Using demo tables (backend not available)');
    }
  };

  const getDemoTables = () => [
    { _id: '1', tableNumber: 'T01', capacity: 2, location: 'indoors', status: 'available' },
    { _id: '2', tableNumber: 'T02', capacity: 4, location: 'indoors', status: 'available' },
    { _id: '3', tableNumber: 'T03', capacity: 6, location: 'outdoors', status: 'available' },
    { _id: '4', tableNumber: 'T04', capacity: 2, location: 'balcony', status: 'available' },
    { _id: '5', tableNumber: 'T05', capacity: 8, location: 'private', status: 'available' },
    { _id: '6', tableNumber: 'T06', capacity: 4, location: 'indoors', status: 'available' },
    { _id: '7', tableNumber: 'T07', capacity: 2, location: 'indoors', status: 'available' },
    { _id: '8', tableNumber: 'T08', capacity: 4, location: 'outdoors', status: 'available' }
  ];

  const checkAvailability = async () => {
    if (!formData.reservationDate || !formData.reservationTime || !formData.partySize) {
      error('Please select date, time, and party size first');
      return;
    }
    
    setCheckingAvailability(true);
    try {
      // Try the new availability endpoint first
      const params = {
        date: formData.reservationDate,
        time: formData.reservationTime,
        partySize: formData.partySize
      };
      const response = await axios.get(`${API_URL}/api/tables/available`, { params });
      
      if (response.data.success) {
        const available = response.data.data || [];
        setAvailableTables(available);
        
        if (available.length === 0) {
          error('No tables available for the selected time. Please try another time, date, or party size.');
        } else {
          success(`Found ${available.length} available tables`);
        }
      } else {
        throw new Error(response.data.message || 'Availability check failed');
      }
    } catch (err) {
      console.error('Error checking availability:', err);
      
      // Fallback to local filtering
      try {
        const allTables = tables.length > 0 ? tables : getDemoTables();
        
        // Get reservations for the selected date
        const reservationsRes = await axios.get(`${API_URL}/api/reservations`, {
          params: {
            date: formData.reservationDate,
            status: { $nin: ['cancelled', 'completed'] }
          }
        });
        
        const reservations = reservationsRes.data.success ? reservationsRes.data.data : [];
        
        // Filter reservations for the selected time
        const relevantReservations = reservations.filter(
          r => r.reservationTime === formData.reservationTime
        );
        
        // Get reserved table numbers
        const reservedTables = relevantReservations.map(r => r.tableNumber);
        
        // Filter available tables
        const available = allTables.filter(table => {
          return (
            table.capacity >= formData.partySize &&
            !reservedTables.includes(table.tableNumber) &&
            table.status === 'available'
          );
        });
        
        setAvailableTables(available);
        
        if (available.length === 0) {
          error('No tables available. Try different time or party size.');
        } else {
          info(`Found ${available.length} tables (fallback mode)`);
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        
        // Last resort: show all tables with sufficient capacity
        const allTables = tables.length > 0 ? tables : getDemoTables();
        const available = allTables.filter(table => 
          table.capacity >= formData.partySize
        );
        setAvailableTables(available);
        
        if (available.length === 0) {
          error('No tables match your criteria. Please try again.');
        } else {
          info('Showing all tables (availability check failed)');
        }
      }
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleNext = () => {
    if (step === 0) {
      // Validate customer info
      if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
        setSnackbar({ open: true, message: 'Please fill in all customer information', severity: 'error' });
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.customerEmail)) {
        setSnackbar({ open: true, message: 'Please enter a valid email address', severity: 'error' });
        return;
      }
      
      // Validate phone (basic validation)
      if (formData.customerPhone.length < 10) {
        setSnackbar({ open: true, message: 'Please enter a valid phone number', severity: 'error' });
        return;
      }
    } else if (step === 1) {
      // Validate date and time
      if (!formData.reservationDate || !formData.reservationTime) {
        setSnackbar({ open: true, message: 'Please select date and time', severity: 'error' });
        return;
      }
      
      // Validate date is not in the past
      const selectedDate = new Date(formData.reservationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setSnackbar({ open: true, message: 'Cannot book for past dates', severity: 'error' });
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    console.log('🚀 handleSubmit called');
    console.log('📋 Selected table:', selectedTable);
    console.log('📝 Form data:', formData);
    
    if (!selectedTable) {
      console.error('❌ No table selected');
      setSnackbar({ open: true, message: 'Please select a table', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      
      const reservationData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        tableNumber: selectedTable.tableNumber,
        reservationDate: formData.reservationDate,
        reservationTime: formData.reservationTime,
        partySize: formData.partySize,
        specialRequests: formData.specialRequests || '',
        status: 'pending'
      };
      
      console.log('📤 Sending reservation data:', reservationData);
      console.log('🌐 API URL:', `${API_URL}/api/reservations`);
      
      const response = await axios.post(`${API_URL}/api/reservations`, reservationData);
      
      console.log('✅ API Response:', response.data);
      
      if (response.data.success) {
        success('Reservation created successfully!');
        
        // Navigate back
        setTimeout(() => {
          navigate('/reservations');
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Failed to create reservation');
      }
    } catch (err) {
      console.error('❌ Create reservation error:');
      console.error('Error:', err);
      console.error('Response:', err.response?.data);
      
      error('Failed to create reservation');
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || 'Error creating reservation.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', 
    '20:00', '21:00', '22:00'
  ];

  const steps = ['Customer Information', 'Date & Time', 'Select Table', 'Confirmation'];

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon /> Personal Details
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Please provide your contact information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                helperText="Enter your full name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                required
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                helperText="We'll send confirmation to this email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                required
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                helperText="We'll contact you if needed"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Party Size"
                value={formData.partySize}
                onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) })}
                required
                InputProps={{
                  startAdornment: <GroupIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                helperText="Number of people"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(size => (
                  <MenuItem key={size} value={size}>
                    {size} {size === 1 ? 'person' : 'people'}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Requests (Optional)"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                multiline
                rows={3}
                placeholder="Birthday celebration, anniversary, dietary restrictions, etc."
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon /> Reservation Details
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Select when you'd like to dine with us
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Reservation Date"
                type="date"
                value={formData.reservationDate}
                onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                helperText="Select a date"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Reservation Time"
                value={formData.reservationTime}
                onChange={(e) => setFormData({ ...formData, reservationTime: e.target.value })}
                required
                InputProps={{
                  startAdornment: <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                helperText="Select a time slot"
              >
                {timeSlots.map(time => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 2, 
                background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(0, 204, 102, 0.05))',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                borderRadius: '12px'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <InfoIcon sx={{ color: '#00ffff' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      💡 Popular Time Slots:
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      18:00, 19:00, and 20:00 are our busiest times. For better availability, try 17:00 or 21:00.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ChairIcon /> Select Your Table
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Available tables for {formData.partySize} people at {formData.reservationTime}
                </Typography>
              </Box>
              <Button
                startIcon={<RefreshIcon />}
                onClick={checkAvailability}
                disabled={checkingAvailability}
                variant="outlined"
                size="small"
              >
                Refresh
              </Button>
            </Box>
            
            <Card className="card-cinematic" sx={{ mb: 3, p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" fontWeight={600}>
                    Your Reservation Details:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date: {new Date(formData.reservationDate).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Time: {formData.reservationTime}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Party Size: {formData.partySize} people
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setStep(1)}
                    startIcon={<ArrowBackIcon />}
                  >
                    Change Date/Time
                  </Button>
                </Grid>
              </Grid>
            </Card>
            
            {checkingAvailability ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <LinearProgress sx={{ mb: 2, borderRadius: 5 }} />
                <Typography color="textSecondary">Checking table availability...</Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                  Searching for tables with capacity ≥ {formData.partySize} people
                </Typography>
              </Box>
            ) : availableTables.length > 0 ? (
              <>
                <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
                  Select a table from the available options:
                </Typography>
                
                <Grid container spacing={2}>
                  {availableTables.map(table => (
                    <Grid item xs={12} sm={6} md={4} key={table._id || table.tableNumber}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: selectedTable?.tableNumber === table.tableNumber 
                            ? '3px solid #8a2be2' 
                            : '1px solid rgba(138, 43, 226, 0.3)',
                          background: selectedTable?.tableNumber === table.tableNumber
                            ? 'rgba(138, 43, 226, 0.1)'
                            : 'rgba(26, 26, 46, 0.8)',
                          transition: 'all 0.3s ease',
                          height: '100%',
                          '&:hover': { 
                            borderColor: '#8a2be2',
                            transform: 'translateY(-4px)',
                            boxShadow: '0 10px 30px rgba(138, 43, 226, 0.3)'
                          }
                        }}
                        onClick={() => setSelectedTable(table)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar sx={{ 
                              bgcolor: selectedTable?.tableNumber === table.tableNumber 
                                ? '#8a2be2' 
                                : '#00ffff',
                              color: selectedTable?.tableNumber === table.tableNumber 
                                ? '#fff' 
                                : '#000',
                              width: 50,
                              height: 50,
                              fontWeight: 700,
                              fontSize: '1.2rem'
                            }}>
                              {table.tableNumber}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Table {table.tableNumber}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                ID: {table._id ? table._id.slice(-4) : 'DEMO'}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                            <Chip
                              icon={<GroupIcon />}
                              label={`${table.capacity} seats`}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ justifyContent: 'flex-start' }}
                            />
                            <Chip
                              icon={<LocationIcon />}
                              label={table.location || 'indoors'}
                              size="small"
                              color="secondary"
                              variant="outlined"
                              sx={{ justifyContent: 'flex-start' }}
                            />
                            <Chip
                              icon={<ChairIcon />}
                              label="Available Now"
                              size="small"
                              color="success"
                              sx={{ justifyContent: 'flex-start' }}
                            />
                          </Box>
                          
                          {selectedTable?.tableNumber === table.tableNumber && (
                            <Box sx={{ 
                              mt: 2, 
                              p: 1.5, 
                              background: 'linear-gradient(45deg, rgba(138, 43, 226, 0.2), rgba(157, 78, 221, 0.1))',
                              border: '1px solid rgba(138, 43, 226, 0.5)',
                              borderRadius: '10px',
                              textAlign: 'center'
                            }}>
                              <Typography variant="body2" sx={{ color: '#8a2be2', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <CheckCircleIcon fontSize="small" />
                                ✓ Selected - Ready to Book
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {selectedTable && (
                  <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(0, 204, 102, 0.05))',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    borderRadius: '12px'
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ color: '#00ff00' }} />
                      Table {selectedTable.tableNumber} selected! Click "Next" to confirm your reservation.
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <ChairIcon sx={{ fontSize: 64, color: 'rgba(255, 0, 0, 0.3)', mb: 2 }} />
                <Typography variant="h6" color="error" gutterBottom>
                  No tables available
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3, maxWidth: '500px', mx: 'auto' }}>
                  Sorry, there are no tables available for {formData.partySize} people at {formData.reservationTime} on {new Date(formData.reservationDate).toLocaleDateString()}.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setStep(1)}
                    startIcon={<ArrowBackIcon />}
                  >
                    Change Date/Time
                  </Button>
                  <Button
                    variant="contained"
                    onClick={checkAvailability}
                    className="btn-cinematic"
                    startIcon={<RefreshIcon />}
                  >
                    Check Again
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon /> 📋 Reservation Summary
            </Typography>
            
            <Paper sx={{ 
              p: 3, 
              mb: 3, 
              background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(22, 33, 62, 0.9))',
              border: '1px solid rgba(138, 43, 226, 0.3)',
              borderRadius: '15px'
            }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#8a2be2' }}>
                    Customer Information
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Full Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.customerName}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.customerEmail}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.customerPhone}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Party Size</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.partySize} people</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider className="divider-purple" sx={{ my: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#00ffff' }}>
                    Reservation Details
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {new Date(formData.reservationDate).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Time</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.reservationTime}</Typography>
                </Grid>
                {formData.specialRequests && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Special Requests</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, fontStyle: 'italic' }}>
                      "{formData.specialRequests}"
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Divider className="divider-purple" sx={{ my: 2 }} />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#ff00ff' }}>
                    Table Details
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  {selectedTable ? (
                    <Box sx={{ 
                      p: 2, 
                      background: 'linear-gradient(45deg, rgba(138, 43, 226, 0.2), rgba(157, 78, 221, 0.1))',
                      border: '1px solid rgba(138, 43, 226, 0.5)',
                      borderRadius: '12px',
                      color: 'white'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: '#8a2be2', 
                          color: 'white',
                          width: 60,
                          height: 60,
                          fontSize: '1.5rem',
                          fontWeight: 700
                        }}>
                          {selectedTable.tableNumber}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Table {selectedTable.tableNumber}
                          </Typography>
                          <Typography variant="body2">
                            {selectedTable.capacity} seats • {selectedTable.location || 'indoors'}
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.7)">
                            Perfect for your party of {formData.partySize}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      p: 2, 
                      background: 'rgba(255, 0, 0, 0.1)',
                      border: '1px solid rgba(255, 0, 0, 0.3)',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <Typography color="error">⚠️ No table selected</Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Paper>
            
            <Paper sx={{ 
              p: 2, 
              background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 153, 0, 0.05))',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '12px'
            }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon sx={{ color: '#ffaa00' }} />
                💡 Please review all details before confirming. You can modify any information by going back.
              </Typography>
            </Paper>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
        {user?.role === 'customer' ? '📅 Book a Table' : '➕ New Reservation'}
      </Typography>
      
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        {user?.role === 'customer' 
          ? 'Reserve your table for a wonderful dining experience'
          : 'Create a new reservation for a customer'}
      </Typography>

      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel 
              sx={{
                '& .MuiStepLabel-label': {
                  fontWeight: step === index ? 700 : 500,
                  color: step === index ? '#8a2be2' : 'text.secondary'
                }
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ 
        p: { xs: 2, md: 4 }, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(22, 33, 62, 0.9))',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
      }}>
        {renderStepContent()}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={step === 0 || loading}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{ 
              px: 4,
              borderColor: 'rgba(138, 43, 226, 0.5)',
              color: '#8a2be2',
              '&:hover': {
                borderColor: '#8a2be2',
                background: 'rgba(138, 43, 226, 0.1)'
              }
            }}
          >
            Back
          </Button>
          
          <Box>
            {step === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!selectedTable || loading}
                startIcon={loading ? null : <CheckCircleIcon />}
                className="btn-cinematic"
                sx={{ 
                  px: 4,
                  py: 1.5,
                  background: loading 
                    ? 'linear-gradient(45deg, #666666 30%, #888888 90%)'
                    : 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                  '&:hover': {
                    background: loading 
                      ? 'linear-gradient(45deg, #666666 30%, #888888 90%)'
                      : 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%)'
                  }
                }}
              >
                {loading ? 'Processing...' : 'Confirm Reservation'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={(step === 2 && !selectedTable) || checkingAvailability}
                endIcon={<ArrowForwardIcon />}
                className="btn-cinematic"
                sx={{ px: 4, py: 1.5 }}
              >
                {step === 2 ? 'Review Reservation' : 'Next'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ 
            borderRadius: 2,
            background: snackbar.severity === 'error' 
              ? 'rgba(244, 67, 54, 0.9)' 
              : snackbar.severity === 'success'
              ? 'rgba(76, 175, 80, 0.9)'
              : 'rgba(33, 150, 243, 0.9)',
            color: 'white',
            fontWeight: 600
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewReservation;