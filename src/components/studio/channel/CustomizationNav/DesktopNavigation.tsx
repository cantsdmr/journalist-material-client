import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { TabConfigArray } from './index';

interface DesktopNavigationProps {
  tabs: TabConfigArray;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs 
        value={activeTab}
        onChange={(_, value) => onTabChange(value)}
        sx={{ px: { md: 3, lg: 4 } }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            value={tab.id}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9375rem'
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};
