import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import ExpenseOrderCard from './ExpenseOrderCard';
import { ExpenseOrder } from '@/types/index';
import { ExpenseOrderStatus } from '@/enums/ExpenseOrderEnums';
import { useApiContext } from '@/contexts/ApiContext';

interface ExpenseOrderListProps {
  onCreateNew?: () => void;
  onEdit?: (expenseOrder: ExpenseOrder) => void;
  onView?: (expenseOrder: ExpenseOrder) => void;
  userRole?: 'journalist' | 'admin' | 'finance-manager';
  channelId?: string;
  showCreateButton?: boolean;
}

const ExpenseOrderList: React.FC<ExpenseOrderListProps> = ({
  onCreateNew,
  onEdit,
  onView,
  userRole = 'journalist',
  channelId,
  showCreateButton = true
}) => {
  const { api } = useApiContext();
  const [expenseOrders, setExpenseOrders] = useState<ExpenseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ExpenseOrderStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const loadExpenseOrders = async (page = 1) => {
    try {
      setLoading(page === 1);
      setError(null);

      let response;
      const pagination = { page, limit: 10 };

      if (userRole === 'journalist') {
        response = await api.expenseOrderApi.getMyExpenseOrders(
          pagination,
          statusFilter || undefined
        );
      } else if (channelId) {
        response = await api.expenseOrderApi.getExpenseOrdersByChannel(
          channelId,
          pagination,
          statusFilter || undefined
        );
      } else {
        response = await api.expenseOrderApi.getPendingExpenseOrders(pagination);
      }

      setExpenseOrders(response.data);
      setTotalPages(Math.ceil(response.total / response.limit));
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load expense orders');
      console.error('Error loading expense orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadExpenseOrders(1);
  }, [statusFilter, userRole, channelId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadExpenseOrders(currentPage);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    loadExpenseOrders(value);
  };

  const handleSubmitExpenseOrder = async (expenseOrder: ExpenseOrder) => {
    try {
      await api.expenseOrderApi.submitExpenseOrder(expenseOrder.id);
      await loadExpenseOrders(currentPage);
    } catch (err: any) {
      console.error('Error submitting expense order:', err);
      setError(err.response?.data?.message || 'Failed to submit expense order');
    }
  };

  const handleCancelExpenseOrder = async (expenseOrder: ExpenseOrder) => {
    try {
      await api.expenseOrderApi.cancelExpenseOrder(expenseOrder.id, 'Cancelled by user');
      await loadExpenseOrders(currentPage);
    } catch (err: any) {
      console.error('Error cancelling expense order:', err);
      setError(err.response?.data?.message || 'Failed to cancel expense order');
    }
  };

  const handleApproveExpenseOrder = async (expenseOrder: ExpenseOrder) => {
    try {
      await api.expenseOrderApi.approveExpenseOrder(expenseOrder.id);
      await loadExpenseOrders(currentPage);
    } catch (err: any) {
      console.error('Error approving expense order:', err);
      setError(err.response?.data?.message || 'Failed to approve expense order');
    }
  };

  const handleRejectExpenseOrder = async (expenseOrder: ExpenseOrder) => {
    try {
      const reason = prompt('Please provide a reason for rejection:');
      if (reason) {
        await api.expenseOrderApi.rejectExpenseOrder(expenseOrder.id, { rejectionReason: reason });
        await loadExpenseOrders(currentPage);
      }
    } catch (err: any) {
      console.error('Error rejecting expense order:', err);
      setError(err.response?.data?.message || 'Failed to reject expense order');
    }
  };

  const handleProcessPayment = async (expenseOrder: ExpenseOrder) => {
    try {
      await api.expenseOrderApi.processPayment(expenseOrder.id);
      await loadExpenseOrders(currentPage);
    } catch (err: any) {
      console.error('Error processing payment:', err);
      setError(err.response?.data?.message || 'Failed to process payment');
    }
  };

  const getPageTitle = () => {
    switch (userRole) {
      case 'journalist':
        return 'My Expense Orders';
      case 'admin':
      case 'finance-manager':
        return channelId ? 'Channel Expense Orders' : 'All Expense Orders';
      default:
        return 'Expense Orders';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {getPageTitle()}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => setStatusFilter(e.target.value as ExpenseOrderStatus | '')}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value={ExpenseOrderStatus.DRAFT}>Draft</MenuItem>
              <MenuItem value={ExpenseOrderStatus.SUBMITTED}>Submitted</MenuItem>
              <MenuItem value={ExpenseOrderStatus.UNDER_REVIEW}>Under Review</MenuItem>
              <MenuItem value={ExpenseOrderStatus.APPROVED}>Approved</MenuItem>
              <MenuItem value={ExpenseOrderStatus.REJECTED}>Rejected</MenuItem>
              <MenuItem value={ExpenseOrderStatus.PAID}>Paid</MenuItem>
              <MenuItem value={ExpenseOrderStatus.CANCELLED}>Cancelled</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
            size="small"
          >
            Refresh
          </Button>
          
          {showCreateButton && userRole === 'journalist' && onCreateNew && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateNew}
            >
              Create Expense Order
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : expenseOrders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No expense orders found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {userRole === 'journalist' 
              ? "You haven't created any expense orders yet."
              : "No expense orders match your current filter."}
          </Typography>
          {showCreateButton && userRole === 'journalist' && onCreateNew && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateNew}
            >
              Create Your First Expense Order
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {expenseOrders.map((expenseOrder) => (
              <Grid item xs={12} md={6} lg={4} key={expenseOrder.id}>
                <ExpenseOrderCard
                  expenseOrder={expenseOrder}
                  onView={onView}
                  onEdit={onEdit}
                  onSubmit={handleSubmitExpenseOrder}
                  onCancel={handleCancelExpenseOrder}
                  onApprove={handleApproveExpenseOrder}
                  onReject={handleRejectExpenseOrder}
                  onProcessPayment={handleProcessPayment}
                  userRole={userRole}
                />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ExpenseOrderList;