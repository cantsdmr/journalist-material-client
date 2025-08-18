import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Skeleton,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Subscriptions as SubscriptionsIcon,
  VideoLibrary as ChannelsIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  TrendingUp,
  AttachMoney,
  Group
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApiContext } from '@/contexts/ApiContext';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';

interface DashboardStats {
  totalUsers: number;
  totalChannels: number;
  totalSubscriptions: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  newUsersThisMonth: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { api } = useApiContext();
  const { execute } = useApiCall();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    
    // Fetch analytics data for dashboard
    const [subscriptionAnalytics, revenueMetrics] = await Promise.all([
      execute(
        () => api.subscriptionApi.getSubscriptionAnalytics({ period: '30d' }),
        { showErrorToast: true }
      ),
      execute(
        () => api.subscriptionApi.getRevenueMetrics({ period: '30d' }),
        { showErrorToast: true }
      )
    ]);
    
    if (subscriptionAnalytics && revenueMetrics) {
      // Calculate monthly revenue safely
      let monthlyRevenue = 0;
      if (revenueMetrics.metrics?.[0]?.channels) {
        const channels = revenueMetrics.metrics[0].channels;
        for (const channelKey in channels) {
          const channel = channels[channelKey] as any;
          monthlyRevenue += channel.revenue || 0;
        }
      }
      
      // Mock data for other stats (in real implementation, you'd have dedicated endpoints)
      const mockStats: DashboardStats = {
        totalUsers: 12543,
        totalChannels: 1247,
        totalSubscriptions: subscriptionAnalytics.total_subscriptions,
        monthlyRevenue,
        activeSubscriptions: subscriptionAnalytics.active_subscriptions,
        newUsersThisMonth: 342
      };
      
      setStats(mockStats);
    }
    
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const adminSections = [
    {
      title: 'News Management',
      description: 'Manage news articles and moderate content',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      path: PATHS.ADMIN_NEWS,
      color: '#1976d2'
    },
    {
      title: 'Poll Management',
      description: 'Oversee polls and voting analytics',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      path: PATHS.ADMIN_POLLS,
      color: '#7b1fa2'
    },
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: <UsersIcon sx={{ fontSize: 40 }} />,
      path: PATHS.ADMIN_USERS,
      color: '#388e3c'
    },
    {
      title: 'Channel Management',
      description: 'Oversee channels and content moderation',
      icon: <ChannelsIcon sx={{ fontSize: 40 }} />,
      path: PATHS.ADMIN_CHANNELS,
      color: '#f57c00'
    },
    {
      title: 'Expense Orders',
      description: 'Review and approve expense claims',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      path: PATHS.ADMIN_EXPENSE_ORDERS,
      color: '#d32f2f'
    },
    {
      title: 'Payout Management',
      description: 'Process payouts and financial transactions',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      path: PATHS.ADMIN_PAYOUTS,
      color: '#2e7d32'
    },
    {
      title: 'Tag Management',
      description: 'Moderate tags and manage taxonomy',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      path: PATHS.ADMIN_TAGS,
      color: '#795548'
    },
    {
      title: 'Subscription Management',
      description: 'Monitor subscriptions and billing',
      icon: <SubscriptionsIcon sx={{ fontSize: 40 }} />,
      path: PATHS.ADMIN_SUBSCRIPTIONS,
      color: '#ff5722'
    },
    {
      title: 'Analytics',
      description: 'Platform analytics and insights',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      path: PATHS.ADMIN_ANALYTICS,
      color: '#9c27b0'
    },
    {
      title: 'Settings',
      description: 'Platform configuration and settings',
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      path: PATHS.ADMIN_SETTINGS,
      color: '#5d4037'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <DashboardIcon sx={{ fontSize: 32, mr: 2 }} />
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Group sx={{ fontSize: 24, mr: 1, color: '#1976d2' }} />
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h4">
                {loading ? <Skeleton width={80} /> : stats?.totalUsers.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {loading ? <Skeleton width={120} /> : `+${stats?.newUsersThisMonth} this month`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChannelsIcon sx={{ fontSize: 24, mr: 1, color: '#388e3c' }} />
                <Typography color="textSecondary" gutterBottom>
                  Total Channels
                </Typography>
              </Box>
              <Typography variant="h4">
                {loading ? <Skeleton width={80} /> : stats?.totalChannels.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SubscriptionsIcon sx={{ fontSize: 24, mr: 1, color: '#f57c00' }} />
                <Typography color="textSecondary" gutterBottom>
                  Active Subscriptions
                </Typography>
              </Box>
              <Typography variant="h4">
                {loading ? <Skeleton width={80} /> : stats?.activeSubscriptions.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {loading ? <Skeleton width={120} /> : `${stats?.totalSubscriptions} total`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ fontSize: 24, mr: 1, color: '#7b1fa2' }} />
                <Typography color="textSecondary" gutterBottom>
                  Monthly Revenue
                </Typography>
              </Box>
              <Typography variant="h4">
                {loading ? <Skeleton width={100} /> : formatCurrency(stats?.monthlyRevenue || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 24, mr: 1, color: '#d32f2f' }} />
                <Typography color="textSecondary" gutterBottom>
                  Growth Rate
                </Typography>
              </Box>
              <Typography variant="h4">
                {loading ? <Skeleton width={60} /> : '+12.5%'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Admin Sections */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Administration
      </Typography>
      
      <Grid container spacing={3}>
        {adminSections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.title}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: section.color, mr: 2 }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" component="h2">
                    {section.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {section.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigate(section.path)}
                  sx={{ backgroundColor: section.color }}
                >
                  Manage
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 