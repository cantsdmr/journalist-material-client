import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiContext } from '@/contexts/ApiContext';
import Notification from '@/components/common/Notification';
import { ChannelTier, EditChannelTierData } from '@/APIs/ChannelAPI';
import TierForm from '@/components/tier/TierForm';
import { PATHS } from '@/constants/paths';
const EditTier: React.FC = () => {
  const { channelId, tierId } = useParams<{ channelId: string; tierId: string }>();
  const navigate = useNavigate();
  const { api } = useApiContext();
  const [error, setError] = useState<string | null>(null);
  const [tier, setTier] = useState<Nullable<ChannelTier>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTier();
  }, [channelId, tierId]);

  const loadTier = async () => {
    try {
      if (channelId && tierId) {
        const result = await api?.channelApi.getTier(channelId, tierId);
        setTier(result);
      }
    } catch (error) {
      console.error('Failed to load tier:', error);
      setError('Failed to load tier');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: EditChannelTierData) => {
    try {
      if (channelId && tierId) {
        await api?.channelApi.updateTier(channelId, tierId, data);
        navigate(PATHS.STUDIO_CHANNEL_VIEW.replace(':channelId', channelId));
      }
    } catch (error) {
      console.error('Failed to update tier:', error);
      setError('Failed to update tier');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tier) {
    return (
      <Typography color="error">Tier not found</Typography>
    );
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
        Update your membership tier details and benefits.
      </Typography>

      <TierForm
        initialData={tier}
        channelId={channelId!}
        onSubmit={handleUpdate}
        submitButtonText="Update Tier"
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

export default EditTier; 