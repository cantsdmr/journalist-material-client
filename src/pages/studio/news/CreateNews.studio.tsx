import React from 'react';
import { Box, Typography } from '@mui/material';
import NewsForm from '@/components/news/NewsForm';
import { useApiContext } from '@/contexts/ApiContext';
import { useNavigate } from 'react-router-dom';
import { CreateNewsData } from '@/types/index';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';

const CreateNewsStudio: React.FC = () => {
  const { api } = useApiContext();
  const navigate = useNavigate();
  const { execute } = useApiCall();

  const handleCreate = async (data: CreateNewsData) => {
    const result = await execute(
      () => api?.newsApi.createNews(data),
      {
        showSuccessMessage: true,
        successMessage: 'News article created successfully!'
      }
    );
    
    if (result) {
      navigate(PATHS.APP_NEWS_VIEW.replace(':id', result.id));
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
    </Box>
  );
};

export default CreateNewsStudio; 