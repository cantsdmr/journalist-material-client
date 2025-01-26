import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Grid, 
  CircularProgress 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useApiContext } from '@/contexts/ApiContext';
import AddIcon from '@mui/icons-material/Add';
import { ChannelTier } from '@/APIs/ChannelAPI';
import TierCard from '@/components/tier/TierCard';

const ListTiers: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const { api } = useApiContext();
  const [tiers, setTiers] = useState<ChannelTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTiers();
  }, [channelId]);

  const loadTiers = async () => {
    try {
      if (channelId) {
        const result = await api?.channelApi.getTiers(channelId);
        if (result) {
          setTiers(result.items || []);
        }
      }
    } catch (error) {
      console.error('Failed to load tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
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
          <Typography variant="body1" color="text.secondary">
            Manage your channel's membership tiers and benefits
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(`/app/channels/${channelId}/tiers/create`)}
        >
          Create Tier
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tiers.map((tier) => (
          <Grid item xs={12} sm={6} md={4} key={tier.id}>
            <TierCard 
              tier={tier}
              onClick={() => navigate(`/app/channels/${channelId}/tiers/${tier.id}`)}
            />
          </Grid>
        ))}
      </Grid>

      {tiers.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 1
        }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No tiers created yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/app/channels/${channelId}/tiers/create`)}
          >
            Create Your First Tier
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ListTiers; 