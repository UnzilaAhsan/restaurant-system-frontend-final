import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Backup as BackupIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    restaurantName: 'RestaurantPro',
    email: 'contact@restaurantpro.com',
    phone: '+1 (555) 123-4567',
    address: '123 Restaurant Street, New York, NY 10001',
    currency: 'USD',
    timezone: 'America/New_York',
    
    // Notification settings
    emailNotifications: true,
    smsNotifications: false,
    reservationReminders: true,
    marketingEmails: false,
    
    // System settings
    autoConfirmReservations: false,
    allowWalkIns: true,
    maxPartySize: 20,
    advanceBookingDays: 30,
    
    // Appearance
    themeColor: '#8a2be2',
    darkMode: true,
    
    // Security
    require2FA: false,
    sessionTimeout: 30,
    passwordExpiryDays: 90
  });

  const handleSave = () => {
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings?')) {
      // Reset to default
      setSettings({
        restaurantName: 'RestaurantPro',
        email: 'contact@restaurantpro.com',
        phone: '+1 (555) 123-4567',
        address: '123 Restaurant Street, New York, NY 10001',
        currency: 'USD',
        timezone: 'America/New_York',
        emailNotifications: true,
        smsNotifications: false,
        reservationReminders: true,
        marketingEmails: false,
        autoConfirmReservations: false,
        allowWalkIns: true,
        maxPartySize: 20,
        advanceBookingDays: 30,
        themeColor: '#8a2be2',
        darkMode: true,
        require2FA: false,
        sessionTimeout: 30,
        passwordExpiryDays: 90
      });
    }
  };

  return (
    <Box className="fade-in">
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        ⚙️ System Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Restaurant Information */}
        <Grid item xs={12}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon /> Restaurant Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Restaurant Name"
                    value={settings.restaurantName}
                    onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={settings.currency}
                      onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      label="Currency"
                    >
                      <MenuItem value="USD">USD ($)</MenuItem>
                      <MenuItem value="EUR">EUR (€)</MenuItem>
                      <MenuItem value="GBP">GBP (£)</MenuItem>
                      <MenuItem value="CAD">CAD (C$)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon /> Notification Settings
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.smsNotifications}
                      onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="SMS Notifications"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.reservationReminders}
                      onChange={(e) => setSettings({ ...settings, reservationReminders: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Reservation Reminders"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.marketingEmails}
                      onChange={(e) => setSettings({ ...settings, marketingEmails: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Marketing Emails"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Reservation Settings */}
        <Grid item xs={12} md={6}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon /> Reservation Settings
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoConfirmReservations}
                      onChange={(e) => setSettings({ ...settings, autoConfirmReservations: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Auto-Confirm Reservations"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowWalkIns}
                      onChange={(e) => setSettings({ ...settings, allowWalkIns: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Allow Walk-ins"
                />
                
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Maximum Party Size: {settings.maxPartySize}
                  </Typography>
                  <Slider
                    value={settings.maxPartySize}
                    onChange={(e, value) => setSettings({ ...settings, maxPartySize: value })}
                    min={2}
                    max={50}
                    valueLabelDisplay="auto"
                  />
                </Box>
                
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Advance Booking: {settings.advanceBookingDays} days
                  </Typography>
                  <Slider
                    value={settings.advanceBookingDays}
                    onChange={(e, value) => setSettings({ ...settings, advanceBookingDays: value })}
                    min={1}
                    max={365}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon /> Security Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.require2FA}
                        onChange={(e) => setSettings({ ...settings, require2FA: e.target.checked })}
                        color="primary"
                      />
                    }
                    label="Require 2FA"
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Session Timeout: {settings.sessionTimeout} minutes
                    </Typography>
                    <Slider
                      value={settings.sessionTimeout}
                      onChange={(e, value) => setSettings({ ...settings, sessionTimeout: value })}
                      min={5}
                      max={120}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Password Expiry: {settings.passwordExpiryDays} days
                    </Typography>
                    <Slider
                      value={settings.passwordExpiryDays}
                      onChange={(e, value) => setSettings({ ...settings, passwordExpiryDays: value })}
                      min={30}
                      max={365}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Appearance Settings */}
        <Grid item xs={12}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaletteIcon /> Appearance Settings
              </Typography>
              
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.darkMode}
                        onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                        color="primary"
                      />
                    }
                    label="Dark Mode"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">Theme Color:</Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: settings.themeColor,
                        cursor: 'pointer',
                        border: '2px solid white',
                        boxShadow: '0 0 10px rgba(0,0,0,0.3)'
                      }}
                    />
                    <Chip label={settings.themeColor} />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Backup & Export */}
        <Grid item xs={12}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BackupIcon /> Backup & Export
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ReceiptIcon />}
                    sx={{ py: 1.5 }}
                  >
                    Export Reservations
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<BackupIcon />}
                    sx={{ py: 1.5 }}
                  >
                    Backup Database
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    sx={{ py: 1.5 }}
                    onClick={handleReset}
                  >
                    Reset Settings
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    className="btn-cinematic"
                    onClick={handleSave}
                    sx={{ py: 1.5 }}
                  >
                    Save All Settings
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemSettings;