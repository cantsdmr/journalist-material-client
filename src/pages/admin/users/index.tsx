import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { People as UsersIcon } from '@mui/icons-material';

const UserManagement: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <UsersIcon sx={{ fontSize: 32, mr: 2 }} />
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <UsersIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            User Management Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This section will include user management, roles, permissions, and user analytics.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserManagement; 