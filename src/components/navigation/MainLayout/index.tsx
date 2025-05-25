import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Box,
  useTheme as useMuiTheme,
  useMediaQuery,
  Drawer,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';
import Sidebar from '@/components/navigation/Sidebar';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { PATHS } from '@/constants/paths';
import { useApp } from '@/contexts/AppContext';
import SearchBar from '@/components/search/SearchBar';

const MainLayout: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const { isDarkMode, toggleTheme } = useAppTheme();
  const muiTheme = useMuiTheme();
  const { isLoading } = useApp();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const handleSearch = (query: string) => {
    navigate(`${PATHS.APP_SEARCH}?q=${encodeURIComponent(query)}`);
  };

  const handleSuggestionSelect = (suggestion: any) => {
    navigate(`${PATHS.APP_SEARCH}?q=${encodeURIComponent(suggestion.text)}`);
  };

  const profileMenuItems = [
    {
      path: PATHS.STUDIO_ROOT,
      icon: <DashboardIcon fontSize="small" />,
      label: 'Creator Studio',
      divider: false
    },
  ];

  const renderProfileMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        sx: { width: 220 }
      }}
    >
      {profileMenuItems.map((item) => [
        <MenuItem 
          key={item.path}
          onClick={() => handleNavigate(item.path)}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText>{item.label}</ListItemText>
        </MenuItem>,
        item.divider && <Divider key={`${item.path}-divider`} />
      ]).flat().filter(Boolean)}
    </Menu>
  );

  if (isLoading) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: muiTheme.zIndex.drawer + 1,
          bgcolor: 'background.default',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: 'none'
        }}
      >
        <Toolbar sx={{ px: '8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 200 }}>
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              onClick={toggleSidebar}
              sx={{ 
                minWidth: 40,
                ml: 0.5,
                mr: 1.5,
                '& .MuiSvgIcon-root': {
                  fontSize: 24,
                  filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1))'
                }
              }}
            >
              <MenuRoundedIcon />
            </IconButton>
            
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                display: 'block',
                letterSpacing: '.1rem',
                fontFamily: "'Inter', -apple-system, sans-serif"
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <span style={{ 
                  color: '#2196F3',
                  textTransform: 'uppercase',
                  fontWeight: 800
                }}>Meta</span>
                <span style={{ 
                  color: '#1976D2',
                  fontWeight: 600
                }}>Journo</span>
              </Box>
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <span style={{ 
                  color: '#2196F3',
                  textTransform: 'uppercase',
                  fontWeight: 800
                }}>M</span>
                <span style={{ 
                  color: '#1976D2',
                  fontWeight: 600
                }}>Journo</span>
              </Box>
            </Typography>
          </Box>

          <Box sx={{ 
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <SearchBar
              onSearch={handleSearch}
              onSuggestionSelect={handleSuggestionSelect}
              placeholder="Search articles, channels, journalists..."
              popularSearches={['cryptocurrency', 'climate change', 'technology', 'politics']}
              className="app-search-bar"
            />
          </Box>

          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            onClick={handleMenuOpen}
            color="inherit"
            sx={{ ml: 2 }}
          >
            <AccountCircleIcon />
          </IconButton>
          {renderProfileMenu()}
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isSidebarOpen}
          onClose={toggleSidebar}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              height: '100%',
              bgcolor: 'background.default'
            }
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: 240,
              border: 'none'
            },
          }}
        >
          <Toolbar />
          <Box sx={{ 
            height: 'calc(100% - 64px)',
            overflow: 'auto'
          }}>
            <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
          </Box>
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          PaperProps={{
            sx: {
              height: '100%',
              bgcolor: 'background.default'
            }
          }}
          sx={{
            width: isSidebarOpen ? 240 : 72,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: isSidebarOpen ? 240 : 72,
              transition: 'width 0.2s',
              overflowX: 'hidden',
              border: 'none',
              borderRight: 'none'
            },
          }}
        >
          <Toolbar />
          <Box sx={{ 
            height: 'calc(100% - 64px)',
            overflow: 'auto'
          }}>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          </Box>
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          width: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default'
        }}
      >
        <Box 
          sx={{ 
            flexGrow: 1,
            py: 3,
            px: { xs: 2, sm: 3 },
            maxWidth: 900,
            mx: 'auto',
            width: '100%'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;