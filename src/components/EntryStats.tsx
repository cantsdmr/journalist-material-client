import React from 'react';
import { Box, IconButton, Typography, Rating } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Video } from '../constants/videos';

interface EntryStatsProps {
  video: Video;
}

const EntryStats: React.FC<EntryStatsProps> = ({ video }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
      <IconButton aria-label="like">
        <FavoriteIcon />
      </IconButton>
      <Typography variant="body2" sx={{ mr: 2 }}>
        19
      </Typography>
      <IconButton aria-label="share">
        <ShareIcon />
      </IconButton>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Ethic Value:
        </Typography>
        <Rating name="ethic-value" value={video.ethicValue} precision={0.5} readOnly />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Fund:
        </Typography>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
          <AttachMoneyIcon sx={{ fontSize: 'inherit' }} />
          {video.fund}
        </Typography>
      </Box>
    </Box>
  );
};

export default EntryStats;
