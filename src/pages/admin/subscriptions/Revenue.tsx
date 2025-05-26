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
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  TrendingUp,
  AccountBalance,
  CreditCard,
  AttachMoney
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const RevenueTracking: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchRevenueData();
  }, [period]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In real implementation, fetch revenue data from API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
    } catch (err: any) {
      setError(err.message || 'Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Mock data for revenue tracking
  const revenueMetrics = {
    totalRevenue: 125000,
    monthlyRecurring: 98000,
    oneTimePayments: 27000,
    averageRevenuePerUser: 45.50,
    growthRate: 12.5
  };

  const monthlyRevenueData = [
    { month: 'Jan', revenue: 85000, subscriptions: 78000, oneTime: 7000 },
    { month: 'Feb', revenue: 92000, subscriptions: 84000, oneTime: 8000 },
    { month: 'Mar', revenue: 98000, subscriptions: 89000, oneTime: 9000 },
    { month: 'Apr', revenue: 105000, subscriptions: 95000, oneTime: 10000 },
    { month: 'May', revenue: 115000, subscriptions: 102000, oneTime: 13000 },
    { month: 'Jun', revenue: 125000, subscriptions: 112000, oneTime: 13000 }
  ];

  const topChannelsByRevenue = [
    { name: 'Tech News Daily', revenue: 15000, subscribers: 1200 },
    { name: 'Global Politics', revenue: 12500, subscribers: 980 },
    { name: 'Science Weekly', revenue: 11000, subscribers: 850 },
    { name: 'Business Insider', revenue: 9500, subscribers: 720 },
    { name: 'Sports Central', revenue: 8200, subscribers: 650 }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RevenueIcon sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" component="h1">
            Revenue Tracking
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

      {/* Revenue Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ fontSize: 24, mr: 1, color: '#1976d2' }} />
                <Typography color="textSecondary" gutterBottom>
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h4">
                {loading ? <Skeleton width={100} /> : formatCurrency(revenueMetrics.totalRevenue)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +{revenueMetrics.growthRate}% vs last period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance sx={{ fontSize: 24, mr: 1, color: '#388e3c' }} />
                <Typography color="textSecondary" gutterBottom>
                  Monthly Recurring
                </Typography>
              </Box>
              <Typography variant="h4">
                {loading ? <Skeleton width={100} /> : formatCurrency(revenueMetrics.monthlyRecurring)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {((revenueMetrics.monthlyRecurring / revenueMetrics.totalRevenue) * 100).toFixed(1)}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CreditCard sx={{ fontSize: 24, mr: 1, color: '#f57c00' }} />
                <Typography color="textSecondary" gutterBottom>
                  One-time Payments
                </Typography>
              </Box>
              <Typography variant="h4">
                {loading ? <Skeleton width={100} /> : formatCurrency(revenueMetrics.oneTimePayments)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {((revenueMetrics.oneTimePayments / revenueMetrics.totalRevenue) * 100).toFixed(1)}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 24, mr: 1, color: '#7b1fa2' }} />
                <Typography color="textSecondary" gutterBottom>
                  ARPU
                </Typography>
              </Box>
              <Typography variant="h4">
                {loading ? <Skeleton width={80} /> : formatCurrency(revenueMetrics.averageRevenuePerUser)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Average Revenue Per User
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Monthly Revenue Trend */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Revenue Trend
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#1976d2" 
                      strokeWidth={3}
                      name="Total Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="subscriptions" 
                      stroke="#388e3c" 
                      strokeWidth={2}
                      name="Subscription Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="oneTime" 
                      stroke="#f57c00" 
                      strokeWidth={2}
                      name="One-time Payments"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Breakdown */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Breakdown
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={monthlyRevenueData.slice(-3)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
                    <Legend />
                    <Bar dataKey="subscriptions" fill="#388e3c" name="Subscriptions" />
                    <Bar dataKey="oneTime" fill="#f57c00" name="One-time" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Channels by Revenue */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top Channels by Revenue
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Channel Name</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">Subscribers</TableCell>
                  <TableCell align="right">ARPU</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topChannelsByRevenue.map((channel, index) => (
                  <TableRow key={channel.name}>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          {index + 1}
                        </Box>
                        {channel.name}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{formatCurrency(channel.revenue)}</TableCell>
                    <TableCell align="right">{channel.subscribers.toLocaleString()}</TableCell>
                    <TableCell align="right">{formatCurrency(channel.revenue / channel.subscribers)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RevenueTracking; 