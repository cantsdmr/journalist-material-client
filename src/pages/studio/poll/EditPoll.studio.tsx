import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import PollForm from '@/components/studio/poll/PollForm';
import { useApiContext } from '@/contexts/ApiContext';
import Notification from '@/components/common/Notification';
import { PATHS } from '@/constants/paths';

const EditPollStudio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { api } = useApiContext();
  const [initialData, setInitialData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        if (!id) return;
        const poll = await api?.pollApi.get(id);
        setInitialData(poll);
      } catch (error) {
        console.error('Failed to fetch poll:', error);
        setError('Failed to fetch poll');
      }
    };

    fetchPoll();
  }, [id, api?.pollApi]);

  const handleUpdate = async (data: any) => {
    try {
      if (!id) return;
      await api?.pollApi.update(id, data);
      navigate(PATHS.STUDIO_POLL_VIEW.replace(':id', id));
    } catch (error) {
      console.error('Failed to update poll:', error);
      setError('Failed to update poll');
    }
  };

  if (!initialData) {
    return null; // or loading spinner
  }

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
        Edit Poll
      </Typography>

      <PollForm
        initialData={initialData}
        onSubmit={handleUpdate}
        submitButtonText="Update Poll"
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

export default EditPollStudio; 