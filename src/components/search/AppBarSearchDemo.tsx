import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle
} from '@mui/icons-material';
import SearchBar from './SearchBar';

interface AppBarSearchDemoProps {
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

const AppBarSearchDemo: React.FC<AppBarSearchDemoProps> = ({
  onMenuClick,
  onNotificationClick,
  onProfileClick
}) => {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Navigate to search results page
  };

  const handleSuggestionSelect = (suggestion: any) => {
    console.log('Selected suggestion:', suggestion);
    // Handle suggestion selection
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ gap: 2 }}>
        {/* Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo/Brand */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            display: { xs: 'none', sm: 'block' },
            minWidth: 'fit-content'
          }}
        >
          Journalist
        </Typography>

        {/* Search Bar - Takes up the middle space */}
        <SearchBar
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          placeholder="Search news, channels, journalists..."
          popularSearches={['Breaking News', 'Politics', 'Technology', 'Climate Change']}
          variant="appbar"
        />

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content' }}>
          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={onNotificationClick}
            aria-label="notifications"
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton
            color="inherit"
            onClick={onProfileClick}
            aria-label="profile"
          >
            <Avatar sx={{ width: 32, height: 32, backgroundColor: 'primary.dark' }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarSearchDemo; 