import React from 'react';
import { IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotificationCenter } from '@/contexts/NotificationCenterContext';

/**
 * NotificationBell Component
 * Displays notification bell icon with new notifications count badge (YouTube-style)
 * Shows count of notifications created since last check (not unread count)
 * Positioned in MainLayout app bar
 */
const NotificationBell: React.FC = () => {
  const { newCount, actions } = useNotificationCenter();

  const handleClick = () => {
    actions.toggleDrawer();
  };

  return (
    <IconButton
      color="inherit"
      onClick={handleClick}
      aria-label="notifications"
      sx={{
        '& .MuiBadge-badge': {
          right: 5,
          top: 5,
          fontSize: '0.75rem',
          height: 18,
          minWidth: 18,
          padding: '0 4px'
        }
      }}
    >
      <Badge
        badgeContent={newCount}
        color="error"
        max={99}
        overlap="circular"
      >
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationBell;
