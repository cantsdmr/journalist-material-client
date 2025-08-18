import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card,
  CardContent,
  Chip,
  Stack,
  Paper,
  Skeleton,
  Button
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useApiContext } from '@/contexts/ApiContext';
import PollChartResults from '@/components/studio/poll/PollChartResults';
import PollConversionModal from '@/components/studio/poll/PollConversionModal';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArticleIcon from '@mui/icons-material/Article';
import { useApiCall } from '@/hooks/useApiCall';

const ViewPollSkeleton = () => (
  <Container maxWidth="lg" sx={{ mt: 4 }}>
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" height={24} />
        </Box>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {[1, 2, 3, 4].map((i) => (
                <Box key={i}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="20%" />
                  </Box>
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height={20} 
                    sx={{ borderRadius: 1 }} 
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton variant="text" width="50%" height={24} />
                <Skeleton variant="text" width="70%" height={40} />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Grid>
    </Grid>
  </Container>
);

const ViewPollStudio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { api } = useApiContext();
  const { execute } = useApiCall();
  const [poll, setPoll] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [conversionModalOpen, setConversionModalOpen] = useState(false);

  useEffect(() => {
    const getPoll = async () => {
      if (id) {
        setLoading(true);
        
        const result = await execute(
          () => api?.pollApi.get(id),
          { showErrorToast: true }
        );
        
        if (result) {
          setPoll(result);
        }
        
        setLoading(false);
      }
    };

    getPoll();
  }, [id, execute]);

  const handleConvert = async (newsData: any) => {
    if (!id) return;
    
    const result = await execute(
      () => api?.pollApi.convertToNews(id, newsData),
      {
        showSuccessMessage: true,
        successMessage: 'Poll converted to news successfully!'
      }
    );
    
    if (result) {
      // Refresh poll data to update conversion status
      const updatedPoll = await execute(
        () => api?.pollApi.get(id),
        { showErrorToast: true }
      );
      
      if (updatedPoll) {
        setPoll(updatedPoll);
      }
    }
  };

  if (loading) {
    return <ViewPollSkeleton />;
  }

  if (!poll) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4">Poll not found</Typography>
      </Container>
    );
  }

  const isActive = new Date() >= new Date(poll.startDate) && new Date() <= new Date(poll.endDate);
  const hasStarted = new Date() >= new Date(poll.startDate);
  
  // Check if poll can be converted (in studio, creators can convert their own polls)
  const canConvert = !poll.isConverted && !poll.stats?.hasEnded;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {poll.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {poll.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={isActive ? 'Active' : (hasStarted ? 'Ended' : 'Scheduled')}
                color={isActive ? 'success' : (hasStarted ? 'error' : 'warning')}
              />
              {poll.isTrending && (
                <Chip 
                  icon={<TrendingUpIcon />}
                  label="Trending"
                  color="primary"
                />
              )}
              {poll.isConverted && (
                <Chip 
                  icon={<ArticleIcon />}
                  label="Converted to News"
                  color="info"
                />
              )}
            </Box>
            
            {canConvert && (
              <Button
                variant="contained"
                startIcon={<ArticleIcon />}
                onClick={() => setConversionModalOpen(true)}
                size="small"
              >
                Convert to News
              </Button>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Poll Results
              </Typography>
              <PollChartResults poll={poll} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2,
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <HowToVoteIcon fontSize="large" />
                <Box>
                  <Typography variant="overline">
                    Total Votes
                  </Typography>
                  <Typography variant="h4">
                    {poll.statistics.totalVotes}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Time Frame
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography>
                      {new Date(poll.startDate).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      End Date
                    </Typography>
                    <Typography>
                      {new Date(poll.endDate).toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
      
      <PollConversionModal
        open={conversionModalOpen}
        poll={poll}
        onClose={() => setConversionModalOpen(false)}
        onConvert={handleConvert}
      />
    </Container>
  );
};

export default ViewPollStudio; 