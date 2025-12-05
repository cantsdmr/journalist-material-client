import React, { useCallback, useState, useMemo } from 'react';
import { Container, Box, TextField, Button, Typography, Divider, Alert, Chip } from '@mui/material';
import { googleProvider } from '@/utils/firebase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import { styled } from '@mui/material/styles';
import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLE } from '@/enums/UserEnums';
import { AuthProvider } from 'firebase/auth';
import { useApiContext } from '@/contexts/ApiContext';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';

interface SocialButtonProps {
  bgcolor: string;
}

interface FormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  displayName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
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

const SignUp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = useAuth();
  const { api } = useApiContext();
  const { execute } = useApiCall();
  const navigate = useNavigate();

  // Get role from URL parameter and determine roleId
  const role = searchParams.get('role');
  const roleId = useMemo(() => {
    if (role === 'journalist') {
      return USER_ROLE.JOURNALIST;
    } else if (role === 'reader') {
      return USER_ROLE.REGULAR_USER;
    }
    return USER_ROLE.REGULAR_USER; // Default to reader
  }, [role]);

  // Role-specific configuration
  const roleConfig = useMemo(() => {
    if (role === 'journalist') {
      return {
        title: 'Join as a Journalist',
        subtitle: 'Create and share your stories with the world',
        benefits: [
          'Publish articles and build your readership',
          'Monetize your content',
          'Access analytics and insights',
          'Connect with your audience'
        ]
      };
    } else {
      return {
        title: 'Join as a Reader',
        subtitle: 'Discover and support independent journalism',
        benefits: [
          'Access quality journalism',
          'Support journalists you trust',
          'Personalized news feed',
          'Engage with content'
        ]
      };
    }
  }, [role]);

  const handleInputChange = useCallback((field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (error) {
      setError('');
    }
  }, [formErrors, error]);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    // Display name validation
    if (!formData.displayName.trim()) {
      errors.displayName = 'Display name is required';
    } else if (formData.displayName.trim().length < 2) {
      errors.displayName = 'Display name must be at least 2 characters';
    } else if (formData.displayName.trim().length > 50) {
      errors.displayName = 'Display name must be less than 50 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleEmailSignUp = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userCredential = await auth?.signUp(formData.email, formData.password);
      if (userCredential) {
        const result = await execute(
          () => api?.auth.signUp({
            externalId: userCredential.uid,
            email: userCredential.email,
            displayName: formData.displayName.trim(),
            photoUrl: userCredential.photoURL ?? '',
            roleId: roleId // Use roleId from URL parameter
          }),
          {
            showSuccessMessage: true,
            successMessage: 'Account created successfully!'
          }
        );

        if (result) {
          // Navigate immediately after successful signup
          navigate(`${PATHS.POST_SIGNUP}?role=${role || 'reader'}`);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up with email and password';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, auth, api, execute, validateForm, roleId, navigate, role]);

  const handleProviderLogin = useCallback(async (provider: AuthProvider) => {
    setError('');
    setIsSubmitting(true);

    try {
      const token = await auth?.signInWithProvider(provider);
      if (token && auth?.user) {
        // Try to sign in first (user might already exist)
        const signInResult = await execute(
          () => api?.auth.signIn({ idToken: token }),
          { showErrorToast: false } // Don't show error if user doesn't exist yet
        );

        if (signInResult) {
          // User already exists, navigate to trending page
          navigate(PATHS.APP_NEWS_TRENDING);
          return;
        } else {
          // User doesn't exist, create new user in backend
          const signUpResult = await execute(
            () => api?.auth.signUp({
              externalId: auth.user.uid,
              email: auth.user.email || '',
              displayName: auth.user.displayName || '',
              photoUrl: auth.user.photoURL || '',
              roleId: roleId // Use roleId from URL parameter
            }),
            {
              showSuccessMessage: true,
              successMessage: 'Account created successfully!'
            }
          );

          if (signUpResult) {
            // Navigate immediately after successful signup
            navigate(`${PATHS.POST_SIGNUP}?role=${role || 'reader'}`);
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login with social provider';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [auth, api, execute, roleId, navigate, role]);

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {roleConfig.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {roleConfig.subtitle}
        </Typography>
        {role && (
          <Chip
            label={role === 'journalist' ? 'Journalist Account' : 'Reader Account'}
            color="primary"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleEmailSignUp} noValidate>
        <TextField
          label="Display Name"
          variant="outlined"
          fullWidth
          margin="normal"
          type="text"
          autoComplete="name"
          value={formData.displayName}
          onChange={handleInputChange('displayName')}
          error={Boolean(formErrors.displayName)}
          helperText={formErrors.displayName}
          disabled={isSubmitting}
          required
        />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={Boolean(formErrors.email)}
          helperText={formErrors.email}
          disabled={isSubmitting}
          required
        />

        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          margin="normal"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={Boolean(formErrors.password)}
          helperText={formErrors.password}
          disabled={isSubmitting}
          required
        />

        <TextField
          label="Confirm Password"
          variant="outlined"
          fullWidth
          type="password"
          margin="normal"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          error={Boolean(formErrors.confirmPassword)}
          helperText={formErrors.confirmPassword}
          disabled={isSubmitting}
          required
        />

        <Button
          type="submit"
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }}>OR</Divider>

      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          You can sign up with the following providers
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
          Sign up with Google
        </SocialButton>
      </Box>
    </Container>
  );
};

export default SignUp;
