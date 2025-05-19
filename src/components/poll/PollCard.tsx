import React from 'react';
import { Card, CardContent, CardActions, Typography, LinearProgress, Button, Box, Chip, Avatar } from '@mui/material';
import { Poll } from '@/APIs/PollAPI';
import { formatDistanceToNow } from 'date-fns';

interface PollCardProps {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void;
  userVote?: string;
  showResults?: boolean;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onVote, userVote, showResults = false }) => {
  const totalVotes = poll.statistics.totalVotes;

  return (
    <Card sx={{ 
      maxWidth: '100%', 
      mb: 2,
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease'
      }
    }}>
      <CardContent>
        {/* Poll Creator Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 1 }}>
            {poll.creator?.displayName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">{poll.creator?.displayName}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>

        {/* Poll Title and Description */}
        <Typography variant="h6" gutterBottom>
          {poll.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {poll.description}
        </Typography>

        {/* Poll Options */}
        <Box sx={{ mt: 2 }}>
          {poll.options.map((option) => {
            const voteCount = option.voteCount || 0;
            const votePercentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            
            return (
              <Box
                key={option.id}
                sx={{
                  mb: 1,
                  position: 'relative',
                  cursor: showResults ? 'default' : 'pointer',
                  '&:hover': !showResults && {
                    bgcolor: 'action.hover',
                    borderRadius: 1
                  }
                }}
                onClick={() => !showResults && onVote?.(poll.id.toString(), option.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {option.text}
                  </Typography>
                  {showResults && (
                    <Typography variant="caption" sx={{ ml: 2 }}>
                      {votePercentage.toFixed(1)}%
                    </Typography>
                  )}
                </Box>
                {showResults && (
                  <LinearProgress
                    variant="determinate"
                    value={votePercentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.100',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: userVote === option.id ? 'primary.main' : 'grey.300'
                      }
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Total Votes */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          {totalVotes} votes • {poll.channel.name}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          {poll.isTrending && (
            <Chip 
              label="Trending" 
              color="primary"
              size="small" 
              sx={{ mr: 1 }}
            />
          )}
          {poll.tags.map(tag => (
            <Chip 
              key={tag.id}
              label={tag.name} 
              size="small" 
              sx={{ mr: 1 }}
            />
          ))}
        </Box>
        {!showResults && (
          <Button 
            size="small" 
            color="primary"
            onClick={() => onVote?.(poll.id.toString(), '')}
          >
            View Results
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default PollCard; 