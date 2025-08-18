import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Toolbar,
  useTheme,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Article as NewsIcon,
  Poll as PollIcon,
  Tv as ChannelIcon,
  Receipt as ExpenseIcon,
  Payment as PayoutIcon,
  Subscriptions as SubscriptionIcon,
  People as UsersIcon,
  Tag as TagIcon,
  Home as HomeIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATHS } from '@/constants/paths';

const drawerWidth = 280;

interface AdminSidebarProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onDrawerToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: PATHS.ADMIN_ROOT,
      exact: true 
    },
    { 
      text: 'News Management', 
      icon: <NewsIcon />, 
      path: PATHS.ADMIN_NEWS 
    },
    { 
      text: 'Poll Management', 
      icon: <PollIcon />, 
      path: PATHS.ADMIN_POLLS 
    },
    { 
      text: 'Channel Management', 
      icon: <ChannelIcon />, 
      path: PATHS.ADMIN_CHANNELS 
    },
    { 
      text: 'User Management', 
      icon: <UsersIcon />, 
      path: PATHS.ADMIN_USERS 
    },
    { 
      text: 'Expense Orders', 
      icon: <ExpenseIcon />, 
      path: PATHS.ADMIN_EXPENSE_ORDERS 
    },
    { 
      text: 'Payout Management', 
      icon: <PayoutIcon />, 
      path: PATHS.ADMIN_PAYOUTS 
    },
    { 
      text: 'Tag Management', 
      icon: <TagIcon />, 
      path: PATHS.ADMIN_TAGS 
    },
    { 
      text: 'Subscriptions', 
      icon: <SubscriptionIcon />, 
      path: PATHS.ADMIN_SUBSCRIPTIONS 
    },
    { 
      text: 'Analytics', 
      icon: <AnalyticsIcon />, 
      path: PATHS.ADMIN_ANALYTICS 
    },
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      path: PATHS.ADMIN_SETTINGS 
    }
  ];

  const isActive = (item: typeof adminMenuItems[0]) => {
    if (item.exact) {
      return location.pathname === item.path || 
             (location.pathname === '/admin' && item.path === PATHS.ADMIN_ROOT);
    }
    return location.pathname.startsWith(item.path);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      onDrawerToggle();
    }
  };

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          px: 3,
          py: 2,
          bgcolor: 'error.main',
          color: 'error.contrastText'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              fontWeight: 700,
              flexGrow: 1,
              fontFamily: "'Inter', -apple-system, sans-serif"
            }}
          >
            Admin Panel
          </Typography>
          <Chip 
            label="Admin"
            size="small"
            sx={{ 
              bgcolor: 'error.contrastText',
              color: 'error.main',
              fontWeight: 600
            }}
          />
        </Box>
      </Toolbar>
      
      <Divider />
      
      <List sx={{ pt: 2, px: 2 }}>
        {adminMenuItems.map((item) => {
          const active = isActive(item);
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  minHeight: 48,
                  bgcolor: active ? 'error.main' : 'transparent',
                  color: active ? 'error.contrastText' : 'text.primary',
                  '&:hover': {
                    bgcolor: active ? 'error.dark' : 'action.hover',
                  },
                  '& .MuiListItemIcon-root': {
                    color: active ? 'error.contrastText' : 'text.secondary',
                    minWidth: 36,
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 600 : 500,
                    fontFamily: "'Inter', -apple-system, sans-serif"
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <List sx={{ px: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigate(PATHS.APP_ROOT)}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1.5,
              minHeight: 48,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'text.secondary', minWidth: 36 }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Back to App"
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 500,
                fontFamily: "'Inter', -apple-system, sans-serif"
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderRightColor: 'divider'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderRightColor: 'divider'
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;