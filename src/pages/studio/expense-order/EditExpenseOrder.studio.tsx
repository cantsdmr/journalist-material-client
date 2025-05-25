import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Button,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import ExpenseOrderForm from '@/components/expense-order/ExpenseOrderForm';
import { ExpenseOrder, UpdateExpenseOrderData, ExpenseType } from '@/APIs/ExpenseOrderAPI';
import { Channel } from '@/APIs/ChannelAPI';
import { ExpenseOrderStatus } from '@/enums/ExpenseOrderEnums';
import { useApiContext } from '@/contexts/ApiContext';
import { useUser } from '@/contexts/UserContext';
import { PATHS } from '@/constants/paths';

const EditExpenseOrderStudio: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { api } = useApiContext();
  const { user } = useUser();
  
  const [expenseOrder, setExpenseOrder] = useState<ExpenseOrder | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch expense order, user's channels, and expense types
        const [expenseOrderResult, channelsResult, typesResult] = await Promise.all([
          api.expenseOrderApi.getExpenseOrder(id),
          api.userApi.getUserChannels(user.id),
          api.expenseOrderApi.getExpenseTypes()
        ]);
        
        setExpenseOrder(expenseOrderResult);
        setChannels(channelsResult.items.map(cu => cu.channel));
        setExpenseTypes(typesResult);
      } catch (err: any) {
        setError(err.message || 'Failed to load expense order');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleSave = async (data: UpdateExpenseOrderData) => {
    if (!id) return;
    
    setSaveLoading(true);
    setError(null);
    
    try {
      const result = await api.expenseOrderApi.updateExpenseOrder(id, data);
      setExpenseOrder(result);
      // Navigate to the updated expense order
      navigate(PATHS.STUDIO_EXPENSE_ORDER_VIEW.replace(':id', result.id));
    } catch (err: any) {
      setError(err.message || 'Failed to update expense order');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSubmit = async (expenseOrder: ExpenseOrder) => {
    try {
      await api.expenseOrderApi.submitExpenseOrder(expenseOrder.id);
      // Navigate to the submitted expense order
      navigate(PATHS.STUDIO_EXPENSE_ORDER_VIEW.replace(':id', expenseOrder.id));
    } catch (err: any) {
      setError(err.message || 'Failed to submit expense order');
    }
  };

  const handleBack = () => {
    if (expenseOrder) {
      navigate(PATHS.STUDIO_EXPENSE_ORDER_VIEW.replace(':id', expenseOrder.id));
    } else {
      navigate(PATHS.STUDIO_EXPENSE_ORDERS);
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
          Back
        </Button>
      </Box>
    );
  }

  // Check if expense order can be edited
  if (expenseOrder.status !== ExpenseOrderStatus.DRAFT) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          This expense order cannot be edited because it has already been submitted.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Expense Order
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Edit Expense Order
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <ExpenseOrderForm
        expenseOrder={expenseOrder}
        channels={channels}
        expenseTypes={expenseTypes}
        onSave={handleSave}
        onSubmit={handleSubmit}
        loading={saveLoading}
        isEdit={true}
      />
    </Box>
  );
};

export default EditExpenseOrderStudio; 