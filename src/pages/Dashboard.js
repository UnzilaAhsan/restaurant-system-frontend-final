import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
  Button,
  Avatar,
  AvatarGroup,
  Paper,
  IconButton,
  Divider,
  Container
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  EventAvailable as EventAvailableIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MonetizationOnIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  TableRestaurant as TableIcon,
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  History as HistoryIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  EmojiEvents as TrophyIcon,
  TrendingFlat as TrendingFlatIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTables: 0,
    availableTables: 0,
    todayReservations: 0,
    occupancyRate: 0,
    revenue: 3245,
    averageTime: '45 mins',
    recentReservations: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error, info } = useToast();

  // Get API URL from environment or use Render URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://restaurant-system-6.onrender.com';

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch tables data
      const tablesRes = await axios.get(`${API_URL}/api/tables`);
      const totalTables = tablesRes.data.data?.length || 0;
      const availableTables = tablesRes.data.data?.filter(t => t.status === 'available').length || 0;
      
      // Get today's date for reservations
      const today = new Date().toISOString().split('T')[0];
      let reservationsRes;
      
      try {
        if (user?.role === 'customer') {
          // For customers, get their reservations
          reservationsRes = await axios.get(`${API_URL}/api/reservations/user/${user.email}`);
        } else {
          // For admin/staff, get today's reservations
          reservationsRes = await axios.get(`${API_URL}/api/reservations`, { 
            params: { 
              date: today,
              limit: 10 
            } 
          });
        }
        
        const todayReservations = reservationsRes.data.data?.length || 0;
        const occupancyRate = totalTables > 0 ? 
          Math.round(((totalTables - availableTables) / totalTables) * 100) : 0;
        
        // Get recent reservations (limit to 5 for display)
        const recentReservations = (reservationsRes.data.data || []).slice(0, 5);
        
        setStats({
          totalTables,
          availableTables,
          todayReservations,
          occupancyRate,
          revenue: 3245, // Demo value
          averageTime: '45 mins', // Demo value
          recentReservations
        });
        
      } catch (reservationError) {
        console.error('Error fetching reservations:', reservationError);
        // Use demo data for reservations
        const demoReservations = generateDemoReservations();
        setStats(prev => ({
          ...prev,
          todayReservations: demoReservations.length,
          recentReservations: demoReservations
        }));
        info('Using demo reservations data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      error('Failed to load dashboard data. Using demo data.');
      
      // Use complete demo data
      const demoReservations = generateDemoReservations();
      setStats({
        totalTables: 15,
        availableTables: 8,
        todayReservations: demoReservations.length,
        occupancyRate: 47,
        revenue: 3245,
        averageTime: '45 mins',
        recentReservations: demoReservations
      });
    } finally {
      setLoading(false);
    }
  }, [user, error, info, API_URL]);

  const generateDemoReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    const reservations = [
      {
        _id: '1',
        customerName: user?.role === 'customer' ? user.username : 'John Doe',
        customerEmail: user?.role === 'customer' ? user.email : 'john@example.com',
        customerPhone: '123-456-7890',
        tableNumber: 'T01',
        reservationDate: today,
        reservationTime: '18:00',
        partySize: 2,
        status: 'confirmed',
        specialRequests: 'Window seat preferred'
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
        specialRequests: 'Birthday celebration'
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
        specialRequests: ''
      },
      {
        _id: '4',
        customerName: 'Alice Johnson',
        customerEmail: 'alice@example.com',
        customerPhone: '555-987-6543',
        tableNumber: 'T04',
        reservationDate: today,
        reservationTime: '19:00',
        partySize: 2,
        status: 'confirmed',
        specialRequests: 'Anniversary dinner'
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
        specialRequests: 'Business meeting'
      }
    ];
    
    // Filter for customer view
    if (user?.role === 'customer') {
      return reservations.filter(r => r.customerEmail === user.email);
    }
    
    return reservations;
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <Card className="card-cinematic" sx={{ height: '100%' }}>
      <CardContent sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, fontSize: '2.5rem' }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Chip
                label={trend}
                size="small"
                className={trend.includes('+') ? 'chip-cyan' : trend.includes('-') ? 'chip-pink' : 'chip-gold'}
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <Avatar
            sx={{
              width: 70,
              height: 70,
              background: `linear-gradient(45deg, ${color.light}, ${color.dark})`,
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return { bg: '#00cc00', color: '#000' };
      case 'pending': return { bg: '#ff9900', color: '#000' };
      case 'seated': return { bg: '#0099cc', color: '#fff' };
      case 'completed': return { bg: '#9900cc', color: '#fff' };
      default: return { bg: '#9e9e9e', color: '#fff' };
    }
  };

  // ========== ADMIN DASHBOARD ==========
  const AdminDashboard = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, fontSize: '3rem' }} className="gradient-text">
              Welcome back, Admin! 👑
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: '600px' }}>
              Complete control over your restaurant operations with real-time analytics and management tools
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchDashboardData}
              sx={{ borderRadius: '15px' }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/new-reservation')}
              className="btn-cinematic"
              sx={{ borderRadius: '15px', px: 3 }}
            >
              New Reservation
            </Button>
          </Box>
        </Box>

        {/* Top Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Tables"
              value={stats.totalTables}
              icon={<RestaurantIcon sx={{ fontSize: 35 }} />}
              color={{ light: '#8a2be2', dark: '#7b1fa2' }}
              subtitle={`${stats.availableTables} available`}
              trend="+2 this month"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Today's Reservations"
              value={stats.todayReservations}
              icon={<PeopleIcon sx={{ fontSize: 35 }} />}
              color={{ light: '#00ffff', dark: '#0099cc' }}
              subtitle="12 more than yesterday"
              trend="+18%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Occupancy Rate"
              value={`${stats.occupancyRate}%`}
              icon={<TrendingUpIcon sx={{ fontSize: 35 }} />}
              color={{ light: '#ff00ff', dark: '#cc00cc' }}
              subtitle="Higher than average"
              trend="+5.2%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Estimated Revenue"
              value={`$${stats.revenue.toLocaleString()}`}
              icon={<MonetizationOnIcon sx={{ fontSize: 35 }} />}
              color={{ light: '#ffd700', dark: '#ff9900' }}
              subtitle="Today's estimate"
              trend="+12%"
            />
          </Grid>
        </Grid>

        {/* Charts and Graphs Section */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={8}>
            <Card className="card-cinematic">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    📊 Revenue Analytics
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <FilterIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ p: 2, height: '300px', display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                  {[65, 80, 45, 90, 75, 85, 70].map((height, index) => (
                    <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                      <Box
                        sx={{
                          height: `${height}%`,
                          background: 'linear-gradient(180deg, #8a2be2, #9d4edd)',
                          borderRadius: '8px 8px 0 0',
                          marginBottom: 1,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 10px 20px rgba(138, 43, 226, 0.3)'
                          }
                        }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        Day {index + 1}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Divider className="divider-purple" sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Weekly performance overview
                  </Typography>
                  <Chip label="Trending Up" className="chip-cyan" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card className="card-cinematic" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                  🏆 Performance Metrics
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Customer Satisfaction</Typography>
                    <Typography variant="body2" fontWeight={600}>94%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={94} className="progress-bar-cinematic" />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Table Turnover</Typography>
                    <Typography variant="body2" fontWeight={600}>2.8/hr</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={70} className="progress-bar-cinematic" />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Staff Efficiency</Typography>
                    <Typography variant="body2" fontWeight={600}>88%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={88} className="progress-bar-cinematic" />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Food Quality</Typography>
                    <Typography variant="body2" fontWeight={600}>96%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={96} className="progress-bar-cinematic" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Reservations Table */}
        <Card className="card-cinematic">
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  📅 Recent Reservations
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Latest bookings and customer details
                </Typography>
              </Box>
              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/reservations')}
                sx={{ textTransform: 'none' }}
              >
                View All
              </Button>
            </Box>
            
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <div className="loading-spinner" style={{ margin: '0 auto' }} />
                <Typography color="textSecondary" sx={{ mt: 2 }}>
                  Loading reservations...
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table className="table-cinematic">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>Table</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Party Size</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentReservations.map((reservation) => {
                      const statusColor = getStatusColor(reservation.status);
                      return (
                        <TableRow key={reservation._id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ 
                                width: 40, 
                                height: 40, 
                                bgcolor: statusColor.bg,
                                color: statusColor.color
                              }}>
                                {reservation.customerName?.charAt(0) || 'G'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {reservation.customerName}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {reservation.customerPhone}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={reservation.tableNumber}
                              size="small"
                              variant="outlined"
                              className="chip-purple"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {reservation.reservationTime}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Today
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${reservation.partySize} people`}
                              size="small"
                              className="chip-cyan"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={reservation.status}
                              size="small"
                              sx={{
                                background: statusColor.bg,
                                color: statusColor.color,
                                fontWeight: 700,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate('/reservations')}
                              className="btn-cinematic"
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {stats.recentReservations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          <EventAvailableIcon sx={{ fontSize: 64, color: 'rgba(138, 43, 226, 0.3)', mb: 2 }} />
                          <Typography variant="h6" color="textSecondary" gutterBottom>
                            No reservations for today yet
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            Start by creating your first reservation
                          </Typography>
                          <Button
                            variant="contained"
                            className="btn-cinematic"
                            onClick={() => navigate('/new-reservation')}
                          >
                            Create First Reservation
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Stats Section */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card className="card-cinematic">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FireIcon /> Top Performing Tables
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {['T05', 'T02', 'T07'].map((table, index) => (
                    <Box key={table} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: '10px',
                      background: 'rgba(138, 43, 226, 0.1)',
                      border: '1px solid rgba(138, 43, 226, 0.2)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                          color: '#000',
                          width: 32,
                          height: 32,
                          fontWeight: 700
                        }}>
                          {index + 1}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          Table {table}
                        </Typography>
                      </Box>
                      <Chip label={`${75 - index * 15}%`} size="small" className="chip-gold" />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card className="card-cinematic">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrophyIcon /> Awards & Achievements
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 2,
                    borderRadius: '10px',
                    background: 'rgba(0, 255, 255, 0.1)',
                    border: '1px solid rgba(0, 255, 255, 0.2)'
                  }}>
                    <StarIcon sx={{ color: '#ffd700' }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        Platinum Service Award
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Customer satisfaction 95%+
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 2,
                    borderRadius: '10px',
                    background: 'rgba(255, 0, 255, 0.1)',
                    border: '1px solid rgba(255, 0, 255, 0.2)'
                  }}>
                    <TrendingUpIcon sx={{ color: '#ff00ff' }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        Growth Excellence
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        25% revenue growth this month
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card className="card-cinematic">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon /> Active Staff
                </Typography>
                <AvatarGroup max={6} sx={{ justifyContent: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#8a2be2', width: 45, height: 45 }}>JD</Avatar>
                  <Avatar sx={{ bgcolor: '#00ffff', color: '#000', width: 45, height: 45 }}>MS</Avatar>
                  <Avatar sx={{ bgcolor: '#ff00ff', width: 45, height: 45 }}>AL</Avatar>
                  <Avatar sx={{ bgcolor: '#ffd700', color: '#000', width: 45, height: 45 }}>KT</Avatar>
                  <Avatar sx={{ bgcolor: '#00cc66', width: 45, height: 45 }}>+2</Avatar>
                </AvatarGroup>
                <Typography variant="body2" color="textSecondary" align="center">
                  5 staff members currently active
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/staff')}
                  sx={{ mt: 2 }}
                >
                  Manage Staff
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );

  // ========== STAFF DASHBOARD ==========
  const StaffDashboard = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, fontSize: '3rem' }} className="gradient-text">
              Hello, Staff! 👨‍🍳
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: '600px' }}>
              Manage today's reservations and provide excellent customer service with real-time updates
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/new-reservation')}
            className="btn-cinematic"
            sx={{ borderRadius: '15px', px: 3 }}
          >
            New Booking
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Today's Bookings"
              value={stats.todayReservations}
              icon={<CalendarIcon sx={{ fontSize: 35 }} />}
              color={{ light: '#8a2be2', dark: '#7b1fa2' }}
              subtitle="Manage reservations"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending"
              value={stats.recentReservations.filter(r => r.status === 'pending').length}
              icon={<AccessTimeIcon sx={{ fontSize: 35 }} />}
              color={{ light: '#ff9900', dark: '#cc8800' }}
              subtitle="Need confirmation"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Seated"
              value={stats.recentReservations.filter(r => r.status === 'seated').length}
              icon={<PersonIcon sx={{ fontSize: 35 }} />}
              color={{ light: '#00ffff', dark: '#0099cc' }}
              subtitle="Currently dining"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Available Tables"
              value={stats.availableTables}
              icon={<TableIcon sx={{ fontSize: 35 }} />}
              color={{ light: '#00cc66', dark: '#00994d' }}
              subtitle="Ready for customers"
            />
          </Grid>
        </Grid>

        {/* Staff Tasks Section */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={8}>
            <Card className="card-cinematic">
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                  🎯 Today's Priority Tasks
                </Typography>
                
                {stats.recentReservations.filter(r => r.status === 'pending').length > 0 ? (
                  <Box>
                    <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
                      Pending reservations to confirm:
                    </Typography>
                    <Grid container spacing={2}>
                      {stats.recentReservations
                        .filter(r => r.status === 'pending')
                        .map((reservation, index) => (
                          <Grid item xs={12} sm={6} key={reservation._id}>
                            <Paper
                              sx={{
                                p: 2,
                                background: 'rgba(255, 153, 0, 0.1)',
                                border: '1px solid rgba(255, 153, 0, 0.3)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                '&:hover': {
                                  background: 'rgba(255, 153, 0, 0.2)'
                                }
                              }}
                              onClick={() => navigate('/reservations')}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {reservation.customerName}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    Table {reservation.tableNumber} • {reservation.reservationTime}
                                  </Typography>
                                </Box>
                                <Chip label="Pending" size="small" className="chip-gold" />
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                    </Grid>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <TrophyIcon sx={{ fontSize: 64, color: 'rgba(138, 43, 226, 0.3)', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      No pending tasks!
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      All reservations are confirmed. Great work!
                    </Typography>
                  </Box>
                )}
                
                <Divider className="divider-purple" sx={{ my: 4 }} />
                
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<TableIcon />}
                      onClick={() => navigate('/tables')}
                      sx={{ py: 1.5 }}
                    >
                      View Tables
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<CalendarIcon />}
                      onClick={() => navigate('/reservations')}
                      sx={{ py: 1.5 }}
                    >
                      All Reservations
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/new-reservation')}
                      sx={{ py: 1.5 }}
                    >
                      New Booking
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={fetchDashboardData}
                      sx={{ py: 1.5 }}
                    >
                      Refresh
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card className="card-cinematic">
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                  ⏰ Shift Information
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Current Shift
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    2:00 PM - 10:00 PM
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={45} 
                    className="progress-bar-cinematic"
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                    45% completed • 4.5 hours remaining
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Assigned Sections
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label="Indoor" className="chip-purple" />
                    <Chip label="Bar" className="chip-cyan" />
                    <Chip label="VIP" className="chip-gold" />
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Performance Today
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tables Served</Typography>
                    <Typography variant="body2" fontWeight={600}>12</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Orders Taken</Typography>
                    <Typography variant="body2" fontWeight={600}>24</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Customer Rating</Typography>
                    <Typography variant="body2" fontWeight={600}>4.8/5</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );

  // ========== CUSTOMER DASHBOARD ==========
  const CustomerDashboard = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, fontSize: '3rem' }} className="gradient-text">
              Welcome, {user?.username || 'Guest'}! 👋
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: '600px' }}>
              View your reservations, book new tables, and manage your dining experience
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/new-reservation')}
            className="btn-cinematic"
            sx={{ borderRadius: '15px', px: 3 }}
          >
            Book Table
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Upcoming"
              value={stats.recentReservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length}
              icon={<CalendarIcon sx={{ fontSize: 35 }} />}
              color={{ light: '#8a2be2', dark: '#7b1fa2' }}
              subtitle="Future reservations"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed"
              value={stats.recentReservations.filter(r => r.status === 'completed').length}
              icon={<HistoryIcon sx={{ fontSize: 35 }} />}
              color={{ light: '#00ffff', dark: '#0099cc' }}
              subtitle="Past visits"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Tables Booked"
              value={stats.recentReservations.length}
              icon={<TableIcon sx={{ fontSize: 35 }} />}
              color={{ light: '#ff00ff', dark: '#cc00cc' }}
              subtitle="Total bookings"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Available Now"
              value={stats.availableTables}
              icon={<EventAvailableIcon sx={{ fontSize: 35 }} />}
              color={{ light: '#00cc66', dark: '#00994d' }}
              subtitle="Tables free"
            />
          </Grid>
        </Grid>

        {/* Customer Bookings */}
        <Card className="card-cinematic">
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>
              📋 Your Recent Bookings
            </Typography>
            
            {stats.recentReservations.length > 0 ? (
              <Grid container spacing={3}>
                {stats.recentReservations.map((reservation) => {
                  const statusColor = getStatusColor(reservation.status);
                  return (
                    <Grid item xs={12} md={6} key={reservation._id}>
                      <Card 
                        className="card-cinematic"
                        sx={{ 
                          height: '100%',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-5px)'
                          }
                        }}
                        onClick={() => navigate('/reservations')}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                Table {reservation.tableNumber}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {new Date(reservation.reservationDate).toLocaleDateString('en-US', { 
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>
                            <Chip
                              label={reservation.status}
                              size="small"
                              sx={{
                                background: statusColor.bg,
                                color: statusColor.color,
                                fontWeight: 700,
                              }}
                            />
                          </Box>
                          
                          <Divider className="divider-purple" sx={{ my: 2 }} />
                          
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="textSecondary">
                                Time
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {reservation.reservationTime}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="textSecondary">
                                Party Size
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {reservation.partySize} people
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">
                                Contact
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {reservation.customerPhone}
                              </Typography>
                            </Grid>
                          </Grid>
                          
                          <Button
                            fullWidth
                            variant="outlined"
                            endIcon={<ArrowForwardIcon />}
                            sx={{ mt: 3 }}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <EventAvailableIcon sx={{ fontSize: 64, color: 'rgba(138, 43, 226, 0.3)', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No reservations yet
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 4, maxWidth: '400px', mx: 'auto' }}>
                  Book your first table to get started. Enjoy exclusive benefits and priority seating.
                </Typography>
                <Button
                  variant="contained"
                  className="btn-cinematic"
                  onClick={() => navigate('/new-reservation')}
                  sx={{ px: 4 }}
                >
                  Book Your First Table
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
        
        {/* Loyalty & Offers */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Card className="card-cinematic">
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon /> Loyalty Points
                </Typography>
                <Box sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(157, 78, 221, 0.1))',
                  borderRadius: '15px',
                  mb: 3
                }}>
                  <Typography variant="h2" sx={{ fontWeight: 900, mb: 1 }} className="gradient-text">
                    1,250
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Available Points
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <span style={{ color: '#8a2be2', fontWeight: 600 }}>250 points</span> to next reward
                </Typography>
                <LinearProgress variant="determinate" value={75} className="progress-bar-cinematic" />
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                  Silver Member • 5 more visits to Gold
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card className="card-cinematic">
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🎁 Special Offers
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Paper
                    sx={{
                      p: 2,
                      background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(255, 0, 255, 0.05))',
                      border: '1px solid rgba(138, 43, 226, 0.3)',
                      borderRadius: '12px'
                    }}
                  >
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                      20% Off Weekend Dining
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Valid every Saturday & Sunday
                    </Typography>
                  </Paper>
                  <Paper
                    sx={{
                      p: 2,
                      background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 204, 102, 0.05))',
                      border: '1px solid rgba(0, 255, 255, 0.3)',
                      borderRadius: '12px'
                    }}
                  >
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                      Free Dessert on Birthdays
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Show ID to claim your dessert
                    </Typography>
                  </Paper>
                  <Paper
                    sx={{
                      p: 2,
                      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 153, 0, 0.05))',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      borderRadius: '12px'
                    }}
                  >
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                      Early Bird Special
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      15% off bookings before 6 PM
                    </Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <div className="loading-spinner" />
        <Typography variant="h6" sx={{ mt: 3 }} className="gradient-text">
          Loading Dashboard...
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Preparing your cinematic experience
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      {user?.role === 'admin' && <AdminDashboard />}
      {user?.role === 'staff' && <StaffDashboard />}
      {user?.role === 'customer' && <CustomerDashboard />}
    </Box>
  );
};

export default Dashboard;