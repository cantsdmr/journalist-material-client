import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  LinearProgress,
  Box,
  Chip,
  Avatar,
  IconButton,
  Stack,
  Tooltip,
  alpha,
  useTheme
} from '@mui/material';
import { Poll } from '@/types/index';
import { formatDistanceToNow } from 'date-fns';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { POLL_MEDIA_FORMAT } from '@/enums/PollEnums';
import { FundingButton } from '@/components/funding';
import { useApiContext } from '@/contexts/ApiContext';

interface PollCardProps {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void;
  onViewResults?: (pollId: string) => void;
  userVote?: string;
  showResults?: boolean;
  disabled?: boolean;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onVote, userVote, showResults = false, disabled = false }) => {
  const theme = useTheme();
  const { api } = useApiContext();
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const totalVotes = poll.stats?.totalVotes || 0;
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
        const fund = await api.fundingApi.getFund('poll', poll.id.toString());
        if (fund) {
          const summary = await api.fundingApi.getFundSummary('poll', poll.id.toString());
          setFundingData({
            currentAmount: fund.currentAmount / 100, // Convert from cents
            goalAmount: fund.goalAmount ? fund.goalAmount / 100 : undefined,
            contributorCount: summary?.totalContributors || 0,
            currency: fund.currency
          });
        }
      } catch (error) {
        // Fund doesn't exist yet - use default values
        console.debug('No funding data for poll:', poll.id);
      }
    };

    loadFundingData();
  }, [poll.id, api.fundingApi]);

  const handleOptionHover = (optionId: string | null) => {
    if (!disabled) {
      setHoveredOption(optionId);
    }
  };

  const handleFundingSuccess = () => {
    // Reload funding data after successful contribution
    const loadFundingData = async () => {
      try {
        const fund = await api.fundingApi.getFund('poll', poll.id.toString());
        if (fund) {
          const summary = await api.fundingApi.getFundSummary('poll', poll.id.toString());
          setFundingData({
            currentAmount: fund.currentAmount / 100,
            goalAmount: fund.goalAmount ? fund.goalAmount / 100 : undefined,
            contributorCount: summary?.totalContributors || 0,
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
    <Card sx={{
      maxWidth: '100%',
      borderRadius: 1.5,
      boxShadow: 'none',
      border: '1px solid',
      borderColor: 'divider',
      '&:hover': {
        boxShadow: 1,
        transition: 'box-shadow 0.2s ease'
      }
    }}>
      <CardContent sx={{ p: 1.5 }}>
        {/* Poll Creator Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Avatar
            sx={{
              mr: 1,
              bgcolor: theme.palette.primary.main,
              width: 28,
              height: 28,
              fontSize: '0.875rem'
            }}
          >
            {poll.creator?.displayName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
              {poll.creator?.displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>

        {/* Poll Title and Description */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
          {poll.title}
        </Typography>
        {poll.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
            sx={{
              mb: 1.5,
              lineHeight: 1.4,
              fontSize: '0.8rem'
            }}
          >
            {poll.description}
          </Typography>
        )}

        {/* Poll Media */}
        {poll.media && poll.media.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {poll.media.map((media) => (
              <Box
                key={media.id}
                sx={{
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  mb: 1.5
                }}
              >
                {media.format === POLL_MEDIA_FORMAT.VIDEO ? (
                  <Box
                    component="video"
                    src={media.url}
                    controls
                    preload="metadata"
                    sx={{
                      width: '100%',
                      height: 180,
                      objectFit: 'cover',
                      objectPosition: 'center',
                      bgcolor: 'black'
                    }}
                  />
                ) : (
                  <Box
                    component="img"
                    src={media.url}
                    alt={media.caption || poll.title}
                    sx={{
                      width: '100%',
                      height: 180,
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                )}
                {media.caption && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      fontSize: '0.75rem'
                    }}
                  >
                    {media.caption}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Poll Options */}
        <Box sx={{ mt: 2, mb: 2 }}>
          {poll.options.map((option) => {
            const voteCount = option.voteCount || 0;
            const votePercentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            const isSelected = userVote === option.id;
            const isHovered = hoveredOption === option.id;

            return (
              <Box
                key={option.id}
                sx={{
                  mb: 2,
                  position: 'relative',
                  cursor: (showResults || disabled) ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isHovered ? 'translateX(4px)' : 'none',
                  opacity: disabled ? 0.6 : 1,
                  '&:hover': (!showResults && !disabled) && {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 1
                  }
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!showResults && !disabled) {
                    onVote?.(poll.id.toString(), option.id);
                  }
                }}
                onMouseEnter={() => handleOptionHover(option.id)}
                onMouseLeave={() => handleOptionHover(null)}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 0.5,
                  px: 2,
                  py: 1.5,
                  border: '1px solid',
                  borderColor: isSelected
                    ? 'primary.main'
                    : isHovered
                      ? alpha(theme.palette.primary.main, 0.5)
                      : 'divider',
                  borderRadius: 1,
                  bgcolor: isSelected
                    ? alpha(theme.palette.primary.main, 0.05)
                    : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': (!showResults && !disabled) && {
                    borderColor: 'primary.main',
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`
                  }
                }}>
                  <Box sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: isSelected
                      ? 'primary.main'
                      : isHovered
                        ? alpha(theme.palette.primary.main, 0.5)
                        : 'divider',
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}>
                    {isSelected && (
                      <Box sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: 'primary.main'
                      }} />
                    )}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      flexGrow: 1,
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? 'primary.main' : 'text.primary'
                    }}
                  >
                    {option.text}
                  </Typography>
                  {showResults && (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      ml: 2,
                      minWidth: 80,
                      justifyContent: 'flex-end'
                    }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: isSelected ? 'primary.main' : 'text.secondary',
                          mr: 1
                        }}
                      >
                        {votePercentage.toFixed(1)}%
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        ({voteCount})
                      </Typography>
                    </Box>
                  )}
                  {isSelected && !showResults && (
                    <CheckCircleIcon
                      sx={{
                        ml: 1,
                        color: 'primary.main',
                        fontSize: '1.2rem'
                      }}
                    />
                  )}
                </Box>
                {showResults && (
                  <LinearProgress
                    variant="determinate"
                    value={votePercentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: isSelected ? 'primary.main' : alpha(theme.palette.primary.main, 0.6)
                      }
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Poll Stats and Tags */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Total Votes">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ThumbUpIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {totalVotes}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Views">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CommentIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {poll.stats?.viewCount || 0}
                </Typography>
              </Box>
            </Tooltip>
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {poll.isTrending && (
              <Chip
                label="Trending"
                color="primary"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            )}
            {poll.tags.slice(0, 2).map(tag => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            ))}
          </Stack>
        </Box>
      </CardContent>

      <CardActions sx={{
        justifyContent: 'space-between',
        px: 2.5,
        py: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Box onClick={(e) => e.stopPropagation()}>
            <FundingButton
              contentType="poll"
              contentId={poll.id.toString()}
              contentTitle={poll.title}
              fundingData={fundingData}
              onContributionSuccess={handleFundingSuccess}
              variant="icon"
              icon="heart"
              size="small"
            />
          </Box>
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default PollCard; 