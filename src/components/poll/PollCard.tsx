import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import { Poll } from '@/types/index';
import { formatDistanceToNow } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { POLL_MEDIA_FORMAT } from '@/enums/PollEnums';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';

interface PollCardProps {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void;
  onViewResults?: (pollId: string) => void;
  userVote?: string;
  showResults?: boolean;
  disabled?: boolean;
  showAsPreview?: boolean;
  mode?: 'grid' | 'scroll';
}

const PollCard: React.FC<PollCardProps> = ({ poll, onVote, userVote, showResults = false, disabled = false, showAsPreview = false, mode = 'scroll' }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const totalVotes = poll.stats?.totalVotes || 0;

  // Get first media item for background
  const mainMedia = poll.media && poll.media.length > 0 ? poll.media[0] : null;

  const handleOptionHover = (optionId: string | null) => {
    if (!disabled) {
      setHoveredOption(optionId);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if in preview mode and not clicking on interactive elements
    if (showAsPreview && !(e.target as HTMLElement).closest('.poll-option, .action-button')) {
      navigate(PATHS.APP_POLL_VIEW.replace(':id', String(poll.id)));
    }
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
        transition: 'opacity 0.2s ease',
        cursor: showAsPreview ? 'pointer' : 'default',
        '&:hover': {
          opacity: showAsPreview ? 0.95 : 1
        }
      }}
    >
      {/* Background Media */}
      {mainMedia && (
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
          {mainMedia.format === POLL_MEDIA_FORMAT.VIDEO ? (
            <Box
              component="video"
              src={mainMedia.url}
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
              src={mainMedia.url}
              alt={mainMedia.caption || poll.title}
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
              height: '60%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
              zIndex: 1
            }}
          />
        </Box>
      )}

      {/* No media fallback gradient */}
      {!mainMedia && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
            zIndex: 0
          }}
        />
      )}

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
        {/* Top Section - Creator Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              {poll.creator?.displayName?.charAt(0).toUpperCase()}
            </Avatar>
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
                {poll.creator?.displayName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.9)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}
              >
                {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>

          {/* Tags and Status */}
          <Stack direction="row" spacing={0.5}>
            {poll.isTrending && (
              <Chip
                icon={<TrendingUpIcon sx={{ fontSize: '0.875rem' }} />}
                label="Trending"
                size="small"
                sx={{
                  height: 24,
                  bgcolor: alpha(theme.palette.error.main, 0.9),
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Bottom Section - Poll Content */}
        <Box>
          {/* Poll Question - Always visible, no description */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                fontSize: '1.5rem',
                color: 'white',
                textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                lineHeight: 1.2
              }}
            >
              {poll.title}
            </Typography>
          </Box>

          {/* Poll Options */}
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            {poll.options.map((option) => {
              const voteCount = option.voteCount || 0;
              const votePercentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
              const isSelected = userVote === option.id;
              const isHovered = hoveredOption === option.id;

              return (
                <Box
                  key={option.id}
                  className="poll-option"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!showResults && !disabled && onVote) {
                      onVote(String(poll.id), option.id);
                    }
                  }}
                  onMouseEnter={() => handleOptionHover(option.id)}
                  onMouseLeave={() => handleOptionHover(null)}
                  sx={{
                    position: 'relative',
                    cursor: (showResults || disabled) ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                    opacity: disabled ? 0.6 : 1
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      backdropFilter: 'blur(20px)',
                      bgcolor: isSelected
                        ? alpha(theme.palette.primary.main, 0.85)
                        : isHovered
                          ? alpha('#fff', 0.25)
                          : alpha('#fff', 0.15),
                      border: '1px solid',
                      borderColor: isSelected
                        ? alpha(theme.palette.primary.light, 0.5)
                        : alpha('#fff', 0.3),
                      boxShadow: isSelected
                        ? '0 4px 20px rgba(0,0,0,0.4)'
                        : '0 2px 10px rgba(0,0,0,0.2)',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Vote percentage background bar */}
                    {showResults && (
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${votePercentage}%`,
                          bgcolor: alpha(theme.palette.primary.main, 0.4),
                          transition: 'width 0.5s ease',
                          zIndex: 0
                        }}
                      />
                    )}

                    {/* Radio button indicator */}
                    <Box
                      sx={{
                        position: 'relative',
                        zIndex: 1,
                        width: 20,
                        height: 20,
                        minWidth: 20,
                        minHeight: 20,
                        flexShrink: 0,
                        borderRadius: '50%',
                        border: '2px solid white',
                        mr: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isSelected ? 'white' : 'transparent',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }}
                    >
                      {isSelected && (
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: theme.palette.primary.main
                          }}
                        />
                      )}
                    </Box>

                    {/* Option Text */}
                    <Typography
                      variant="body1"
                      sx={{
                        position: 'relative',
                        zIndex: 1,
                        flex: 1,
                        fontWeight: isSelected ? 700 : 600,
                        fontSize: '1rem',
                        color: 'white',
                        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                        wordBreak: 'break-word'
                      }}
                    >
                      {option.text}
                    </Typography>

                    {/* Vote percentage display */}
                    {showResults && (
                      <Typography
                        variant="body2"
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: 'white',
                          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                          flexShrink: 0,
                          ml: 1
                        }}
                      >
                        {votePercentage.toFixed(0)}%
                      </Typography>
                    )}

                    {isSelected && !showResults && (
                      <CheckCircleIcon
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          ml: 1,
                          color: 'white',
                          fontSize: '1.25rem',
                          flexShrink: 0,
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                        }}
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>

          {/* Tags */}
          {poll.tags && poll.tags.length > 0 && (
            <Stack direction="row" spacing={0.5} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
              {poll.tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag.id}
                  label={`#${tag.name}`}
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
    </Box>
  );
};

export default PollCard; 