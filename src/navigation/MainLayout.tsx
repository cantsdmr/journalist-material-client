import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Box,
  useTheme as useMuiTheme,
  InputBase,
  alpha,
  useMediaQuery,
  Drawer
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';
import SearchIcon from '@mui/icons-material/Search';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

const MainLayout: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const { isDarkMode, toggleTheme } = useAppTheme();
  const muiTheme = useMuiTheme();

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
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
            <Box sx={{
              position: 'relative',
              borderRadius: '12px',
              backgroundColor: (theme) => 
                theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.common.white, 0.08)
                  : alpha(theme.palette.common.black, 0.04),
              '&:hover': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.12)
                    : alpha(theme.palette.common.black, 0.08),
              },
              width: '100%',
              maxWidth: '600px',
              margin: '0 16px',
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.1)
                  : alpha(theme.palette.common.black, 0.1),
            }}>
              <Box sx={{
                padding: '0 16px',
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary'
              }}>
                <SearchIcon />
              </Box>
              <InputBase
                placeholder="Search news..."
                sx={{
                  color: 'inherit',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: '10px 8px 10px 48px',
                    width: '100%',
                  },
                }}
              />
            </Box>
          </Box>

          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
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
          pt: 4,
          width: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default'
        }}
      >
        <Box sx={{ 
          flexGrow: 1,
          overflow: 'auto',
          width: '100%',
          maxWidth: '100%',
          bgcolor: 'background.default',
          px: { xs: 2, sm: 3 },
          ml: { xs: 0, sm: 1 }
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;