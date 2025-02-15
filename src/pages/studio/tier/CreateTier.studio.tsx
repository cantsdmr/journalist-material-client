import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import TierForm from '@/components/tier/TierForm';
import { useApiContext } from '@/contexts/ApiContext';
import Notification from '@/components/common/Notification';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateChannelTierData } from '@/APIs/ChannelAPI';
import { PATHS } from '@/constants/paths';

const CreateTier: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { api } = useApiContext();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (data: CreateChannelTierData) => {
    try {
      if (channelId) {
        await api?.channelApi.createTier(channelId, data);
        navigate(PATHS.STUDIO_CHANNEL_VIEW.replace(':channelId', channelId));
      }
    } catch (error) {
      console.error('Failed to create tier:', error);
      setError('Failed to create tier');
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

      <Notification
        open={!!error}
        message={error}
        severity="error"
        onClose={() => setError(null)}
      />
    </Box>
  );
};

export default CreateTier; 