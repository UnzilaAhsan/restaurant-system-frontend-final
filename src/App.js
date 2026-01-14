import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './App.css';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


// Components
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tables from './pages/Tables';
import Reservations from './pages/Reservations';
import NewReservation from './pages/NewReservation';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

// New Pages
import StaffManagement from './pages/StaffManagement';
import Analytics from './pages/Analytics';
import MenuManagement from './pages/MenuManagement';
import SystemSettings from './pages/SystemSettings';
import HelpSupport from './pages/HelpSupport';
import Schedule from './pages/Schedule';
import OrderManagement from './pages/OrderManagement';
import Loyalty from './pages/Loyalty';

// Create cinematic dark purple theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8a2be2',
      light: '#9d4edd',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00ffff',
      light: '#33ffff',
      dark: '#00cccc',
      contrastText: '#000000',
    },
    error: {
      main: '#ff4444',
      light: '#ff6666',
      dark: '#cc0000',
    },
    warning: {
      main: '#ffaa00',
      light: '#ffbb33',
      dark: '#cc8800',
    },
    info: {
      main: '#0099cc',
      light: '#33bbff',
      dark: '#006699',
    },
    success: {
      main: '#00cc66',
      light: '#33ff99',
      dark: '#00994d',
    },
    background: {
      default: '#0a0a0f',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(138, 43, 226, 0.3)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 900,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.5px',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.25px',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '0.15px',
    },
    subtitle2: {
      fontWeight: 600,
      letterSpacing: '0.1px',
    },
    body1: {
      letterSpacing: '0.15px',
      lineHeight: 1.6,
    },
    body2: {
      letterSpacing: '0.1px',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    caption: {
      letterSpacing: '0.4px',
    },
    overline: {
      fontWeight: 600,
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 10px rgba(0, 0, 0, 0.3)',
    '0px 5px 20px rgba(0, 0, 0, 0.4)',
    '0px 10px 30px rgba(0, 0, 0, 0.5)',
    '0px 20px 50px rgba(0, 0, 0, 0.6)',
    '0px 30px 70px rgba(0, 0, 0, 0.7)',
    '0px 40px 90px rgba(0, 0, 0, 0.8)',
    '0px 50px 110px rgba(0, 0, 0, 0.9)',
    ...Array(17).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#8a2be2 #1a1a2e',
          '&::-webkit-scrollbar-track': {
            background: '#1a1a2e',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(45deg, #8a2be2, #9d4edd)',
            borderRadius: '10px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #8a2be2 30%, #9d4edd 90%)',
          boxShadow: '0 5px 20px rgba(138, 43, 226, 0.4)',
          '&:hover': {
            background: 'linear-gradient(45deg, #7b1fa2 30%, #8a2be2 90%)',
            boxShadow: '0 10px 30px rgba(138, 43, 226, 0.6)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #00ffff 30%, #33ffff 90%)',
          color: '#000',
          boxShadow: '0 5px 20px rgba(0, 255, 255, 0.4)',
          '&:hover': {
            background: 'linear-gradient(45deg, #00cccc 30%, #00ffff 90%)',
            boxShadow: '0 10px 30px rgba(0, 255, 255, 0.6)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.8))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(138, 43, 226, 0.3)',
          borderRadius: '20px',
          transition: 'all 0.4s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            borderColor: 'rgba(138, 43, 226, 0.6)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
        },
        elevation2: {
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
        },
        elevation3: {
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 26, 46, 0.9)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
          borderRight: '1px solid rgba(138, 43, 226, 0.3)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          background: 'linear-gradient(45deg, #8a2be2, #9d4edd)',
          color: 'white',
          fontWeight: 600,
          letterSpacing: '0.5px',
        },
        body: {
          borderBottom: '1px solid rgba(138, 43, 226, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(26, 26, 46, 0.5)',
            '& fieldset': {
              borderColor: 'rgba(138, 43, 226, 0.3)',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(138, 43, 226, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8a2be2',
              boxShadow: '0 0 20px rgba(138, 43, 226, 0.3)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#8a2be2',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.3px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(138, 43, 226, 0.3)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          height: '10px',
        },
        bar: {
          background: 'linear-gradient(90deg, #8a2be2, #ff00ff, #00ffff)',
          borderRadius: '10px',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid rgba(138, 43, 226, 0.5)',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          background: 'linear-gradient(45deg, #ff0000, #ff5555)',
          fontWeight: 700,
        },
      },
    },
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <AuthProvider>
          <Toast />
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tables" element={<Tables />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="new-reservation" element={<NewReservation />} />
                <Route path="profile" element={<Profile />} />
                
                {/* Admin only routes */}
                <Route path="staff" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <StaffManagement />
                  </ProtectedRoute>
                } />
                <Route path="analytics" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="menu" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <MenuManagement />
                  </ProtectedRoute>
                } />
                
                {/* Staff routes */}
                <Route path="schedule" element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <Schedule />
                  </ProtectedRoute>
                } />
                <Route path="orders" element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <OrderManagement />
                  </ProtectedRoute>
                } />
                
                {/* Customer routes */}
                <Route path="loyalty" element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Loyalty />
                  </ProtectedRoute>
                } />
                
                {/* Common routes for all authenticated users */}
                <Route path="settings" element={<SystemSettings />} />
                <Route path="help" element={<HelpSupport />} />
                
                {/* Customer's bookings (shows only their reservations) */}
                <Route path="bookings" element={<Reservations />} />
              </Route>
              
              {/* Catch all route - redirect to login */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;