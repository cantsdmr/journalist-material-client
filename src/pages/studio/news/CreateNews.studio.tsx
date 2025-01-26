import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import NewsForm from '@/components/news/NewsForm';
import { useApiContext } from '@/contexts/ApiContext';
import Notification from '@/components/common/Notification';
import { useNavigate } from 'react-router-dom';
import { CreateNewsData } from '@/APIs/NewsAPI';

const CreateNewsStudio: React.FC = () => {
  const { api } = useApiContext();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (data: CreateNewsData) => {
    try {
      const result = await api?.newsApi.createNews(data);
      if (result) {
        navigate(`/app/news/${result.id}`);
      }
    } catch (error) {
      console.error('Failed to create news:', error);
      setError('Failed to create news');
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
        Create News
      </Typography>

      <NewsForm
        onSubmit={handleCreate}
        submitButtonText="Create News"
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

export default CreateNewsStudio; 