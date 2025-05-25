import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import NewsForm from '@/components/news/NewsForm';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';

const EditNewsStudio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { api } = useApiContext();
  const [initialData, setInitialData] = useState<any>(null);
  const { execute } = useApiCall();

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      
      const result = await execute(
        () => api?.newsApi.get(id),
        { showErrorToast: true }
      );
      
      if (result) {
        setInitialData(result);
      }
    };

    fetchNews();
  }, [id, api?.newsApi, execute]);

  const handleUpdate = async (data: any) => {
    if (!id) return;
    
    const result = await execute(
      () => api?.newsApi.update(id, data),
      {
        showSuccessMessage: true,
        successMessage: 'News article updated successfully!'
      }
    );
    
    if (result) {
      navigate(`/news/${id}`);
    }
  };

  if (!initialData) return null; // or loading spinner

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
        Update News
      </Typography>

      <NewsForm
        initialData={initialData}
        onSubmit={handleUpdate}
        submitButtonText="Update News"
      />
    </Container>
  );
};

export default EditNewsStudio; 