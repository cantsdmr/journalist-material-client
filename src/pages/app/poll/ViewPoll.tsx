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
  useTheme,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useApiContext } from '@/contexts/ApiContext';
import { Poll, VotingEligibilityResponse } from '@/types/index';
import PollDetail from '@/components/poll/PollDetail';
import { Link as RouterLink } from 'react-router-dom';
import CampaignIcon from '@mui/icons-material/Campaign';
import PersonIcon from '@mui/icons-material/Person';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CommentIcon from '@mui/icons-material/Comment';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PATHS } from '@/constants/paths';
import { formatDistanceToNow } from 'date-fns';
import { alpha } from '@mui/material/styles';
import { useApiCall } from '@/hooks/useApiCall';
import { Link as RouterLink2 } from 'react-router-dom';

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
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [votingEligibility, setVotingEligibility] = useState<VotingEligibilityResponse | null>(null);
  const { execute } = useApiCall();

  // Check if user has limited access to premium content
  const hasLimitedAccess = poll?.accessInfo && !poll.accessInfo.canAccess;

  useEffect(() => {
    const fetchPoll = async () => {
      if (!id) return;
      
      setLoading(true);
      
      // Fetch poll data
      const pollResult = await execute(
        () => api?.pollApi.get(id),
        { showErrorToast: true }
      );
      
      if (pollResult) {
        setPoll(pollResult);
        
        // Fetch user's vote for this poll
        const voteResponse = await execute(
          () => api?.pollApi.getUserVote(id),
          { showErrorToast: false } // Don't show error if user hasn't voted
        );
        
        if (voteResponse?.optionId) {
          setUserVote(voteResponse.optionId);
        }

        // Check voting eligibility
        const eligibilityResponse = await execute(
          () => api?.pollApi.checkVotingEligibility(id),
          { showErrorToast: false }
        );

        if (eligibilityResponse) {
          setVotingEligibility(eligibilityResponse);
        }
      }
      
      setLoading(false);
    };

    fetchPoll();
  }, [id, execute]);

  const handleVote = async (pollId: string, optionId: string) => {
    // Check eligibility before voting
    if (!votingEligibility?.canVote) {
      setError(votingEligibility?.reason || 'You cannot vote on this poll');
      return;
    }

    const result = await execute(
      () => api?.pollApi.vote(pollId, { optionId }),
      {
        showSuccessMessage: true,
        successMessage: 'Vote recorded successfully!'
      }
    );
    
    if (result) {
      setUserVote(optionId);
      // Refresh poll to get updated vote counts
      const updatedPoll = await execute(
        () => api?.pollApi.get(pollId),
        { showErrorToast: true }
      );
      
      if (updatedPoll) {
        setPoll(updatedPoll);
      }
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
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
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                {poll.title}
              </Typography>
              <PollDetail
                poll={poll}
                onVote={handleVote}
                userVote={userVote}
                showResults={!!userVote}
                disabled={!votingEligibility?.canVote}
              />
            </CardContent>
          </Card>
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

            {/* Poll Statistics or Premium Notice */}
            {hasLimitedAccess ? (
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: theme => alpha(theme.palette.warning.main, 0.05),
                  border: theme => `2px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                  borderRadius: 3
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: theme => alpha(theme.palette.warning.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2
                  }}
                >
                  <LockIcon sx={{ fontSize: 30, color: 'warning.main' }} />
                </Box>

                <Typography variant="h6" gutterBottom fontWeight="bold" color="warning.dark">
                  Premium Poll Statistics
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {poll.accessInfo?.reason || 'Subscribe to view detailed poll statistics and results.'}
                </Typography>

                {poll.accessInfo?.requiredTierName && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Required tier: <strong>{poll.accessInfo.requiredTierName}</strong>
                  </Alert>
                )}

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Subscribe to unlock:
                  </Typography>
                  <Stack spacing={0.5} alignItems="flex-start" sx={{ mx: 'auto', display: 'inline-flex' }}>
                    {['View vote counts', 'See poll results', 'Participate in voting', 'Access detailed statistics'].map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Button
                  component={RouterLink2}
                  to={PATHS.APP_CHANNEL_VIEW.replace(':channelId', poll.channelId)}
                  variant="contained"
                  color="warning"
                  size="medium"
                  startIcon={<UpgradeIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '0.95rem'
                  }}
                >
                  View Subscription Options
                </Button>
              </Paper>
            ) : (
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
            )}

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