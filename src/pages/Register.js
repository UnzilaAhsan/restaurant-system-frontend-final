import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Grid,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Restaurant as RestaurantIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Badge as BadgeIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };
    
    const result = await register(userData);
    
    if (result.success) {
      setSuccess('🎉 Registration successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError(result.message || 'Registration failed');
    }
    
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', py: 4 }}>
      {/* Background Effects */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 80% 20%, rgba(138, 43, 226, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)
        `,
        zIndex: -1,
      }} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/login')}
          sx={{ color: '#8a2be2' }}
        >
          Back to Login
        </Button>
        <Chip label="v2.1.0" size="small" className="chip-purple" />
      </Box>
      
      <Grid container spacing={4}>
        {/* Left Side - Registration Form */}
        <Grid item xs={12} md={7}>
          <Paper 
            className="card-cinematic"
            sx={{ 
              p: 4,
              height: '100%',
              backdropFilter: 'blur(20px)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ 
                bgcolor: 'rgba(138, 43, 226, 0.2)',
                width: 50,
                height: 50
              }}>
                <BadgeIcon sx={{ color: '#8a2be2' }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #8a2be2, #ff00ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Create Account
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Join the RestaurantPro platform
                </Typography>
              </Box>
            </Box>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: '12px',
                  background: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid rgba(244, 67, 54, 0.3)'
                }}
              >
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3, 
                  borderRadius: '12px',
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.3)'
                }}
              >
                {success}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" />
                      Username
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      disabled={loading}
                      className="input-cinematic"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" />
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={loading}
                      className="input-cinematic"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LockIcon fontSize="small" />
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={loading}
                      className="input-cinematic"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LockIcon fontSize="small" />
                      Confirm Password
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Confirm password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      disabled={loading}
                      className="input-cinematic"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShieldIcon fontSize="small" />
                      Account Type
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      disabled={loading}
                      className="input-cinematic"
                    >
                      <MenuItem value="customer">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon fontSize="small" />
                          <span>Customer</span>
                          <Chip label="Default" size="small" className="chip-cyan" sx={{ ml: 1 }} />
                        </Box>
                      </MenuItem>
                      <MenuItem value="staff">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BadgeIcon fontSize="small" />
                          <span>Staff</span>
                          <Chip label="Restricted" size="small" className="chip-purple" sx={{ ml: 1 }} />
                        </Box>
                      </MenuItem>
                      <MenuItem value="admin">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ShieldIcon fontSize="small" />
                          <span>Admin</span>
                          <Chip label="Full Access" size="small" className="chip-gold" sx={{ ml: 1 }} />
                        </Box>
                      </MenuItem>
                    </TextField>
                  </Box>
                </Grid>
              </Grid>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                className="btn-cinematic"
                sx={{ 
                  py: 1.8,
                  mb: 3,
                  borderRadius: '15px',
                  fontSize: '1.1rem'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </form>
            
            <Divider className="divider-purple" sx={{ my: 3 }} />
            
            <Typography align="center" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ 
                fontWeight: 700, 
                textDecoration: 'none',
                color: '#8a2be2',
                '&:hover': { textDecoration: 'underline' }
              }}>
                Sign In
              </Link>
            </Typography>
          </Paper>
        </Grid>
        
        {/* Right Side - Benefits & Info */}
        <Grid item xs={12} md={5}>
          <Paper 
            className="card-cinematic"
            sx={{ 
              p: 4,
              height: '100%',
              background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(157, 78, 221, 0.05))',
              backdropFilter: 'blur(20px)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <RestaurantIcon sx={{ 
                fontSize: 64,
                color: '#8a2be2',
                mb: 2,
                filter: 'drop-shadow(0 0 15px rgba(138, 43, 226, 0.5))'
              }} />
              <Typography variant="h5" sx={{ 
                fontWeight: 800,
                mb: 1,
                background: 'linear-gradient(45deg, #8a2be2, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Why Join RestaurantPro?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Premium features for modern restaurant management
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(138, 43, 226, 0.2)', width: 50, height: 50 }}>
                  <CheckCircleIcon sx={{ color: '#8a2be2' }} />
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                    Real-time Analytics
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Track performance with live dashboards and reports
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(0, 255, 255, 0.2)', width: 50, height: 50 }}>
                  <CheckCircleIcon sx={{ color: '#00ffff' }} />
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                    Seamless Booking
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Manage reservations with intuitive calendar interface
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255, 0, 255, 0.2)', width: 50, height: 50 }}>
                  <CheckCircleIcon sx={{ color: '#ff00ff' }} />
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                    Multi-role Support
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Separate interfaces for admin, staff, and customers
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255, 215, 0, 0.2)', width: 50, height: 50 }}>
                  <CheckCircleIcon sx={{ color: '#ffd700' }} />
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                    Mobile Responsive
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Access from any device with optimized experience
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Divider className="divider-purple" sx={{ my: 4 }} />
            
            <Box className="card-cinematic" sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ 
                fontWeight: 700, 
                mb: 2, 
                color: '#8a2be2'
              }}>
                💡 Quick Tip:
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                You can also use demo accounts on the login page:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  • Admin: admin@example.com / password123
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  • Staff: staff@example.com / password123
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  • Customer: customer@example.com / password123
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Footer Note */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="caption" color="textSecondary">
          By registering, you agree to our Terms of Service and Privacy Policy
        </Typography>
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
          © 2024 RestaurantPro. v2.1.0 • Premium Edition
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;