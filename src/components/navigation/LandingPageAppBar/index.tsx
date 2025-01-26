import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, InputBase, Box } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import logoURL from '@/assets/logo.png'
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserInfoContext } from '@/contexts/UserContext';

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
  const auth = useAuthContext();
  const userInfo = useUserInfoContext();
  const [signedIn, setSignedIn] = useState<boolean>(false);

  const logout = async () => {
    await auth?.signOut()
    setSignedIn(false)
  }

  useEffect(() => {
      if (auth?.user) {
        setSignedIn(true)
        userInfo
      }

  }, [auth?.user])

  return (
    <AppBar position="absolute" sx={{ background: '#f0e8e861', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Find a publisher"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <img height={35} style={{marginTop: 5}} src={logoURL}></img>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="primary" variant="outlined" size="large" component={Link} style={{ marginRight: 30 }} to="/login">
            {!signedIn ? "Log in" : "Explore" }
          </Button>
          <Button color="primary" variant="outlined" size="large" disabled={!signedIn} onClick={logout} style={{ marginRight: 30 }}>
            Log out
          </Button>
          <Button color="secondary" variant="outlined" size="large" component={Link} to="/get-started">
            Get Started
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LandingPageAppBar;
