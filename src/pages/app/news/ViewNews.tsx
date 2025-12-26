import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Grid,
  Stack,
  Paper,
  Skeleton,
  Alert,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useApiContext } from '@/contexts/ApiContext';
import { News } from '@/types/index';
import NewsSocialLinks from '@/components/news/NewsSocialLinks';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CoverPlaceholder from '@/assets/BG_journo.png';
import { NEWS_MEDIA_TYPE, NEWS_MEDIA_FORMAT } from '@/enums/NewsEnums';
import PersonIcon from '@mui/icons-material/Person';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Link as RouterLink } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import JEditor from '@/components/editor/JEditor';
import { alpha } from '@mui/material/styles';
import { parseContent } from '@/utils/json';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';
import TransactionTransparency from '@/components/news/TransactionTransparency';
import LockIcon from '@mui/icons-material/Lock';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FundingModal, { FundingData } from '@/components/funding/FundingModal';
import type { FundData } from '@/APIs/app/FundingAPI';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

const ViewNewsSkeleton = () => (
  <Container maxWidth="lg" sx={{ mt: 4 }}>
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={300}
          sx={{ borderRadius: 2, mb: 3 }}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <Card>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Stack direction="row" spacing={1}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="circular" width={40} height={40} />
                ))}
              </Stack>
            </Box>

            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              sx={{ mb: 3, borderRadius: 1 }}
            />

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="95%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="85%" />
              <Skeleton variant="text" width="95%" />
            </Stack>

            <Skeleton
              variant="rectangular"
              width="100%"
              height={80}
              sx={{ mb: 3, borderRadius: 1 }}
            />

            <Stack direction="row" spacing={1}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rounded" width={80} height={32} />
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
              {[1, 2, 3, 4, 5].map((i) => (
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

const ViewNews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { api } = useApiContext();
  const { execute } = useApiCall();
  const [entry, setEntry] = useState<Nullable<News>>(null);
  const [loading, setLoading] = useState(true);
  const [hasLimitedAccess, setHasLimitedAccess] = useState(false);

  // Funding state
  const [fundingModalOpen, setFundingModalOpen] = useState(false);
  const [fundData, setFundData] = useState<FundData | null>(null);
  const [loadingFund, setLoadingFund] = useState(false);

  useEffect(() => {
    const getNews = async () => {
      if (id) {
        setLoading(true);

        // Use DETAIL access endpoint (full content without expensive relations)
        const result = await execute(
          () => api?.app.news.get(id),
          { showErrorToast: true }
        );

        if (result) {
          setEntry(result);

          // Check if user has limited access (BRIEF group - preview only)
          // This happens when accessInfo.canAccess is false for premium content
          if (result.accessInfo && !result.accessInfo.canAccess) {
            setHasLimitedAccess(true);
          }

          // Load fund data
          loadFundData(id);
        }

        setLoading(false);
      }
    };

    getNews();
  }, [id, execute]);

  const loadFundData = async (newsId: string) => {
    try {
      setLoadingFund(true);
      const fund = await api?.app.funding.getFund('news', newsId);
      setFundData(fund);
    } catch (error) {
      console.error('Failed to load fund data:', error);
    } finally {
      setLoadingFund(false);
    }
  };

  const handleOpenFundingModal = async () => {
    // Check if user has payment methods
    try {
      const paymentMethods = await api?.app.account.getPayoutMethods();

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
    if (!entry || !fundData) return null;

    return {
      id: fundData.id,
      title: entry.title,
      currentAmount: fundData.currentAmount / 100, // Convert from cents to decimal
      goalAmount: fundData.goalAmount ? fundData.goalAmount / 100 : undefined,
      currency: fundData.currency,
      contributorCount: 0, // This would need to be fetched from fund summary
      description: `Support quality journalism by funding this article`
    };
  };

  if (loading) {
    return <ViewNewsSkeleton />;
  }

  if (!entry) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4">Entry not found</Typography>
      </Container>
    );
  }

  const coverMedia = entry.media.find(m => m.type === NEWS_MEDIA_TYPE.COVER);

  const formatFundAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box
            sx={{
              height: 300,
              width: '100%',
              position: 'relative',
              mb: 3,
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            {coverMedia?.format === NEWS_MEDIA_FORMAT.VIDEO ? (
              <Box
                component="video"
                src={coverMedia.url}
                controls
                preload="metadata"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  bgcolor: 'black'
                }}
              />
            ) : (
              <Box
                component="img"
                src={coverMedia?.url || CoverPlaceholder}
                alt={entry.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            )}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                p: 3,
                color: 'white'
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                {entry.title}
              </Typography>
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
                    to={PATHS.APP_CHANNEL_VIEW.replace(':channelId', entry.channelId)}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease-in-out',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <CampaignIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">
                      {entry.channel.name}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      bgcolor: 'rgba(0, 0, 0, 0.3)',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <PersonIcon sx={{ mr: 1, fontSize: '0.9rem' }} />
                    <Typography variant="caption">
                      {entry.creator.displayName}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle1">
                  {new Date(entry.publishedAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ p: 3 }}>
              {/* Unified Premium Content Notice */}
              {hasLimitedAccess ? (
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    bgcolor: theme => alpha(theme.palette.warning.main, 0.05),
                    border: theme => `2px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                    borderRadius: 3
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: theme => alpha(theme.palette.warning.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2
                    }}
                  >
                    <LockIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                  </Box>

                  <Typography variant="h5" gutterBottom fontWeight="bold" color="warning.dark">
                    Premium Content
                  </Typography>

                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                    {entry.accessInfo?.reason || 'Subscribe to unlock the full article and support quality journalism.'}
                  </Typography>

                  {entry.accessInfo?.requiredTierName && (
                    <Alert
                      severity="info"
                      sx={{
                        mb: 3,
                        maxWidth: 500,
                        mx: 'auto',
                        '& .MuiAlert-message': {
                          width: '100%',
                          textAlign: 'center'
                        }
                      }}
                    >
                      Required tier: <strong>{entry.accessInfo.requiredTierName}</strong>
                    </Alert>
                  )}

                  <Box sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                      Subscribe to unlock:
                    </Typography>
                    <List dense>
                      {[
                        'Full article content',
                        'Quality metrics',
                        'Fund information',
                        'Social links',
                        'Transaction transparency'
                      ].map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Button
                    component={RouterLink}
                    to={PATHS.APP_CHANNEL_VIEW.replace(':channelId', entry.channelId)}
                    variant="contained"
                    color="warning"
                    size="large"
                    startIcon={<UpgradeIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    View Subscription Options
                  </Button>
                </Paper>
              ) : (
                <>
                  {/* Full Content */}
                  <JEditor
                    data={parseContent(entry.content)}
                    readOnly={true}
                    borderColor={theme =>
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.1)
                        : alpha(theme.palette.common.black, 0.1)
                    }
                  />

                  <Box sx={{ mt: 2 }}>
                    {entry.tags.map((tag) => (
                      <Chip
                        key={tag.id}
                        label={tag.title}
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Social Links - Only show with full access */}
            {!hasLimitedAccess && entry.socialLinks && entry.socialLinks.length > 0 && (
              <NewsSocialLinks links={entry.socialLinks} />
            )}

            {/* Quality Metrics - Only show with full access */}
            {!hasLimitedAccess && entry.qualityMetrics && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'success.light',
                  color: 'success.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  borderRadius: 2
                }}
              >
                <StarIcon fontSize="large" />
                <Box>
                  <Typography variant="overline">
                    Quality Score
                  </Typography>
                  <Typography variant="h4" component="div">
                    {entry.qualityMetrics.overallQualityScore.toFixed(1)}/10
                  </Typography>
                </Box>
              </Paper>
            )}

            {/* News Fund - Only show with full access */}
            {!hasLimitedAccess && entry.newsFund && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  borderRadius: 2
                }}
              >
                <AttachMoneyIcon fontSize="large" />
                <Box>
                  <Typography variant="overline">
                    News Fund
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatFundAmount(entry.newsFund.amount)}
                  </Typography>
                </Box>
              </Paper>
            )}

            {/* Fund this Article - Always visible regardless of premium status */}
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
                    Fund this Article
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
                    Be the first to fund this article
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary">
                  Support quality journalism by contributing to this article
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<VolunteerActivismIcon />}
                  onClick={handleOpenFundingModal}
                  disabled={!entry}
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
          </Stack>
        </Grid>
      </Grid>

      {/* Transaction Transparency - Only show with full access */}
      {!hasLimitedAccess && (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <TransactionTransparency
            newsId={entry.id}
            channelId={entry.channelId}
            newsFund={entry.newsFund}
          />
        </Container>
      )}

      {/* Funding Modal */}
      {entry && fundData && (
        <FundingModal
          open={fundingModalOpen}
          onClose={() => setFundingModalOpen(false)}
          onSuccess={handleFundingSuccess}
          contentType="news"
          contentId={entry.id}
          fundingData={getFundingData()!}
        />
      )}
    </Container>
  );
};

export default ViewNews;
