import React from 'react';
import { 
  Box, Typography, Grid,
  Card, CardContent, Button 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { PATHS } from '@/constants/paths';

const Studio: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Creator Studio Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NewspaperIcon sx={{ mr: 1 }} />
                <Typography variant="h6">News Overview</Typography>
              </Box>
              <Typography variant="h4">150</Typography>
              <Typography color="text.secondary">Total Articles</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RssFeedIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Channels</Typography>
              </Box>
              <Typography variant="h4">5</Typography>
              <Typography color="text.secondary">Active Channels</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AnalyticsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Views</Typography>
              </Box>
              <Typography variant="h4">10.5K</Typography>
              <Typography color="text.secondary">Last 30 days</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Payouts</Typography>
              </Box>
              <Typography variant="h4">$2.4K</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Total earned
              </Typography>
              <Button 
                variant="contained" 
                size="small"
                onClick={() => navigate(PATHS.STUDIO_EXPENSE_ORDERS)}
                sx={{ mt: 1 }}
              >
                Manage Payouts
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Studio; 