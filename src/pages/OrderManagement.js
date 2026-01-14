import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const OrderManagement = () => {
  return (
    <Box className="fade-in">
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        🍽️ Order Management
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Customer orders and kitchen management
      </Typography>
      
      <Card className="card-cinematic">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Order Management System
          </Typography>
          <Typography color="textSecondary">
            This module will be implemented in the next release. It will include:
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li>Real-time order tracking</li>
              <li>Kitchen display system</li>
              <li>Order history and analytics</li>
              <li>Bill splitting and payment processing</li>
            </ul>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderManagement;