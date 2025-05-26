import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { Analytics as AnalyticsIcon } from '@mui/icons-material';

const PlatformAnalytics: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <AnalyticsIcon sx={{ fontSize: 32, mr: 2 }} />
        <Typography variant="h4" component="h1">
          Platform Analytics
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <AnalyticsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Platform Analytics Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This section will include comprehensive platform analytics, user behavior, and performance metrics.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PlatformAnalytics; 