import React, { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import LandingPageAppBar from '@/components/navigation/LandingPageAppBar';

const LandingPage: React.FC = () => {
  const staticPrefix = 'Your ';
  const changingWords = ['media', 'rules', 'audience'];
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const currentWord = changingWords[currentIndex];
    const fullPhrase = `Your ${currentWord}`;
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (text.length < fullPhrase.length) {
        timeout = setTimeout(() => {
          setText(fullPhrase.substring(0, text.length + 1));
        }, 150);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    }

    if (isDeleting) {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(text.substring(0, text.length - 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % changingWords.length);
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, currentIndex, isDeleting]);

  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <LandingPageAppBar />
      <Container sx={{ position: 'relative', zIndex: 1, pt: 8 }}>
        <Box sx={{ textAlign: 'center', mt: '40vh' }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: '#d490d4',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
              fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' },
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              '& span': {
                background: 'linear-gradient(45deg, #d490d4 30%, #a76bc8 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              },
              '&::after': {
                content: '""',
                width: '4px',
                height: '1em',
                background: 'linear-gradient(45deg, #d490d4 30%, #a76bc8 90%)',
                marginLeft: '8px',
                animation: 'blink-caret .75s step-end infinite',
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(212, 144, 212, 0.5)',
              },
              '@keyframes blink-caret': {
                'from, to': { opacity: 1 },
                '50%': { opacity: 0 }
              }
            }}
          >
            <span>
              <span style={{ opacity: 1 }}>Your&nbsp;</span>
              {text.substring(5)}
            </span>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
