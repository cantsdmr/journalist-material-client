import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ChannelForm from '@/components/channel/ChannelForm';
import { useApiContext } from '@/contexts/ApiContext';
import Notification from '@/components/common/Notification';
import ChannelFormSkeleton from '@/components/channel/ChannelForm/ChannelFormSkeleton';

const EditChannelStudio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { api } = useApiContext();
  const [initialData, setInitialData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannel = async () => {
      setLoading(true);
      try {
        const channel = await api?.channelApi.getChannel(id!);
        setInitialData(channel);
      } catch (error) {
        console.error('Failed to fetch channel:', error);
        setError('Failed to fetch channel');
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, []);

  const handleUpdate = async (data: any) => {
    try {
      await api?.channelApi.updateChannel(id!, data);
      navigate(`/app/channels/${id}`);
    } catch (error) {
      console.error('Failed to update channel:', error);
      setError('Failed to update channel');
    }
  };

  if (loading) return <ChannelFormSkeleton />;
  if (error) return (
    <Container sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Notification
        open={!!error}
        message={error}
        severity="error"
        onClose={() => setError(null)}
      />
    </Container>
  );
  if (!initialData) return null;

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
        Edit Channel
      </Typography>

      <ChannelForm
        initialData={initialData}
        onSubmit={handleUpdate}
        submitButtonText="Update Channel"
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

export default EditChannelStudio;
