import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import PaymentIcon from '@mui/icons-material/Payment';
import InfoIcon from '@mui/icons-material/Info';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Notification } from '@/types/index';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useNotificationCenter } from '@/contexts/NotificationCenterContext';
import { NOTIFICATION_CATEGORY } from '@/enums/NotificationEnums';

interface NotificationItemProps {
  notification: Notification;
}

/**
 * NotificationItem Component
 * Displays individual notification with avatar, title, message, timestamp, and actions
 */
const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { actions } = useNotificationCenter();

  /**
   * Get notification icon based on type/category
   */
  const getNotificationIcon = () => {
    // You can customize these based on your notification types
    switch (notification.categoryId) {
      case NOTIFICATION_CATEGORY.SUBSCRIPTION:
        return <SubscriptionsIcon />;
      case NOTIFICATION_CATEGORY.PAYMENT:
      case NOTIFICATION_CATEGORY.PAYOUT:
        return <PaymentIcon />;
      default:
        return <InfoIcon />;
    }
  };

  /**
   * Get notification color based on type/category
   */
  const getNotificationColor = () => {
    switch (notification.categoryId) {
      case NOTIFICATION_CATEGORY.SUBSCRIPTION:
        return theme.palette.primary.main;
      case NOTIFICATION_CATEGORY.PAYMENT:
      case NOTIFICATION_CATEGORY.PAYOUT:
        return theme.palette.success.main;
      case NOTIFICATION_CATEGORY.CHANNEL:
        return theme.palette.secondary.main;
      case NOTIFICATION_CATEGORY.SYSTEM:
        return theme.palette.warning.main;
      default:
        return theme.palette.info.main;
    }
  };

  /**
   * Handle notification click - mark as read and navigate
   */
  const handleClick = async () => {
    if (!notification.isRead) {
      await actions.markAsRead(notification.id);
    }

    // Navigate based on notification data
    if (notification.data?.url) {
      navigate(notification.data.url);
      actions.closeDrawer();
    }
  };

  /**
   * Format timestamp to relative time
   */
  const getRelativeTime = () => {
    try {
      return formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <ListItem
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        bgcolor: notification.isRead ? 'transparent' : theme.palette.action.hover,
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 2,
        px: 2,
        '&:hover': {
          bgcolor: theme.palette.action.selected
        },
        position: 'relative'
      }}
    >
      {/* Unread indicator dot */}
      {!notification.isRead && (
        <FiberManualRecordIcon
          sx={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 12,
            color: theme.palette.primary.main,
            zIndex: 1
          }}
        />
      )}

      {/* Avatar */}
      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor: getNotificationColor(),
            width: 40,
            height: 40
          }}
        >
          {getNotificationIcon()}
        </Avatar>
      </ListItemAvatar>

      {/* Content */}
      <ListItemText
        primary={
          <Typography
            variant="body2"
            sx={{
              fontWeight: notification.isRead ? 400 : 600,
              color: theme.palette.text.primary,
              mb: 0.5
            }}
          >
            {notification.title}
          </Typography>
        }
        secondary={
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.875rem',
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {notification.message}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                fontSize: '0.75rem'
              }}
            >
              {getRelativeTime()}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
};

export default NotificationItem;
