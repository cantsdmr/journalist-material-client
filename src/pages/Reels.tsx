import React from 'react';
import { Container, Grid, Box, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { allVideos, Video } from '../constants/videos';

const Reels: React.FC = () => {
  const reels = allVideos.slice(0, 20); // Get 20 entries

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reels
      </Typography>
      <Grid container spacing={6} direction="column">
        {reels.map((video) => (
          <Grid item xs={12} key={video.id}>
            <Card sx={{ position: 'relative', height: '100%' }}>
              <CardMedia
                component="img"
                image={video.thumbnail}
                alt={video.title}
                sx={{ height: '100%', width: '100%' }} // Full height and width
              />
              <CardContent sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <Typography variant="h6">{video.title}</Typography>
              </CardContent>
                </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Reels;
