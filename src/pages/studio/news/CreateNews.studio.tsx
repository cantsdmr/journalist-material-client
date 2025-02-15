import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import NewsForm from '@/components/news/NewsForm';
import { useApiContext } from '@/contexts/ApiContext';
import Notification from '@/components/common/Notification';
import { useNavigate } from 'react-router-dom';
import { CreateNewsData } from '@/APIs/NewsAPI';
import { PATHS } from '@/constants/paths';

const CreateNewsStudio: React.FC = () => {
  const { api } = useApiContext();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (data: CreateNewsData) => {
    try {
      const result = await api?.newsApi.createNews(data);
      if (result) {
        navigate(PATHS.APP_NEWS_VIEW.replace(':id', result.id));
      }
    } catch (error) {
      console.error('Failed to create news:', error);
      setError('Failed to create news');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
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
    </Box>
  );
};

export default CreateNewsStudio; 