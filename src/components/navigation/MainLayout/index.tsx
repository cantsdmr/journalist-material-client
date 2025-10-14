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
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';
import Sidebar from '@/components/navigation/Sidebar';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { PATHS } from '@/constants/paths';
import { useApp } from '@/contexts/AppContext';
import SearchBar from '@/components/search/SearchBar';
import { VERSION } from '@/constants/values';

const MainLayout: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const { isDarkMode, toggleTheme } = useAppTheme();
  const muiTheme = useMuiTheme();
  const { isLoading } = useApp();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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
    setMobileSearchOpen(false);
  };

  const handleMobileSearchToggle = () => {
    setMobileSearchOpen(!mobileSearchOpen);
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', overflow: 'hidden' }}>
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
          {/* Mobile Search Mode */}
          {mobileSearchOpen && isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
              <IconButton
                color="inherit"
                onClick={handleMobileSearchToggle}
                sx={{ flexShrink: 0 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1, mt: 0.5 }}>
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search"
                  className="app-search-bar"
                  autoFocus
                />
              </Box>
            </Box>
          ) : (
            <>
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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    v{VERSION}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center'
              }}>
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search articles, channels, journalists..."
                  className="app-search-bar"
                />
              </Box>

              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} />

              {/* Search Icon for Mobile */}
              <IconButton
                onClick={handleMobileSearchToggle}
                color="inherit"
                sx={{ display: { xs: 'flex', md: 'none' } }}
              >
                <SearchIcon />
              </IconButton>

              {/* Account Button */}
              <IconButton
                onClick={() => navigate(PATHS.APP_ACCOUNT)}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <AccountCircleIcon />
              </IconButton>
            </>
          )}
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
            overflow: 'auto',
            overflowX: 'hidden',
            width: '100%'
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
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          overflow: 'hidden',
          maxWidth: '100%'
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            py: 3,
            px: { xs: 2, sm: 3 },
            overflowY: 'auto',
            overflowX: 'hidden',
            maxWidth: '100%'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
