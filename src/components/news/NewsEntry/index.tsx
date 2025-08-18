import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Box, 
  Stack,
  alpha,
  IconButton,
  Tooltip,
  Avatar
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { News } from '@/types/index';
import { NEWS_MEDIA_TYPE, NEWS_MEDIA_FORMAT } from '@/enums/NewsEnums';
import DefaultNewsAvatar from '@/assets/BG_journo.png';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { PATHS } from '@/constants/paths';
import { FundingButton } from '@/components/funding';
import { useApiContext } from '@/contexts/ApiContext';

interface NewsEntryProps {
  news: News;
}

const NewsEntry: React.FC<NewsEntryProps> = ({ news }) => {
  const navigate = useNavigate();
  const { api } = useApiContext();
  const coverMedia = news.media?.find(m => m.type === NEWS_MEDIA_TYPE.COVER);
  const [fundingData, setFundingData] = useState<{
    currentAmount: number;
    goalAmount?: number;
    contributorCount: number;
    currency: string;
  }>({
    currentAmount: 0,
    goalAmount: undefined,
    contributorCount: 0,
    currency: 'USD'
  });

  // Load funding data
  useEffect(() => {
    const loadFundingData = async () => {
      try {
        const fund = await api.fundingApi.getFund('news', news.id);
        if (fund) {
          const summary = await api.fundingApi.getFundSummary('news', news.id);
          setFundingData({
            currentAmount: fund.current_amount / 100, // Convert from cents
            goalAmount: fund.goal_amount ? fund.goal_amount / 100 : undefined,
            contributorCount: summary?.total_contributors || 0,
            currency: fund.currency
          });
        }
      } catch (error) {
        // Fund doesn't exist yet - use default values
        console.debug('No funding data for news:', news.id);
      }
    };

    loadFundingData();
  }, [news.id, api.fundingApi]);

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.action-button')) {
      navigate(PATHS.APP_NEWS_VIEW.replace(':id', news.id));
    }
  };

  const handleFundingSuccess = () => {
    // Reload funding data after successful contribution
    const loadFundingData = async () => {
      try {
        const fund = await api.fundingApi.getFund('news', news.id);
        if (fund) {
          const summary = await api.fundingApi.getFundSummary('news', news.id);
          setFundingData({
            currentAmount: fund.current_amount / 100,
            goalAmount: fund.goal_amount ? fund.goal_amount / 100 : undefined,
            contributorCount: summary?.total_contributors || 0,
            currency: fund.currency
          });
        }
      } catch (error) {
        console.error('Error reloading funding data:', error);
      }
    };
    loadFundingData();
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box 
        component={RouterLink}
        to={PATHS.APP_CHANNEL_VIEW.replace(':channelId', news.channel.id)}
        sx={{ 
          display: 'inline-flex',
          alignItems: 'center',
          color: 'text.primary',
          textDecoration: 'none',
          mb: 1.5,
          px: 0.5,
          '&:hover': { 
            color: 'primary.main',
            '& .channel-name': { color: 'primary.main' }
          }
        }}
      >
        <Avatar
          src={news.channel.logoUrl}
          alt={news.channel.name}
          variant="rounded"
          sx={{ 
            width: 28, 
            height: 28, 
            mr: 1.5,
            bgcolor: 'grey.200',
            borderRadius: 1.5
          }}
        >
          <AccountCircleIcon fontSize="small" />
        </Avatar>
        <Typography 
          variant="body2" 
          className="channel-name"
          fontWeight={500}
          sx={{ 
            transition: 'color 0.2s'
          }}
        >
          {news.channel.name}
        </Typography>
      </Box>

      <Card 
        onClick={handleCardClick}
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          cursor: 'pointer',
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          '&:hover': { 
            '& .news-thumbnail': { transform: 'scale(1.05)' },
            '& .news-title': { color: 'primary.main' }
          }
        }}
      >
        <Box 
          sx={{ 
            position: 'relative',
            width: { xs: '100%', sm: '360px' },
            minWidth: { sm: '360px' },
            height: { xs: '220px', sm: '200px' },
            flexShrink: 0,
            overflow: 'hidden',
            bgcolor: 'grey.100'
          }}
        >
          {coverMedia?.format === NEWS_MEDIA_FORMAT.VIDEO ? (
            <Box
              component="video"
              src={coverMedia.url}
              preload="metadata"
              className="news-thumbnail"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                display: 'block',
                bgcolor: 'black'
              }}
            />
          ) : (
            <Box
              component="img"
              src={coverMedia?.url || DefaultNewsAvatar}
              alt={news.title}
              className="news-thumbnail"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                display: 'block'
              }}
            />
          )}
          {news.qualityMetrics?.overallQualityScore && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: alpha('#000', 0.75),
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {news.qualityMetrics.overallQualityScore.toFixed(1)}
            </Box>
          )}
        </Box>

        <Box 
          sx={{ 
            p: 3,
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography 
            className="news-title"
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
              transition: 'color 0.2s',
              mb: 2
            }}
          >
            {news.title}
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 3,
              lineHeight: 1.6
            }}
          >
            {news.content}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto'
          }}>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {new Date(news.publishedAt).toLocaleDateString()}
            </Typography>

            <Stack direction="row" spacing={1.5}>
              <Tooltip title="Like">
                <IconButton 
                  className="action-button"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle like
                  }}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'error.main' }
                  }}
                >
                  <FavoriteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Box className="action-button" onClick={(e) => e.stopPropagation()}>
                <FundingButton
                  contentType="news"
                  contentId={news.id}
                  contentTitle={news.title}
                  fundingData={fundingData}
                  onContributionSuccess={handleFundingSuccess}
                  variant="icon"
                  icon="heart"
                  size="small"
                />
              </Box>
              
              <Tooltip title="Share">
                <IconButton 
                  className="action-button"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle share
                  }}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <ShareIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default NewsEntry; 