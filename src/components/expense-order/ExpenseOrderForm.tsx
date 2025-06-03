import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  Save as SaveIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import JCard from '@/components/common/Card';
import { ExpenseOrder, CreateExpenseOrderData, UpdateExpenseOrderData, ExpenseType, Channel } from '@/types/index';
import { ExpenseOrderStatus } from '@/enums/ExpenseOrderEnums';

interface ExpenseOrderFormProps {
  expenseOrder?: ExpenseOrder;
  channels: Channel[];
  expenseTypes: ExpenseType[];
  onSave: (data: CreateExpenseOrderData | UpdateExpenseOrderData) => Promise<void>;
  onSubmit?: (expenseOrder: ExpenseOrder) => Promise<void>;
  loading?: boolean;
  isEdit?: boolean;
}

const ExpenseOrderForm: React.FC<ExpenseOrderFormProps> = ({
  expenseOrder,
  channels,
  expenseTypes,
  onSave,
  onSubmit,
  loading = false,
  isEdit = false
}) => {
  const [formData, setFormData] = useState({
    channelId: expenseOrder?.channel.id || '',
    typeId: expenseOrder?.type.id || 0,
    title: expenseOrder?.title || '',
    description: expenseOrder?.description || '',
    amount: expenseOrder?.amount || 0,
    currency: expenseOrder?.currency || 'USD',
    receiptUrl: expenseOrder?.receipt_url || '',
    notes: expenseOrder?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitLoading, setSubmitLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.channelId) newErrors.channelId = 'Channel is required';
    if (!formData.typeId) newErrors.typeId = 'Expense type is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.currency.trim()) newErrors.currency = 'Currency is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (isEdit) {
        const updateData: UpdateExpenseOrderData = {
          title: formData.title,
          description: formData.description,
          amount: formData.amount,
          currency: formData.currency,
          typeId: Number(formData.typeId),
          receiptUrl: formData.receiptUrl,
          notes: formData.notes
        };
        await onSave(updateData);
      } else {
        const createData: CreateExpenseOrderData = {
          channelId: formData.channelId,
          typeId: Number(formData.typeId),
          title: formData.title,
          description: formData.description,
          amount: formData.amount,
          currency: formData.currency,
          receiptUrl: formData.receiptUrl,
          notes: formData.notes
        };
        await onSave(createData);
      }
    } catch (error) {
      console.error('Error saving expense order:', error);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!expenseOrder || !onSubmit) return;

    setSubmitLoading(true);
    try {
      await onSubmit(expenseOrder);
    } catch (error) {
      console.error('Error submitting expense order:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const canSubmit = isEdit && expenseOrder?.status === ExpenseOrderStatus.DRAFT && onSubmit;

  return (
    <JCard>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        {isEdit ? 'Edit Expense Order' : 'Create New Expense Order'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.channelId}>
            <InputLabel>Channel</InputLabel>
            <Select
              value={formData.channelId}
              label="Channel"
              onChange={(e) => handleInputChange('channelId', e.target.value)}
              disabled={isEdit} // Can't change channel when editing
            >
              {channels.map((channel) => (
                <MenuItem key={channel.id} value={channel.id}>
                  {channel.name}
                </MenuItem>
              ))}
            </Select>
            {errors.channelId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.channelId}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.typeId}>
            <InputLabel>Expense Type</InputLabel>
            <Select
              value={formData.typeId}
              label="Expense Type"
              onChange={(e) => handleInputChange('typeId', e.target.value)}
            >
              {expenseTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
            {errors.typeId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.typeId}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            placeholder="Enter expense title"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            placeholder="Describe the expense in detail"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            error={!!errors.amount}
            helperText={errors.amount}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Currency"
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value.toUpperCase())}
            error={!!errors.currency}
            helperText={errors.currency}
            placeholder="USD"
            inputProps={{ maxLength: 3 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Receipt URL"
            value={formData.receiptUrl}
            onChange={(e) => handleInputChange('receiptUrl', e.target.value)}
            placeholder="https://example.com/receipt.pdf"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachFileIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Notes (Optional)"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Additional notes or comments"
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={loading || submitLoading}
            >
              Save as Draft
            </Button>

            {canSubmit && (
              <Button
                variant="contained"
                startIcon={submitLoading ? <CircularProgress size={16} /> : <SendIcon />}
                onClick={handleSubmitForApproval}
                disabled={loading || submitLoading}
              >
                Submit for Approval
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </JCard>
  );
};

export default ExpenseOrderForm; 