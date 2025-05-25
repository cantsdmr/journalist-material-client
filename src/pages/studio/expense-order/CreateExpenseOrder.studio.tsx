import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ExpenseOrderForm from '@/components/expense-order/ExpenseOrderForm';
import { CreateExpenseOrderData, ExpenseType } from '@/APIs/ExpenseOrderAPI';
import { Channel } from '@/APIs/ChannelAPI';
import { useApiContext } from '@/contexts/ApiContext';
import { useUser } from '@/contexts/UserContext';
import { PATHS } from '@/constants/paths';

const CreateExpenseOrderStudio: React.FC = () => {
  const navigate = useNavigate();
  const { api } = useApiContext();
  const { user } = useUser();
  
  const [channels, setChannels] = useState<Channel[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        
        // Fetch user's channels and expense types
        const [channelsResult, typesResult] = await Promise.all([
          api.userApi.getUserChannels(user.id),
          api.expenseOrderApi.getExpenseTypes()
        ]);
        
        setChannels(channelsResult.items.map(cu => cu.channel));
        setExpenseTypes(typesResult);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      }
    };

    fetchData();
  }, [user]);

  const handleSave = async (data: CreateExpenseOrderData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.expenseOrderApi.createExpenseOrder(data);
      // Navigate to the created expense order
      navigate(PATHS.STUDIO_EXPENSE_ORDER_VIEW.replace(':id', result.id));
    } catch (err: any) {
      setError(err.message || 'Failed to create expense order');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(PATHS.STUDIO_EXPENSE_ORDERS);
  };

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
          Create Expense Order
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {channels.length === 0 && !error ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          You need to be a member of at least one channel to create expense orders.
        </Alert>
      ) : (
        <ExpenseOrderForm
          channels={channels}
          expenseTypes={expenseTypes}
          onSave={handleSave}
          loading={loading}
          isEdit={false}
        />
      )}
    </Box>
  );
};

export default CreateExpenseOrderStudio; 