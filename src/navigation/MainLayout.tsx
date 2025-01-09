import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Box, Drawer, InputBase, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import Sidebar from './Sidebar';
import { useApiContext } from '../contexts/ApiContext';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const SideBarwithPage: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Journalist Land
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
      </Toolbar>
    </AppBar>
    <Drawer
      variant="permanent"
      sx={{
        width: isSidebarOpen ? 240 : 60,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: isSidebarOpen ? 240 : 60, boxSizing: 'border-box', transition: 'width 0.3s' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflowX: 'hidden' }}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </Box>
    </Drawer>
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 3 }}
    >
      <Outlet />
    </Box>
  </Box>;
}

const MainLayout: React.FC = () => {
  const [renderLayout, setRenderLayout] = useState<boolean>(false);
  const { isAuthenticated } = useApiContext();

  useEffect(() => {
    if (isAuthenticated) {
      setRenderLayout(true)
    }
  }, [isAuthenticated])

  const getLayout = () => {
    if (renderLayout) {
      return <SideBarwithPage />
    }

    return <></>;
  }


  return getLayout();
};

export default MainLayout;