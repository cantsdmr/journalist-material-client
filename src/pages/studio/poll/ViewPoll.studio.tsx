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
  Skeleton
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useApiContext } from '@/contexts/ApiContext';
import PollChartResults from '@/components/studio/poll/PollChartResults';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

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
  const [poll, setPoll] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPoll = async () => {
      try {
        if (id) {
          setLoading(true);
          const result = await api?.pollApi.get(id);
          if (result) {
            setPoll(result);
          }
        }
      } catch (error) {
        console.error('Failed to fetch poll:', error);
      } finally {
        setLoading(false);
      }
    };

    getPoll();
  }, [id, api?.pollApi]);

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
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
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
    </Container>
  );
};

export default ViewPollStudio; 