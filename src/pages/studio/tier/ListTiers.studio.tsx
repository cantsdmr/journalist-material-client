import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useApiContext } from '@/contexts/ApiContext';
import TierCard from '@/components/tier/TierCard';
import { ChannelTier } from '@/APIs/ChannelAPI';
import { EmptyState } from '@/components/common/EmptyState';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useApiCall } from '@/hooks/useApiCall';

const ListTiers: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { api } = useApiContext();
  const navigate = useNavigate();
  const [tiers, setTiers] = useState<ChannelTier[]>([]);
  const { execute } = useApiCall();

  useEffect(() => {
    loadTiers();
  }, [channelId]);

  const loadTiers = async () => {
    if (!channelId) return;
    
    const result = await execute(
      () => api?.channelApi.getTiers(channelId),
      { showErrorToast: true }
    );
    
    if (result) {
      setTiers(result);
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
        Membership Tiers
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ maxWidth: 600, mb: 3 }}
      >
        Manage your channel's membership tiers and subscription options.
      </Typography>

      {tiers.length === 0 ? (
        <EmptyState
          title="No Tiers Yet"
          description="Create your first membership tier to start offering exclusive content to subscribers."
          icon={<AddIcon sx={{ fontSize: { xs: 40, sm: 48 } }} />}
          action={{
            label: "Create Tier",
            onClick: () => navigate(`/studio/channels/${channelId}/tiers/create`)
          }}
        />
      ) : (
        <Grid container spacing={3}>
          {tiers.map((tier) => (
            <Grid item xs={12} md={6} lg={4} key={tier.id}>
              <TierCard tier={tier} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ListTiers; 