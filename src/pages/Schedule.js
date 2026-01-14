import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import { CalendarToday, AccessTime, Person } from '@mui/icons-material';

const Schedule = () => {
  return (
    <Box className="fade-in">
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        📅 Today's Schedule
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Staff schedule and shift management
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Today's Shifts
              </Typography>
              <Typography color="textSecondary">
                Shift management feature will be implemented soon.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Schedule;