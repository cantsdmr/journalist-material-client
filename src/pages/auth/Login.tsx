import React, { useEffect, useState } from 'react';
import { Container, Box, TextField, Button, Typography, Divider, Link } from '@mui/material';
import { googleProvider, twitterProvider, facebookProvider, appleProvider } from '@/utils/firebase';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';
import { styled } from '@mui/material/styles';
import { useAuth } from '@/contexts/AuthContext';
import { AuthProvider } from 'firebase/auth';
import { useApiContext } from '@/contexts/ApiContext';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';

interface SocialButtonProps {
  bgcolor: string;
}

const SocialButton = styled(Button)<SocialButtonProps>(({ theme, bgcolor }) => ({
  color: '#fff',
  backgroundColor: bgcolor,
  boxShadow: `0 2px 4px 0 ${bgcolor}80`, // Add transparency to the color for the shadow
  '&:hover': {
    backgroundColor: theme.palette.augmentColor({ color: { main: bgcolor } }).dark,
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
}));

// const GoogleButton = styled(IconButton)(({ theme }) => ({
//   color: '#DB4437',
//   boxShadow: '0 2px 4px 0 rgba(219, 68, 55, 0.3)',
//   '&:hover': {
//     backgroundColor: 'rgba(219, 68, 55, 0.1)',
//   },
// }));

// const TwitterButton = styled(IconButton)(({ theme }) => ({
//   color: '#1DA1F2',
//   boxShadow: '0 2px 4px 0 rgba(29, 161, 242, 0.3)',
//   '&:hover': {
//     backgroundColor: 'rgba(29, 161, 242, 0.1)',
//   },
// }));

// const FacebookButton = styled(IconButton)(({ theme }) => ({
//   color: '#1877F2',
//   boxShadow: '0 2px 4px 0 rgba(24, 119, 242, 0.3)',
//   '&:hover': {
//     backgroundColor: 'rgba(24, 119, 242, 0.1)',
//   },
// }));

// const AppleButton = styled(IconButton)(({ theme }) => ({
//   color: '#000000',
//   boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
//   '&:hover': {
//     backgroundColor: 'rgba(0, 0, 0, 0.1)',
//   },
// }));

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const { api } = useApiContext();
  const navigate = useNavigate();
  const { execute } = useApiCall();

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    
    try {
      const token = await auth?.signIn(email, password);
      if (token) {
        await execute(
          () => api?.authApi.signIn({ idToken: token }),
          {
            showSuccessMessage: true,
            successMessage: 'Successfully logged in!'
          }
        );
      }
    } catch (error) {
      setError('Failed to login with email and password');
    }
  };

  const handleProviderLogin = async (provider: AuthProvider) => {
    setError('');
    
    try {
      const token = await auth?.signInWithProvider(provider);
      if (token) {
        await execute(
          () => api?.authApi.signIn({ idToken: token }),
          {
            showSuccessMessage: true,
            successMessage: 'Successfully logged in!'
          }
        );
      }
    } catch (error) {
      setError('Failed to login with Google');
    }
  };

  useEffect(() => {
    if (auth?.user) {
      navigate(PATHS.APP_NEWS_TRENDING)
    }
  }, [auth?.user != null])
  

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back!
        </Typography>
      </Box>
      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Box component="form" onSubmit={handleEmailLogin} sx={{ mb: 2 }}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Link href="#" variant="caption">
            Did you forget your password?
          </Link>
        </Box>
        <Button type="submit" variant="outlined" color="secondary" fullWidth sx={{ mb: 2 }}>
          Log In
        </Button>
      </Box>
      <Divider sx={{ my: 2 }}>OR</Divider>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          You can sign in or sign up our application with following providers
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <SocialButton
            variant="contained"
            startIcon={<GoogleIcon />}
            bgcolor="#DB4437"
            onClick={handleProviderLogin.bind(this, googleProvider)}
          >
            Sign in with Google
          </SocialButton>
          <SocialButton
            variant="contained"
            startIcon={<XIcon />}
            bgcolor="#1DA1F2"
            onClick={handleProviderLogin.bind(this, twitterProvider)}
          >
            Sign in with X
          </SocialButton>
          <SocialButton
            variant="contained"
            startIcon={<FacebookIcon />}
            bgcolor="#1877F2"
            onClick={handleProviderLogin.bind(this, facebookProvider)}
          >
            Sign in with Facebook
          </SocialButton>
          <SocialButton
            variant="contained"
            startIcon={<AppleIcon />}
            bgcolor="#000000"
            onClick={handleProviderLogin.bind(this, appleProvider)}
          >
            Sign in with Apple
          </SocialButton>
      </Box>
    </Container>
  );
};

export default Login;
