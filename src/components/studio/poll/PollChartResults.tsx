import React from 'react';
import { Box, LinearProgress, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface PollChartResultsProps {
  poll: any;
}

const PollChartResults: React.FC<PollChartResultsProps> = ({ poll }) => {
  const theme = useTheme();
  const totalVotes = poll.statistics.totalVotes;

  return (
    <Box>
      {poll.options.map((option: any) => {
        const percentage = totalVotes > 0 
          ? (option.votes / totalVotes) * 100 
          : 0;

        return (
          <Box key={option.id} sx={{ mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mb: 0.5
            }}>
              <Typography variant="body1">
                {option.text}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.votes} votes ({percentage.toFixed(1)}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 8,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 1,
                  bgcolor: theme.palette.primary.main
                }
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default PollChartResults; 