import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiContext } from '@/contexts/ApiContext';
import { ChannelTier } from '@/types/index';
import TierCard from '@/components/tier/TierCard';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useApiCall } from '@/hooks/useApiCall';

const ViewTier: React.FC = () => {
  const { channelId, tierId } = useParams<{ channelId: string; tierId: string }>();
  const navigate = useNavigate();
  const { api } = useApiContext();
  const [tier, setTier] = useState<ChannelTier | null>(null);
  const { execute } = useApiCall();

  useEffect(() => {
    loadTier();
  }, [channelId, tierId]);

  const loadTier = async () => {
    if (!channelId || !tierId) return;
    
    const result = await execute(
      () => api?.channelApi.getTier(channelId, tierId),
      { showErrorToast: true }
    );
    
    if (result) {
      setTier(result);
    }
  };

  if (!tier) {
    return null; // or loading spinner
  }

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/studio/channels/${channelId}/tiers`)}
            sx={{ mb: 2 }}
          >
            Back to Tiers
          </Button>
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              fontWeight: 600,
              mb: 1
            }}
          >
            {tier.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tier details and management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/studio/channels/${channelId}/tiers/${tierId}/edit`)}
        >
          Edit Tier
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TierCard tier={tier} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewTier; 