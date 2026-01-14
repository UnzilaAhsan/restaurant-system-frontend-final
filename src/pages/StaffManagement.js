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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  Grid,
  Paper,
  Avatar,
  Switch,
  FormControlLabel,
  Tooltip,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AttachMoney as AttachMoneyIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'staff',
    salary: 0,
    rank: 'junior',
    phone: '',
    address: '',
    isActive: true
  });
  
  const { user } = useAuth();
  const { success, error, info } = useToast();

  // Get API URL from environment or use Render URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://restaurant-system-6.onrender.com';

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      
      // Check if user is admin
      if (user?.role !== 'admin') {
        error('Only admins can access staff management');
        return;
      }
      
      const response = await axios.get(`${API_URL}/api/staff`);
      
      if (response.data.success) {
        setStaff(response.data.data || []);
      } else {
        // Fallback to demo data
        setStaff(generateDemoStaff());
        info('Using demo staff data');
      }
    } catch (err) {
      console.error('Error fetching staff:', err);
      
      if (err.response?.status === 403 || err.response?.status === 401) {
        error('Access denied. Admin privileges required.');
      } else {
        // Fallback to demo data
        setStaff(generateDemoStaff());
        info('Using demo staff data (backend error)');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateDemoStaff = () => {
    return [
      {
        _id: 'admin123',
        username: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        salary: 75000,
        rank: 'executive',
        phone: '+1 (555) 123-4567',
        address: '123 Admin Street, New York, NY',
        joinDate: '2024-01-15',
        isActive: true
      },
      {
        _id: 'staff123',
        username: 'Staff Member',
        email: 'staff@example.com',
        role: 'staff',
        salary: 45000,
        rank: 'senior',
        phone: '+1 (555) 987-6543',
        address: '456 Staff Avenue, New York, NY',
        joinDate: '2024-02-20',
        isActive: true
      },
      {
        _id: 'staff456',
        username: 'Junior Staff',
        email: 'junior@example.com',
        role: 'staff',
        salary: 35000,
        rank: 'junior',
        phone: '+1 (555) 555-5555',
        address: '789 Junior Road, New York, NY',
        joinDate: '2024-03-10',
        isActive: true
      },
      {
        _id: 'staff789',
        username: 'Manager',
        email: 'manager@example.com',
        role: 'staff',
        salary: 60000,
        rank: 'manager',
        phone: '+1 (555) 111-2222',
        address: '101 Manager Blvd, New York, NY',
        joinDate: '2024-01-05',
        isActive: true
      }
    ];
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        // Update staff
        await axios.put(`${API_URL}/api/staff/${formData._id}`, formData);
        success('Staff updated successfully!');
      } else {
        // Create new staff
        await axios.post(`${API_URL}/api/staff`, formData);
        success('Staff member added successfully!');
      }
      
      fetchStaff();
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      console.error('Error saving staff:', err);
      
      // Simulate success in demo mode
      if (err.code === 'ERR_NETWORK') {
        if (editMode) {
          // Update in local state
          setStaff(prev => 
            prev.map(staffMember => 
              staffMember._id === formData._id ? formData : staffMember
            )
          );
        } else {
          // Add to local state
          setStaff(prev => [...prev, { 
            ...formData, 
            _id: Date.now().toString(),
            joinDate: new Date().toISOString().split('T')[0]
          }]);
        }
        success('Staff saved (demo mode)');
        setOpenDialog(false);
        resetForm();
      } else {
        error('Failed to save staff member');
      }
    }
  };

  const handleEdit = (staffMember) => {
    setFormData({
      _id: staffMember._id,
      username: staffMember.username,
      email: staffMember.email,
      password: '', // Don't show existing password
      role: staffMember.role,
      salary: staffMember.salary,
      rank: staffMember.rank,
      phone: staffMember.phone || '',
      address: staffMember.address || '',
      isActive: staffMember.isActive
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await axios.delete(`${API_URL}/api/staff/${id}`);
        success('Staff member deleted successfully!');
        fetchStaff();
      } catch (err) {
        console.error('Error deleting staff:', err);
        
        // Delete from local state in demo mode
        if (err.code === 'ERR_NETWORK') {
          setStaff(prev => prev.filter(staffMember => staffMember._id !== id));
          success('Staff deleted (demo mode)');
        } else {
          error('Failed to delete staff member');
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'staff',
      salary: 0,
      rank: 'junior',
      phone: '',
      address: '',
      isActive: true
    });
    setEditMode(false);
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 'executive': return '#ffd700';
      case 'manager': return '#ff00ff';
      case 'senior': return '#00ffff';
      case 'junior': return '#8a2be2';
      default: return '#666';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#8a2be2';
      case 'staff': return '#00cc66';
      default: return '#666';
    }
  };

  // Staff statistics
  const staffStats = {
    total: staff.length,
    active: staff.filter(s => s.isActive).length,
    inactive: staff.filter(s => !s.isActive).length,
    totalSalary: staff.reduce((sum, s) => sum + (s.salary || 0), 0)
  };

  return (
    <Box className="fade-in">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            👥 Staff Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage staff members, salaries, and ranks
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchStaff}
          >
            Refresh
          </Button>
          
          {user?.role === 'admin' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              className="btn-cinematic"
            >
              Add Staff
            </Button>
          )}
        </Box>
      </Box>

      {/* Check if user is admin */}
      {user?.role !== 'admin' ? (
        <Alert severity="warning" sx={{ mb: 4 }}>
          Admin privileges required to access staff management.
        </Alert>
      ) : (
        <>
          {/* Staff Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="card-cinematic">
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total Staff
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900 }}>
                    {staffStats.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card className="card-cinematic">
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Active Staff
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#00cc00' }}>
                    {staffStats.active}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card className="card-cinematic">
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total Salary
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#00ffff' }}>
                    ${staffStats.totalSalary.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card className="card-cinematic">
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Avg. Salary
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#ff00ff' }}>
                    ${staff.length > 0 ? Math.round(staffStats.totalSalary / staff.length).toLocaleString() : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Staff Table */}
          <Card className="card-cinematic">
            <CardContent>
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <LinearProgress sx={{ mb: 3 }} />
                  <Typography color="textSecondary">Loading staff...</Typography>
                </Box>
              ) : staff.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <PersonIcon sx={{ fontSize: 64, color: 'rgba(138, 43, 226, 0.3)', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No staff members found
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    Add your first staff member to get started
                  </Typography>
                  <Button
                    variant="contained"
                    className="btn-cinematic"
                    onClick={() => setOpenDialog(true)}
                  >
                    Add First Staff Member
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table className="table-cinematic">
                    <TableHead>
                      <TableRow>
                        <TableCell>Staff Member</TableCell>
                        <TableCell>Role & Rank</TableCell>
                        <TableCell>Salary</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {staff.map((staffMember) => (
                        <TableRow key={staffMember._id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ 
                                bgcolor: getRankColor(staffMember.rank),
                                width: 40,
                                height: 40
                              }}>
                                {staffMember.username?.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {staffMember.username}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {staffMember.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Chip
                                label={staffMember.role}
                                size="small"
                                icon={<SecurityIcon />}
                                sx={{ 
                                  background: getRoleColor(staffMember.role),
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                              <Chip
                                label={staffMember.rank}
                                size="small"
                                icon={<WorkIcon />}
                                sx={{ 
                                  background: getRankColor(staffMember.rank),
                                  color: 'white',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AttachMoneyIcon fontSize="small" />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                ${(staffMember.salary || 0).toLocaleString()}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="textSecondary">
                              Monthly
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              <PhoneIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                              {staffMember.phone || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {staffMember.address || 'No address'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={staffMember.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                              label={staffMember.isActive ? 'Active' : 'Inactive'}
                              color={staffMember.isActive ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Tooltip title="Edit Staff">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEdit(staffMember)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Delete Staff">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(staffMember._id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Add/Edit Staff Dialog */}
          <Dialog open={openDialog} onClose={() => { setOpenDialog(false); resetForm(); }} maxWidth="md" fullWidth>
            <DialogTitle>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {editMode ? 'Edit Staff Member' : 'Add New Staff Member'}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                
                {!editMode && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editMode}
                      InputProps={{
                        startAdornment: <SecurityIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>
                )}
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  >
                    <MenuItem value="staff">Staff</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Rank"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    required
                  >
                    <MenuItem value="junior">Junior</MenuItem>
                    <MenuItem value="senior">Senior</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="executive">Executive</MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Salary ($)"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                    InputProps={{
                      startAdornment: <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        color="primary"
                      />
                    }
                    label="Active Staff Member"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => { setOpenDialog(false); resetForm(); }}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                className="btn-cinematic"
                disabled={!formData.username || !formData.email || (!editMode && !formData.password)}
              >
                {editMode ? 'Update' : 'Add Staff'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default StaffManagement;