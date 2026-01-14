import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Button,
  Container,
  Chip,
  Paper,
  alpha,
  Grid
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TableRestaurant as TableIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Restaurant as RestaurantIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Chair as ChairIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  EventAvailable as EventAvailableIcon,
  AccountCircle as AccountCircleIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Home as HomeIcon,
  ContactSupport as ContactSupportIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
  MenuBook as MenuBookIcon,
  LocalOffer as LocalOfferIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const drawerWidth = 320;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications] = useState([
    { id: 1, text: 'New reservation for Table 5', time: '5 min ago' },
    { id: 2, text: 'Table 3 needs attention', time: '10 min ago' },
    { id: 3, text: 'Daily report ready', time: '1 hour ago' }
  ]);
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    success('Logged out successfully!');
    navigate('/login');
    handleMenuClose();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Role-based menu items
  const getMenuItems = () => {
    const commonItems = [
      { 
        text: 'Dashboard', 
        icon: <DashboardIcon />, 
        path: '/dashboard',
        description: 'Overview & Analytics'
      },
      { 
        text: 'Reservations', 
        icon: <CalendarIcon />, 
        path: '/reservations',
        description: 'Manage Bookings'
      },
      { 
        text: 'New Reservation', 
        icon: <AddIcon />, 
        path: '/new-reservation',
        description: 'Create Booking'
      },
    ];

    const adminItems = [
      ...commonItems,
      { 
        text: 'Table Management', 
        icon: <TableIcon />, 
        path: '/tables',
        description: 'Configure Tables'
      },
      { 
        text: 'Menu Management', 
        icon: <MenuBookIcon />, 
        path: '/menu',
        description: 'Food & Beverage'
      },
      { 
        text: 'Analytics', 
        icon: <TrendingUpIcon />, 
        path: '/analytics',
        description: 'Performance Metrics'
      },
      { 
        text: 'Staff Management', 
        icon: <GroupIcon />, 
        path: '/staff',
        description: 'Team Management'
      },
      { 
        text: 'Profile Settings', 
        icon: <PersonIcon />, 
        path: '/profile',
        description: 'Account & Preferences'
      },
    ];

    const staffItems = [
      ...commonItems,
      { 
        text: 'Today\'s Schedule', 
        icon: <EventAvailableIcon />, 
        path: '/schedule',
        description: 'Daily Operations'
      },
      { 
        text: 'Order Management', 
        icon: <LocalOfferIcon />, 
        path: '/orders',
        description: 'Customer Orders'
      },
      { 
        text: 'Profile Settings', 
        icon: <PersonIcon />, 
        path: '/profile',
        description: 'Account & Preferences'
      },
    ];

    const customerItems = [
      ...commonItems,
      { 
        text: 'My Bookings', 
        icon: <HistoryIcon />, 
        path: '/bookings',
        description: 'Reservation History'
      },
      { 
        text: 'Menu & Orders', 
        icon: <MenuBookIcon />, 
        path: '/menu',
        description: 'Food & Beverage'
      },
      { 
        text: 'Loyalty Program', 
        icon: <EmojiEventsIcon />, 
        path: '/loyalty',
        description: 'Rewards & Points'
      },
      { 
        text: 'Profile Settings', 
        icon: <PersonIcon />, 
        path: '/profile',
        description: 'Account & Preferences'
      },
    ];

    switch (user?.role) {
      case 'admin':
        return adminItems;
      case 'staff':
        return staffItems;
      case 'customer':
        return customerItems;
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  // Footer content
  const Footer = () => (
    <Box 
      sx={{ 
        mt: 'auto',
        py: 4,
        px: 3,
        background: 'linear-gradient(180deg, transparent, rgba(138, 43, 226, 0.1))',
        borderTop: '1px solid rgba(138, 43, 226, 0.2)'
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RestaurantIcon sx={{ mr: 1, color: '#8a2be2' }} />
              <Typography variant="h6" className="gradient-text">
                RestaurantPro
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Premium restaurant management system with advanced analytics, 
              real-time monitoring, and seamless booking experience.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton size="small" sx={{ color: '#8a2be2' }}>
                <StarIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#00ffff' }}>
                <VerifiedUserIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#ff00ff' }}>
                <TrendingUpIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <Button 
                  component="a" 
                  href="/dashboard"
                  sx={{ 
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    px: 0,
                    minWidth: 'auto'
                  }}
                >
                  Dashboard
                </Button>
              </ListItem>
              <ListItem disablePadding>
                <Button 
                  component="a" 
                  href="/reservations"
                  sx={{ 
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    px: 0,
                    minWidth: 'auto'
                  }}
                >
                  Reservations
                </Button>
              </ListItem>
              <ListItem disablePadding>
                <Button 
                  component="a" 
                  href="/tables"
                  sx={{ 
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    px: 0,
                    minWidth: 'auto'
                  }}
                >
                  Tables
                </Button>
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Support
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <Button 
                  component="a" 
                  href="/help"
                  sx={{ 
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    px: 0,
                    minWidth: 'auto'
                  }}
                >
                  <InfoIcon sx={{ mr: 1, fontSize: 'small' }} />
                  Help Center
                </Button>
              </ListItem>
              <ListItem disablePadding>
                <Button 
                  component="a" 
                  href="/contact"
                  sx={{ 
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    px: 0,
                    minWidth: 'auto'
                  }}
                >
                  <ContactSupportIcon sx={{ mr: 1, fontSize: 'small' }} />
                  Contact Us
                </Button>
              </ListItem>
              <ListItem disablePadding>
                <Button 
                  component="a" 
                  href="/privacy"
                  sx={{ 
                    color: 'text.secondary',
                    justifyContent: 'flex-start',
                    px: 0,
                    minWidth: 'auto'
                  }}
                >
                  <SecurityIcon sx={{ mr: 1, fontSize: 'small' }} />
                  Privacy Policy
                </Button>
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              System Status
            </Typography>
            <Paper 
              className="card-cinematic"
              sx={{ p: 2 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">API Status</Typography>
                <Chip label="Online" size="small" className="chip-cyan" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Database</Typography>
                <Chip label="Active" size="small" className="chip-purple" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Uptime</Typography>
                <Chip label="99.9%" size="small" className="chip-gold" />
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, borderColor: 'rgba(138, 43, 226, 0.2)' }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 RestaurantPro. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography variant="body2" color="text.secondary">
              v2.1.0 • Premium Edition
            </Typography>
            <Button 
              size="small" 
              onClick={toggleDarkMode}
              startIcon={darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              sx={{ color: 'text.secondary' }}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );

  const drawerContent = (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
      overflowX: 'hidden'
    }}>
      {/* Brand Header */}
      <Box sx={{ 
        p: 4, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(157, 78, 221, 0.1))',
        borderBottom: '1px solid rgba(138, 43, 226, 0.3)'
      }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          mb: 2
        }}>
          <RestaurantIcon sx={{ 
            fontSize: 48,
            color: '#8a2be2',
            filter: 'drop-shadow(0 0 10px rgba(138, 43, 226, 0.5))'
          }} />
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 900,
              background: 'linear-gradient(45deg, #8a2be2, #ff00ff)',
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
        <Chip 
          label={`v2.1.0 • ${user?.role?.toUpperCase()}`}
          size="small"
          className="chip-purple"
          sx={{ mt: 1 }}
        />
      </Box>
      
      {/* User Profile Section */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        borderBottom: '1px solid rgba(138, 43, 226, 0.2)'
      }}>
        <Avatar
          className="avatar-glow"
          sx={{
            width: 60,
            height: 60,
            background: 'linear-gradient(45deg, #8a2be2, #ff00ff)',
            border: '3px solid rgba(138, 43, 226, 0.5)'
          }}
        >
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ 
            fontWeight: 700,
            color: 'white'
          }}>
            {user?.username}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: 'rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            <AccountCircleIcon fontSize="small" />
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </Typography>
          <Typography variant="caption" sx={{ 
            color: 'rgba(255,255,255,0.5)',
            display: 'block'
          }}>
            Last login: Today, 14:30
          </Typography>
        </Box>
      </Box>
      
      {/* Navigation Menu */}
      <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
        <Typography variant="overline" sx={{ 
          color: 'rgba(138, 43, 226, 0.7)',
          fontWeight: 600,
          letterSpacing: '1px',
          px: 2,
          mb: 1,
          display: 'block'
        }}>
          Main Navigation
        </Typography>
        
        <List sx={{ p: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              button
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              selected={location.pathname === item.path}
              sx={{
                mb: 1.5,
                borderRadius: '15px',
                py: 1.5,
                px: 2,
                background: location.pathname === item.path 
                  ? 'linear-gradient(45deg, rgba(138, 43, 226, 0.3), rgba(157, 78, 221, 0.2))'
                  : 'transparent',
                border: location.pathname === item.path
                  ? '1px solid rgba(138, 43, 226, 0.5)'
                  : '1px solid transparent',
                '&:hover': {
                  background: 'rgba(138, 43, 226, 0.15)',
                  border: '1px solid rgba(138, 43, 226, 0.3)',
                  transform: 'translateX(5px)',
                  transition: 'all 0.3s ease'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: location.pathname === item.path ? '#8a2be2' : 'rgba(255,255,255,0.7)'
              }}>
                {item.icon}
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{ 
                    fontWeight: 600,
                    color: location.pathname === item.path ? 'white' : 'rgba(255,255,255,0.9)'
                  }}
                />
                <Typography variant="caption" sx={{ 
                  color: 'rgba(255,255,255,0.5)',
                  display: 'block'
                }}>
                  {item.description}
                </Typography>
              </Box>
              {location.pathname === item.path && (
                <Box sx={{ 
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#8a2be2',
                  ml: 1,
                  animation: 'glow 2s infinite'
                }} />
              )}
            </ListItem>
          ))}
        </List>
        
        <Divider className="divider-purple" sx={{ my: 3 }} />
        
        {/* Quick Stats */}
        <Paper 
          className="card-cinematic"
          sx={{ p: 2, mb: 3 }}
        >
          <Typography variant="subtitle2" sx={{ 
            color: 'rgba(255,255,255,0.7)',
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <TrendingUpIcon fontSize="small" />
            Quick Stats
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Tables</Typography>
            <Typography variant="body2" fontWeight={600}>12/20</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Reservations</Typography>
            <Typography variant="body2" fontWeight={600}>8 Today</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Occupancy</Typography>
            <Typography variant="body2" fontWeight={600}>65%</Typography>
          </Box>
        </Paper>
      </Box>
      
      {/* System Status */}
      <Box sx={{ 
        p: 2,
        borderTop: '1px solid rgba(138, 43, 226, 0.2)',
        background: 'rgba(10, 10, 15, 0.5)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 1
        }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            System Status
          </Typography>
          <Box sx={{ 
            width: 10, 
            height: 10, 
            borderRadius: '50%',
            background: '#00ff00',
            boxShadow: '0 0 10px #00ff00'
          }} />
        </Box>
        <Typography variant="caption" sx={{ 
          color: 'rgba(255,255,255,0.5)',
          display: 'block'
        }}>
          All systems operational
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      {/* Cinematic Background Effects */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(0, 255, 255, 0.05) 0%, transparent 50%)
        `,
        zIndex: -1,
        pointerEvents: 'none'
      }} />
      
      {/* Animated Grid Background */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(138, 43, 226, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(138, 43, 226, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.3
      }} />
      
      {/* Main App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          background: 'rgba(26, 26, 46, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(138, 43, 226, 0.3)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          zIndex: 1200
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2,
                color: '#8a2be2',
                border: '1px solid rgba(138, 43, 226, 0.3)',
                '&:hover': {
                  background: 'rgba(138, 43, 226, 0.1)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flex: 1 
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #8a2be2, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' }
            }}>
              {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
            
            <Chip
              label="PRO"
              size="small"
              className="chip-purple"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            <IconButton 
              className="icon-hover"
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                position: 'relative'
              }}
            >
              <Badge badgeContent={notifications.length} color="error" className="notification-badge">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <IconButton
              onClick={toggleDarkMode}
              className="icon-hover"
              sx={{ 
                color: 'rgba(255,255,255,0.8)'
              }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: '20px',
              border: '1px solid rgba(138, 43, 226, 0.3)',
              background: 'rgba(138, 43, 226, 0.1)',
              cursor: 'pointer',
              '&:hover': {
                background: 'rgba(138, 43, 226, 0.2)'
              }
            }} onClick={handleMenuOpen}>
              <Avatar
                className="avatar-glow"
                sx={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(45deg, #8a2be2, #ff00ff)',
                  border: '2px solid rgba(138, 43, 226, 0.5)'
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user?.username}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {user?.role}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Toolbar>
        
        {/* Page Breadcrumb */}
        <Box sx={{ 
          px: 3,
          py: 1,
          borderTop: '1px solid rgba(138, 43, 226, 0.1)',
          background: 'rgba(10, 10, 15, 0.3)'
        }}>
          <Typography variant="caption" sx={{ 
            color: 'rgba(255,255,255,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            <HomeIcon fontSize="small" />
            <span>/</span>
            <span>Dashboard</span>
            <span>/</span>
            <span style={{ color: '#8a2be2' }}>
              {menuItems.find(item => item.path === location.pathname)?.text || 'Home'}
            </span>
          </Typography>
        </Box>
      </AppBar>
      
      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: '1px solid rgba(138, 43, 226, 0.3)',
                boxShadow: '20px 0 50px rgba(0,0,0,0.5)',
                overflow: 'hidden'
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: '1px solid rgba(138, 43, 226, 0.3)',
                boxShadow: '20px 0 50px rgba(0,0,0,0.5)',
                overflow: 'hidden'
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>
      
      {/* User Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            background: 'rgba(26, 26, 46, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(138, 43, 226, 0.3)',
            borderRadius: '15px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            minWidth: 200,
            overflow: 'hidden'
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(138, 43, 226, 0.2)' }}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Signed in as
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {user?.username}
          </Typography>
        </Box>
        
        <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: '#8a2be2' }} />
          </ListItemIcon>
          <ListItemText>Profile Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" sx={{ color: '#8a2be2' }} />
          </ListItemIcon>
          <ListItemText>System Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { navigate('/help'); handleMenuClose(); }}>
          <ListItemIcon>
            <ContactSupportIcon fontSize="small" sx={{ color: '#8a2be2' }} />
          </ListItemIcon>
          <ListItemText>Help & Support</ListItemText>
        </MenuItem>
        
        <Divider sx={{ borderColor: 'rgba(138, 43, 226, 0.2)' }} />
        
        <MenuItem onClick={handleLogout} sx={{ color: '#ff4444' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#ff4444' }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, md: 4 },
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          mt: '96px',
          minHeight: 'calc(100vh - 96px)',
          overflow: 'auto'
        }}
      >
        {/* Hero Section for Current Page */}
        <Box className="hero-section" sx={{ 
          mb: 6,
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            p: 4,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            width: '100%'
          }}>
            <Typography variant="h1" sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 900,
              mb: 2,
              background: 'linear-gradient(45deg, #8a2be2, #ffffff, #00ffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '600px',
              mx: 'auto',
              mb: 3
            }}>
              {menuItems.find(item => item.path === location.pathname)?.description || 
               'Manage your restaurant operations with advanced tools and real-time analytics'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip label="Premium" className="chip-purple" />
              <Chip label="Real-time" className="chip-cyan" />
              <Chip label="Secure" className="chip-pink" />
            </Box>
          </Box>
        </Box>
        
        {/* Main Content - Will be replaced by Outlet */}
        <Box sx={{ flex: 1, minHeight: '500px' }}>
          <Outlet />
        </Box>
        
        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;