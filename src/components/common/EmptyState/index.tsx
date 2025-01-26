import React from 'react';
import { Box, Typography, Button, alpha } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = <InboxIcon sx={{ fontSize: 48 }} />,
  action
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        borderRadius: 2,
        bgcolor: theme => 
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.05)
            : alpha(theme.palette.common.black, 0.02),
        textAlign: 'center'
      }}
    >
      <Box 
        sx={{ 
          color: 'text.secondary',
          mb: 2
        }}
      >
        {Icon}
      </Box>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          mb: 1
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ mb: action ? 3 : 0 }}
      >
        {description}
      </Typography>
      {action && (
        <Button
          variant="contained"
          onClick={action.onClick}
          sx={{
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export type { EmptyStateProps }; 