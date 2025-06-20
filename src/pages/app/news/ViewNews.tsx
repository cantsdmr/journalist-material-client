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
  Skeleton
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useApiContext } from '@/contexts/ApiContext';
import { News } from '@/types/index';
import NewsSocialLinks from '@/components/news/NewsSocialLinks';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CoverPlaceholder from '@/assets/BG_journo.png';
import { NEWS_MEDIA_TYPE } from '@/enums/NewsEnums';
import PersonIcon from '@mui/icons-material/Person';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Link as RouterLink } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import JEditor from '@/components/editor/JEditor';
import { alpha } from '@mui/material/styles';
import { parseContent } from '@/utils/json';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';

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

  useEffect(() => {
    const getNews = async () => {
      if (id) {
        setLoading(true);
        
        const result = await execute(
          () => api?.newsApi.get(id),
          { showErrorToast: true }
        );
        
        if (result) {
          setEntry(result);
        }
        
        setLoading(false);
      }
    };

    getNews();
  }, [id, execute]);

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

  const coverImage = entry.media.find(m => m.type === NEWS_MEDIA_TYPE.COVER);

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
            <Box
              component="img"
              src={coverImage?.url || CoverPlaceholder}
              alt={entry.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
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
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <NewsSocialLinks links={entry.socialLinks} />
            
            {entry.qualityMetrics && (
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

            {entry.newsFund && (
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
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewNews;