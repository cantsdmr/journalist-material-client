import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import TierForm from '@/components/tier/TierForm';
import { useApiContext } from '@/contexts/ApiContext';
import { useNavigate, useParams } from 'react-router-dom';
import { EditChannelTierData } from '@/types/index';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';

const EditTier: React.FC = () => {
  const { channelId, tierId } = useParams<{ channelId: string; tierId: string }>();
  const { api } = useApiContext();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<any>(null);
  const { execute } = useApiCall();

  useEffect(() => {
    const loadTier = async () => {
      if (!channelId || !tierId) return;
      
      const result = await execute(
        () => api?.app.channel.getTier(channelId, tierId),
        { showErrorToast: true }
      );
      
      if (result) {
        setInitialData(result);
      }
    };

    loadTier();
  }, [channelId, tierId, api?.app.channel, execute]);

  const handleUpdate = async (data: EditChannelTierData) => {
    if (!channelId || !tierId) return;
    
    const result = await execute(
      () => api?.app.channel.updateTier(channelId, tierId, data),
      {
        showSuccessMessage: true,
        successMessage: 'Tier updated successfully!'
      }
    );
    
    if (result) {
      navigate(PATHS.STUDIO_CHANNEL_VIEW.replace(':channelId', channelId));
    }
  };

  if (!initialData) {
    return null; // or loading spinner
  }

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
        Edit Tier
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ maxWidth: 600, mb: 3 }}
      >
        Update the details and benefits of this membership tier.
      </Typography>

      <TierForm
        channelId={channelId!}
        initialData={initialData}
        onSubmit={handleUpdate}
        submitButtonText="Update Tier"
      />
    </Box>
  );
};

export default EditTier; 