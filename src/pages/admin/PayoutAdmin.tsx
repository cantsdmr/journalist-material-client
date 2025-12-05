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
  Alert,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Payment as PaymentIcon,
  Replay as RetryIcon,
  Cancel as CancelIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';

// Payout interface matching backend PayoutDto
interface PayoutData {
  id: string;
  expenseOrderId: string;
  journalistId: string;
  channelId: string;
  grossAmount: number;
  platformFeeAmount: number;
  netAmount: number;
  currency: string;
  paymentMethodId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentReference?: string;
  processedBy?: string;
  processedAt?: string;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: string;
  errorMessage?: string;
  errorCategory?: string;
  createdAt: string;
  updatedAt: string;
  // Related data
  expenseOrder?: {
    id: string;
    title: string;
    description: string;
    type: { name: string };
  };
  journalist?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  channel?: {
    id: string;
    name: string;
  };
}

const PayoutAdmin: React.FC = () => {
  const [payouts, setPayouts] = useState<PayoutData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<PayoutData | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Filters and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { api } = useApiContext();
  const { execute } = useApiCall();

  const fetchPayouts = useCallback(async () => {
    if (!api?.app.payout) return;

    setLoading(true);
    setError(null);

    try {
      const params: any = {
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await execute(() => api.app.payout.getPayouts(params));

      if (response) {
        setPayouts(response.items || []);
        setTotalCount(response.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch payouts:', err);
      setError('Failed to fetch payouts');
      setPayouts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [api, execute, page, rowsPerPage, statusFilter]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  const handleView = (payout: PayoutData) => {
    setSelectedPayout(payout);
    setViewDialogOpen(true);
  };

  const handleProcessPayout = (payout: PayoutData) => {
    setSelectedPayout(payout);
    setProcessDialogOpen(true);
  };

  const handleProcessSubmit = async () => {
    if (!selectedPayout || !api?.app.payout) return;

    try {
      await execute(() => api.app.payout.processPayout(selectedPayout.id));

      setProcessDialogOpen(false);
      setSelectedPayout(null);
      fetchPayouts();
    } catch (err) {
      setError('Failed to process payout');
    }
  };

  const handleRetryPayout = async (payout: PayoutData) => {
    if (!api?.app.payout) return;

    try {
      await execute(() => api.app.payout.retryPayout(payout.id));
      fetchPayouts();
    } catch (err) {
      setError('Failed to retry payout');
    }
  };

  const handleCancelPayout = (payout: PayoutData) => {
    setSelectedPayout(payout);
    setCancelReason('');
    setCancelDialogOpen(true);
  };

  const handleCancelSubmit = async () => {
    if (!selectedPayout || !api?.app.payout) return;

    try {
      await execute(() => api.app.payout.cancelPayout(selectedPayout.id, { reason: cancelReason }));

      setCancelDialogOpen(false);
      setSelectedPayout(null);
      setCancelReason('');
      fetchPayouts();
    } catch (err) {
      setError('Failed to cancel payout');
    }
  };

  const getStatusColor = (status: PayoutData['status']): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount / 100); // Amount is stored in cents
  };

  const formatJournalistName = (journalist?: PayoutData['journalist']) => {
    if (!journalist) return 'Unknown';
    return `${journalist.firstName} ${journalist.lastName}`;
  };

  const columns: Column[] = [
    {
      id: 'expenseOrder',
      label: 'Expense Order',
      minWidth: 200,
      sortable: true,
      format: (_value, row) => (
        <Box>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {row.expenseOrder?.title || 'N/A'}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={row.expenseOrder?.type?.name || 'Unknown'}
              size="small"
              variant="outlined"
              sx={{ height: 16, '& .MuiChip-label': { fontSize: '0.6rem', px: 0.5 } }}
            />
            <Typography variant="caption" color="text.secondary">
              #{row.id.slice(0, 8)}
            </Typography>
          </Stack>
        </Box>
      ),
    },
    {
      id: 'channel',
      label: 'Channel',
      minWidth: 120,
      format: (_value, row) => (
        <Typography variant="body2" noWrap>
          {row.channel?.name || 'N/A'}
        </Typography>
      ),
    },
    {
      id: 'journalist',
      label: 'Journalist',
      minWidth: 140,
      format: (_value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24 }}>
            {row.journalist?.firstName?.[0] || 'U'}
          </Avatar>
          <Typography variant="body2" noWrap>
            {formatJournalistName(row.journalist)}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'grossAmount',
      label: 'Gross',
      minWidth: 90,
      align: 'right',
      sortable: true,
      format: (_value, row) => (
        <Typography variant="body2">
          {formatCurrency(row.grossAmount, row.currency)}
        </Typography>
      ),
    },
    {
      id: 'platformFeeAmount',
      label: 'Fee',
      minWidth: 80,
      align: 'right',
      format: (_value, row) => (
        <Typography variant="body2" color="text.secondary">
          -{formatCurrency(row.platformFeeAmount, row.currency)}
        </Typography>
      ),
    },
    {
      id: 'netAmount',
      label: 'Net Payout',
      minWidth: 100,
      align: 'right',
      sortable: true,
      format: (_value, row) => (
        <Typography variant="body2" fontWeight="medium" color="primary">
          {formatCurrency(row.netAmount, row.currency)}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      sortable: true,
      format: (value, row) => (
        <Stack spacing={0.5}>
          <Chip
            label={value}
            color={getStatusColor(value)}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
          {row.errorMessage && (
            <Tooltip title={row.errorMessage}>
              <WarningIcon color="error" sx={{ fontSize: 16 }} />
            </Tooltip>
          )}
          {row.retryCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              Retry {row.retryCount}/{row.maxRetries}
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      id: 'paymentReference',
      label: 'Payment Ref',
      minWidth: 120,
      format: (value) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          {value ? value.slice(0, 12) + '...' : '-'}
        </Typography>
      ),
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 110,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {new Date(value).toLocaleDateString()}
        </Typography>
      ),
    },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const filters = (
    <Stack direction="row" spacing={1}>
      <FormControl size="small" sx={{ minWidth: 140 }}>
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

  const rowActions = (row: PayoutData) => (
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

      {row.status === 'pending' && (
        <Tooltip title="Process Payout">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleProcessPayout(row);
            }}
          >
            <PaymentIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
      )}

      {row.status === 'failed' && row.retryCount < row.maxRetries && (
        <Tooltip title="Retry Payout">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleRetryPayout(row);
            }}
          >
            <RetryIcon fontSize="small" color="warning" />
          </IconButton>
        </Tooltip>
      )}

      {(row.status === 'pending' || row.status === 'failed') && (
        <Tooltip title="Cancel Payout">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleCancelPayout(row);
            }}
          >
            <CancelIcon fontSize="small" color="error" />
          </IconButton>
        </Tooltip>
      )}

      {row.paymentReference && (
        <Tooltip title="View Payment Details">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // Could open payment provider's transaction page
            }}
          >
            <ReceiptIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );

  return (
    <Box>
      <AdminTable
        title="Payout Management"
        columns={columns}
        rows={payouts}
        totalCount={totalCount}
        loading={loading}
        error={error}
        selected={selected}
        onSelectionChange={setSelected}
        onRefresh={fetchPayouts}
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
      />

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Payout Details</DialogTitle>
        <DialogContent>
          {selectedPayout && (
            <Stack spacing={3} sx={{ pt: 1 }}>
              {/* Expense Order Info */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Expense Order Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                      <Typography variant="body2">{selectedPayout.expenseOrder?.title || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                      <Typography variant="body2">{selectedPayout.expenseOrder?.description || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                      <Chip label={selectedPayout.expenseOrder?.type?.name || 'Unknown'} size="small" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Expense Order ID</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {selectedPayout.expenseOrderId}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Payout Info */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Payout Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Journalist</Typography>
                      <Typography variant="body2">{formatJournalistName(selectedPayout.journalist)}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedPayout.journalist?.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Channel</Typography>
                      <Typography variant="body2">{selectedPayout.channel?.name || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Gross Amount</Typography>
                      <Typography variant="body2">
                        {formatCurrency(selectedPayout.grossAmount, selectedPayout.currency)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Platform Fee</Typography>
                      <Typography variant="body2" color="error">
                        -{formatCurrency(selectedPayout.platformFeeAmount, selectedPayout.currency)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">Net Payout</Typography>
                      <Typography variant="body2" fontWeight="medium" color="primary">
                        {formatCurrency(selectedPayout.netAmount, selectedPayout.currency)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                      <Chip
                        label={selectedPayout.status}
                        color={getStatusColor(selectedPayout.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Payment Reference</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {selectedPayout.paymentReference || 'Not processed'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Retry Info */}
              {selectedPayout.status === 'failed' && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Retry Information</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Retry Count</Typography>
                        <Typography variant="body2">
                          {selectedPayout.retryCount} / {selectedPayout.maxRetries}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Next Retry</Typography>
                        <Typography variant="body2">
                          {selectedPayout.nextRetryAt
                            ? new Date(selectedPayout.nextRetryAt).toLocaleString()
                            : 'No retry scheduled'
                          }
                        </Typography>
                      </Grid>
                      {selectedPayout.errorCategory && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Error Category</Typography>
                          <Chip label={selectedPayout.errorCategory} size="small" color="error" />
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {/* Error Message */}
              {selectedPayout.errorMessage && (
                <Alert severity="error">
                  <Typography variant="body2">{selectedPayout.errorMessage}</Typography>
                </Alert>
              )}

              {/* Timeline */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Timeline</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                      <Typography variant="body2">
                        {new Date(selectedPayout.createdAt).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Processed</Typography>
                      <Typography variant="body2">
                        {selectedPayout.processedAt
                          ? new Date(selectedPayout.processedAt).toLocaleString()
                          : 'Not processed'
                        }
                      </Typography>
                    </Grid>
                    {selectedPayout.processedBy && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Processed By</Typography>
                        <Typography variant="body2">{selectedPayout.processedBy}</Typography>
                      </Grid>
                    )}
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

      {/* Process Payout Dialog */}
      <Dialog open={processDialogOpen} onClose={() => setProcessDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Process Payout</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {selectedPayout && (
              <Alert severity="warning" icon={<PaymentIcon />}>
                <Typography variant="body2">
                  You are about to process a payout of{' '}
                  <strong>{formatCurrency(selectedPayout.netAmount, selectedPayout.currency)}</strong>
                  {' '}to <strong>{formatJournalistName(selectedPayout.journalist)}</strong>.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Platform fee: {formatCurrency(selectedPayout.platformFeeAmount, selectedPayout.currency)}
                </Typography>
              </Alert>
            )}
            <Typography variant="body2" color="text.secondary">
              This action will initiate the payment process. The funds will be transferred to the journalist's
              payment method on file.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProcessDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleProcessSubmit}
            variant="contained"
            color="primary"
            startIcon={<CheckCircleIcon />}
          >
            Confirm & Process
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Payout Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Payout</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {selectedPayout && (
              <Alert severity="error">
                <Typography variant="body2">
                  You are about to cancel the payout for <strong>{formatJournalistName(selectedPayout.journalist)}</strong>.
                </Typography>
              </Alert>
            )}
            <TextField
              label="Cancellation Reason"
              fullWidth
              multiline
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Provide a reason for cancelling this payout..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Close</Button>
          <Button
            onClick={handleCancelSubmit}
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
          >
            Cancel Payout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PayoutAdmin;
