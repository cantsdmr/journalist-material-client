import React, { useState } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  alpha,
  useTheme,
  Stack
} from '@mui/material';
import { Poll } from '@/types/index';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface PollDetailProps {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void;
  userVote?: string | null;
  showResults?: boolean;
  disabled?: boolean;
}

const PollDetail: React.FC<PollDetailProps> = ({
  poll,
  onVote,
  userVote,
  showResults = false,
  disabled = false
}) => {
  const theme = useTheme();
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const totalVotes = poll.stats?.totalVotes || 0;

  const handleOptionHover = (optionId: string | null) => {
    if (!disabled) {
      setHoveredOption(optionId);
    }
  };

  return (
    <Box>
      {/* Poll Options */}
      <Stack spacing={2} sx={{ mb: 2 }}>
        {poll.options.map((option) => {
          const voteCount = option.voteCount || 0;
          const votePercentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
          const isSelected = userVote === option.id;
          const isHovered = hoveredOption === option.id;

          return (
            <Box
              key={option.id}
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
                transform: isHovered ? 'translateX(4px)' : 'none',
                opacity: disabled ? 0.6 : 1
              }}
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
                  minWidth: 24,
                  minHeight: 24,
                  flexShrink: 0,
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
                    flex: 1,
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? 'primary.main' : 'text.primary',
                    wordBreak: 'break-word'
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
                    justifyContent: 'flex-end',
                    flexShrink: 0
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
                      fontSize: '1.2rem',
                      flexShrink: 0
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
      </Stack>
    </Box>
  );
};

export default PollDetail;
