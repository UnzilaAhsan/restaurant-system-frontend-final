import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import { Star, EmojiEvents, LocalOffer } from '@mui/icons-material';

const Loyalty = () => {
  return (
    <Box className="fade-in">
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        🎁 Loyalty Program
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Rewards, points, and special offers for customers
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star /> Your Points
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 2 }} className="gradient-text">
                1,250
              </Typography>
              <Typography color="textSecondary">
                250 points to next reward level
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEvents /> Current Tier
              </Typography>
              <Chip label="Silver Member" className="chip-purple" sx={{ fontSize: '1.2rem', px: 2, py: 1 }} />
              <Typography color="textSecondary" sx={{ mt: 2 }}>
                5 more visits to reach Gold Tier
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Loyalty;