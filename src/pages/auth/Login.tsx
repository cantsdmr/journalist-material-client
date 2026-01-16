import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Divider, Link, Alert } from '@mui/material';
import { googleProvider } from '@/utils/firebase';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
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
  boxShadow: `0 2px 4px 0 ${bgcolor}80`,
  '&:hover': {
    backgroundColor: theme.palette.augmentColor({ color: { main: bgcolor } }).dark,
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
}));

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = useAuth();
  const { api } = useApiContext();
  const navigate = useNavigate();
  const { execute } = useApiCall();

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Step 1: Firebase Auth
      const token = await auth?.signIn(email, password);
      if (token) {
        // Step 2: Backend signIn
        const result = await execute(
          () => api?.auth.signIn({ idToken: token }),
          {
            showSuccessMessage: true,
            successMessage: 'Successfully logged in!'
          }
        );

        if (!result) {
          // Backend call failed - sign out from Firebase to reset state
          await auth?.signOut();
          setError('Failed to connect to server. Please try again.');
        } else {
          // Step 3: Navigate to app - Profile will be fetched by PrivateRoute/ProfileContext
          navigate(PATHS.APP_NEWS_TRENDING);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login with email and password';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderLogin = async (provider: AuthProvider) => {
    setError('');
    setIsSubmitting(true);

    try {
      // Step 1: Firebase Auth with provider
      const token = await auth?.signInWithProvider(provider);
      if (token) {
        // Step 2: Backend signIn
        const result = await execute(
          () => api?.auth.signIn({ idToken: token }),
          {
            showSuccessMessage: true,
            successMessage: 'Successfully logged in!'
          }
        );

        if (!result) {
          // Backend call failed - sign out from Firebase to reset state
          await auth?.signOut();
          setError('Failed to connect to server. Please try again.');
        } else {
          // Step 3: Navigate to app - Profile will be fetched by PrivateRoute/ProfileContext
          navigate(PATHS.APP_NEWS_TRENDING);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login with Google';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back!
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleEmailLogin} sx={{ mb: 2 }}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          margin="normal"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
        />
        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Link href="#" variant="caption">
            Did you forget your password?
          </Link>
        </Box>
        <Button
          type="submit"
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mb: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
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
          onClick={() => handleProviderLogin(googleProvider)}
          disabled={isSubmitting}
        >
          Sign in with Google
        </SocialButton>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Don't have an account?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`${PATHS.SIGNUP}?role=journalist`)}
            disabled={isSubmitting}
          >
            Sign up as Journalist
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`${PATHS.SIGNUP}?role=reader`)}
            disabled={isSubmitting}
          >
            Sign up as Reader
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
