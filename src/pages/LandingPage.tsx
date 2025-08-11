import React from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import LandingPageAppBar from '@/components/navigation/LandingPageAppBar';

const LandingPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <LandingPageAppBar />
      
      {/* Hero Section */}
      <Box sx={{ 
        minHeight: '90vh', 
        display: 'flex', 
        alignItems: 'center',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8} textAlign="center">
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: { xs: '2.5rem', sm: '3.2rem', md: '3.8rem' },
                  mb: 4,
                  lineHeight: 1.3,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
                }}
              >
                Discover Journalism You Can Trust.
                <br />
                Fund Stories That Deserve Attention.
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  mb: 5,
                  lineHeight: 1.7,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontWeight: 400,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                }}
              >
                MetaJourno connects readers directly to independent journalists — no paywalls, no content hosting, just verified trust and transparent funding.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SearchIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: '#1e3c72',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 1,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    '&:hover': {
                      bgcolor: '#f8f9fa',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Browse Stories
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ArticleIcon />}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 1,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Join as a Journalist
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ArticleIcon />}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 1,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Join as a Reader
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;