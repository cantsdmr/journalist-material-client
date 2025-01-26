import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import NewsForm from '@/components/news/NewsForm';
import { useApiContext } from '@/contexts/ApiContext';
import Notification from '@/components/common/Notification';

const EditNewsStudio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { api } = useApiContext();
  const [initialData, setInitialData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await api?.newsApi.get(id!);
        setInitialData(news);
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setError('Failed to fetch news');
      }
    };

    fetchNews();
  }, []);

  const handleUpdate = async (data: any) => {
    await api?.newsApi.update(id!, data);
    navigate(`/news/${id}`);
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

      <Notification
        open={!!error}
        message={error}
        severity="error"
        onClose={() => setError(null)}
      />
    </Container>
  );
};

export default EditNewsStudio; 