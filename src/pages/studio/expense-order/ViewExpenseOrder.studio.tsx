import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Receipt as ReceiptIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import ExpenseOrderStatusChip from '@/components/expense-order/ExpenseOrderStatusChip';
import { ExpenseOrder } from '@/types/index';
import { ExpenseOrderStatus } from '@/enums/ExpenseOrderEnums';
import { useApiContext } from '@/contexts/ApiContext';
import { PATHS } from '@/constants/paths';

const ViewExpenseOrderStudio: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { api } = useApiContext();
  
  const [expenseOrder, setExpenseOrder] = useState<ExpenseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const fetchExpenseOrder = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await api.app.expenseOrder.getExpenseOrder(id);
      setExpenseOrder(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch expense order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseOrder();
  }, [id]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleBack = () => {
    navigate(PATHS.STUDIO_EXPENSE_ORDERS);
  };

  const handleEdit = () => {
    if (expenseOrder) {
      navigate(PATHS.STUDIO_EXPENSE_ORDER_EDIT.replace(':id', expenseOrder.id));
    }
  };

  const handleSubmit = async () => {
    if (!expenseOrder) return;

    setActionLoading(true);
    try {
      await api.app.expenseOrder.submitExpenseOrder(expenseOrder.id);
      await fetchExpenseOrder(); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Failed to submit expense order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!expenseOrder) return;

    setActionLoading(true);
    try {
      await api.app.expenseOrder.cancelExpenseOrder(expenseOrder.id, cancelReason);
      await fetchExpenseOrder(); // Refresh data
      setCancelDialogOpen(false);
      setCancelReason('');
    } catch (err: any) {
      setError(err.message || 'Failed to cancel expense order');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !expenseOrder) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'Expense order not found'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Expense Orders
        </Button>
      </Box>
    );
  }

  const canEdit = expenseOrder.status === ExpenseOrderStatus.DRAFT;
  const canSubmit = expenseOrder.status === ExpenseOrderStatus.DRAFT;
  const canCancel = [ExpenseOrderStatus.DRAFT, ExpenseOrderStatus.SUBMITTED].includes(expenseOrder.status);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, flex: 1 }}>
          Expense Order Details
        </Typography>
        <ExpenseOrderStatusChip status={expenseOrder.status} />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              {expenseOrder.title}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              {expenseOrder.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Channel
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {expenseOrder.channel.name}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Expense Type
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {expenseOrder.type.name}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {formatCurrency(expenseOrder.amount, expenseOrder.currency)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body1">
                  {format(new Date(expenseOrder.createdAt), 'PPP')}
                </Typography>
              </Grid>
            </Grid>

            {expenseOrder.receiptUrl && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Receipt
                  </Typography>
                  <Link
                    href={expenseOrder.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <ReceiptIcon fontSize="small" />
                    View Receipt
                  </Link>
                </Box>
              </>
            )}

            {expenseOrder.notes && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Notes
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    {expenseOrder.notes}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>

          {/* Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {canEdit && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  disabled={actionLoading}
                >
                  Edit
                </Button>
              )}
              {canSubmit && (
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleSubmit}
                  disabled={actionLoading}
                >
                  Submit for Approval
                </Button>
              )}
              {canCancel && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Timeline
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Created
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(expenseOrder.createdAt), { addSuffix: true })}
                </Typography>
              </Box>

              {expenseOrder.submittedAt && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Submitted
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(expenseOrder.submittedAt), { addSuffix: true })}
                  </Typography>
                </Box>
              )}

              {expenseOrder.approvedAt && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {expenseOrder.status === ExpenseOrderStatus.APPROVED ? 'Approved' : 'Reviewed'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(expenseOrder.approvedAt), { addSuffix: true })}
                  </Typography>
                  {expenseOrder.approver && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      by {expenseOrder.approver.displayName}
                    </Typography>
                  )}
                </Box>
              )}

              {expenseOrder.paidAt && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Paid
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(expenseOrder.paidAt), { addSuffix: true })}
                  </Typography>
                  {expenseOrder.paymentReference && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      Ref: {expenseOrder.paymentReference}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Paper>

          {expenseOrder.rejectionReason && (
            <Paper sx={{ p: 3, bgcolor: 'error.lighter' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'error.main' }}>
                Rejection Reason
              </Typography>
              <Typography variant="body2" color="error.main">
                {expenseOrder.rejectionReason}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Expense Order</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to cancel this expense order? This action cannot be undone.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for cancellation (optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Provide a reason for cancelling this expense order..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Keep Order
          </Button>
          <Button 
            onClick={handleCancelConfirm} 
            color="error" 
            variant="contained"
            disabled={actionLoading}
          >
            Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewExpenseOrderStudio; 