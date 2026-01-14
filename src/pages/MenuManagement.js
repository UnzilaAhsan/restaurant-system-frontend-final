import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as LocalOfferIcon,
  Star as StarIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Grilled Salmon',
      category: 'Main Course',
      price: 28.99,
      description: 'Fresh Atlantic salmon with lemon butter sauce',
      isAvailable: true,
      popularity: 4.8
    },
    {
      id: 2,
      name: 'Caesar Salad',
      category: 'Appetizer',
      price: 12.99,
      description: 'Crisp romaine lettuce with Caesar dressing',
      isAvailable: true,
      popularity: 4.5
    },
    {
      id: 3,
      name: 'Chocolate Lava Cake',
      category: 'Dessert',
      price: 9.99,
      description: 'Warm chocolate cake with molten center',
      isAvailable: true,
      popularity: 4.9
    },
    {
      id: 4,
      name: 'Mango Smoothie',
      category: 'Beverage',
      price: 6.99,
      description: 'Fresh mango blend with yogurt',
      isAvailable: true,
      popularity: 4.7
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    description: '',
    isAvailable: true
  });

  const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Side Dish'];

  const handleSubmit = () => {
    if (formData.id) {
      // Edit existing item
      setMenuItems(menuItems.map(item => 
        item.id === formData.id ? formData : item
      ));
    } else {
      // Add new item
      setMenuItems([...menuItems, {
        ...formData,
        id: menuItems.length + 1,
        popularity: 4.0
      }]);
    }
    setOpenDialog(false);
    resetForm();
  };

  const handleEdit = (item) => {
    setFormData(item);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Main Course',
      price: '',
      description: '',
      isAvailable: true
    });
  };

  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            🍽️ Menu Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your restaurant menu items and categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          className="btn-cinematic"
          sx={{ px: 4 }}
        >
          Add Menu Item
        </Button>
      </Box>

      {/* Menu Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                {menuItems.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Categories
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                {new Set(menuItems.map(item => item.category)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Available Items
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                {menuItems.filter(item => item.isAvailable).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Avg. Price
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                ${(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Menu Items Table */}
      <Card className="card-cinematic">
        <CardContent>
          <TableContainer>
            <Table className="table-cinematic">
              <TableHead>
                <TableRow>
                  <TableCell>Menu Item</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Popularity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.category}
                        size="small"
                        icon={<CategoryIcon />}
                        className="chip-purple"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#00ffff' }}>
                        ${item.price}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon fontSize="small" sx={{ color: '#ffd700' }} />
                        <Typography variant="body2">
                          {item.popularity}/5.0
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.isAvailable ? 'Available' : 'Unavailable'}
                        color={item.isAvailable ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(item)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => { setOpenDialog(false); resetForm(); }} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {formData.id ? 'Edit Menu Item' : 'Add New Menu Item'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Item Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                InputProps={{
                  startAdornment: <RestaurantIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price ($)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
                InputProps={{
                  startAdornment: <LocalOfferIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Chip
                label={formData.isAvailable ? 'Available' : 'Unavailable'}
                color={formData.isAvailable ? 'success' : 'error'}
                onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                clickable
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
            sx={{ px: 4 }}
          >
            {formData.id ? 'Update' : 'Add Item'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuManagement;