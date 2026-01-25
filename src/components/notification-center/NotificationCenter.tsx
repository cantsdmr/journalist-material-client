import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  List,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNotificationCenter } from '@/contexts/NotificationCenterContext';
import NotificationItem from './NotificationItem';

/**
 * NotificationCenter Component
 * Main drawer component for displaying in-app notifications
 * Features:
 * - Infinite scroll
 * - Mark all as read
 * - Empty state
 * - Responsive design
 */
const NotificationCenter: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { notifications, isOpen, isLoading, hasMore, actions } = useNotificationCenter();

  const drawerWidth = isMobile ? '100%' : 400;

  /**
   * Handle drawer close
   */
  const handleClose = () => {
    actions.closeDrawer();
  };

  /**
   * Handle mark all as read
   */
  const handleMarkAllAsRead = async () => {
    await actions.markAllAsRead();
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
        px: 3
      }}
    >
      <NotificationsNoneIcon
        sx={{
          fontSize: 80,
          color: theme.palette.text.disabled,
          mb: 2
        }}
      />
      <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
        No notifications
      </Typography>
      <Typography variant="body2" sx={{ color: theme.palette.text.disabled, textAlign: 'center' }}>
        You're all caught up! Check back later for new updates.
      </Typography>
    </Box>
  );

  /**
   * Render loader
   */
  const renderLoader = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
      <CircularProgress size={32} />
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: drawerWidth,
          bgcolor: 'background.default'
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: 'sticky',
          top: 0,
          bgcolor: 'background.default',
          zIndex: 1
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Notifications
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Mark all as read button */}
          {1 > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllAsRead}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                color: theme.palette.primary.main
              }}
            >
              Mark all read
            </Button>
          )}

          {/* Close button */}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ height: 'calc(100vh - 65px)', overflow: 'auto' }} id="notification-scroll-container">
        {isLoading && notifications.length === 0 ? (
          renderLoader()
        ) : notifications.length === 0 ? (
          renderEmptyState()
        ) : (
          <InfiniteScroll
            dataLength={notifications.length}
            next={actions.loadMore}
            hasMore={hasMore}
            loader={renderLoader()}
            scrollableTarget="notification-scroll-container"
            endMessage={
              <Box sx={{ py: 2, textAlign: 'center' }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                  You've reached the end
                </Typography>
              </Box>
            }
          >
            <List sx={{ py: 0 }}>
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </List>
          </InfiniteScroll>
        )}
      </Box>
    </Drawer>
  );
};

export default NotificationCenter;
