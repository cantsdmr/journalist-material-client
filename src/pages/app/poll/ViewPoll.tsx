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
import LockIcon from '@mui/icons-material/Lock';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PATHS } from '@/constants/paths';
import { formatDistanceToNow } from 'date-fns';
import { alpha } from '@mui/material/styles';
import { useApiCall } from '@/hooks/useApiCall';
import { Link as RouterLink2 } from 'react-router-dom';
import FundingModal, { FundingData } from '@/components/funding/FundingModal';
import type { FundData } from '@/APIs/FundingAPI';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

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

  // Funding state
  const [fundingModalOpen, setFundingModalOpen] = useState(false);
  const [fundData, setFundData] = useState<FundData | null>(null);
  const [loadingFund, setLoadingFund] = useState(false);

  // Check if user has limited access to premium content
  const hasLimitedAccess = poll?.isPremium && poll?.accessInfo && !poll.accessInfo.canAccess;

  const loadFundData = async (pollId: string) => {
    try {
      setLoadingFund(true);
      const fund = await api?.fundingApi.getFund('poll', pollId);
      setFundData(fund);
    } catch (error) {
      console.error('Failed to load fund data:', error);
    } finally {
      setLoadingFund(false);
    }
  };

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

        // Load fund data
        loadFundData(id);
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

  const handleOpenFundingModal = async () => {
    // Check if user has payment methods
    try {
      const paymentMethods = await api?.accountApi.getPaymentMethods();

      if (!paymentMethods?.items || paymentMethods.items.length === 0) {
        // Show warning that user needs to add payment method
        alert('Please add a payment method before funding. You can add payment methods in your account settings.');
        return;
      }
    } catch (error) {
      console.error('Failed to check payment methods:', error);
    }

    setFundingModalOpen(true);
  };

  const handleFundingSuccess = async (contribution: any) => {
    // Reload fund data after successful contribution
    if (id) {
      await loadFundData(id);
    }
    // Optionally show success message
    console.log('Contribution successful:', contribution);
  };

  const getFundingData = (): FundingData | null => {
    if (!poll || !fundData) return null;

    return {
      id: fundData.id,
      title: poll.title,
      currentAmount: fundData.currentAmount / 100, // Convert from cents to decimal
      goalAmount: fundData.goalAmount ? fundData.goalAmount / 100 : undefined,
      currency: fundData.currency,
      contributorCount: 0, // This would need to be fetched from fund summary
      description: `Support quality journalism by funding this poll`
    };
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
            {/* Poll Media */}
            {poll.media && poll.media.length > 0 && (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  overflow: 'hidden',
                  borderRadius: '4px 4px 0 0'
                }}
              >
                <Box
                  component={poll.media[0].format === 2 ? 'video' : 'img'}
                  src={poll.media[0].url}
                  alt={poll.media[0].caption || poll.title}
                  controls={poll.media[0].format === 2}
                  autoPlay={poll.media[0].format === 2}
                  loop={poll.media[0].format === 2}
                  muted={poll.media[0].format === 2}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                {poll.media[0].caption && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: alpha(theme.palette.common.black, 0.7),
                      color: 'white',
                      p: 1,
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <Typography variant="caption">
                      {poll.media[0].caption}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                {poll.title}
              </Typography>

              {/* Voting Eligibility Warning */}
              {votingEligibility && !votingEligibility.canVote && (
                <Alert
                  severity={userVote ? "info" : "warning"}
                  sx={{ mb: 3 }}
                  icon={userVote ? <CheckCircleIcon /> : undefined}
                >
                  {votingEligibility.reason || (userVote ? 'You have already voted on this poll' : 'You are not eligible to vote on this poll')}
                </Alert>
              )}

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
                      {poll.stats?.totalVotes ?? 0}
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

            {/* Fund this Poll - Always visible regardless of premium status */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '2px solid',
                borderColor: 'primary.main',
                bgcolor: theme => alpha(theme.palette.primary.main, 0.05)
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VolunteerActivismIcon color="primary" fontSize="large" />
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    Fund this Poll
                  </Typography>
                </Box>

                {fundData && !loadingFund ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Current Funding
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                      {fundData.currency} {(fundData.currentAmount / 100).toFixed(2)}
                    </Typography>
                    {fundData.goalAmount && (
                      <Typography variant="caption" color="text.secondary">
                        Goal: {fundData.currency} {(fundData.goalAmount / 100).toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                ) : loadingFund ? (
                  <Skeleton variant="rectangular" height={60} />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Be the first to fund this poll
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary">
                  Support quality journalism by contributing to this poll
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<VolunteerActivismIcon />}
                  onClick={handleOpenFundingModal}
                  disabled={!poll}
                  sx={{
                    py: 1.5,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Fund Now
                </Button>
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

      {/* Funding Modal */}
      {poll && fundData && (
        <FundingModal
          open={fundingModalOpen}
          onClose={() => setFundingModalOpen(false)}
          onSuccess={handleFundingSuccess}
          contentType="poll"
          contentId={poll.id}
          fundingData={getFundingData()!}
        />
      )}

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