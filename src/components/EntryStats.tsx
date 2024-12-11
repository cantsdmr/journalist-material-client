import React from 'react';
import { Box, IconButton, Typography, Rating } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { News } from '@APIs/NewsAPI';

interface EntryStatsProps {
  news: News;
}

const EntryStats: React.FC<EntryStatsProps> = ({ news }) => {
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
        {/* <Rating name="ethic-value" value={news.ethicValue} precision={0.5} readOnly /> */}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Fund:
        </Typography>
        {/* <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
          <AttachMoneyIcon sx={{ fontSize: 'inherit' }} />
          {news.fund}
        </Typography> */}
      </Box>
    </Box>
  );
};

export default EntryStats;
