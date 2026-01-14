import React, { useState, useEffect, useCallback } from 'react';
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
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Grid,
  Avatar,
  Paper,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  TableRestaurant as TableIcon,
  AccessTime as TimeIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Event as EventIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
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

  const fetchReservations = useCallback(async () => {
    try {
        setLoading(true);
        console.log('📋 Fetching ALL reservations...');
        
        const response = await axios.get(`${API_URL}/api/reservations`);
        
        if (response.data.success) {
            console.log(`✅ Got ${response.data.data.length} reservations`);
            setReservations(response.data.data);
            setFilteredReservations(response.data.data);
            
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
        
        // Fallback to demo data
        const demoReservations = generateDemoReservations();
        setReservations(demoReservations);
        setFilteredReservations(demoReservations);
        
        const statsData = {
            total: demoReservations.length,
            confirmed: demoReservations.filter(r => r.status === 'confirmed').length,
            pending: demoReservations.filter(r => r.status === 'pending').length,
            seated: demoReservations.filter(r => r.status === 'seated').length,
            completed: demoReservations.filter(r => r.status === 'completed').length,
            cancelled: demoReservations.filter(r => r.status === 'cancelled').length
        };
        setStats(statsData);
        
        console.log('⚠️ Using demo reservations data');
        info('Using demo data - backend not available');
    } finally {
        setLoading(false);
    }
}, [API_URL, error, info, user]);

useEffect(() => {
    fetchReservations();
}, [fetchReservations]);

  useEffect(() => {
    // Filter reservations based on search query and date
    let filtered = reservations;
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(reservation => 
        reservation.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.customerPhone?.includes(searchQuery) ||
        reservation.tableNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by date
    if (date) {
      filtered = filtered.filter(reservation => 
        reservation.reservationDate === date
      );
    }
    
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(reservation => 
        reservation.status === statusFilter
      );
    }
    
    setFilteredReservations(filtered);
  }, [searchQuery, date, statusFilter, reservations]);

  const generateDemoReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const demoReservations = [
      {
        _id: '1',
        customerName: 'John Doe',
        customerEmail: user?.role === 'customer' ? user.email : 'customer@example.com',
        customerPhone: '123-456-7890',
        tableNumber: 'T01',
        reservationDate: today,
        reservationTime: '18:00',
        partySize: 2,
        status: 'confirmed',
        specialRequests: 'Window seat preferred',
        createdAt: new Date()
      },
      {
        _id: '2',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '987-654-3210',
        tableNumber: 'T02',
        reservationDate: today,
        reservationTime: '19:30',
        partySize: 4,
        status: 'pending',
        specialRequests: 'Birthday celebration',
        createdAt: new Date()
      },
      {
        _id: '3',
        customerName: 'Bob Wilson',
        customerEmail: 'bob@example.com',
        customerPhone: '555-123-4567',
        tableNumber: 'T03',
        reservationDate: today,
        reservationTime: '20:00',
        partySize: 6,
        status: 'seated',
        specialRequests: '',
        createdAt: new Date()
      },
      {
        _id: '4',
        customerName: user?.role === 'customer' ? user.username : 'Alice Johnson',
        customerEmail: user?.role === 'customer' ? user.email : 'alice@example.com',
        customerPhone: '555-987-6543',
        tableNumber: 'T04',
        reservationDate: tomorrowStr,
        reservationTime: '19:00',
        partySize: 2,
        status: 'confirmed',
        specialRequests: 'Anniversary dinner',
        createdAt: new Date()
      },
      {
        _id: '5',
        customerName: 'Charlie Brown',
        customerEmail: 'charlie@example.com',
        customerPhone: '555-444-3333',
        tableNumber: 'T05',
        reservationDate: today,
        reservationTime: '17:30',
        partySize: 8,
        status: 'completed',
        specialRequests: 'Business meeting',
        createdAt: new Date()
      },
      {
        _id: '6',
        customerName: 'David Lee',
        customerEmail: 'david@example.com',
        customerPhone: '555-666-7777',
        tableNumber: 'T06',
        reservationDate: tomorrowStr,
        reservationTime: '20:30',
        partySize: 3,
        status: 'cancelled',
        specialRequests: '',
        createdAt: new Date()
      }
    ];
    
    // If user is customer, only show their reservations
    if (user?.role === 'customer') {
      return demoReservations.filter(r => r.customerEmail === user.email);
    }
    
    return demoReservations;
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await axios.put(`${API_URL}/api/reservations/${id}/status`, { status: 'cancelled' });
        success('Reservation cancelled successfully');
        fetchReservations();
      } catch (err) {
        console.error('Error cancelling reservation:', err);
        
        // Update locally if backend fails
        setReservations(prev => 
          prev.map(r => r._id === id ? { ...r, status: 'cancelled' } : r)
        );
        success('Reservation cancelled (demo mode)');
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
      
      // Update locally if backend fails
      setReservations(prev => 
        prev.map(r => r._id === id ? { ...r, status: newStatus } : r)
      );
      success(`Status updated to ${newStatus} (demo mode)`);
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
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Convert 24h to 12h format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleViewReservation = (reservation) => {
    setViewDialog({ open: true, reservation });
  };

  const renderStatsCard = (title, value, color, icon, subtitle = '') => (
    <Card className="card-cinematic" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{
            p: 1.5,
            borderRadius: '12px',
            background: `rgba(${color === '#00cc00' ? '0,204,0' : color === '#ff9900' ? '255,153,0' : color === '#0099cc' ? '0,153,204' : '138,43,226'}, 0.2)`,
            color: color
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const handleCreateDemoReservation = async () => {
    try {
      const demoReservation = {
        customerName: 'Demo Customer',
        customerEmail: 'demo@example.com',
        customerPhone: '123-456-7890',
        tableNumber: 'T07',
        reservationDate: new Date().toISOString().split('T')[0],
        reservationTime: '20:00',
        partySize: 2,
        status: 'pending',
        specialRequests: 'This is a demo reservation'
      };
      
      const response = await axios.post(`${API_URL}/api/reservations`, demoReservation);
      
      if (response.data.success) {
        success('Demo reservation created successfully!');
        fetchReservations();
      }
    } catch (err) {
      console.error('Error creating demo reservation:', err);
      error('Failed to create demo reservation');
    }
  };

  const handleClearFilters = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setStatusFilter('');
    setSearchQuery('');
    info('Filters cleared');
  };

  const handleNewReservation = () => {
    navigate('/new-reservation');
  };

  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            📅 Reservations Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {user?.role === 'customer' ? 'Your Reservations' : 'Manage all restaurant reservations'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user?.role === 'admin' && (
            <Button
              variant="outlined"
              onClick={handleCreateDemoReservation}
              startIcon={<EventIcon />}
            >
              Add Demo
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchReservations}
            className="btn-cinematic"
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          {renderStatsCard('Total', stats.total, '#8a2be2', <TableIcon />, 'All reservations')}
        </Grid>
        <Grid item xs={6} sm={3}>
          {renderStatsCard('Confirmed', stats.confirmed, '#00cc00', <CheckCircleIcon />, 'Approved bookings')}
        </Grid>
        <Grid item xs={6} sm={3}>
          {renderStatsCard('Pending', stats.pending, '#ff9900', <TimeIcon />, 'Awaiting confirmation')}
        </Grid>
        <Grid item xs={6} sm={3}>
          {renderStatsCard('Seated', stats.seated, '#0099cc', <PersonIcon />, 'Currently dining')}
        </Grid>
      </Grid>

      {/* Filters */}
      <Card className="card-cinematic" sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            {user?.role !== 'customer' && (
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search by Name, Email, Phone, or Table"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  placeholder="Search reservations..."
                />
              </Grid>
            )}
            
            <Grid item xs={12} md={user?.role !== 'customer' ? 3 : 6}>
              <TextField
                fullWidth
                label="Filter by Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={user?.role !== 'customer' ? 3 : 6}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status Filter"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="seated">Seated</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={user?.role !== 'customer' ? 2 : 6}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleNewReservation}
                className="btn-cinematic"
                startIcon={<EventIcon />}
              >
                New Reservation
              </Button>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<FilterIcon />}
            >
              Clear Filters
            </Button>
            <Typography variant="body2" color="textSecondary" sx={{ ml: 'auto', alignSelf: 'center' }}>
              Showing {filteredReservations.length} of {reservations.length} reservations
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Debug Info for Admin */}
      {user?.role === 'admin' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Debug Info:</strong> Showing reservations for date: {date} | Status: {statusFilter || 'All'} | 
            User Role: {user?.role} | Total in DB: {reservations.length}
          </Typography>
        </Alert>
      )}

      {/* Reservations Table */}
      <Card className="card-cinematic">
        <CardContent>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <LinearProgress sx={{ mb: 3, borderRadius: 5 }} />
              <Typography color="textSecondary">Loading reservations...</Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                Fetching data from server...
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table className="table-cinematic">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer Details</TableCell>
                      <TableCell>Table & Time</TableCell>
                      <TableCell>Party Size</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredReservations.map((reservation) => {
                      const statusColor = getStatusColor(reservation.status);
                      return (
                        <TableRow key={reservation._id || reservation.id} className="table-row-hover">
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
                                <br />
                                <Typography variant="caption" color="textSecondary">
                                  {reservation.customerPhone || 'No phone'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Chip
                                label={`Table ${reservation.tableNumber || 'N/A'}`}
                                size="small"
                                variant="outlined"
                                className="chip-purple"
                                sx={{ mb: 0.5 }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {formatDate(reservation.reservationDate)}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {formatTime(reservation.reservationTime)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${reservation.partySize || 1} ${reservation.partySize === 1 ? 'person' : 'people'}`}
                              size="small"
                              className="chip-cyan"
                            />
                            {reservation.specialRequests && (
                              <Tooltip title={reservation.specialRequests}>
                                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                                  💡 Has special request
                                </Typography>
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={statusColor.icon}
                              label={statusColor.label}
                              size="small"
                              sx={{
                                background: statusColor.bg,
                                color: statusColor.color,
                                fontWeight: 700,
                                minWidth: 100,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleViewReservation(reservation)}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              
                              {user?.role !== 'customer' && (
                                <>
                                  {reservation.status === 'pending' && (
                                    <Tooltip title="Confirm">
                                      <IconButton
                                        size="small"
                                        color="success"
                                        onClick={() => handleStatusChange(reservation._id, 'confirmed')}
                                      >
                                        <CheckCircleIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  
                                  {reservation.status === 'confirmed' && (
                                    <Tooltip title="Mark as Seated">
                                      <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleStatusChange(reservation._id, 'seated')}
                                      >
                                        <PersonIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  
                                  {reservation.status === 'seated' && (
                                    <Tooltip title="Complete">
                                      <IconButton
                                        size="small"
                                        color="secondary"
                                        onClick={() => handleStatusChange(reservation._id, 'completed')}
                                      >
                                        <CheckCircleIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  
                                  {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
                                    <Tooltip title="Cancel">
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleCancel(reservation._id)}
                                      >
                                        <CancelIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    
                    {filteredReservations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                          <EventIcon sx={{ fontSize: 64, color: 'rgba(138, 43, 226, 0.3)', mb: 2 }} />
                          <Typography variant="h6" color="textSecondary" gutterBottom>
                            No reservations found
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 3, maxWidth: '500px', mx: 'auto' }}>
                            {searchQuery || statusFilter || date 
                              ? 'No reservations match your current filters. Try adjusting your search criteria.' 
                              : user?.role === 'customer' 
                                ? "You haven't made any reservations yet. Book your first table!" 
                                : 'No reservations in the system yet. Create your first reservation.'}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                              variant="outlined"
                              onClick={handleClearFilters}
                            >
                              Clear Filters
                            </Button>
                            <Button
                              variant="contained"
                              className="btn-cinematic"
                              onClick={handleNewReservation}
                              startIcon={<EventIcon />}
                            >
                              Create New Reservation
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {reservations.length > 0 && filteredReservations.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No reservations match your search criteria. Try different filters.
                </Alert>
              )}
            </>
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
                  <Paper sx={{ p: 2, background: 'rgba(138, 43, 226, 0.1)', borderRadius: '12px' }}>
                    <Typography variant="subtitle2" color="textSecondary">Customer Information</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
                      {viewDialog.reservation.customerName || 'Guest'}
                    </Typography>
                    <Typography variant="body2">{viewDialog.reservation.customerEmail || 'No email'}</Typography>
                    <Typography variant="body2">{viewDialog.reservation.customerPhone || 'No phone'}</Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: 'rgba(0, 255, 255, 0.1)', borderRadius: '12px' }}>
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
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: 'rgba(255, 0, 255, 0.1)', borderRadius: '12px' }}>
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
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                      Created: {viewDialog.reservation.createdAt ? formatDate(viewDialog.reservation.createdAt) : 'Unknown'}
                    </Typography>
                  </Paper>
                </Grid>
                
                {viewDialog.reservation.specialRequests && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, background: 'rgba(255, 215, 0, 0.1)', borderRadius: '12px' }}>
                      <Typography variant="subtitle2" color="textSecondary">Special Requests</Typography>
                      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                        "{viewDialog.reservation.specialRequests}"
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setViewDialog({ open: false, reservation: null })}>
                Close
              </Button>
              {user?.role !== 'customer' && (
                <Button
                  variant="contained"
                  className="btn-cinematic"
                  onClick={handleNewReservation}
                  endIcon={<ArrowForwardIcon />}
                >
                  Create New
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Reservations;