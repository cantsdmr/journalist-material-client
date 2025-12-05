import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import ExpenseOrderForm from '@/components/expense-order/ExpenseOrderForm';
import { ExpenseOrder, UpdateExpenseOrderData } from '@/types/index';
import { ExpenseOrderStatus } from '@/enums/ExpenseOrderEnums';
import { useApiContext } from '@/contexts/ApiContext';
import { useProfile } from '@/contexts/ProfileContext';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';
import { getExpenseTypeOptions } from '@/enums/ExpenseTypeEnums';

const EditExpenseOrderStudio: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { api } = useApiContext();
  const { profile } = useProfile();
  
  const [expenseOrder, setExpenseOrder] = useState<ExpenseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const { execute, loading: saveLoading } = useApiCall();

  // Get channels from profile context
  const channels = profile?.staffChannels?.map(staffChannel => staffChannel.channel) || [];
  
  // Get expense types from static enum
  const expenseTypes = getExpenseTypeOptions();

  useEffect(() => {
    const fetchExpenseOrder = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch expense order
        const expenseOrderResult = await execute(
          () => api.app.expenseOrder.getExpenseOrder(id),
          { showErrorToast: true }
        );
        
        if (expenseOrderResult) {
          setExpenseOrder(expenseOrderResult);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseOrder();
  }, [id, execute]);

  const handleSave = async (data: UpdateExpenseOrderData) => {
    if (!id) return;
    
    const result = await execute(
      () => api.app.expenseOrder.updateExpenseOrder(id, data),
      {
        showSuccessMessage: true,
        successMessage: 'Expense order updated successfully!'
      }
    );
    
    if (result) {
      setExpenseOrder(result);
      navigate(PATHS.STUDIO_EXPENSE_ORDER_VIEW.replace(':id', result.id));
    }
  };

  const handleSubmit = async (expenseOrder: ExpenseOrder) => {
    const result = await execute(
      () => api.app.expenseOrder.submitExpenseOrder(expenseOrder.id),
      {
        showSuccessMessage: true,
        successMessage: 'Expense order submitted successfully!'
      }
    );
    
    if (result) {
      navigate(PATHS.STUDIO_EXPENSE_ORDER_VIEW.replace(':id', expenseOrder.id));
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

  if (!expenseOrder) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 1
        }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Expense Order Not Found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back
          </Button>
        </Box>
      </Box>
    );
  }

  // Check if expense order can be edited
  if (expenseOrder.status !== ExpenseOrderStatus.DRAFT) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 1
        }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Cannot Edit Expense Order
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This expense order cannot be edited because it has already been submitted.
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Expense Order
          </Button>
        </Box>
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