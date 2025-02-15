import React from 'react';
import {
  SwipeableDrawer,
  List,
  ListItemButton,
  ListItemText,
  alpha
} from '@mui/material';
import { TabConfigArray } from './index';

interface MobileNavigationProps {
  tabs: TabConfigArray;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  isOpen,
  onClose,
  onOpen
}) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      disableSwipeToOpen={false}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '80vh'
        }
      }}
    >
      <List sx={{ pt: 1, pb: 2 }}>
        {tabs.map((tab) => (
          <ListItemButton
            key={tab.id}
            selected={activeTab === tab.id}
            onClick={() => {
              onTabChange(tab.id);
              onClose();
            }}
            sx={{
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: theme => alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            <ListItemText primary={tab.label} />
          </ListItemButton>
        ))}
      </List>
    </SwipeableDrawer>
  );
}; 