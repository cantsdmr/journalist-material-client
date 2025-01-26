// implements error screen
import React from 'react';
import { Box, Typography } from '@mui/material';

interface ErrorScreenProps {
  error: Error;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error }) => {
  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2
    }}>
      <Typography variant="h4" color="error">
        An error occurred
      </Typography>
      <Typography color="text.secondary">
        {error.message}
      </Typography>
    </Box>
  );
};

export default ErrorScreen;