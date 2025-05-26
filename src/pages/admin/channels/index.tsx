import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { VideoLibrary as ChannelsIcon } from '@mui/icons-material';

const ChannelManagement: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ChannelsIcon sx={{ fontSize: 32, mr: 2 }} />
        <Typography variant="h4" component="h1">
          Channel Management
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <ChannelsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Channel Management Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This section will include channel moderation, content management, and channel analytics.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ChannelManagement; 