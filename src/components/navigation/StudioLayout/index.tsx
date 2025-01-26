import React, { useState } from 'react';
import { 
  Box, AppBar, Toolbar, IconButton, Typography,
  Menu, MenuItem, useTheme as useMuiTheme,
  useMediaQuery,
  ListItemIcon, ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';
import { useApp } from '@/hooks/useApp';
import StudioSidebar from '../StudioSidebar';
import { PATHS } from '@/constants/paths';

const StudioLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const { isFullyInitialized } = useApp();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

  if (!isFullyInitialized) {
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
              onClick={handleDrawerToggle}
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
              <MenuIcon />
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
                Creator Studio
              </Box>
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                Studio
              </Box>
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton 
            onClick={() => navigate(PATHS.APP_ROOT)} 
            color="inherit"
            sx={{ ml: 2 }}
          >
            <HomeIcon />
          </IconButton>
          <IconButton
            onClick={handleMenuOpen}
            color="inherit"
            sx={{ ml: 2 }}
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { width: 220 }
            }}
          >
            {[
              { path: PATHS.APP_ROOT, icon: <HomeIcon fontSize="small" />, label: 'Exit Studio' }
            ].map((item) => (
              <MenuItem 
                key={item.path}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.label}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      <StudioSidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

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
            maxWidth: 1200,
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

export default StudioLayout; 