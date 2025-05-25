import React from 'react';
import { Container, Typography } from '@mui/material';
import ChannelForm from '@/components/studio/channel/ChannelForm';
import { useApiContext } from '@/contexts/ApiContext';
import { useNavigate } from 'react-router-dom';
import { CreateChannelData, EditChannelData } from '@/APIs/ChannelAPI';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';

const CreateChannelStudio: React.FC = () => {
  const { api } = useApiContext();
  const navigate = useNavigate();
  const { execute } = useApiCall();

  const handleCreate = async (data: EditChannelData | CreateChannelData | null | undefined) => {
    if (!data) return;
    
    const result = await execute(
      () => api?.channelApi.createChannel(data as CreateChannelData),
      {
        showSuccessMessage: true,
        successMessage: 'Channel created successfully!'
      }
    );
    
    if (result) {
      navigate(`${PATHS.STUDIO_CHANNELS}`);
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
    </Container>
  );
};

export default CreateChannelStudio;
