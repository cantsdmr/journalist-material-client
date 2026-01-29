import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  styled
} from '@mui/material';
import {
  Palette,
  Notifications,
  ArrowForward,
  ArrowBack
} from '@mui/icons-material';
import AppearanceSettingsTab from '@/components/account/AppearanceSettingsTab';
import NotificationPreferencesTab from '@/components/account/NotificationPreferencesTab';

type SettingSection = 'appearance' | 'notifications';

const ArrowButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.04)',
  width: 32,
  height: 32,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(0, 0, 0, 0.08)',
  }
}));

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingSection>('appearance');
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const menuItems = [
    { id: 'appearance' as SettingSection, icon: <Palette />, label: 'Appearance' },
    { id: 'notifications' as SettingSection, icon: <Notifications />, label: 'Notifications' },
  ];

  const checkScroll = () => {
    const tabsElement = tabsRef.current?.querySelector('.MuiTabs-scroller');
    if (tabsElement) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsElement;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const tabsElement = tabsRef.current?.querySelector('.MuiTabs-scroller');
    if (tabsElement) {
      tabsElement.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        tabsElement.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const handleScrollLeft = () => {
    const tabsElement = tabsRef.current?.querySelector('.MuiTabs-scroller');
    if (tabsElement) {
      tabsElement.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    const tabsElement = tabsRef.current?.querySelector('.MuiTabs-scroller');
    if (tabsElement) {
      tabsElement.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'appearance':
        return <AppearanceSettingsTab />;
      case 'notifications':
        return <NotificationPreferencesTab />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Settings
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage your application preferences
        </Typography>
      </Box>

      {/* Horizontal Tabs Navigation */}
      <Box sx={{ position: 'relative', mb: 3 }} ref={tabsRef}>
        {showLeftArrow && (
          <ArrowButton
            onClick={handleScrollLeft}
            sx={{ left: 0 }}
          >
            <ArrowBack fontSize="small" />
          </ArrowButton>
        )}
        <Tabs
          value={activeSection}
          onChange={(_, newValue) => setActiveSection(newValue)}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTabs-scroller': {
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            },
            '& .MuiTabs-indicator': {
              height: 2,
              borderRadius: '2px 2px 0 0'
            },
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 2.5,
              py: 1.5,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 600
              }
            }
          }}
        >
          {menuItems.map((item) => (
            <Tab
              key={item.id}
              value={item.id}
              label={item.label}
              icon={item.icon}
              iconPosition="start"
              sx={{
                minHeight: 48,
                gap: 0.75
              }}
            />
          ))}
        </Tabs>
        {showRightArrow && (
          <ArrowButton
            onClick={handleScrollRight}
            sx={{ right: 0 }}
          >
            <ArrowForward fontSize="small" />
          </ArrowButton>
        )}
      </Box>

      {/* Main Content Area */}
      <Box>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Settings;
