import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    notifications: true,
    darkMode: false,
  });

  const handleSave = () => {
    success('Profile updated successfully!');
  };

  return (
    <Box className="fade-in">
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Profile Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card className="card-hover">
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto 20px',
                  background: 'linear-gradient(45deg, #3f51b5, #757de8)',
                  fontSize: '2.5rem',
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {user?.username}
              </Typography>
              
              <Chip
                label={user?.role?.toUpperCase()}
                color="primary"
                sx={{ mb: 3, fontWeight: 600 }}
              />
              
              <Typography variant="body2" color="textSecondary" paragraph>
                Member since: January 2024
              </Typography>
              
              <Typography variant="body2" color="textSecondary">
                Last login: Today, 10:30 AM
              </Typography>
            </CardContent>
          </Card>
          
          <Card className="card-hover" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon /> Security
              </Typography>
              
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              >
                Change Password
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
              >
                Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card className="card-hover">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Personal Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon /> Notifications
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.notifications}
                    onChange={(e) => setProfileData({ ...profileData, notifications: e.target.checked })}
                    color="primary"
                  />
                }
                label="Enable email notifications"
                sx={{ mb: 2 }}
              />
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaletteIcon /> Appearance
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.darkMode}
                    onChange={(e) => setProfileData({ ...profileData, darkMode: e.target.checked })}
                    color="primary"
                  />
                }
                label="Dark mode"
                sx={{ mb: 3 }}
              />
              
              <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                sx={{ px: 4 }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;