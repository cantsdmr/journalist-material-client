import React from 'react';
import {
  Typography,
  Box,
  Stack,
  alpha,
  IconButton,
  Avatar,
  Chip,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { News } from '@/types/index';
import { NEWS_MEDIA_TYPE, NEWS_MEDIA_FORMAT } from '@/enums/NewsEnums';
import DefaultNewsAvatar from '@/assets/BG_journo.png';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifiedIcon from '@mui/icons-material/Verified';
import { PATHS } from '@/constants/paths';
import { formatDistanceToNow } from 'date-fns';

interface NewsEntryProps {
  news: News;
  mode?: 'grid' | 'scroll';
}

const NewsEntry: React.FC<NewsEntryProps> = ({ news, mode = 'scroll' }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const coverMedia = news.media?.find(m => m.type === NEWS_MEDIA_TYPE.COVER);

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.action-button')) {
      navigate(PATHS.APP_NEWS_VIEW.replace(':id', news.id));
    }
  };

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(PATHS.APP_CHANNEL_VIEW.replace(':channelId', news.channel.id));
  };

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        position: 'relative',
        width: '100%',
        height: mode === 'grid' ? 'auto' : '90vh',
        maxWidth: mode === 'scroll' ? '480px' : '100%',
        margin: mode === 'scroll' ? '0 auto' : 0,
        aspectRatio: mode === 'grid' ? '4/5' : undefined,
        borderRadius: mode === 'grid' ? 3 : 4,
        overflow: 'hidden',
        bgcolor: theme.palette.mode === 'dark' ? '#000' : '#111',
        boxShadow: 'none',
        cursor: 'pointer',
        transition: 'opacity 0.2s ease',
        '&:hover': {
          opacity: 0.95
        }
      }}
    >
      {/* Background Media */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}
      >
        {coverMedia?.format === NEWS_MEDIA_FORMAT.VIDEO ? (
          <Box
            component="video"
            src={coverMedia.url}
            autoPlay
            loop
            muted
            playsInline
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.7)'
            }}
          />
        ) : (
          <Box
            component="img"
            src={coverMedia?.url || DefaultNewsAvatar}
            alt={news.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.7)'
            }}
          />
        )}
        {/* Gradient Overlays */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 1
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 1
          }}
        />
      </Box>

      {/* Content Overlay */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2.5
        }}
      >
        {/* Grid Mode - Simplified Overlay */}
        {mode === 'grid' ? (
          <>
            {/* Top Section - Quality Score Badge only */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              {news.qualityMetrics?.overallQualityScore && (
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: '0.875rem' }} />}
                  label={news.qualityMetrics.overallQualityScore.toFixed(1)}
                  size="small"
                  sx={{
                    height: 24,
                    bgcolor: alpha(theme.palette.success.main, 0.9),
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                />
              )}
            </Box>

            {/* Bottom Section - Title, View Count and Favorite Button */}
            <Box>
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: 'white',
                  textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                  mb: 1.5,
                  lineHeight: 1.2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {news.title}
              </Typography>

              {/* Stats and Actions */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 1
                }}
              >
                {/* View Count */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VisibilityIcon
                    sx={{
                      fontSize: '1.1rem',
                      mr: 0.5,
                      color: 'white',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      color: 'white',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}
                  >
                    12K
                  </Typography>
                </Box>

                {/* Favorite Button */}
                <IconButton
                  className="action-button"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle like
                  }}
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.main, 0.8),
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Box>
            </Box>
          </>
        ) : (
          /* Scroll Mode - TikTok-style Layout */
          <>
            {/* Main Container with Right Side Actions */}
            <Box sx={{ display: 'flex', height: '100%', position: 'relative' }}>
              {/* Left Side - Content */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}
              >
                {/* Channel Info */}
                <Box
                  onClick={handleChannelClick}
                  className="action-button"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1.5,
                    cursor: 'pointer',
                    '&:hover': {
                      '& .channel-avatar': {
                        transform: 'scale(1.1)'
                      }
                    }
                  }}
                >
                  <Avatar
                    src={news.channel.logoUrl}
                    alt={news.channel.name}
                    className="channel-avatar"
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: theme.palette.primary.main,
                      border: '2px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                  <Box sx={{ ml: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: 'white',
                        textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                      }}
                    >
                      {news.channel.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.9)',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                      }}
                    >
                      {formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                </Box>

                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    color: 'white',
                    textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                    mb: 0.5,
                    lineHeight: 1.2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {news.title}
                </Typography>

                {/* Content/Description */}
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.95)',
                    textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 1.5
                  }}
                >
                  {news.content}
                </Typography>

                {/* Tags */}
                {news.tags && news.tags.length > 0 && (
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    {news.tags.slice(0, 3).map((tag) => (
                      <Chip
                        key={tag.id}
                        label={`#${tag.title}`}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          bgcolor: alpha('#fff', 0.15),
                          backdropFilter: 'blur(10px)',
                          color: 'white',
                          border: '1px solid',
                          borderColor: alpha('#fff', 0.2),
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                          '&:hover': {
                            bgcolor: alpha('#fff', 0.25)
                          }
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default NewsEntry; 