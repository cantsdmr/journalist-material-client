import React from 'react';
import { 
  IconButton, 
  Typography, 
  Stack,
  Tooltip,
  Paper
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import { News } from '@/types/index';

interface NewsEntryStatsProps {
  news: News;
  onLike?: () => void;
  onShare?: () => void;
}

const NewsEntryStats: React.FC<NewsEntryStatsProps> = ({ 
  news,
  onLike,
  onShare 
}) => {
  const score = news.qualityMetrics?.overallQualityScore;

  return (
    <Stack 
      direction="row" 
      spacing={2} 
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="row" spacing={1}>
        <IconButton 
          size="small"
          onClick={onLike}
          sx={{ 
            color: 'error.light',
            '&:hover': { bgcolor: 'error.lighter' }
          }}
        >
          <FavoriteIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small"
          onClick={onShare}
          sx={{ 
            color: 'primary.light',
            '&:hover': { bgcolor: 'primary.lighter' }
          }}
        >
          <ShareIcon fontSize="small" />
        </IconButton>
      </Stack>

      {score && (
        <Tooltip title="Quality Score">
          <Paper
            elevation={0}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              bgcolor: 'success.lighter',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              gap: 0.5
            }}
          >
            <StarIcon 
              sx={{ 
                color: 'success.main',
                fontSize: '1rem'
              }} 
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'success.dark',
                fontWeight: 'medium'
              }}
            >
              {score.toFixed(1)}
            </Typography>
          </Paper>
        </Tooltip>
      )}
    </Stack>
  );
};

export default NewsEntryStats;
