import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ExpenseOrderForm from '@/components/expense-order/ExpenseOrderForm';
import { CreateExpenseOrderData } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import { useProfile } from '@/contexts/ProfileContext';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';
import { getExpenseTypeOptions } from '@/enums/ExpenseTypeEnums';

const CreateExpenseOrderStudio: React.FC = () => {
  const navigate = useNavigate();
  const { api } = useApiContext();
  const { profile } = useProfile();
  const { execute, loading } = useApiCall();

  // Get channels from profile context
  const channels = profile?.staffChannels?.map(staffChannel => staffChannel.channel) || [];
  
  // Get expense types from static enum
  const expenseTypes = getExpenseTypeOptions();

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