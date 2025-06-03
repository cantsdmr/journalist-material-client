import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ExpenseOrderForm from '@/components/expense-order/ExpenseOrderForm';
import { CreateExpenseOrderData, ExpenseType } from '@/types/index';
import { Channel } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import { useProfile } from '@/contexts/ProfileContext';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';

const CreateExpenseOrderStudio: React.FC = () => {
  const navigate = useNavigate();
  const { api } = useApiContext();
  const { profile } = useProfile();
  
  const [channels, setChannels] = useState<Channel[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const { execute, loading } = useApiCall();

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return;
      
      // Fetch user's channels
      const channelsResult = await execute(
        () => api.accountApi.getUserChannels(),
        { showErrorToast: true }
      );
      
      if (channelsResult) {
        setChannels(channelsResult.items.map(cu => cu.channel));
      }
      
      // Fetch expense types
      const typesResult = await execute(
        () => api.expenseOrderApi.getExpenseTypes(),
        { showErrorToast: true }
      );
      
      if (typesResult) {
        setExpenseTypes(typesResult);
      }
    };

    fetchData();
  }, [profile, execute]);

  const handleSave = async (data: CreateExpenseOrderData) => {
    const result = await execute(
      () => api.expenseOrderApi.createExpenseOrder(data),
      {
        showSuccessMessage: true,
        successMessage: 'Expense order created successfully!'
      }
    );
    
    if (result) {
      navigate(PATHS.STUDIO_EXPENSE_ORDER_VIEW.replace(':id', result.id));
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

      {channels.length === 0 && !loading ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 1
        }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No Channels Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You need to be a member of at least one channel to create expense orders.
          </Typography>
        </Box>
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