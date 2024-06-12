import React from 'react';
import { Container, Box, Typography, Avatar, Button, Grid, Card, CardContent, Switch, Tabs, Tab } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitchIcon from '@mui/icons-material/Interests';
import { Link } from 'react-router-dom';

const membershipPlans = [
  {
    title: 'Karınca Kararınca',
    price: '$5',
    period: '/month',
    description: 'plus VAT',
    features: ['Patron-only updates', 'Chat community'],
  },
  {
    title: 'Gündemden Detaylar',
    price: '$20',
    period: '/month',
    description: 'plus VAT',
    features: ['Early access', 'Patron-only updates', 'Chat community'],
  },
  {
    title: 'Dünyada Neler Oluyor',
    price: '$50',
    period: '/month',
    description: 'plus VAT',
    features: ['Livestreams', 'Patron-only updates', 'Chat community', 'Early access'],
  },
];

const DivisionProfile: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [payAnnually, setPayAnnually] = React.useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPayAnnually(event.target.checked);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar src="https://via.placeholder.com/100" sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
        <Typography variant="h4" gutterBottom>Nevşin Mengü</Typography>
        <Typography variant="subtitle1" color="textSecondary">creating News</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>24 posts</Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>Become a member</Button>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button component={Link} to="#" variant="outlined" color="primary" startIcon={<YouTubeIcon />} sx={{ mx: 1 }}>
            YouTube
          </Button>
          <Button component={Link} to="#" variant="outlined" color="primary" startIcon={<TwitchIcon />} sx={{ mx: 1 }}>
            Twitch
          </Button>
          <Button component={Link} to="#" variant="outlined" color="primary" startIcon={<FacebookIcon />} sx={{ mx: 1 }}>
            Facebook
          </Button>
          <Button component={Link} to="#" variant="outlined" color="primary" startIcon={<TwitterIcon />} sx={{ mx: 1 }}>
            Twitter
          </Button>
        </Box>
      </Box>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Home" />
        <Tab label="About" />
      </Tabs>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" gutterBottom>Choose your membership</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
          <Typography variant="body2" sx={{ mr: 2 }}>Pay annually (Save 10%)</Typography>
          <Switch checked={payAnnually} onChange={handleToggleChange} />
        </Box>
      </Box>
      <Grid container spacing={2} justifyContent="center">
        {membershipPlans.map((plan, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{plan.title}</Typography>
                <Typography variant="h4" color="primary" gutterBottom>{plan.price}<Typography variant="body2" component="span">{plan.period}</Typography></Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>{plan.description}</Typography>
                <Button variant="contained" color="primary" sx={{ mb: 2 }}>Join</Button>
                <Typography variant="body2" color="textSecondary" gutterBottom>What's included</Typography>
                <Box>
                  {plan.features.map((feature, index) => (
                    <Typography key={index} variant="body2" color="textSecondary">{feature}</Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DivisionProfile;
