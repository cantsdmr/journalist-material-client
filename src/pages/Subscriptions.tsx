import React from 'react';
import { Container, Typography, TextField, Box, Button, Grid, Avatar, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const suggestedCreators = [
  {
    name: 'Ozkan Aksular',
    description: 'creating Youtube Videos',
    posts: 33,
    avatar: 'https://via.placeholder.com/150',
  },
  {
    name: 'Aynur Portre Art',
    description: 'Benimle Gerçekçi Çizim Hakkında her Şeyi Öğreneceksiniz',
    posts: 18,
    avatar: 'https://via.placeholder.com/150',
  },
  {
    name: 'Anatolian Rock Revival Project',
    description: 'creating Cultural Heritage Program',
    members: 136,
    avatar: 'https://via.placeholder.com/150',
  },
  {
    name: 'Radyo Karavan',
    description: 'Radio channel',
    posts: 10,
    avatar: 'https://via.placeholder.com/150',
  },
  {
    name: 'Serbestiyet',
    description: 'Independent Journalism',
    posts: 22,
    avatar: 'https://via.placeholder.com/150',
  },
];

const Subscriptions: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Find Channels
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search creators"
          fullWidth
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
        {['Art', 'Podcast', 'Music', 'Games', 'Writing', 'Photography', 'Video'].map((label) => (
          <Chip key={label} label={label} variant="outlined" />
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Creators You Subscribed
        </Typography>
        <Button variant="text">Manage</Button>
      </Box>
      <Grid container spacing={2}>
        {suggestedCreators.map((creator, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
              <Avatar src={creator.avatar} sx={{ width: 100, height: 100, mb: 2 }} />
              <Typography variant="h6" component="div">{creator.name}</Typography>
              <Typography variant="body2" color="textSecondary">{creator.description}</Typography>
              <Typography variant="body2" color="textSecondary">{creator.posts ? `${creator.posts} posts` : `${creator.members} members`}</Typography>
              <Button variant="contained" sx={{ mt: 2 }}>Details</Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Subscriptions;
