import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import { ChannelTier } from '@/APIs/ChannelAPI';

interface TierCardProps {
  tier: ChannelTier;
  onClick?: () => void;
}

const TierCard: React.FC<TierCardProps> = ({ tier, onClick }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          boxShadow: (theme) => theme.shadows[4]
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {tier.name}
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              ${tier.price}
              <Typography component="span" variant="body2" color="text.secondary">
                /month
              </Typography>
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {tier.description}
          </Typography>

          {/* <Box>
            <Typography variant="subtitle2" gutterBottom>
              Benefits:
            </Typography>
            <Stack spacing={1}>
              {tier.tierBenefits.slice(0, 3).map((benefit, index) => (
                <Typography key={index} variant="body2">
                  • {benefit}
                </Typography>
              ))}
              {tier.tierBenefits.length > 3 && (
                <Typography variant="body2" color="text.secondary">
                  +{tier.tierBenefits.length - 3} more benefits
                </Typography>
              )}
            </Stack>
          </Box> */}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TierCard; 