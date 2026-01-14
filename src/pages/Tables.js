import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
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
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Chair as ChairIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: 2,
    location: 'indoors',
    status: 'available',
    description: ''
  });
  
  const { user } = useAuth();
  const { success, error, info } = useToast();

  // Get API URL from environment or use Render URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://restaurant-system-6.onrender.com';

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/tables`);
      
      if (response.data.success) {
        setTables(response.data.data || []);
      } else {
        // Fallback to demo data
        setTables(generateDemoTables());
        info('Using demo tables data');
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
      // Fallback to demo data
      setTables(generateDemoTables());
      info('Using demo tables data (backend error)');
    } finally {
      setLoading(false);
    }
  };

  const generateDemoTables = () => {
    return [
      { _id: '1', tableNumber: 'T01', capacity: 2, location: 'indoors', status: 'available' },
      { _id: '2', tableNumber: 'T02', capacity: 4, location: 'indoors', status: 'available' },
      { _id: '3', tableNumber: 'T03', capacity: 6, location: 'outdoors', status: 'occupied' },
      { _id: '4', tableNumber: 'T04', capacity: 2, location: 'balcony', status: 'reserved' },
      { _id: '5', tableNumber: 'T05', capacity: 8, location: 'private', status: 'available', description: 'Private dining room' },
      { _id: '6', tableNumber: 'T06', capacity: 4, location: 'indoors', status: 'available' }
    ];
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        // Update table
        await axios.put(`${API_URL}/api/tables/${formData._id}`, formData);
        success('Table updated successfully!');
      } else {
        // Create new table
        await axios.post(`${API_URL}/api/tables`, formData);
        success('Table created successfully!');
      }
      
      fetchTables();
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      console.error('Error saving table:', err);
      
      // Simulate success in demo mode
      if (err.code === 'ERR_NETWORK') {
        if (editMode) {
          // Update in local state
          setTables(prev => 
            prev.map(table => 
              table._id === formData._id ? formData : table
            )
          );
        } else {
          // Add to local state
          setTables(prev => [...prev, { ...formData, _id: Date.now().toString() }]);
        }
        success('Table saved (demo mode)');
        setOpenDialog(false);
        resetForm();
      } else {
        error('Failed to save table');
      }
    }
  };

  const handleEdit = (table) => {
    setFormData({
      _id: table._id,
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      location: table.location,
      status: table.status,
      description: table.description || ''
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await axios.delete(`${API_URL}/api/tables/${id}`);
        success('Table deleted successfully!');
        fetchTables();
      } catch (err) {
        console.error('Error deleting table:', err);
        
        // Delete from local state in demo mode
        if (err.code === 'ERR_NETWORK') {
          setTables(prev => prev.filter(table => table._id !== id));
          success('Table deleted (demo mode)');
        } else {
          error('Failed to delete table');
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tableNumber: '',
      capacity: 2,
      location: 'indoors',
      status: 'available',
      description: ''
    });
    setEditMode(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return { color: 'success', bg: '#00cc00', label: 'Available' };
      case 'occupied': return { color: 'error', bg: '#ff4444', label: 'Occupied' };
      case 'reserved': return { color: 'warning', bg: '#ff9900', label: 'Reserved' };
      case 'maintenance': return { color: 'default', bg: '#666666', label: 'Maintenance' };
      default: return { color: 'default', bg: '#9e9e9e', label: 'Unknown' };
    }
  };

  const getLocationColor = (location) => {
    switch (location) {
      case 'indoors': return '#8a2be2';
      case 'outdoors': return '#00cc66';
      case 'balcony': return '#0099cc';
      case 'private': return '#ff00ff';
      default: return '#666666';
    }
  };

  // Table statistics
  const tableStats = {
    total: tables.length,
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length
  };

  return (
    <Box className="fade-in">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            🪑 Table Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage restaurant tables and their status
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchTables}
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
              Add Table
            </Button>
          )}
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography color="textSecondary" variant="body2" gutterBottom>
                Total Tables
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                {tableStats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography color="textSecondary" variant="body2" gutterBottom>
                Available
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#00cc00' }}>
                {tableStats.available}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography color="textSecondary" variant="body2" gutterBottom>
                Occupied
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#ff4444' }}>
                {tableStats.occupied}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography color="textSecondary" variant="body2" gutterBottom>
                Reserved
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#ff9900' }}>
                {tableStats.reserved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tables Table */}
      <Card className="card-cinematic">
        <CardContent>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <LinearProgress sx={{ mb: 3 }} />
              <Typography color="textSecondary">Loading tables...</Typography>
            </Box>
          ) : tables.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <ChairIcon sx={{ fontSize: 64, color: 'rgba(138, 43, 226, 0.3)', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No tables found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Add your first table to get started
              </Typography>
              {user?.role === 'admin' && (
                <Button
                  variant="contained"
                  className="btn-cinematic"
                  onClick={() => setOpenDialog(true)}
                >
                  Add First Table
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer>
              <Table className="table-cinematic">
                <TableHead>
                  <TableRow>
                    <TableCell>Table Number</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    {user?.role === 'admin' && <TableCell align="right">Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tables.map((table) => {
                    const status = getStatusColor(table.status);
                    const locationColor = getLocationColor(table.location);
                    
                    return (
                      <TableRow key={table._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              bgcolor: locationColor,
                              width: 40,
                              height: 40
                            }}>
                              {table.tableNumber}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {table.tableNumber}
                              </Typography>
                              {table.description && (
                                <Typography variant="caption" color="textSecondary">
                                  {table.description}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<PeopleIcon />}
                            label={`${table.capacity} seats`}
                            size="small"
                            className="chip-purple"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<LocationIcon />}
                            label={table.location}
                            size="small"
                            sx={{ 
                              background: `${locationColor}20`,
                              color: locationColor,
                              border: `1px solid ${locationColor}40`
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={table.status === 'available' ? <CheckCircleIcon /> : <CancelIcon />}
                            label={status.label}
                            color={status.color}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        {user?.role === 'admin' && (
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Tooltip title="Edit Table">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEdit(table)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Delete Table">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(table._id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Table Dialog */}
      <Dialog open={openDialog} onClose={() => { setOpenDialog(false); resetForm(); }} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {editMode ? 'Edit Table' : 'Add New Table'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Table Number"
                value={formData.tableNumber}
                onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                required
                placeholder="e.g., T01, T02"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 2 })}
                required
                InputProps={{ inputProps: { min: 1, max: 20 } }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              >
                <MenuItem value="indoors">Indoors</MenuItem>
                <MenuItem value="outdoors">Outdoors</MenuItem>
                <MenuItem value="balcony">Balcony</MenuItem>
                <MenuItem value="private">Private Room</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="occupied">Occupied</MenuItem>
                <MenuItem value="reserved">Reserved</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (Optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={2}
                placeholder="e.g., Near window, Private booth, VIP section"
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
            disabled={!formData.tableNumber || !formData.capacity}
          >
            {editMode ? 'Update Table' : 'Add Table'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tables;