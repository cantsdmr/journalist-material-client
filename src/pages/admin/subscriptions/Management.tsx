import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Grid,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { 
  AdminSubscription, 
  SubscriptionFilters, 
  SubscriptionAnalytics,
  BulkUpdateData 
} from '@/types/index';
import { PaginationObject, DEFAULT_PAGINATION } from '@/utils/http';
import { getSubscriptionStatusColor} from '@/enums/SubscriptionEnums';
import { useApiCall } from '@/hooks/useApiCall';

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [analytics, setAnalytics] = useState<SubscriptionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SubscriptionFilters>({});
  const [pagination] = useState<PaginationObject>(DEFAULT_PAGINATION);
  
  // Bulk operations
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<'cancel' | 'activate' | 'suspend'>('cancel');
  const [bulkReason, setBulkReason] = useState('');
  
  const { api } = useApiContext();
  const { execute } = useApiCall();

  useEffect(() => {
    fetchSubscriptions();
    fetchAnalytics();
  }, [filters, pagination]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    
    const result = await execute(
      () => api.subscriptionApi.getAllSubscriptions(pagination, filters),
      { showErrorToast: true }
    );
    
    if (result) {
      setSubscriptions(result.items || []);
    }
    
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    
    const result = await execute(
      () => api.subscriptionApi.getSubscriptionAnalytics({ period: '30d' }),
      { showErrorToast: false } // Don't show error for analytics
    );
    
    if (result) {
      setAnalytics(result);
    }
    
    setAnalyticsLoading(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setFilters({ ...filters });
      // In a real implementation, you'd add search to filters
    } else {
      fetchSubscriptions();
    }
  };

  const handleFilterChange = (key: keyof SubscriptionFilters, value: string) => {
    setFilters({ ...filters, [key]: value || undefined });
  };

  const handleBulkAction = async () => {
    if (selectedSubscriptions.length === 0) return;
    
    setLoading(true);
    
    const bulkData: BulkUpdateData = {
      action: bulkAction,
      subscription_ids: selectedSubscriptions,
      reason: bulkReason || undefined
    };
    
    const result = await execute(
      () => api.subscriptionApi.bulkUpdateSubscriptions(bulkData),
      {
        showSuccessMessage: true,
        successMessage: 'Successfully updated subscriptions'
      }
    );
    
    if (result) {
      if (result.failed > 0) {
        setError(`Failed to update ${result.failed} subscriptions`);
      }
      
      setBulkActionDialog(false);
      setSelectedSubscriptions([]);
      setBulkReason('');
      await fetchSubscriptions();
    }
    
    setLoading(false);
  };

  const handleExport = async () => {
    const result = await execute(
      () => api.subscriptionApi.exportSubscriptions(filters, 'csv'),
      { showErrorToast: true }
    );
    
    if (result) {
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const getStatusColor = (status: string) => {
    return getSubscriptionStatusColor(status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(price / 100);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Subscription Management
      </Typography>

      {/* Analytics Cards */}
      {analytics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Subscriptions
                </Typography>
                <Typography variant="h4">
                  {analyticsLoading ? <Skeleton width={60} /> : analytics.total_subscriptions.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Subscriptions
                </Typography>
                <Typography variant="h4">
                  {analyticsLoading ? <Skeleton width={60} /> : analytics.active_subscriptions.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  New This Month
                </Typography>
                <Typography variant="h4">
                  {analyticsLoading ? <Skeleton width={60} /> : analytics.new_subscriptions.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Churn Rate
                </Typography>
                <Typography variant="h4">
                  {analyticsLoading ? <Skeleton width={60} /> : `${(analytics.churn_rate * 100).toFixed(1)}%`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters and Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TextField
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ minWidth: 250 }}
            />
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setFilters({})}
            >
              Clear Filters
            </Button>

            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export
            </Button>

            {selectedSubscriptions.length > 0 && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setBulkActionDialog(true)}
              >
                Bulk Actions ({selectedSubscriptions.length})
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Subscriptions Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedSubscriptions.length > 0 && selectedSubscriptions.length < subscriptions.length}
                    checked={subscriptions.length > 0 && selectedSubscriptions.length === subscriptions.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSubscriptions(subscriptions.map(s => s.id));
                      } else {
                        setSelectedSubscriptions([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>User</TableCell>
                <TableCell>Channel</TableCell>
                <TableCell>Tier</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Started</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))
              ) : (
                subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedSubscriptions.includes(subscription.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubscriptions([...selectedSubscriptions, subscription.id]);
                          } else {
                            setSelectedSubscriptions(selectedSubscriptions.filter(id => id !== subscription.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {subscription.user.display_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {subscription.user.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {subscription.channel.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {subscription.tier.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatPrice(subscription.tier.price, subscription.tier.currency)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={subscription.status}
                        color={getStatusColor(subscription.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(subscription.started_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {subscription.expires_at ? formatDate(subscription.expires_at) : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => {
                          // Navigate to subscription details
                          console.log('View subscription:', subscription.id);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Bulk Action Dialog */}
      <Dialog
        open={bulkActionDialog}
        onClose={() => setBulkActionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Bulk Action</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            You are about to perform a bulk action on {selectedSubscriptions.length} subscription(s).
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Action</InputLabel>
            <Select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value as any)}
              label="Action"
            >
              <MenuItem value="cancel">Cancel Subscriptions</MenuItem>
              <MenuItem value="activate">Activate Subscriptions</MenuItem>
              <MenuItem value="suspend">Suspend Subscriptions</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Reason (optional)"
            value={bulkReason}
            onChange={(e) => setBulkReason(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkAction}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionManagement; 