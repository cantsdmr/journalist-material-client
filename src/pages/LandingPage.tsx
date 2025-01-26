import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import bgURL from '@/assets/BG_journo3.webp'
import LandingPageAppBar from '@/components/navigation/LandingPageAppBar';

const LandingPage: React.FC = () => {
  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <LandingPageAppBar/>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${bgURL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        }}
      />
      <Container sx={{ position: 'relative', zIndex: 1, pt: 8 }}>
        <Box sx={{ textAlign: 'center', color: '#b068b1', mt: '40vh' }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
            Your house, Your rules
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
