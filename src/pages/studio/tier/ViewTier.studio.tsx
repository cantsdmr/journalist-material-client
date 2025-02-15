import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Stack, 
  Card, CardContent, CircularProgress 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiContext } from '@/contexts/ApiContext';
import EditIcon from '@mui/icons-material/Edit';
import { ChannelTier } from '@/APIs/ChannelAPI';

const ViewTier: React.FC = () => {
  const { channelId, tierId } = useParams<{ channelId: string; tierId: string }>();
  const navigate = useNavigate();
  const { api } = useApiContext();
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

  if (!tier) {
    return (
      <Typography color="error">Tier not found</Typography>
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
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {tier.name}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/app/channels/${channelId}/tiers/${tierId}/edit`)}
        >
          Edit Tier
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                ${tier.price}/month
              </Typography>
              <Typography variant="body1">
                {tier.description}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Benefits
              </Typography>
              <Stack spacing={1}>
                {tier.benefits.map((benefit: string, index: number) => (
                  <Typography key={index} variant="body1">
                    • {benefit}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewTier; 