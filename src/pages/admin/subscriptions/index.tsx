import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box
} from '@mui/material';
import {
  Subscriptions as SubscriptionsIcon,
  ManageAccounts as ManageIcon,
  Analytics as AnalyticsIcon,
  AttachMoney as RevenueIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';

const SubscriptionIndex: React.FC = () => {
  const navigate = useNavigate();

  const subscriptionSections = [
    {
      title: 'Subscription Management',
      description: 'Manage all platform subscriptions, view details, and perform bulk operations',
      icon: <ManageIcon sx={{ fontSize: 48 }} />,
      path: PATHS.ADMIN_SUBSCRIPTION_MANAGEMENT,
      color: '#1976d2'
    },
    {
      title: 'Analytics & Insights',
      description: 'View subscription trends, churn rates, and detailed analytics',
      icon: <AnalyticsIcon sx={{ fontSize: 48 }} />,
      path: PATHS.ADMIN_SUBSCRIPTION_ANALYTICS,
      color: '#7b1fa2'
    },
    {
      title: 'Revenue Tracking',
      description: 'Monitor revenue metrics, payment processing, and financial reports',
      icon: <RevenueIcon sx={{ fontSize: 48 }} />,
      path: PATHS.ADMIN_SUBSCRIPTION_REVENUE,
      color: '#388e3c'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <SubscriptionsIcon sx={{ fontSize: 32, mr: 2 }} />
        <Typography variant="h4" component="h1">
          Subscription Management
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive subscription management tools for monitoring, analyzing, and managing 
        all platform subscriptions and revenue streams.
      </Typography>

      <Grid container spacing={3}>
        {subscriptionSections.map((section) => (
          <Grid item xs={12} md={4} key={section.title}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                <Box sx={{ color: section.color, mb: 2 }}>
                  {section.icon}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {section.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate(section.path)}
                  sx={{ 
                    backgroundColor: section.color,
                    '&:hover': {
                      backgroundColor: section.color,
                      filter: 'brightness(0.9)'
                    }
                  }}
                >
                  Open
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SubscriptionIndex; 