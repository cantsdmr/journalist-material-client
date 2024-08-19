import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Chip, Grid, IconButton, Link } from '@mui/material';
import EntryStats from './EntryStats';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import TwitchIcon from '@mui/icons-material/Interests';
import LanguageIcon from '@mui/icons-material/Language';
import { Link as RouterLink } from 'react-router-dom';
import { News } from '../APIs/NewsAPI';

interface EntryProps {
  news: News;
}

const Entry: React.FC<EntryProps> = ({ news }) => {
  return (
    <Grid item xs={12}>
      <Card sx={{ display: 'flex', alignItems: 'flex-start', p: 2 }}>
        <Avatar
          variant="square"
          src={news.image_url}
          alt={news.title}
          sx={{ width: 150, height: 150, mr: 2 }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              {news.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
              {news.description}
            </Typography>
            <Link component={RouterLink} to={`/app/entry/${news.id}`} sx={{ mt: 1, display: 'block' }}>
              View Details
            </Link>
            {/* <Box sx={{ mt: 2 }}>
              {news.tags.map((tag, index) => (
                <Chip key={index} label={tag} variant="outlined" sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box> */}
            <EntryStats news={news} />
          </CardContent>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
          <IconButton aria-label="YouTube">
            <YouTubeIcon />
          </IconButton>
          <IconButton aria-label="Twitter">
            <XIcon />
          </IconButton>
          <IconButton aria-label="Twitch">
            <TwitchIcon />
          </IconButton>
          <IconButton aria-label="Web">
            <LanguageIcon />
          </IconButton>
        </Box>
      </Card>
    </Grid>
  );
};

export default Entry;