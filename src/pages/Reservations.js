import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Card,
  CardContent,
  Grid,
  Avatar,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  TableRestaurant as TableIcon,
  AccessTime as TimeIcon,
  Refresh as RefreshIcon,
  Event as EventIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    seated: 0,
    completed: 0,
    cancelled: 0
  });
  const [viewDialog, setViewDialog] = useState({ open: false, reservation: null });
  
  const { user } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();
  
  // Get API URL from environment or use Render URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://restaurant-system-nce0.onrender.com';

  const fetchReservations = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching ALL reservations...');
      
      const response = await axios.get(`${API_URL}/api/reservations`);
      
      if (response.data.success) {
        console.log(`✅ Got ${response.data.data.length} reservations`);
        setReservations(response.data.data);
        
        // Calculate stats
        const statsData = {
          total: response.data.data.length,
          confirmed: response.data.data.filter(r => r.status === 'confirmed').length,
          pending: response.data.data.filter(r => r.status === 'pending').length,
          seated: response.data.data.filter(r => r.status === 'seated').length,
          completed: response.data.data.filter(r => r.status === 'completed').length,
          cancelled: response.data.data.filter(r => r.status === 'cancelled').length
        };
        setStats(statsData);
      } else {
        console.error('❌ API returned error:', response.data.message);
        error('Failed to load reservations');
      }
    } catch (err) {
      console.error('❌ Error fetching reservations:', err);
      error('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await axios.put(`${API_URL}/api/reservations/${id}/status`, { status: 'cancelled' });
        success('Reservation cancelled successfully');
        fetchReservations();
      } catch (err) {
        console.error('Error cancelling reservation:', err);
        error('Failed to cancel reservation');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/reservations/${id}/status`, { status: newStatus });
      success(`Reservation status updated to ${newStatus}`);
      fetchReservations();
    } catch (err) {
      console.error('Error updating reservation:', err);
      error('Failed to update reservation status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return { bg: '#00cc00', color: '#000', icon: <CheckCircleIcon />, label: 'Confirmed' };
      case 'pending': return { bg: '#ff9900', color: '#000', icon: <TimeIcon />, label: 'Pending' };
      case 'seated': return { bg: '#0099cc', color: '#fff', icon: <PersonIcon />, label: 'Seated' };
      case 'completed': return { bg: '#9900cc', color: '#fff', icon: <CheckCircleIcon />, label: 'Completed' };
      case 'cancelled': return { bg: '#ff4444', color: '#fff', icon: <CancelIcon />, label: 'Cancelled' };
      default: return { bg: '#9e9e9e', color: '#fff', icon: <TimeIcon />, label: 'Unknown' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      // Convert 24h to 12h format
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const handleViewReservation = (reservation) => {
    setViewDialog({ open: true, reservation });
  };

  const handleNewReservation = () => {
    navigate('/new-reservation');
  };

  const renderStatsCard = (title, value, color, icon) => (
    <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{
            p: 1.5,
            borderRadius: '12px',
            bgcolor: `${color}20`,
            color: color
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            📅 Reservations
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {user?.role === 'customer' ? 'Your Reservations' : 'All Restaurant Reservations'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchReservations}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            onClick={handleNewReservation}
            startIcon={<EventIcon />}
          >
            New Reservation
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4} md={2.4}>
          {renderStatsCard('Total', stats.total, '#8a2be2', <TableIcon />)}
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          {renderStatsCard('Confirmed', stats.confirmed, '#00cc00', <CheckCircleIcon />)}
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          {renderStatsCard('Pending', stats.pending, '#ff9900', <TimeIcon />)}
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          {renderStatsCard('Seated', stats.seated, '#0099cc', <PersonIcon />)}
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          {renderStatsCard('Cancelled', stats.cancelled, '#ff4444', <CancelIcon />)}
        </Grid>
      </Grid>

      {/* Debug Info */}
      {user?.role === 'admin' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Backend URL:</strong> {API_URL}<br/>
            <strong>Total Reservations:</strong> {reservations.length}
          </Typography>
        </Alert>
      )}

      {/* Reservations Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <LinearProgress sx={{ mb: 3, borderRadius: 5 }} />
              <Typography color="textSecondary">Loading reservations from server...</Typography>
            </Box>
          ) : reservations.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <EventIcon sx={{ fontSize: 64, color: 'rgba(138, 43, 226, 0.3)', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No reservations found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3, maxWidth: '500px', mx: 'auto' }}>
                {user?.role === 'customer' 
                  ? "You haven't made any reservations yet. Book your first table!" 
                  : 'No reservations in the system yet. Create your first reservation.'}
              </Typography>
              <Button
                variant="contained"
                onClick={handleNewReservation}
                startIcon={<EventIcon />}
              >
                Create New Reservation
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Details</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Table</TableCell>
                    <TableCell>Party Size</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservations.map((reservation) => {
                    const statusColor = getStatusColor(reservation.status);
                    return (
                      <TableRow key={reservation._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              bgcolor: statusColor.bg,
                              color: statusColor.color,
                              width: 40,
                              height: 40
                            }}>
                              {reservation.customerName?.charAt(0) || 'G'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {reservation.customerName || 'Guest'}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {reservation.customerEmail || 'No email'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(reservation.reservationDate)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {formatTime(reservation.reservationTime)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`Table ${reservation.tableNumber || 'N/A'}`}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {reservation.partySize || 1} {reservation.partySize === 1 ? 'person' : 'people'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={statusColor.icon}
                            label={statusColor.label}
                            size="small"
                            sx={{
                              background: statusColor.bg,
                              color: statusColor.color,
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                              size="small"
                              onClick={() => handleViewReservation(reservation)}
                            >
                              View
                            </Button>
                            
                            {user?.role !== 'customer' && reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleCancel(reservation._id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* View Reservation Dialog */}
      <Dialog open={viewDialog.open} onClose={() => setViewDialog({ open: false, reservation: null })} maxWidth="sm" fullWidth>
        {viewDialog.reservation && (
          <>
            <DialogTitle>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Reservation Details
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(138, 43, 226, 0.05)', borderRadius: '12px' }}>
                    <Typography variant="subtitle2" color="textSecondary">Customer Information</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
                      {viewDialog.reservation.customerName || 'Guest'}
                    </Typography>
                    <Typography variant="body2">{viewDialog.reservation.customerEmail || 'No email'}</Typography>
                    <Typography variant="body2">{viewDialog.reservation.customerPhone || 'No phone'}</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(0, 255, 255, 0.05)', borderRadius: '12px' }}>
                    <Typography variant="subtitle2" color="textSecondary">Reservation Details</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Date:</strong> {formatDate(viewDialog.reservation.reservationDate)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Time:</strong> {formatTime(viewDialog.reservation.reservationTime)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Table:</strong> {viewDialog.reservation.tableNumber || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Party Size:</strong> {viewDialog.reservation.partySize || 1} people
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(255, 0, 255, 0.05)', borderRadius: '12px' }}>
                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        icon={getStatusColor(viewDialog.reservation.status).icon}
                        label={getStatusColor(viewDialog.reservation.status).label}
                        size="small"
                        sx={{
                          background: getStatusColor(viewDialog.reservation.status).bg,
                          color: getStatusColor(viewDialog.reservation.status).color,
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
                
                {viewDialog.reservation.specialRequests && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(255, 215, 0, 0.05)', borderRadius: '12px' }}>
                      <Typography variant="subtitle2" color="textSecondary">Special Requests</Typography>
                      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                        "{viewDialog.reservation.specialRequests}"
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setViewDialog({ open: false, reservation: null })}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Reservations;