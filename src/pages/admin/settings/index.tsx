import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

const AdminSettings: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <SettingsIcon sx={{ fontSize: 32, mr: 2 }} />
        <Typography variant="h4" component="h1">
          Admin Settings
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <SettingsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Admin Settings Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This section will include platform configuration, system settings, and administrative preferences.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminSettings; 