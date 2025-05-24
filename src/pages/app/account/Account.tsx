import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { AccountCircle, Payment, Subscriptions as SubscriptionsIcon } from '@mui/icons-material';
import ProfileTab from '@/components/account/ProfileTab';
import PaymentMethodsTab from '@/components/account/PaymentMethodsTab';
import SubscriptionsTab from '@/components/account/SubscriptionsTab';

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
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `account-tab-${index}`,
    'aria-controls': `account-tabpanel-${index}`,
  };
}

const Account: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>
      
      <Paper sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="account settings tabs"
            variant="fullWidth"
          >
            <Tab 
              icon={<AccountCircle />} 
              label="Profile" 
              {...a11yProps(0)}
            />
            <Tab 
              icon={<Payment />} 
              label="Payment Methods" 
              {...a11yProps(1)}
            />
            <Tab 
              icon={<SubscriptionsIcon />} 
              label="Subscriptions" 
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <ProfileTab />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <PaymentMethodsTab />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <SubscriptionsTab />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Account; 