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
  Grid,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { ExpenseOrder } from '@/types/entities/ExpenseOrder';
import { PaginatedResponse } from '@/utils/http';
import { ExpenseOrderStatus, ExpenseOrderStatusLabels } from '@/enums/ExpenseOrderEnums';

const ExpenseOrderAdmin: React.FC = () => {
  const { api } = useApiContext();
  const { execute } = useApiCall();
  
  const [expenseOrders, setExpenseOrders] = useState<ExpenseOrder[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ExpenseOrder | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'payment' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  
  // Filters and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [channelFilter] = useState<string>('');
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchExpenseOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use the new admin endpoint to get all expense orders with filters
      const filters: { status?: number; channelId?: string; journalistId?: string } = {};

      if (statusFilter) {
        filters.status = parseInt(statusFilter);
      }
      if (channelFilter) {
        filters.channelId = channelFilter;
      }

      const result = await execute(
        () => api.expenseOrderApi.getAllExpenseOrders({ page: page + 1, limit: rowsPerPage }, filters),
        { showErrorToast: false }
      ) as PaginatedResponse<any>;

      if (result) {
        setExpenseOrders(result.items || []);
        setTotalCount(result.metadata?.total || 0);
      }
    } catch (err) {
      setError('Failed to fetch expense orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseOrders();
  }, [page, rowsPerPage, searchQuery, statusFilter, channelFilter, sortColumn, sortDirection]);

  const handleEdit = (order: ExpenseOrder) => {
    setSelectedOrder(order);
    setEditDialogOpen(true);
  };

  const handleAction = (order: ExpenseOrder, action: 'approve' | 'reject' | 'payment') => {
    setSelectedOrder(order);
    setActionType(action);
    setActionDialogOpen(true);
    setActionReason('');
    setPaymentReference('');
  };

  const handleActionSubmit = async () => {
    if (!selectedOrder || !actionType) return;

    try {
      let result;
      switch (actionType) {
        case 'approve':
          result = await execute(
            () => api.expenseOrderApi.approveExpenseOrder(selectedOrder.id, { notes: actionReason }),
            {
              showSuccessMessage: true,
              successMessage: 'Expense order approved successfully!'
            }
          );
          break;
        case 'reject':
          result = await execute(
            () => api.expenseOrderApi.rejectExpenseOrder(selectedOrder.id, {
              rejectionReason: actionReason,
              notes: actionReason
            }),
            {
              showSuccessMessage: true,
              successMessage: 'Expense order rejected successfully!'
            }
          );
          break;
        case 'payment':
          result = await execute(
            () => api.expenseOrderApi.processPayment(selectedOrder.id, {
              paymentReference
            }),
            {
              showSuccessMessage: true,
              successMessage: 'Payment processed successfully!'
            }
          );
          break;
      }

      if (result) {
        setActionDialogOpen(false);
        setSelectedOrder(null);
        setActionType(null);
        fetchExpenseOrders();
      }
    } catch (err) {
      console.error(`Failed to ${actionType} expense order:`, err);
    }
  };

  // const handleSaveEdit = async (orderData: Partial<ExpenseOrder>) => {
  //   if (!selectedOrder) return;

  //   try {
  //     await execute(() => api.expenseOrderApi.updateExpenseOrder(selectedOrder.id, orderData));
  //     setEditDialogOpen(false);
  //     setSelectedOrder(null);
  //     fetchExpenseOrders();
  //   } catch (err) {
  //     setError('Failed to update expense order');
  //   }
  // };

  const getStatusColor = (status: ExpenseOrderStatus): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case ExpenseOrderStatus.DRAFT: return 'default';
      case ExpenseOrderStatus.SUBMITTED: return 'info';
      case ExpenseOrderStatus.UNDER_REVIEW: return 'warning';
      case ExpenseOrderStatus.APPROVED: return 'success';
      case ExpenseOrderStatus.REJECTED: return 'error';
      case ExpenseOrderStatus.PAID: return 'success';
      case ExpenseOrderStatus.CANCELLED: return 'secondary';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const columns: Column[] = [
    {
      id: 'title',
      label: 'Expense',
      minWidth: 200,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.type?.name} • ID: {row.id}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'journalist',
      label: 'Journalist',
      minWidth: 150,
      format: (_value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24 }}>
            {row.journalist?.displayName?.[0] || 'U'}
          </Avatar>
          <Typography variant="body2" noWrap>
            {row.journalist?.displayName || 'Unknown User'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'channel',
      label: 'Channel',
      minWidth: 120,
      format: (_value, row) => (
        <Typography variant="body2" noWrap>
          {row.channel?.name || 'Unknown'}
        </Typography>
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
      format: (value) => (
        <Chip
          label={ExpenseOrderStatusLabels[value]}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'submitted_at',
      label: 'Submitted',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {value ? new Date(value).toLocaleDateString() : '-'}
        </Typography>
      ),
    },
    {
      id: 'paid_at',
      label: 'Paid',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {value ? new Date(value).toLocaleDateString() : '-'}
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
  ];

  const statusOptions = Object.entries(ExpenseOrderStatusLabels).map(([key, label]) => ({
    value: key,
    label: label
  }));

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

  const rowActions = (row: ExpenseOrder) => (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="View">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(row);
          }}
        >
          <ViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {row.receiptUrl && (
        <Tooltip title="View Receipt">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              window.open(row.receiptUrl, '_blank');
            }}
          >
            <ReceiptIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {row.status === ExpenseOrderStatus.UNDER_REVIEW && (
        <>
          <Tooltip title="Approve">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row, 'approve');
              }}
            >
              <ApproveIcon fontSize="small" color="success" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Reject">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row, 'reject');
              }}
            >
              <RejectIcon fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        </>
      )}

      {row.status === ExpenseOrderStatus.APPROVED && (
        <Tooltip title="Process Payment">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleAction(row, 'payment');
            }}
          >
            <PaymentIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );

  return (
    <Box>
      <AdminTable
        title="Expense Order Management"
        columns={columns}
        rows={expenseOrders}
        totalCount={totalCount}
        loading={loading}
        error={error}
        selected={selected}
        onSelectionChange={setSelected}
        onEdit={handleEdit}
        onRefresh={fetchExpenseOrders}
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

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>View Expense Order</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Card variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                      <Typography variant="body2">{selectedOrder.title}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(selectedOrder.amount, selectedOrder.currency)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                      <Typography variant="body2">{selectedOrder.description}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Journalist</Typography>
                      <Typography variant="body2">
                        {selectedOrder.journalist?.displayName || 'Unknown User'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Channel</Typography>
                      <Typography variant="body2">{selectedOrder.channel?.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Type</Typography>
                      <Typography variant="body2">{selectedOrder.type?.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Status</Typography>
                      <Chip
                        label={ExpenseOrderStatusLabels[selectedOrder.status]}
                        color={getStatusColor(selectedOrder.status)}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {selectedOrder.notes && (
                <Alert severity="info">
                  <Typography variant="body2">{selectedOrder.notes}</Typography>
                </Alert>
              )}

              {selectedOrder.rejectionReason && (
                <Alert severity="error">
                  <Typography variant="body2">{selectedOrder.rejectionReason}</Typography>
                </Alert>
              )}

              {selectedOrder.paymentReference && (
                <Alert severity="success">
                  <Typography variant="body2">Payment Reference: {selectedOrder.paymentReference}</Typography>
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approve' && 'Approve Expense Order'}
          {actionType === 'reject' && 'Reject Expense Order'}
          {actionType === 'payment' && 'Process Payment'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {actionType === 'payment' && (
              <TextField
                label="Payment Reference"
                fullWidth
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="Enter payment reference or transaction ID"
              />
            )}
            <TextField
              label={actionType === 'reject' ? 'Rejection Reason' : 'Notes'}
              fullWidth
              multiline
              rows={3}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder={
                actionType === 'reject' 
                  ? 'Explain why this expense order is being rejected...'
                  : 'Add any additional notes...'
              }
              required={actionType === 'reject'}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleActionSubmit} 
            variant="contained"
            color={
              actionType === 'approve' ? 'success' :
              actionType === 'reject' ? 'error' :
              'primary'
            }
            disabled={actionType === 'reject' && !actionReason.trim()}
          >
            {actionType === 'approve' && 'Approve'}
            {actionType === 'reject' && 'Reject'}
            {actionType === 'payment' && 'Process Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpenseOrderAdmin;