import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Button,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ExpenseOrderCard from '@/components/expense-order/ExpenseOrderCard';
import { ExpenseOrder } from '@/types/index';
import { ExpenseOrderStatus } from '@/enums/ExpenseOrderEnums';
import { useApiContext } from '@/contexts/ApiContext';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`expense-order-tabpanel-${index}`}
      aria-labelledby={`expense-order-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ListExpenseOrdersStudio: React.FC = () => {
  const navigate = useNavigate();
  const { api } = useApiContext();
  
  const [tabValue, setTabValue] = useState(0);
  const [expenseOrders, setExpenseOrders] = useState<ExpenseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { execute } = useApiCall();

  const statusFilters = [
    { label: 'All', status: undefined },
    { label: 'Draft', status: ExpenseOrderStatus.DRAFT },
    { label: 'Submitted', status: ExpenseOrderStatus.SUBMITTED },
    { label: 'Approved', status: ExpenseOrderStatus.APPROVED },
    { label: 'Paid', status: ExpenseOrderStatus.PAID },
    { label: 'Rejected', status: ExpenseOrderStatus.REJECTED }
  ];

  const fetchExpenseOrders = async (status?: ExpenseOrderStatus) => {
    setLoading(true);
    
    const result = await execute(
      () => api.expenseOrderApi.getMyExpenseOrders({ page: 1, limit: 50 }, status),
      { showErrorToast: true }
    );
    
    if (result) {
      setExpenseOrders(result.items);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenseOrders(statusFilters[tabValue].status);
  }, [tabValue, execute]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewExpenseOrder = (expenseOrder: ExpenseOrder) => {
    navigate(PATHS.STUDIO_EXPENSE_ORDER_VIEW.replace(':id', expenseOrder.id));
  };

  const handleEditExpenseOrder = (expenseOrder: ExpenseOrder) => {
    navigate(PATHS.STUDIO_EXPENSE_ORDER_EDIT.replace(':id', expenseOrder.id));
  };

  const handleSubmitExpenseOrder = async (expenseOrder: ExpenseOrder) => {
    const result = await execute(
      () => api.expenseOrderApi.submitExpenseOrder(expenseOrder.id),
      {
        showSuccessMessage: true,
        successMessage: 'Expense order submitted successfully!'
      }
    );
    
    if (result) {
      // Refresh the list
      fetchExpenseOrders(statusFilters[tabValue].status);
    }
  };

  const handleCancelExpenseOrder = async (expenseOrder: ExpenseOrder) => {
    const result = await execute(
      () => api.expenseOrderApi.cancelExpenseOrder(expenseOrder.id),
      {
        showSuccessMessage: true,
        successMessage: 'Expense order cancelled successfully!'
      }
    );
    
    if (result) {
      // Refresh the list
      fetchExpenseOrders(statusFilters[tabValue].status);
    }
  };

  const handleCreateNew = () => {
    navigate(PATHS.STUDIO_EXPENSE_ORDER_CREATE);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Expense Orders
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
        >
          Create New
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="expense order status tabs">
          {statusFilters.map((filter, index) => (
            <Tab key={index} label={filter.label} />
          ))}
        </Tabs>
      </Box>

      {statusFilters.map((filter, index) => (
        <TabPanel key={index} value={tabValue} index={index}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : expenseOrders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No expense orders found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {filter.status ? `No ${filter.label.toLowerCase()} expense orders` : 'You haven\'t created any expense orders yet'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
              >
                Create Your First Expense Order
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {expenseOrders.map((expenseOrder) => (
                <Grid item xs={12} md={6} lg={4} key={expenseOrder.id}>
                  <ExpenseOrderCard
                    expenseOrder={expenseOrder}
                    onView={handleViewExpenseOrder}
                    onEdit={handleEditExpenseOrder}
                    onSubmit={handleSubmitExpenseOrder}
                    onCancel={handleCancelExpenseOrder}
                    userRole="journalist"
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      ))}
    </Box>
  );
};

export default ListExpenseOrdersStudio; 