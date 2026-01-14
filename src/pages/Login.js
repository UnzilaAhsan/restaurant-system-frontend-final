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
  Grid,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Restaurant as RestaurantIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Star as StarIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: 'admin@example.com',
    password: 'password123'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setFormData({ 
      email: demoEmail, 
      password: demoPassword 
    });
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 4 }}>
      {/* Background Effects */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(138, 43, 226, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)
        `,
        zIndex: -1,
      }} />
      
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        {/* Left Side - Brand & Features */}
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            p: 4,
            textAlign: { xs: 'center', md: 'left' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <RestaurantIcon sx={{ 
                fontSize: 48,
                color: '#8a2be2',
                filter: 'drop-shadow(0 0 10px rgba(138, 43, 226, 0.5))'
              }} />
              <Box>
                <Typography variant="h2" sx={{ 
                  fontWeight: 900,
                  background: 'linear-gradient(45deg, #8a2be2, #ffffff, #00ffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '1px'
                }}>
                  RestaurantPro
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  Premium Edition
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="h3" sx={{ 
              fontWeight: 800,
              mb: 3,
              fontSize: '2.5rem',
              background: 'linear-gradient(45deg, #8a2be2, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome to the Future of Restaurant Management
            </Typography>
            
            <Typography variant="h6" sx={{ 
              color: 'rgba(255,255,255,0.8)',
              mb: 4,
              lineHeight: 1.6
            }}>
              Experience the most advanced restaurant management system with real-time analytics, 
              seamless booking, and comprehensive control over your operations.
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Chip label="Real-time Analytics" className="chip-purple" />
              <Chip label="Secure & Encrypted" className="chip-cyan" />
              <Chip label="24/7 Support" className="chip-pink" />
              <Chip label="Mobile Friendly" className="chip-gold" />
            </Box>
            
            {/* Features List */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(138, 43, 226, 0.2)', width: 40, height: 40 }}>
                    <SpeedIcon sx={{ color: '#8a2be2' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>Lightning Fast</Typography>
                    <Typography variant="caption" color="textSecondary">Real-time updates</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(0, 255, 255, 0.2)', width: 40, height: 40 }}>
                    <SecurityIcon sx={{ color: '#00ffff' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>Bank-level Security</Typography>
                    <Typography variant="caption" color="textSecondary">256-bit encryption</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255, 0, 255, 0.2)', width: 40, height: 40 }}>
                    <StarIcon sx={{ color: '#ff00ff' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>Premium Support</Typography>
                    <Typography variant="caption" color="textSecondary">24/7 assistance</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255, 215, 0, 0.2)', width: 40, height: 40 }}>
                    <LockIcon sx={{ color: '#ffd700' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>Role-based Access</Typography>
                    <Typography variant="caption" color="textSecondary">Granular permissions</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
              "Trusted by 500+ restaurants worldwide. Join the revolution in restaurant management."
            </Typography>
          </Box>
        </Grid>
        
        {/* Right Side - Login Form */}
        <Grid item xs={12} md={6}>
          <Paper 
            className="card-cinematic"
            sx={{ 
              p: 4,
              maxWidth: '500px',
              mx: 'auto',
              backdropFilter: 'blur(20px)'
            }}
          >
            <Typography variant="h4" align="center" gutterBottom sx={{ 
              fontWeight: 800,
              mb: 1,
              background: 'linear-gradient(45deg, #8a2be2, #ff00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Sign In to Dashboard
            </Typography>
            
            <Typography variant="h6" align="center" gutterBottom sx={{ 
              mb: 4, 
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 400 
            }}>
              Access your restaurant management portal
            </Typography>
            
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
            
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon fontSize="small" />
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                  className="input-cinematic"
                />
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockIcon fontSize="small" />
                  Password
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  className="input-cinematic"
                />
              </Box>
              
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In to Dashboard'}
              </Button>
            </form>
            
            <Divider className="divider-purple" sx={{ my: 3 }}>
              <Typography variant="body2" color="textSecondary">
                OR CONTINUE WITH
              </Typography>
            </Divider>
            
            <Typography align="center" sx={{ mt: 2, mb: 3 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ 
                fontWeight: 700, 
                textDecoration: 'none',
                color: '#8a2be2',
                '&:hover': { textDecoration: 'underline' }
              }}>
                Create Account
              </Link>
            </Typography>
            
            {/* Demo Accounts */}
            <Box className="card-cinematic" sx={{ mt: 3, p: 3 }}>
              <Typography variant="subtitle2" sx={{ 
                fontWeight: 700, 
                mb: 2, 
                color: '#8a2be2',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <StarIcon />
                🚀 Quick Test Accounts
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleDemoLogin('admin@example.com', 'password123')}
                    sx={{ 
                      py: 1.5,
                      borderColor: 'rgba(138, 43, 226, 0.5)',
                      color: '#8a2be2',
                      '&:hover': {
                        borderColor: '#8a2be2',
                        background: 'rgba(138, 43, 226, 0.1)'
                      }
                    }}
                  >
                    Admin
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleDemoLogin('staff@example.com', 'password123')}
                    sx={{ 
                      py: 1.5,
                      borderColor: 'rgba(0, 255, 255, 0.5)',
                      color: '#00ffff',
                      '&:hover': {
                        borderColor: '#00ffff',
                        background: 'rgba(0, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Staff
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleDemoLogin('customer@example.com', 'password123')}
                    sx={{ 
                      py: 1.5,
                      borderColor: 'rgba(255, 0, 255, 0.5)',
                      color: '#ff00ff',
                      '&:hover': {
                        borderColor: '#ff00ff',
                        background: 'rgba(255, 0, 255, 0.1)'
                      }
                    }}
                  >
                    Customer
                  </Button>
                </Grid>
              </Grid>
              
              <Typography variant="caption" color="textSecondary" sx={{ 
                mt: 2, 
                display: 'block',
                textAlign: 'center'
              }}>
                All demo accounts use password: password123
              </Typography>
            </Box>
            
            <Typography variant="body2" align="center" sx={{ 
              mt: 3, 
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.75rem'
            }}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Footer Note */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="caption" color="textSecondary">
          © 2024 RestaurantPro. All rights reserved. • v2.1.0 • Premium Edition
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;