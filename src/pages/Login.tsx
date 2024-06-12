import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { firebaseAuth, googleProvider, twitterProvider } from '../util/firebase';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      navigate('/feed');
    } catch (error) {
      setError('Failed to login with email and password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
      navigate('/feed');
    } catch (error) {
      setError('Failed to login with Google');
    }
  };

  const handleTwitterLogin = async () => {
    try {
      await signInWithPopup(firebaseAuth, twitterProvider);
      navigate('/feed');
    } catch (error) {
      setError('Failed to login with Twitter');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {error && (
          <Typography variant="body2" color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleEmailLogin} sx={{ mt: 2 }}>
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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login with Email
          </Button>
        </Box>
        <Button onClick={handleGoogleLogin} variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
          Sign In with Google
        </Button>
        <Button onClick={handleTwitterLogin} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Sign In with Twitter
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
