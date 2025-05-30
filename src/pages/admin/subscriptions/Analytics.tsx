import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  People,
  Cancel
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApiContext } from '@/contexts/ApiContext';
import { SubscriptionAnalytics } from '@/APIs/SubscriptionAPI';
import { useApiCall } from '@/hooks/useApiCall';

const SubscriptionAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<SubscriptionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30d');
  
  const { api } = useApiContext();
  const { execute } = useApiCall();

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    const result = await execute(
      () => api.subscriptionApi.getSubscriptionAnalytics({ period }),
      { showErrorToast: true }
    );
    
    if (result) {
      setAnalytics(result);
    }
    
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Mock data for charts (in real implementation, this would come from the API)
  const subscriptionTrendData = [
    { month: 'Jan', new: 120, canceled: 45, active: 1200 },
    { month: 'Feb', new: 150, canceled: 38, active: 1312 },
    { month: 'Mar', new: 180, canceled: 52, active: 1440 },
    { month: 'Apr', new: 200, canceled: 48, active: 1592 },
    { month: 'May', new: 165, canceled: 55, active: 1702 },
    { month: 'Jun', new: 190, canceled: 42, active: 1850 }
  ];

  const revenueByTierData = [
    { name: 'Basic', value: 35, revenue: 15000 },
    { name: 'Premium', value: 45, revenue: 35000 },
    { name: 'Pro', value: 20, revenue: 25000 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AnalyticsIcon sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" component="h1">
            Subscription Analytics
          </Typography>
        </Box>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="Period"
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ fontSize: 24, mr: 1, color: '#1976d2' }} />
                <Typography color="textSecondary" gutterBottom>
                  Total Subscriptions
                </Typography>
              </Box>
              <Typography variant="h4">
                {loading ? <Skeleton width={80} /> : analytics?.total_subscriptions.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +12.5% vs last period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 24, mr: 1, color: '#388e3c' }} />
                <Typography color="textSecondary" gutterBottom>
                  New Subscriptions
                </Typography>
              </Box>
              <Typography variant="h4">
                {loading ? <Skeleton width={80} /> : analytics?.new_subscriptions.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                This period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Cancel sx={{ fontSize: 24, mr: 1, color: '#f57c00' }} />
                <Typography color="textSecondary" gutterBottom>
                  Churn Rate
                </Typography>
              </Box>
              <Typography variant="h4">
                {loading ? <Skeleton width={60} /> : formatPercentage(analytics?.churn_rate || 0)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingDown sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  -2.1% vs last period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ fontSize: 24, mr: 1, color: '#7b1fa2' }} />
                <Typography color="textSecondary" gutterBottom>
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h4">
                {loading ? (
                  <Skeleton width={100} />
                ) : (
                  formatCurrency(
                    Object.values(analytics?.revenue_by_currency || {})
                      .reduce((sum, amount) => sum + amount, 0)
                  )
                )}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                This period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Subscription Trends */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subscription Trends
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={subscriptionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="new" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="New Subscriptions"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="canceled" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      name="Canceled"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="active" 
                      stroke="#ffc658" 
                      strokeWidth={2}
                      name="Active Total"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue by Tier */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue by Tier
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={revenueByTierData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueByTierData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(_, name) => [formatCurrency(revenueByTierData.find(d => d.name === name)?.revenue || 0), 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Revenue */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Revenue Breakdown
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={subscriptionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value) * 100), 'Revenue']} />
                    <Legend />
                    <Bar dataKey="new" fill="#8884d8" name="New Subscriptions Revenue" />
                    <Bar dataKey="active" fill="#82ca9d" name="Recurring Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SubscriptionAnalyticsPage; 