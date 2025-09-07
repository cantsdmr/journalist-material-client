import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PayoutDashboard, ExpenseOrderForm } from '@/components/expense-order';
// import { Channel } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import { useProfile } from '@/contexts/ProfileContext';
import { getExpenseTypeOptions } from '@/enums/ExpenseTypeEnums';

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
      id={`payout-tabpanel-${index}`}
      aria-labelledby={`payout-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const PayoutsStudio: React.FC = () => {
  const { api } = useApiContext();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('');

  // Get channels from profile context
  const channels = profile?.staffChannels?.map(staffChannel => staffChannel.channel) || [];
  
  // Get expense types from static enum
  const expenseTypes = getExpenseTypeOptions();

  useEffect(() => {
    // Set first channel as default when channels are loaded
    if (channels.length > 0 && !selectedChannelId) {
      setSelectedChannelId(channels[0].id);
    }
  }, [channels, selectedChannelId]);

  const handleCreateExpenseOrder = () => {
    setShowCreateForm(true);
    setTabValue(1);
  };

  const handleSaveExpenseOrder = async (data: any) => {
    try {
      await api.expenseOrderApi.createExpenseOrder(data);
      setShowCreateForm(false);
      setTabValue(0);
      // Refresh dashboard
      window.location.reload();
    } catch (error) {
      console.error('Error creating expense order:', error);
      throw error;
    }
  };

  const handleViewExpenseOrder = (expenseOrderId: string) => {
    // Navigate to expense order detail page
    navigate(`/studio/payouts/orders/${expenseOrderId}`);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setShowCreateForm(false);
    }
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Payouts & Expense Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your expense orders and track payments from your channels
        </Typography>
      </Box>

      {channels.length > 1 && (
        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Channel</InputLabel>
            <Select
              value={selectedChannelId}
              label="Select Channel"
              onChange={(e) => setSelectedChannelId(e.target.value)}
            >
              {channels.map((channel) => (
                <MenuItem key={channel.id} value={channel.id}>
                  {channel.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="payout tabs">
          <Tab
            label="Dashboard"
            icon={<ReceiptIcon />}
            iconPosition="start"
            id="payout-tab-0"
            aria-controls="payout-tabpanel-0"
          />
          <Tab
            label={showCreateForm ? "Create Expense Order" : "Create New"}
            icon={<AddIcon />}
            iconPosition="start"
            id="payout-tab-1"
            aria-controls="payout-tabpanel-1"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <PayoutDashboard
          channelId={selectedChannelId}
          onCreateExpenseOrder={handleCreateExpenseOrder}
          onViewExpenseOrder={handleViewExpenseOrder}
          userRole="journalist"
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {showCreateForm && (
          <ExpenseOrderForm
            channels={channels}
            expenseTypes={expenseTypes}
            onSave={handleSaveExpenseOrder}
            isEdit={false}
          />
        )}
        {!showCreateForm && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Create a New Expense Order
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Request a payout from your channel's earnings by creating an expense order.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateForm(true)}
              sx={{ px: 4, py: 1.5 }}
            >
              Start Creating
            </Button>
          </Box>
        )}
      </TabPanel>
    </Container>
  );
};

export default PayoutsStudio;