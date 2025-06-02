import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import PollForm from '@/components/studio/poll/PollForm';
import { useApiContext } from '@/contexts/ApiContext';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';

const EditPollStudio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { api } = useApiContext();
  const [initialData, setInitialData] = useState<any>(null);
  const { execute } = useApiCall();

  useEffect(() => {
    const fetchPoll = async () => {
      if (!id) return;
      
      const result = await execute(
        () => api?.pollApi.get(id),
        { showErrorToast: true }
      );
      
      if (result) {
        setInitialData(result.data);
      }
    };

    fetchPoll();
  }, [id, api?.pollApi, execute]);

  const handleUpdate = async (data: any) => {
    if (!id) return;
    
    const result = await execute(
      () => api?.pollApi.update(id, data),
      {
        showSuccessMessage: true,
        successMessage: 'Poll updated successfully!'
      }
    );
    
    if (result) {
      navigate(PATHS.STUDIO_POLL_VIEW.replace(':id', id));
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
        initialData={{
          title: initialData.title,
          description: initialData.description,
          startDate: initialData.startDate,
          endDate: initialData.endDate,
          channelId: initialData.channel.id,
          options: initialData.options.map((option: any) => ({
            text: option.text,
            id: option.id
          }))
        }}
        onSubmit={handleUpdate}
        submitButtonText="Update Poll"
      />
    </Container>
  );
};

export default EditPollStudio; 