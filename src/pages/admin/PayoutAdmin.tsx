import React, { useState, useEffect } from 'react';
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
  TrendingUp as StatsIcon,
  Receipt as ReceiptIcon,
  PlayArrow as ProcessIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import AdminTable, { Column } from '@/components/admin/AdminTable';

// Define types for payout data based on the backend DTOs
interface PayoutData {
  id: string;
  fund_id: string;
  channel_id: string;
  channel_name: string;
  content_type: 'news' | 'poll';
  content_id: string;
  content_title: string;
  amount: number;
  currency: string;
  recipient_id: string;
  recipient_name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transaction_id?: string;
  created_at: string;
  processed_at?: string;
  error_message?: string;
}

// Mock data for demonstration
const generateMockPayouts = (): PayoutData[] => {
  const statuses: PayoutData['status'][] = ['pending', 'processing', 'completed', 'failed'];
  const contentTypes: ('news' | 'poll')[] = ['news', 'poll'];
  const currencies = ['USD', 'EUR', 'GBP'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `payout_${i + 1}`,
    fund_id: `fund_${i + 1}`,
    channel_id: `channel_${i + 1}`,
    channel_name: `Channel ${i + 1}`,
    content_type: contentTypes[Math.floor(Math.random() * contentTypes.length)],
    content_id: `content_${i + 1}`,
    content_title: `Content Title ${i + 1}`,
    amount: Math.floor(Math.random() * 10000) + 100,
    currency: currencies[Math.floor(Math.random() * currencies.length)],
    recipient_id: `user_${i + 1}`,
    recipient_name: `Creator ${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    transaction_id: Math.random() > 0.5 ? `txn_${Date.now()}_${i}` : undefined,
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    processed_at: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    error_message: Math.random() > 0.8 ? 'Payment method verification failed' : undefined
  }));
};

const PayoutAdmin: React.FC = () => {
  const [payouts, setPayouts] = useState<PayoutData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<PayoutData | null>(null);
  const [processingNotes, setProcessingNotes] = useState('');
  
  // Filters and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('');
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchPayouts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, using mock data since there's no specific payout API endpoint
      // In a real implementation, this would call something like:
      // const result = await execute(() => api.fundingApi.getPayouts(...))
      
      const mockData = generateMockPayouts();
      let filteredData = mockData;
      
      // Apply filters
      if (searchQuery) {
        filteredData = filteredData.filter(p => 
          p.channel_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.content_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.recipient_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (statusFilter) {
        filteredData = filteredData.filter(p => p.status === statusFilter);
      }
      
      if (contentTypeFilter) {
        filteredData = filteredData.filter(p => p.content_type === contentTypeFilter);
      }
      
      // Apply sorting
      filteredData.sort((a, b) => {
        const aVal = a[sortColumn as keyof PayoutData] || '';
        const bVal = b[sortColumn as keyof PayoutData] || '';
        const comparison = aVal > bVal ? 1 : -1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
      
      // Apply pagination
      const startIndex = page * rowsPerPage;
      const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);
      
      setPayouts(paginatedData);
      setTotalCount(filteredData.length);
    } catch (err) {
      setError('Failed to fetch payouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [page, rowsPerPage, searchQuery, statusFilter, contentTypeFilter, sortColumn, sortDirection]);

  const handleView = (payout: PayoutData) => {
    setSelectedPayout(payout);
    setViewDialogOpen(true);
  };

  const handleProcessPayout = (payout: PayoutData) => {
    setSelectedPayout(payout);
    setProcessDialogOpen(true);
    setProcessingNotes('');
  };

  const handleProcessSubmit = async () => {
    if (!selectedPayout) return;

    try {
      // In a real implementation, this would call:
      // await execute(() => api.fundingApi.processPayout(selectedPayout.content_type, selectedPayout.content_id, {
      //   recipient_id: selectedPayout.recipient_id,
      //   amount: selectedPayout.amount,
      //   description: processingNotes
      // }));
      
      // Mock processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessDialogOpen(false);
      setSelectedPayout(null);
      setProcessingNotes('');
      fetchPayouts();
    } catch (err) {
      setError('Failed to process payout');
    }
  };

  const getStatusColor = (status: PayoutData['status']): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount / 100); // Assuming amounts are stored in cents
  };

  const columns: Column[] = [
    {
      id: 'content_title',
      label: 'Content',
      minWidth: 200,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {value}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={row.content_type}
              size="small"
              variant="outlined"
              sx={{ height: 16, '& .MuiChip-label': { fontSize: '0.6rem', px: 0.5 } }}
            />
            <Typography variant="caption" color="text.secondary">
              ID: {row.id}
            </Typography>
          </Stack>
        </Box>
      ),
    },
    {
      id: 'channel_name',
      label: 'Channel',
      minWidth: 120,
      format: (value) => (
        <Typography variant="body2" noWrap>
          {value}
        </Typography>
      ),
    },
    {
      id: 'recipient_name',
      label: 'Recipient',
      minWidth: 120,
      format: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24 }}>
            {value?.[0]}
          </Avatar>
          <Typography variant="body2" noWrap>
            {value}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 100,
      align: 'right',
      sortable: true,
      format: (value, row) => (
        <Typography variant="body2" fontWeight="medium">
          {formatCurrency(value, row.currency)}
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
          {row.error_message && (
            <Tooltip title={row.error_message}>
              <WarningIcon color="error" sx={{ fontSize: 16 }} />
            </Tooltip>
          )}
        </Stack>
      ),
    },
    {
      id: 'transaction_id',
      label: 'Transaction ID',
      minWidth: 150,
      format: (value) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {value || '-'}
        </Typography>
      ),
    },
    {
      id: 'created_at',
      label: 'Created',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {new Date(value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      id: 'processed_at',
      label: 'Processed',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {value ? new Date(value).toLocaleDateString() : '-'}
        </Typography>
      ),
    },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' }
  ];

  const contentTypeOptions = [
    { value: 'news', label: 'News' },
    { value: 'poll', label: 'Poll' }
  ];

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

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Content Type</InputLabel>
        <Select
          value={contentTypeFilter}
          label="Content Type"
          onChange={(e) => setContentTypeFilter(e.target.value)}
        >
          <MenuItem value="">All Types</MenuItem>
          {contentTypeOptions.map((option) => (
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
            <ProcessIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
      )}

      {row.transaction_id && (
        <Tooltip title="View Transaction">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // Open transaction details in new tab
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
        actions={
          <Button
            variant="outlined"
            startIcon={<StatsIcon />}
            onClick={() => {
              // Open payout statistics dialog
            }}
          >
            Statistics
          </Button>
        }
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
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Content Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                      <Typography variant="body2">{selectedPayout.content_title}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                      <Chip label={selectedPayout.content_type} size="small" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Channel</Typography>
                      <Typography variant="body2">{selectedPayout.channel_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Content ID</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedPayout.content_id}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Payout Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Recipient</Typography>
                      <Typography variant="body2">{selectedPayout.recipient_name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(selectedPayout.amount, selectedPayout.currency)}
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
                      <Typography variant="subtitle2" color="text.secondary">Transaction ID</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedPayout.transaction_id || 'Not processed'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {selectedPayout.error_message && (
                <Alert severity="error">
                  <Typography variant="body2">{selectedPayout.error_message}</Typography>
                </Alert>
              )}

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Timeline</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                      <Typography variant="body2">
                        {new Date(selectedPayout.created_at).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Processed</Typography>
                      <Typography variant="body2">
                        {selectedPayout.processed_at 
                          ? new Date(selectedPayout.processed_at).toLocaleString()
                          : 'Not processed'
                        }
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

      {/* Process Payout Dialog */}
      <Dialog open={processDialogOpen} onClose={() => setProcessDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Process Payout</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {selectedPayout && (
              <Alert severity="info">
                Processing payout of {formatCurrency(selectedPayout.amount, selectedPayout.currency)} to {selectedPayout.recipient_name}
              </Alert>
            )}
            <TextField
              label="Processing Notes"
              fullWidth
              multiline
              rows={3}
              value={processingNotes}
              onChange={(e) => setProcessingNotes(e.target.value)}
              placeholder="Add any notes about this payout processing..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProcessDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleProcessSubmit} 
            variant="contained"
            color="primary"
            startIcon={<PaymentIcon />}
          >
            Process Payout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PayoutAdmin;