import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Grid,
  Skeleton,
  Paper,
  Stack,
  IconButton,
  Button,
  alpha,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useApiContext } from '@/contexts/ApiContext';
import { Poll } from '@/APIs/PollAPI';
import PollCard from '@/components/poll/PollCard';
import { Link as RouterLink } from 'react-router-dom';
import CampaignIcon from '@mui/icons-material/Campaign';
import PersonIcon from '@mui/icons-material/Person';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CommentIcon from '@mui/icons-material/Comment';
import { PATHS } from '@/constants/paths';
import { formatDistanceToNow } from 'date-fns';

const ViewPollSkeleton = () => (
  <Container maxWidth="lg" sx={{ mt: 4 }}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Card>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Stack direction="row" spacing={1}>
                {[1, 2].map((i) => (
                  <Skeleton key={i} variant="circular" width={40} height={40} />
                ))}
              </Stack>
            </Box>
            
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="95%" />
              <Skeleton variant="text" width="90%" />
            </Stack>

            <Stack spacing={2}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
              ))}
            </Stack>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {[1, 2, 3].map((i) => (
                <Box key={i}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="20%" />
                  </Box>
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height={8} 
                    sx={{ borderRadius: 1 }} 
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Container>
);

const ViewPoll: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { api } = useApiContext();
  const theme = useTheme();
  const [poll, setPoll] = useState<Nullable<Poll>>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [showResultsMode, setShowResultsMode] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        if (id) {
          setLoading(true);
          const pollResult = await api?.pollApi.get(id);
          if (pollResult) {
            setPoll(pollResult);
            
            // Fetch user's vote for this poll
            try {
              const voteResponse = await api?.pollApi.getUserVote(id);
              if (voteResponse.optionId) {
                setUserVote(voteResponse.optionId);
              }
            } catch (error) {
              console.error('Failed to fetch user vote:', error);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch poll:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id, api?.pollApi]);

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      await api?.pollApi.vote(pollId, { optionId });
      setUserVote(optionId);
      // Refresh poll to get updated vote counts
      const updatedPoll = await api?.pollApi.get(pollId);
      if (updatedPoll) {
        setPoll(updatedPoll);
      }
    } catch (error: any) {
      console.error('Failed to vote:', error);
      setError(error.response?.data?.message || 'Failed to vote on poll');
    }
  };

  const handleViewResults = async (pollId: string) => {
    try {
      // Fetch the latest poll results
      const updatedPoll = await api?.pollApi.get(pollId);
      if (updatedPoll) {
        setPoll(updatedPoll);
      }
      // Show results mode
      setShowResultsMode(true);
    } catch (error: any) {
      console.error('Failed to fetch results:', error);
      setError(error.response?.data?.message || 'Failed to fetch poll results');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: poll?.title,
        text: poll?.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show a snackbar/toast notification
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark functionality
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box 
                  component={RouterLink}
                  to={PATHS.APP_CHANNEL_VIEW.replace(':channelId', poll.channel.id)}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CampaignIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    {poll.channel.name}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <PersonIcon sx={{ mr: 1, fontSize: '0.9rem' }} />
                  <Typography variant="caption">
                    {poll.creator.displayName}
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={1}>
                <IconButton 
                  onClick={handleShare}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  <ShareIcon />
                </IconButton>
                <IconButton 
                  onClick={toggleBookmark}
                  sx={{ 
                    color: isBookmarked ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
              </Stack>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <PollCard
            poll={poll}
            onVote={handleVote}
            onViewResults={handleViewResults}
            userVote={userVote}
            showResults={!!userVote || showResultsMode}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {poll.description && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  About this Poll
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {poll.description}
                </Typography>
              </Paper>
            )}
            
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Poll Statistics
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Votes
                  </Typography>
                  <Typography variant="h4">
                    {poll.options.reduce((sum, option) => sum + option.voteCount, 0)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Time Remaining
                  </Typography>
                  <Typography variant="body1">
                    {poll.endDate ? formatDistanceToNow(new Date(poll.endDate), { addSuffix: true }) : 'No end date'}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>
              <Button
                startIcon={<CommentIcon />}
                variant="outlined"
                fullWidth
                sx={{ 
                  mt: 1,
                  textTransform: 'none',
                  borderRadius: 2
                }}
              >
                Add a Comment
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ViewPoll; 