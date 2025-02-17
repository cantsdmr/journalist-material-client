import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PATHS } from '@/constants/paths';
import landpageIntro from '@/assets/landing_page_compiled.gif';

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
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1
          }
        }}
      >
        <Box
          component="img"
          src={landpageIntro}
          alt="Background"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'relative',
            zIndex: 0
          }}
        />
      </Box>
      
      <AppBar 
        position="absolute" 
        elevation={0}
        sx={{ 
          background: 'rgba(255, 255, 255, 0.01)',
          zIndex: 2
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
            py: { xs: 2, sm: 1.5 },
            px: { xs: 2, sm: 4 }
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Box sx={{ 
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, #2196F3 0%, transparent 100%)',
                borderRadius: '2px'
              }
            }}>
              <span style={{
                color: '#1565C0',
                textTransform: 'uppercase',
                fontWeight: 800,
                fontSize: '1.6rem',
                letterSpacing: '1px'
              }}>Meta</span>
              <span style={{
                color: '#0D47A1',
                fontWeight: 600,
                fontSize: '1.6rem'
              }}>Journo</span>
            </Box>
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
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    px: 4,
                    py: 1.2,
                    borderRadius: '12px',
                    borderWidth: '2px',
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#1976D2',
                    borderColor: '#1976D2',
                    background: 'rgba(25, 118, 210, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: '#1565C0',
                      color: '#1565C0',
                      background: 'rgba(25, 118, 210, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(21, 101, 192, 0.25)'
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: '0 4px 12px rgba(21, 101, 192, 0.2)'
                    }
                  }}
                >
                  Log in
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  component={Link}
                  to={PATHS.SIGNUP}
                  sx={{
                    width: { xs: '45%', sm: 'auto' },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    px: 4,
                    py: 1.2,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 50%, #0D47A1 100%)',
                    boxShadow: '0 8px 16px -4px rgba(33, 150, 243, 0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 50%, #0D47A1 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 20px -4px rgba(33, 150, 243, 0.6)'
                    }
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
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    px: 4,
                    py: 1.2,
                    borderRadius: '12px',
                    borderWidth: '2px',
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#1976D2',
                    borderColor: '#1976D2',
                    background: 'rgba(25, 118, 210, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: '#1565C0',
                      color: '#1565C0',
                      background: 'rgba(25, 118, 210, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(21, 101, 192, 0.25)'
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: '0 4px 12px rgba(21, 101, 192, 0.2)'
                    }
                  }}
                >
                  My Feed
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  size="large"
                  onClick={logout}
                  sx={{
                    width: { xs: '45%', sm: 'auto' },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    px: 4,
                    py: 1.2,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #f44336 0%, #e53935 50%, #c62828 100%)',
                    boxShadow: '0 8px 16px -4px rgba(244, 67, 54, 0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e53935 0%, #d32f2f 50%, #b71c1c 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 20px -4px rgba(244, 67, 54, 0.6)'
                    }
                  }}
                >
                  Log out
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default LandingPageAppBar;
