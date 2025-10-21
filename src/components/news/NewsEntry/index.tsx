import React from 'react';
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

interface NewsEntryProps {
  news: News;
}

const NewsEntry: React.FC<NewsEntryProps> = ({ news }) => {
  const navigate = useNavigate();
  const coverMedia = news.media?.find(m => m.type === NEWS_MEDIA_TYPE.COVER);

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.action-button')) {
      navigate(PATHS.APP_NEWS_VIEW.replace(':id', news.id));
    }
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box
        component={RouterLink}
        to={PATHS.APP_CHANNEL_VIEW.replace(':channelId', news.channel.id)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          color: 'text.primary',
          textDecoration: 'none',
          mb: 1,
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
            width: 24,
            height: 24,
            mr: 1,
            bgcolor: 'grey.200',
            borderRadius: 1
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 16 }} />
        </Avatar>
        <Typography
          variant="body2"
          className="channel-name"
          fontWeight={500}
          sx={{
            transition: 'color 0.2s',
            fontSize: '0.8rem'
          }}
        >
          {news.channel.name}
        </Typography>
      </Box>

      <Card
        onClick={handleCardClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          bgcolor: 'background.paper',
          borderRadius: 1.5,
          overflow: 'hidden',
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
          height: '100%',
          '&:hover': {
            '& .news-thumbnail': { transform: 'scale(1.05)' },
            '& .news-title': { color: 'primary.main' },
            boxShadow: 1
          },
          transition: 'box-shadow 0.2s ease'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 aspect ratio
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
                position: 'absolute',
                top: 0,
                left: 0,
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
                position: 'absolute',
                top: 0,
                left: 0,
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
            p: 1.5,
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            className="news-title"
            variant="h6"
            sx={{
              fontWeight: 600,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
              transition: 'color 0.2s',
              mb: 0.5,
              fontSize: '0.9rem'
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
              mb: 1.5,
              lineHeight: 1.4,
              fontSize: '0.8rem'
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
              sx={{ fontWeight: 500, fontSize: '0.7rem' }}
            >
              {new Date(news.publishedAt).toLocaleDateString()}
            </Typography>

            <Stack direction="row" spacing={0.5}>
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
                    padding: '4px',
                    '&:hover': { color: 'error.main' }
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>

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
                    padding: '4px',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <ShareIcon sx={{ fontSize: 18 }} />
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