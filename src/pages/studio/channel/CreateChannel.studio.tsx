import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import ChannelForm from '@/components/channel/ChannelForm';
import { useApiContext } from '@/contexts/ApiContext';
import Notification from '@/components/common/Notification';
import { useNavigate } from 'react-router-dom';
import { CreateChannelData } from '@/APIs/ChannelAPI';
import { PATHS } from '@/constants/paths';

const CreateChannelStudio: React.FC = () => {
  const { api } = useApiContext();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (data: CreateChannelData) => {
    try {
      const result = await api?.channelApi.createChannel(data);
      if (result) {
        navigate(`${PATHS.STUDIO_CHANNELS}`);
      }
    } catch (error) {
      console.error('Failed to create channel:', error);
      setError('Failed to create channel');
    }
  };

  return (
    <Container sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontSize: { xs: '1.125rem', sm: '1.25rem' },
          fontWeight: 600,
          mb: 3
        }}
      >
        Create Channel
      </Typography>

      <ChannelForm
        onSubmit={handleCreate}
        submitButtonText="Create Channel"
      />

      <Notification
        open={!!error}
        message={error}
        severity="error"
        onClose={() => setError(null)}
      />
    </Container>
  );
};

export default CreateChannelStudio;
