import React from 'react';
import { Box, Typography } from '@mui/material';
import TierForm from '@/components/tier/TierForm';
import { useApiContext } from '@/contexts/ApiContext';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateChannelTierData } from '@/types/index';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';

const CreateTier: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { api } = useApiContext();
  const navigate = useNavigate();
  const { execute } = useApiCall();

  const handleCreate = async (data: CreateChannelTierData) => {
    if (!channelId) return;
    
    const result = await execute(
      () => api?.app.channel.createTier(channelId, data),
      {
        showSuccessMessage: true,
        successMessage: 'Tier created successfully!'
      }
    );
    
    if (result) {
      navigate(PATHS.STUDIO_CHANNEL_VIEW.replace(':channelId', channelId));
    }
  };

  return (
    <Box>
      <Typography 
        variant="h5" 
        sx={{ 
          fontSize: { xs: '1.125rem', sm: '1.25rem' },
          fontWeight: 600,
          mb: 1
        }}
      >
        Create Tier
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ maxWidth: 600, mb: 3 }}
      >
        Create a membership tier to offer exclusive benefits to your subscribers.
      </Typography>

      <TierForm
        channelId={channelId!}
        onSubmit={handleCreate}
        submitButtonText="Create Tier"
      />
    </Box>
  );
};

export default CreateTier; 