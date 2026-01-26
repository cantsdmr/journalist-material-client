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
  Divider,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Sidebar from '@/components/navigation/Sidebar';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from '@/components/search/SearchBar';
import { VERSION } from '@/constants/values';
import NotificationBell from '@/components/notification-center/NotificationBell';
import NotificationCenter from '@/components/notification-center/NotificationCenter';

const MainLayout: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const muiTheme = useMuiTheme();
  const { isLoading, isAuthenticated } = useApp();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (query: string) => {
    navigate(`${PATHS.APP_SEARCH}?q=${encodeURIComponent(query)}`);
    setMobileSearchOpen(false);
  };

  const handleMobileSearchToggle = () => {
    setMobileSearchOpen(!mobileSearchOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate(PATHS.APP_ACCOUNT);
  };

  const handleSettingsClick = () => {
    handleProfileMenuClose();
    navigate(PATHS.APP_ACCOUNT_SETTINGS);
  };

  const handleCreatorStudioClick = () => {
    handleProfileMenuClose();
    navigate(PATHS.STUDIO_ROOT);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    try {
      await auth?.signOut();
      navigate(PATHS.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return null;
  }

  // Guard: Don't render authenticated components until API token is set
  if (!isAuthenticated) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'background.default'
      }}>
        <CircularProgress />
      </Box>
    );
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
                />
              </Box>
            </Box>
          ) : (
            <>
              {/* Left Section - Menu + Logo */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                left: 0
              }}>
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

              {/* Center Section - Expandable Search Bar aligned with news cards */}
              <Box sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                display: { xs: 'none', md: 'flex' }
              }}>
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search articles, channels, journalists..."
                  className="app-search-bar"
                />
              </Box>

              {/* Spacer */}
              <Box sx={{ flexGrow: 1 }} />

              {/* Right Section - Search Icon (Mobile) + Notifications + Account Button */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Search Icon for Mobile */}
                <IconButton
                  onClick={handleMobileSearchToggle}
                  color="inherit"
                  sx={{ display: { xs: 'flex', md: 'none' } }}
                >
                  <SearchIcon />
                </IconButton>

                {/* Notification Bell */}
                <NotificationBell />

                {/* Account Button with Dropdown */}
                <IconButton
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  aria-controls={profileMenuAnchor ? 'profile-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={profileMenuAnchor ? 'true' : undefined}
                >
                  <AccountCircleIcon />
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Notification Center Drawer */}
      <NotificationCenter />

      {/* Profile Dropdown Menu */}
      <Menu
        id="profile-menu"
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            overflow: 'visible',
            '& .MuiMenuItem-root': {
              py: 1.5,
              px: 2,
            }
          }
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Account</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCreatorStudioClick}>
          <ListItemIcon>
            <VideoLibraryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Creator Studio</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

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
          width: '100%'
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            py: 3,
            px: { xs: 2, sm: 3 },
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
            marginLeft: 0,
            marginRight: 'auto'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
