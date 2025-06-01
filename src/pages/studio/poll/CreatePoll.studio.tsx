import React from 'react';
import { Container, Typography } from '@mui/material';
import { useApiContext } from '@/contexts/ApiContext';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import PollForm from '@/components/studio/poll/PollForm';
import { useApiCall } from '@/hooks/useApiCall';

const CreatePollStudio: React.FC = () => {
  const { api } = useApiContext();
  const navigate = useNavigate();
  const { execute } = useApiCall();

  const handleCreate = async (data: any) => {
    if (!data) return;
    
    const result = await execute(
      () => api?.studioApi.createPoll(data),
      {
        showSuccessMessage: true,
        successMessage: 'Poll created successfully!'
      }
    );
    
    if (result) {
      navigate(`${PATHS.STUDIO_POLLS}`);
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
    </Container>
  );
};

export default CreatePollStudio; 