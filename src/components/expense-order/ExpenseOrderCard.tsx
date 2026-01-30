import React from 'react';
import {
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Receipt as ReceiptIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import JCard from '@/components/common/Card';
import ExpenseOrderStatusChip from './ExpenseOrderStatusChip';
import { ExpenseOrder } from '@/types/index';
import { EXPENSE_ORDER_STATUS, type ExpenseOrderStatus } from '@/enums/ExpenseOrderEnums';
import { getExpenseTypeLabel } from '@/enums/ExpenseTypeEnums';
import { formatDistanceToNow } from 'date-fns';

interface ExpenseOrderCardProps {
  expenseOrder: ExpenseOrder;
  onView?: (expenseOrder: ExpenseOrder) => void;
  onEdit?: (expenseOrder: ExpenseOrder) => void;
  onSubmit?: (expenseOrder: ExpenseOrder) => void;
  onCancel?: (expenseOrder: ExpenseOrder) => void;
  onApprove?: (expenseOrder: ExpenseOrder) => void;
  onReject?: (expenseOrder: ExpenseOrder) => void;
  onProcessPayment?: (expenseOrder: ExpenseOrder) => void;
  showActions?: boolean;
  userRole?: 'journalist' | 'admin' | 'finance-manager';
}

const ExpenseOrderCard: React.FC<ExpenseOrderCardProps> = ({
  expenseOrder,
  onView,
  onEdit,
  onSubmit,
  onCancel,
  onApprove,
  onReject,
  onProcessPayment,
  showActions = true,
  userRole = 'journalist'
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const canEdit = expenseOrder.status === EXPENSE_ORDER_STATUS.DRAFT;
  const canSubmit = expenseOrder.status === EXPENSE_ORDER_STATUS.DRAFT;
  const canCancel = ([EXPENSE_ORDER_STATUS.DRAFT, EXPENSE_ORDER_STATUS.SUBMITTED] as ExpenseOrderStatus[]).includes(expenseOrder.status);
  const canApprove = ([EXPENSE_ORDER_STATUS.SUBMITTED, EXPENSE_ORDER_STATUS.UNDER_REVIEW] as ExpenseOrderStatus[]).includes(expenseOrder.status);
  const canReject = ([EXPENSE_ORDER_STATUS.SUBMITTED, EXPENSE_ORDER_STATUS.UNDER_REVIEW] as ExpenseOrderStatus[]).includes(expenseOrder.status);
  const canProcessPayment = expenseOrder.status === EXPENSE_ORDER_STATUS.APPROVED;

  const getActionMenuItems = () => {
    const items = [];

    if (onView) {
      items.push(
        <MenuItem key="view" onClick={() => { onView(expenseOrder); handleMenuClose(); }}>
          <ViewIcon sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
      );
    }

    if (userRole === 'journalist') {
      if (canEdit && onEdit) {
        items.push(
          <MenuItem key="edit" onClick={() => { onEdit(expenseOrder); handleMenuClose(); }}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit
          </MenuItem>
        );
      }

      if (canSubmit && onSubmit) {
        items.push(
          <MenuItem key="submit" onClick={() => { onSubmit(expenseOrder); handleMenuClose(); }}>
            <SendIcon sx={{ mr: 1 }} fontSize="small" />
            Submit for Approval
          </MenuItem>
        );
      }

      if (canCancel && onCancel) {
        items.push(
          <MenuItem key="cancel" onClick={() => { onCancel(expenseOrder); handleMenuClose(); }} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Cancel
          </MenuItem>
        );
      }
    } else if (userRole === 'admin' || userRole === 'finance-manager') {
      if (canApprove && onApprove) {
        items.push(
          <MenuItem key="approve" onClick={() => { onApprove(expenseOrder); handleMenuClose(); }} sx={{ color: 'success.main' }}>
            Approve
          </MenuItem>
        );
      }

      if (canReject && onReject) {
        items.push(
          <MenuItem key="reject" onClick={() => { onReject(expenseOrder); handleMenuClose(); }} sx={{ color: 'error.main' }}>
            Reject
          </MenuItem>
        );
      }

      if (canProcessPayment && onProcessPayment) {
        items.push(
          <MenuItem key="process-payment" onClick={() => { onProcessPayment(expenseOrder); handleMenuClose(); }} sx={{ color: 'primary.main' }}>
            Process Payment
          </MenuItem>
        );
      }
    }

    return items;
  };

  return (
    <JCard>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
            {expenseOrder.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {expenseOrder.description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {expenseOrder.channel.name} • {getExpenseTypeLabel(expenseOrder.type.id)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ExpenseOrderStatusChip status={expenseOrder.status} />
          {showActions && (
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {formatCurrency(expenseOrder.amount, expenseOrder.currency)}
          </Typography>
          {expenseOrder.receiptUrl && (
            <Tooltip title="Receipt attached">
              <ReceiptIcon sx={{ ml: 1, color: 'success.main' }} fontSize="small" />
            </Tooltip>
          )}
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          {formatDistanceToNow(new Date(expenseOrder.createdAt), { addSuffix: true })}
        </Typography>
      </Box>

      {expenseOrder.notes && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            "{expenseOrder.notes}"
          </Typography>
        </Box>
      )}

      {expenseOrder.rejectionReason && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
          <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
            Rejection Reason: {expenseOrder.rejectionReason}
          </Typography>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 180 }
        }}
      >
        {getActionMenuItems()}
      </Menu>
    </JCard>
  );
};

export default ExpenseOrderCard; 