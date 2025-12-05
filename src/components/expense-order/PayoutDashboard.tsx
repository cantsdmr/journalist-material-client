import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { ExpenseOrderStats, Channel } from '@/types/index';
// import { ExpenseOrderStatus } from '@/enums/ExpenseOrderEnums';
import { useApiContext } from '@/contexts/ApiContext';
import ExpenseOrderList from './ExpenseOrderList';

interface PayoutDashboardProps {
  channelId?: string;
  onCreateExpenseOrder?: () => void;
  onViewExpenseOrder?: (expenseOrderId: string) => void;
  userRole?: 'journalist' | 'admin' | 'finance-manager';
}

const PayoutDashboard: React.FC<PayoutDashboardProps> = ({
  channelId,
  onCreateExpenseOrder,
  onViewExpenseOrder,
  userRole = 'journalist'
}) => {
  const { api } = useApiContext();
  const theme = useTheme();
  const [stats, setStats] = useState<ExpenseOrderStats | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [channelId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load stats
      const statsData = await api.app.expenseOrder.getExpenseOrderStats(channelId);
      setStats(statsData);

      // Load channel data if channelId is provided
      if (channelId) {
        const channelData = await api.app.channel.getChannel(channelId);
        setChannel(channelData);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return theme.palette.success.main;
      case 'approved':
        return theme.palette.info.main;
      case 'submitted':
      case 'underReview':
        return theme.palette.warning.main;
      case 'rejected':
      case 'cancelled':
        return theme.palette.error.main;
      case 'draft':
      default:
        return theme.palette.grey[500];
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color, 
    subtitle 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color: string; 
    subtitle?: string; 
  }) => (
    <Card 
      sx={{ 
        height: '100%',
        border: `1px solid ${alpha(color, 0.2)}`,
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              p: 1, 
              borderRadius: 2, 
              bgcolor: alpha(color, 0.1),
              color: color,
              mr: 2 
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: color, mb: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {channel ? `${channel.name} Payouts` : 'Payout Dashboard'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {userRole === 'journalist' 
            ? 'Manage your expense orders and track payments'
            : 'Overview of expense orders and payout statistics'}
        </Typography>
      </Box>

      {/* Stats Overview */}
      {stats && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Orders"
                value={stats.total}
                icon={<ReceiptIcon />}
                color={theme.palette.primary.main}
                subtitle="All time"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Amount"
                value={formatCurrency(stats.totalAmount)}
                icon={<MoneyIcon />}
                color={theme.palette.secondary.main}
                subtitle="Requested"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Paid Amount"
                value={formatCurrency(stats.totalPaidAmount)}
                icon={<CheckCircleIcon />}
                color={theme.palette.success.main}
                subtitle="Completed payments"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending"
                value={stats.submitted + stats.underReview + stats.approved}
                icon={<PendingIcon />}
                color={theme.palette.warning.main}
                subtitle="Awaiting action"
              />
            </Grid>
          </Grid>

          {/* Status Breakdown */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Status Breakdown
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Draft', value: stats.draft, status: 'draft' },
                  { label: 'Submitted', value: stats.submitted, status: 'submitted' },
                  { label: 'Under Review', value: stats.underReview, status: 'underReview' },
                  { label: 'Approved', value: stats.approved, status: 'approved' },
                  { label: 'Paid', value: stats.paid, status: 'paid' },
                  { label: 'Rejected', value: stats.rejected, status: 'rejected' },
                  { label: 'Cancelled', value: stats.cancelled, status: 'cancelled' }
                ].map((item) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={item.status}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700, 
                          color: getStatusColor(item.status),
                          mb: 1 
                        }}
                      >
                        {item.value}
                      </Typography>
                      <Chip
                        label={item.label}
                        size="small"
                        sx={{
                          bgcolor: alpha(getStatusColor(item.status), 0.1),
                          color: getStatusColor(item.status),
                          fontWeight: 500
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </>
      )}

      {/* Expense Orders List */}
      <Card>
        <CardContent>
          <ExpenseOrderList
            userRole={userRole}
            channelId={channelId}
            onCreateNew={onCreateExpenseOrder}
            onView={onViewExpenseOrder ? (order) => onViewExpenseOrder(order.id) : undefined}
            showCreateButton={userRole === 'journalist'}
          />
        </CardContent>
      </Card>

      {/* Action Buttons for Journalists */}
      {userRole === 'journalist' && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<ReceiptIcon />}
            onClick={onCreateExpenseOrder}
            sx={{ px: 4, py: 1.5 }}
          >
            Create New Expense Order
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PayoutDashboard;