import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  Alert
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Block as SuspendIcon,
  CheckCircle as ActivateIcon,
  Cancel as CancelIcon,
  TrendingUp as AnalyticsIcon,
  Download as ExportIcon,
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { AdminSubscription } from '@/types/entities/Subscription';
import { PaginatedResponse } from '@/utils/http';
import { 
  SUBSCRIPTION_STATUS,
  getSubscriptionStatusColor,
  getSubscriptionStatusLabel,
  ALL_SUBSCRIPTION_STATUSES
} from '@/enums/SubscriptionEnums';

const SubscriptionAdmin: React.FC = () => {
  const { api } = useApiContext();
  const { execute } = useApiCall();
  
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<AdminSubscription | null>(null);
  const [actionType, setActionType] = useState<'activate' | 'suspend' | 'cancel' | null>(null);
  const [actionReason, setActionReason] = useState('');
  
  // Filters and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [channelFilter] = useState<string>('');
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters: any = {};
      
      if (searchQuery) filters.search = searchQuery;
      if (statusFilter) filters.status = statusFilter;
      if (channelFilter) filters.channel_id = channelFilter;

      const result = await execute(
        () => api.subscriptionApi.getAllSubscriptions(
          { page: page + 1, limit: rowsPerPage },
          filters
        ),
        { showErrorToast: false }
      ) as PaginatedResponse<any>;

      if (result) {
        setSubscriptions(result.items || []);
        setTotalCount(result.metadata?.total || 0);
      }
    } catch (err) {
      setError('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, statusFilter, channelFilter, api.subscriptionApi, execute]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleView = (subscription: AdminSubscription) => {
    setSelectedSubscription(subscription);
    setViewDialogOpen(true);
  };

  const handleAction = (subscription: AdminSubscription, action: 'activate' | 'suspend' | 'cancel') => {
    setSelectedSubscription(subscription);
    setActionType(action);
    setActionDialogOpen(true);
    setActionReason('');
  };

  const handleActionSubmit = async () => {
    if (!selectedSubscription || !actionType) return;

    try {
      // Map frontend enum to backend expected format
      const backendStatus = 
        actionType === 'activate' ? 'active' : 
        actionType === 'suspend' ? 'suspended' : 
        'canceled'; // Note: backend uses 'canceled' not 'cancelled'
        
      await execute(() => 
        api.subscriptionApi.updateSubscriptionStatus(
          selectedSubscription.id, 
          backendStatus,
          actionReason
        )
      );
      
      setActionDialogOpen(false);
      setSelectedSubscription(null);
      setActionType(null);
      setActionReason('');
      fetchSubscriptions();
    } catch (err) {
      setError(`Failed to ${actionType} subscription`);
    }
  };

  const handleExport = async () => {
    try {
      // Map frontend status to backend expected format
      const backendStatus = statusFilter === 'cancelled' ? 'canceled' : statusFilter;
      
      const blob = await execute(() => 
        api.subscriptionApi.exportSubscriptions(
          { 
            status: backendStatus as "active" | "canceled" | "expired" | "suspended" | undefined,
            channel_id: channelFilter
          },
          'csv'
        )
      );
      
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      setError('Failed to export subscriptions');
    }
  };

  // Use the enum utility function for status colors

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns: Column[] = [
    {
      id: 'user',
      label: 'User',
      minWidth: 180,
      format: (_value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {row.user.displayName?.[0] || row.user.email?.[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium" noWrap>
              {row.user.displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {row.user.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'channel',
      label: 'Channel',
      minWidth: 120,
      format: (_value, row) => (
        <Typography variant="body2" noWrap>
          {row.channel.name}
        </Typography>
      ),
    },
    {
      id: 'tier',
      label: 'Tier',
      minWidth: 150,
      format: (_value, row) => (
        <Box>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {row.tier.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatCurrency(row.tier.price, row.tier.currency)}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'statusId',
      label: 'Status',
      minWidth: 100,
      sortable: true,
      format: (value) => (
        <Chip
          label={getSubscriptionStatusLabel(value)}
          color={getSubscriptionStatusColor(value)}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      id: 'subscribedAt',
      label: 'Subscribed',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {formatDate(value)}
        </Typography>
      ),
    },
    {
      id: 'expiresAt',
      label: 'Expires',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {value ? formatDate(value) : 'Never'}
        </Typography>
      ),
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {formatDate(value)}
        </Typography>
      ),
    },
  ];

  const statusOptions = ALL_SUBSCRIPTION_STATUSES;

  const filters = (
    <Stack direction="row" spacing={1}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          label="Status"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="">All Status</MenuItem>
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );

  const rowActions = (row: AdminSubscription) => (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="View Details">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleView(row);
          }}
        >
          <ViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {row.statusId === SUBSCRIPTION_STATUS.SUSPENDED && (
        <Tooltip title="Activate">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleAction(row, 'activate');
            }}
          >
            <ActivateIcon fontSize="small" color="success" />
          </IconButton>
        </Tooltip>
      )}

      {row.statusId === SUBSCRIPTION_STATUS.ACTIVE && (
        <Tooltip title="Suspend">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleAction(row, 'suspend');
            }}
          >
            <SuspendIcon fontSize="small" color="warning" />
          </IconButton>
        </Tooltip>
      )}

      {row.statusId !== SUBSCRIPTION_STATUS.CANCELLED && (
        <Tooltip title="Cancel">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleAction(row, 'cancel');
            }}
          >
            <CancelIcon fontSize="small" color="error" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );

  return (
    <Box>
      <AdminTable
        title="Subscription Management"
        columns={columns}
        rows={subscriptions}
        totalCount={totalCount}
        loading={loading}
        error={error}
        selected={selected}
        onSelectionChange={setSelected}
        onRefresh={fetchSubscriptions}
        onSearch={setSearchQuery}
        onSort={(column, direction) => {
          setSortColumn(column);
          setSortDirection(direction);
        }}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        searchQuery={searchQuery}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        filters={filters}
        rowActions={rowActions}
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<AnalyticsIcon />}
              onClick={() => {
                // Open analytics dialog or navigate to analytics page
              }}
            >
              Analytics
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExport}
            >
              Export
            </Button>
          </Stack>
        }
      />

      {/* View Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Subscription Details</DialogTitle>
        <DialogContent>
          {selectedSubscription && (
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>User Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                      <Typography variant="body2">{selectedSubscription.user.displayName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                      <Typography variant="body2">{selectedSubscription.user.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">User ID</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedSubscription.user.id}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Subscription Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Channel</Typography>
                      <Typography variant="body2">{selectedSubscription.channel.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Tier</Typography>
                      <Typography variant="body2">{selectedSubscription.tier.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Price</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(selectedSubscription.tier.price, selectedSubscription.tier.currency)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                      <Chip
                        label={getSubscriptionStatusLabel(selectedSubscription.statusId)}
                        color={getSubscriptionStatusColor(selectedSubscription.statusId)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Timeline</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Subscribed</Typography>
                      <Typography variant="body2">
                        {formatDate(selectedSubscription.subscribedAt)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Expires</Typography>
                      <Typography variant="body2">
                        {selectedSubscription.expiresAt
                          ? formatDate(selectedSubscription.expiresAt)
                          : 'Never'
                        }
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                      <Typography variant="body2">
                        {formatDate(selectedSubscription.createdAt)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Updated</Typography>
                      <Typography variant="body2">
                        {formatDate(selectedSubscription.updatedAt)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>System Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Subscription ID</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedSubscription.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Channel ID</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedSubscription.channel.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Tier ID</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedSubscription.tier.id}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'activate' && 'Activate Subscription'}
          {actionType === 'suspend' && 'Suspend Subscription'}
          {actionType === 'cancel' && 'Cancel Subscription'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {selectedSubscription && (
              <Alert severity={actionType === 'activate' ? 'info' : 'warning'}>
                {actionType === 'activate' && `Activating subscription for ${selectedSubscription.user.displayName}`}
                {actionType === 'suspend' && `Suspending subscription for ${selectedSubscription.user.displayName}`}
                {actionType === 'cancel' && `Canceling subscription for ${selectedSubscription.user.displayName}`}
              </Alert>
            )}
            <TextField
              label="Reason"
              fullWidth
              multiline
              rows={3}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder={`Explain why this subscription is being ${actionType}d...`}
              required={actionType !== 'activate'}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleActionSubmit} 
            variant="contained"
            color={
              actionType === 'activate' ? 'success' :
              actionType === 'suspend' ? 'warning' :
              'error'
            }
            disabled={(actionType === 'suspend' || actionType === 'cancel') && !actionReason.trim()}
          >
            {actionType === 'activate' && 'Activate'}
            {actionType === 'suspend' && 'Suspend'}
            {actionType === 'cancel' && 'Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionAdmin;