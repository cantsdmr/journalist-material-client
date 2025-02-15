import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, InputBase, Box } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import logoURL from '@/assets/logo.png'
import { useAuth } from '@/contexts/AuthContext';
import { PATHS } from '@/constants/paths';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
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

const LandingPageAppBar: React.FC = () => {
  const auth = useAuth();
  const [signedIn, setSignedIn] = useState<boolean>(false);

  const logout = async () => {
    await auth?.signOut();
    setSignedIn(false);
  };

  useEffect(() => {
    setSignedIn(!!auth?.user);
  }, [auth?.user]);

  return (
    <AppBar position="absolute" sx={{ background: '#f0e8e861', boxShadow: 'none' }}>
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          py: { xs: 2, sm: 0 }
        }}
      >
        <Search sx={{ 
          order: { xs: 2, sm: 1 },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Find a publisher"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        <Box sx={{ 
          flexGrow: 1, 
          textAlign: 'center',
          order: { xs: 1, sm: 2 }
        }}>
          <img height={35} style={{marginTop: 5}} src={logoURL} alt="Logo" />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          order: { xs: 3, sm: 3 },
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'center', sm: 'flex-end' },
          gap: 2
        }}>
          {!signedIn ? (
            <>
              <Button 
                color="primary" 
                variant="outlined" 
                size="large" 
                component={Link} 
                to={PATHS.LOGIN}
                sx={{
                  width: { xs: '45%', sm: 'auto' },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Log in
              </Button>
              <Button 
                color="secondary" 
                variant="outlined" 
                size="large" 
                component={Link} 
                to={PATHS.SIGNUP}
                sx={{
                  width: { xs: '45%', sm: 'auto' },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Get Started
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="primary" 
                variant="outlined" 
                size="large" 
                component={Link}
                to={PATHS.APP_NEWS_MY_FEED}
                sx={{
                  width: { xs: '45%', sm: 'auto' },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                My Feed
              </Button>
              <Button 
                color="secondary" 
                variant="outlined" 
                size="large" 
                onClick={logout}
                sx={{
                  width: { xs: '45%', sm: 'auto' },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Log out
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LandingPageAppBar;
