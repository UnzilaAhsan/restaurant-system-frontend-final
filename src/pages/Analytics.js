import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Avatar,
  AvatarGroup
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MonetizationOnIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  Timer as TimerIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const { error, info } = useToast();

  // Get API URL from environment or use Render URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://restaurant-system-nce0.onrender.com';

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/analytics`);
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      error('Failed to load analytics. Using demo data.');
      
      // Fallback to demo data
      setAnalytics(generateDemoAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const generateDemoAnalytics = () => {
    const now = new Date();
    const dates = [];
    const dailyRevenue = {};
    
    // Generate last 7 days of revenue data
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dates.push(dateStr);
      dailyRevenue[dateStr] = Math.floor(Math.random() * 5000) + 2000;
    }
    
    // Generate peak hours data
    const peakHours = [
      { _id: '17:00', count: 15 },
      { _id: '18:00', count: 45 },
      { _id: '19:00', count: 60 },
      { _id: '20:00', count: 50 },
      { _id: '21:00', count: 30 }
    ];
    
    // Generate table stats
    const tableStats = [
      { _id: 'T01', totalReservations: 28, averagePartySize: 3.5, totalRevenue: 4200 },
      { _id: 'T02', totalReservations: 32, averagePartySize: 4.2, totalRevenue: 5100 },
      { _id: 'T03', totalReservations: 25, averagePartySize: 2.8, totalRevenue: 3500 },
      { _id: 'T04', totalReservations: 35, averagePartySize: 5.1, totalRevenue: 6200 },
      { _id: 'T05', totalReservations: 18, averagePartySize: 6.5, totalRevenue: 4800 }
    ];
    
    // Generate staff performance
    const staffPerformance = [
      { _id: 'staff001', staffName: 'John Doe', totalReservations: 45, totalRevenue: 8500 },
      { _id: 'staff002', staffName: 'Jane Smith', totalReservations: 38, totalRevenue: 7200 },
      { _id: 'staff003', staffName: 'Bob Wilson', totalReservations: 52, totalRevenue: 9800 },
      { _id: 'staff004', staffName: 'Alice Johnson', totalReservations: 41, totalRevenue: 7600 }
    ];
    
    // Generate customer stats
    const customerStats = [
      { _id: 'John Doe', totalVisits: 12, totalSpent: 2800 },
      { _id: 'Jane Smith', totalVisits: 8, totalSpent: 1950 },
      { _id: 'Robert Brown', totalVisits: 15, totalSpent: 3400 },
      { _id: 'Emily Davis', totalVisits: 6, totalSpent: 1250 },
      { _id: 'Michael Wilson', totalVisits: 10, totalSpent: 2200 }
    ];
    
    return {
      summary: {
        totalRevenue: 45000,
        totalReservations: 156,
        averagePartySize: 3.8,
        bestTable: { _id: 'T04', revenue: 6200 }
      },
      tableStats,
      peakHours,
      staffPerformance,
      customerStats,
      dailyRevenue
    };
  };

  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <Card className="card-cinematic" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
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
                className="chip-cyan"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <Box sx={{ 
            p: 2, 
            borderRadius: '15px',
            background: `linear-gradient(45deg, ${color}, rgba(255,255,255,0.1))`,
            color: 'white'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <LinearProgress sx={{ width: '100%', mb: 2 }} />
        <Typography color="textSecondary">Loading analytics data...</Typography>
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Typography color="error" variant="h6" gutterBottom>
          Failed to load analytics
        </Typography>
        <button 
          variant="outlined" 
          onClick={fetchAnalytics}
          sx={{ mt: 2 }}
        >
          Retry
        </button>
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            📊 Performance Analytics
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Detailed insights and performance metrics
          </Typography>
          <Chip 
            label="Demo Data" 
            size="small" 
            color="warning" 
            sx={{ mt: 1 }} 
          />
        </Box>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
            className="input-cinematic"
          >
            <MenuItem value="7days">Last 7 days</MenuItem>
            <MenuItem value="30days">Last 30 days</MenuItem>
            <MenuItem value="90days">Last 90 days</MenuItem>
            <MenuItem value="1year">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${analytics.summary?.totalRevenue?.toLocaleString() || 0}`}
            icon={<MonetizationOnIcon sx={{ fontSize: 32 }} />}
            color="#8a2be2"
            subtitle={`${analytics.summary?.totalReservations || 0} reservations`}
            trend="+12.5%"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reservations"
            value={analytics.summary?.totalReservations || 0}
            icon={<CalendarIcon sx={{ fontSize: 32 }} />}
            color="#00ffff"
            subtitle="Completed bookings"
            trend="+8.2%"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Party Size"
            value={Math.round(analytics.summary?.averagePartySize || 0)}
            icon={<PeopleIcon sx={{ fontSize: 32 }} />}
            color="#ff00ff"
            subtitle="People per reservation"
            trend="+3.1%"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Best Table"
            value={analytics.summary?.bestTable?._id || 'T04'}
            icon={<RestaurantIcon sx={{ fontSize: 32 }} />}
            color="#ffd700"
            subtitle="Top performing table"
            trend="+15.7%"
          />
        </Grid>
      </Grid>

      {/* Charts & Tables Section */}
      <Grid container spacing={3}>
        {/* Table Performance */}
        <Grid item xs={12} md={6}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <RestaurantIcon /> Table Performance
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Table</TableCell>
                      <TableCell align="right">Reservations</TableCell>
                      <TableCell align="right">Avg. Party</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analytics.tableStats?.slice(0, 5).map((table) => (
                      <TableRow key={table._id}>
                        <TableCell>
                          <Chip label={table._id} size="small" className="chip-purple" />
                        </TableCell>
                        <TableCell align="right">{table.totalReservations}</TableCell>
                        <TableCell align="right">{Math.round(table.averagePartySize)}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#00ffff' }}>
                            ${table.totalRevenue?.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Peak Hours */}
        <Grid item xs={12} md={6}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon /> Peak Hours
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {analytics.peakHours?.map((hour, index) => (
                  <Box key={hour._id} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {hour._id}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {hour.count} reservations
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(hour.count / Math.max(...analytics.peakHours.map(h => h.count))) * 100}
                      className="progress-bar-cinematic"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Staff Performance */}
        <Grid item xs={12}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon /> Staff Performance
              </Typography>
              
              <TableContainer>
                <Table className="table-cinematic">
                  <TableHead>
                    <TableRow>
                      <TableCell>Staff</TableCell>
                      <TableCell align="right">Reservations</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Avg. per Booking</TableCell>
                      <TableCell align="right">Performance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analytics.staffPerformance?.map((staff) => (
                      <TableRow key={staff._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: '#8a2be2' }}>
                              {staff.staffName?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {staff.staffName}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                ID: {staff._id?.slice(-4) || 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{staff.totalReservations}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#00ff00' }}>
                            ${staff.totalRevenue?.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          ${Math.round(staff.totalRevenue / (staff.totalReservations || 1) || 0).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${Math.round((staff.totalReservations / analytics.staffPerformance.reduce((sum, s) => sum + (s.totalReservations || 0), 0)) * 100)}%`}
                            size="small"
                            className="chip-gold"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Customers */}
        <Grid item xs={12} md={6}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarIcon /> Top Customers
              </Typography>
              
              <AvatarGroup max={6} sx={{ justifyContent: 'center', mb: 3 }}>
                {analytics.customerStats?.slice(0, 6).map((customer, index) => (
                  <Avatar 
                    key={customer._id}
                    sx={{ 
                      bgcolor: ['#8a2be2', '#00ffff', '#ff00ff', '#ffd700', '#00cc66'][index % 5],
                      width: 45,
                      height: 45
                    }}
                  >
                    {customer._id?.charAt(0).toUpperCase()}
                  </Avatar>
                ))}
              </AvatarGroup>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {analytics.customerStats?.slice(0, 3).map((customer) => (
                  <Paper 
                    key={customer._id}
                    sx={{ 
                      p: 2, 
                      background: 'rgba(138, 43, 226, 0.1)',
                      border: '1px solid rgba(138, 43, 226, 0.3)',
                      borderRadius: '10px'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {customer._id}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {customer.totalVisits} visits
                        </Typography>
                      </Box>
                      <Chip
                        label={`$${customer.totalSpent?.toLocaleString()}`}
                        size="small"
                        className="chip-cyan"
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12} md={6}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShowChartIcon /> Revenue Trend
              </Typography>
              
              <Box sx={{ p: 2, height: '300px', display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                {Object.entries(analytics.dailyRevenue || {}).slice(-7).map(([date, revenue]) => (
                  <Box key={date} sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </Typography>
                    <Box
                      sx={{
                        height: `${(revenue / Math.max(...Object.values(analytics.dailyRevenue || {}))) * 100}%`,
                        background: 'linear-gradient(180deg, #8a2be2, #9d4edd)',
                        borderRadius: '8px 8px 0 0',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 10px 20px rgba(138, 43, 226, 0.3)'
                        }
                      }}
                    />
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                      ${Math.round(revenue).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;