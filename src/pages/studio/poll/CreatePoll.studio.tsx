import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import { useApiContext } from '@/contexts/ApiContext';
import Notification from '@/components/common/Notification';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import PollForm from '@/components/studio/poll/PollForm';

const CreatePollStudio: React.FC = () => {
  const { api } = useApiContext();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (data: any) => {
    if (!data) return;
    try {
      const result = await api?.pollApi.create(data);
      if (result) {
        navigate(`${PATHS.STUDIO_POLLS}`);
      }
    } catch (error) {
      console.error('Failed to create poll:', error);
      setError('Failed to create poll');
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
        Create Poll
      </Typography>

      <PollForm
        onSubmit={handleCreate}
        submitButtonText="Create Poll"
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

export default CreatePollStudio; 