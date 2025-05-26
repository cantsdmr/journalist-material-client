import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as UsersIcon,
  VideoLibrary as ChannelsIcon,
  Subscriptions as SubscriptionsIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  ManageAccounts,
  TrendingUp,
  AttachMoney
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { PATHS } from '@/constants/paths';

const drawerWidth = 280;

interface NavigationItem {
  text: string;
  icon: React.ReactElement;
  path?: string;
  children?: NavigationItem[];
}

const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [subscriptionsOpen, setSubscriptionsOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: PATHS.ADMIN_DASHBOARD
    },
    {
      text: 'User Management',
      icon: <UsersIcon />,
      path: PATHS.ADMIN_USERS
    },
    {
      text: 'Channel Management',
      icon: <ChannelsIcon />,
      path: PATHS.ADMIN_CHANNELS
    },
    {
      text: 'Subscriptions',
      icon: <SubscriptionsIcon />,
      children: [
        {
          text: 'Overview',
          icon: <SubscriptionsIcon />,
          path: PATHS.ADMIN_SUBSCRIPTIONS
        },
        {
          text: 'Management',
          icon: <ManageAccounts />,
          path: PATHS.ADMIN_SUBSCRIPTION_MANAGEMENT
        },
        {
          text: 'Analytics',
          icon: <TrendingUp />,
          path: PATHS.ADMIN_SUBSCRIPTION_ANALYTICS
        },
        {
          text: 'Revenue',
          icon: <AttachMoney />,
          path: PATHS.ADMIN_SUBSCRIPTION_REVENUE
        }
      ]
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleSubscriptionsToggle = () => {
    setSubscriptionsOpen(!subscriptionsOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderNavigationItem = (item: NavigationItem, depth = 0) => {
    if (item.children) {
      const isSubscriptions = item.text === 'Subscriptions';
      const isOpen = isSubscriptions ? subscriptionsOpen : false;
      
      return (
        <React.Fragment key={item.text}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={isSubscriptions ? handleSubscriptionsToggle : undefined}
              sx={{
                pl: 2 + depth * 2,
                backgroundColor: isActive(PATHS.ADMIN_SUBSCRIPTIONS) ? 'action.selected' : 'transparent'
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderNavigationItem(child, depth + 1))}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    return (
      <ListItem key={item.text} disablePadding>
        <ListItemButton
          onClick={() => item.path && handleNavigate(item.path)}
          sx={{
            pl: 2 + depth * 2,
            backgroundColor: item.path && isActive(item.path) ? 'action.selected' : 'transparent'
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    );
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map((item) => renderNavigationItem(item))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Administration
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout; 