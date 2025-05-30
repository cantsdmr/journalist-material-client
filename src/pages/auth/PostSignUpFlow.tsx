import React, { useState } from 'react';
import { Container, Box, Typography, Button, Card, CardContent, Grid, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApiContext } from '@/contexts/ApiContext';
import { USER_ROLE } from '@/enums/UserEnums';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';

interface UserProfile {
  primaryRole: string;
  interests: string[];
  experience: string;
  goals: string[];
}

const PostSignUpFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    primaryRole: '',
    interests: [],
    experience: '',
    goals: []
  });
  const navigate = useNavigate();
  const { api } = useApiContext();
  const { execute } = useApiCall();

  const steps = ['Welcome', 'Tell us about yourself', 'Your interests', 'Get started'];

  const roleOptions = [
    {
      role: 'journalist',
      title: 'I want to write and publish',
      description: 'Create articles, investigate stories, and build your readership',
      features: ['Article editor', 'Story planning tools', 'Reader analytics', 'Revenue sharing'],
      userRole: USER_ROLE.JOURNALIST
    },
    {
      role: 'editor',
      title: 'I want to manage content',
      description: 'Review, edit, and oversee publication workflows',
      features: ['Editorial dashboard', 'Content review tools', 'Team management', 'Quality control'],
      userRole: USER_ROLE.EDITOR
    },
    {
      role: 'reader',
      title: 'I want to read and discover',
      description: 'Follow journalists, discover stories, and engage with content',
      features: ['Personalized feed', 'Bookmarking', 'Comment system', 'Newsletter subscriptions'],
      userRole: USER_ROLE.REGULAR_USER
    }
  ];

  const interestOptions = [
    'Politics', 'Technology', 'Science', 'Sports', 'Business', 'Culture', 
    'Health', 'Environment', 'Entertainment', 'Education', 'Travel', 'Food'
  ];

  const handleRoleSelect = (selectedRole: string, userRole: number) => {
    setProfile(prev => ({ ...prev, primaryRole: selectedRole }));
    // Update user role in backend
    updateUserRole(userRole);
    setActiveStep(1);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const updateUserRole = async (roleId: number) => {
    setLoading(true);
    console.log('PostSignUpFlow: Updating user role to:', roleId);
    
    await execute(
      () => api?.accountApi.updateProfile({ roleId }),
      {
        showSuccessMessage: false, // Don't show success message for this
        showErrorToast: false // Don't block the UI flow even if role update fails
      }
    );
    
    console.log('PostSignUpFlow: User role update completed');
    setLoading(false);
  };

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Save profile preferences to backend or local storage
      localStorage.setItem('userInterests', JSON.stringify(profile.interests));
      
      // Navigate to appropriate dashboard based on role
      // For now, all roles go to the trending page
      navigate(PATHS.APP_NEWS_TRENDING);
    } catch (error) {
      console.error('Error saving profile:', error);
      // Still navigate even if saving fails
      navigate(PATHS.APP_NEWS_TRENDING);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Allow users to skip the onboarding and go straight to the app
    navigate(PATHS.APP_NEWS_TRENDING);
  };

  const renderWelcomeStep = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Journalist Platform! 👋
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
        Let's personalize your experience. What brings you here today?
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
        Don't worry, you can always change this later in your settings.
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {roleOptions.map((option) => (
          <Grid item xs={12} md={4} key={option.role}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                '&:hover': { boxShadow: 6 },
                height: '100%',
                transition: 'box-shadow 0.3s'
              }}
              onClick={() => handleRoleSelect(option.role, option.userRole)}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {option.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {option.description}
                </Typography>
                <Box sx={{ textAlign: 'left' }}>
                  {option.features.map((feature, index) => (
                    <Typography key={index} variant="caption" display="block" sx={{ mb: 0.5 }}>
                      • {feature}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button variant="text" onClick={handleSkip} sx={{ color: 'text.secondary' }}>
          Skip for now
        </Button>
      </Box>
    </Box>
  );

  const renderInterestsStep = () => (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        What topics interest you most?
      </Typography>
      <Typography variant="body1" textAlign="center" sx={{ mb: 4 }}>
        Select any that apply - we'll use this to personalize your experience
      </Typography>
      <Grid container spacing={2} sx={{ maxWidth: 600, mx: 'auto' }}>
        {interestOptions.map((interest) => (
          <Grid item xs={6} sm={4} key={interest}>
            <Button
              variant={profile.interests.includes(interest) ? 'contained' : 'outlined'}
              fullWidth
              onClick={() => handleInterestToggle(interest)}
              sx={{ py: 1.5 }}
            >
              {interest}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button 
          variant="outlined" 
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Button 
          variant="contained" 
          size="large" 
          onClick={() => setActiveStep(2)}
          disabled={profile.interests.length === 0}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );

  const renderCompletionStep = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h5" gutterBottom>
        You're all set! 🎉
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Based on your preferences, we've customized your experience. Ready to get started?
      </Typography>
      <Button 
        variant="contained" 
        size="large" 
        onClick={handleComplete}
        disabled={loading}
        sx={{ px: 4 }}
      >
        {loading ? 'Setting up...' : 'Enter Platform'}
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && renderWelcomeStep()}
      {activeStep === 1 && renderInterestsStep()}
      {activeStep === 2 && renderCompletionStep()}
    </Container>
  );
};

export default PostSignUpFlow; 