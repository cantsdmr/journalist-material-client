import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Flag as GoalIcon
} from '@mui/icons-material';

interface FundingProgressProps {
  currentAmount: number;
  goalAmount?: number;
  contributorCount: number;
  currency: string;
  showDetailed?: boolean;
}

const FundingProgress: React.FC<FundingProgressProps> = ({
  currentAmount,
  goalAmount,
  contributorCount,
  currency,
  showDetailed = true
}) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const progressPercentage = goalAmount 
    ? Math.min((currentAmount / goalAmount) * 100, 100)
    : 0;

  const remainingAmount = goalAmount ? Math.max(goalAmount - currentAmount, 0) : 0;

  if (!showDetailed) {
    return (
      <Box>
        {goalAmount && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Funded: {formatAmount(currentAmount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Goal: {formatAmount(goalAmount)}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                }
              }}
            />
          </>
        )}
        {!goalAmount && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoneyIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight="medium">
              {formatAmount(currentAmount)} raised
            </Typography>
            <PeopleIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {contributorCount} supporters
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Card variant="outlined" sx={{ backgroundColor: 'background.paper' }}>
      <CardContent>
        <Grid container spacing={3}>
          {/* Current Amount */}
          <Grid item xs={12} sm={goalAmount ? 4 : 6}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <MoneyIcon color="primary" fontSize="large" />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {formatAmount(currentAmount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Raised so far
              </Typography>
            </Box>
          </Grid>

          {/* Goal Amount */}
          {goalAmount && (
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <GoalIcon color="action" fontSize="large" />
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {formatAmount(goalAmount)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Funding goal
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Contributors */}
          <Grid item xs={12} sm={goalAmount ? 4 : 6}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <PeopleIcon color="action" fontSize="large" />
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {contributorCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {contributorCount === 1 ? 'Supporter' : 'Supporters'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Progress Bar and Additional Info */}
        {goalAmount && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                Progress: {progressPercentage.toFixed(1)}%
              </Typography>
              {remainingAmount > 0 && (
                <Typography variant="body2" color="text.secondary">
                  {formatAmount(remainingAmount)} to go
                </Typography>
              )}
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage}
              sx={{ 
                height: 12, 
                borderRadius: 6,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 6,
                  background: progressPercentage >= 100 
                    ? 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)'
                    : 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)'
                }
              }}
            />

            {progressPercentage >= 100 && (
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: 'success.light', 
                borderRadius: 1,
                textAlign: 'center'
              }}>
                <Typography variant="body2" fontWeight="medium" color="success.dark">
                  🎉 Funding goal reached! Thank you to all supporters!
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FundingProgress;