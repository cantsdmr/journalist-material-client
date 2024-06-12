import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Box, Drawer, InputBase, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import Feed from './pages/Feed';
import Subscriptions from './pages/Subscriptions';
import Explore from './pages/Explore';
import EntryDetails from './pages/EntryDetails';
import Reels from './pages/Reels';
import CreatePoll from './components/CreatePoll';
import Polls from './pages/Polls';
import Sidebar from './components/Sidebar';
import DivisionProfile from './pages/DivisionProfile';
import LandingPage from './pages/LandingPage';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { ApiProvider } from './contexts/ApiContext';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

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

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            YouTube
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
        <Box sx={{ overflow: 'auto' }}>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  const auth = useAuthContext();
  
  return (
    <ApiProvider>
      <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              auth?.isAuthenticated ? <Navigate to="/app/feed" replace /> : <LandingPage />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route path="feed" element={<Feed />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="explore" element={<Explore />} />
            <Route path="entry/:id" element={<EntryDetails />} />
            <Route path="reels" element={<Reels />} />
            <Route path="create-poll" element={<CreatePoll />} />
            <Route path="polls" element={<Polls />} />
            <Route path="profile/:creatorId" element={<DivisionProfile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </AuthProvider>
    </ApiProvider>
  );
};

export default App;
