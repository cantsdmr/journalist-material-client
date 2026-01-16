import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Tabs,
  Tab,
  IconButton,
  styled
} from '@mui/material';
import {
  AccountCircle,
  Payment,
  Subscriptions as SubscriptionsIcon,
  Palette,
  Notifications,
  Security,
  LightMode,
  DarkMode,
  ArrowForward,
  ArrowBack
} from '@mui/icons-material';
import ProfileTab from '@/components/account/ProfileTab';
import PayoutMethodsTab from '@/components/account/PayoutMethodsTab';
import SubscriptionsTab from '@/components/account/SubscriptionsTab';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

type SettingSection = 'profile' | 'payment' | 'subscriptions' | 'appearance' | 'notifications' | 'security';

const AppearanceSettings: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [themeMode, setThemeMode] = useState(isDarkMode ? 'dark' : 'light');

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.value;
    setThemeMode(newMode);
    if ((newMode === 'dark' && !isDarkMode) || (newMode === 'light' && isDarkMode)) {
      toggleTheme();
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        Appearance
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Customize how MetaJourno looks on your device
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Theme mode
          </FormLabel>
          <RadioGroup value={themeMode} onChange={handleThemeChange}>
            <FormControlLabel
              value="light"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LightMode fontSize="small" />
                  <Box>
                    <Typography variant="body1">Light</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Use light theme
                    </Typography>
                  </Box>
                </Box>
              }
              sx={{ mb: 2, p: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
            />
            <FormControlLabel
              value="dark"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DarkMode fontSize="small" />
                  <Box>
                    <Typography variant="body1">Dark</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Use dark theme
                    </Typography>
                  </Box>
                </Box>
              }
              sx={{ p: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
            />
          </RadioGroup>
        </FormControl>
      </Paper>
    </Box>
  );
};

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

const Account: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingSection>('profile');
  const { user } = useAuth();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const menuItems = [
    { id: 'profile' as SettingSection, icon: <AccountCircle />, label: 'Profile', divider: false },
    { id: 'payment' as SettingSection, icon: <Payment />, label: 'Payout Methods', divider: false },
    { id: 'subscriptions' as SettingSection, icon: <SubscriptionsIcon />, label: 'Subscriptions', divider: true },
    { id: 'appearance' as SettingSection, icon: <Palette />, label: 'Appearance', divider: false },
    { id: 'notifications' as SettingSection, icon: <Notifications />, label: 'Notifications', divider: false },
    { id: 'security' as SettingSection, icon: <Security />, label: 'Password and authentication', divider: false },
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
      case 'profile':
        return <ProfileTab />;
      case 'payment':
        return <PayoutMethodsTab />;
      case 'subscriptions':
        return <SubscriptionsTab />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'notifications':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Notifications</Typography>
            <Typography color="text.secondary">Notification settings coming soon...</Typography>
          </Box>
        );
      case 'security':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Password and authentication</Typography>
            <Typography color="text.secondary">Security settings coming soon...</Typography>
          </Box>
        );
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
            {user?.displayName || 'Account'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({user?.email || 'user'})
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Your personal account
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

export default Account; 