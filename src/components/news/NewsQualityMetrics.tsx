import React from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Stack,
  Card,
  CardContent
} from '@mui/material';
import { QualityMetrics as QualityMetricsType } from '../../APIs/NewsAPI';
import { camelCaseToTitleCase } from '../../utils/stringUtils';

interface NewsQualityMetricsProps {
  metrics: QualityMetricsType | null;
}

const NewsQualityMetrics: React.FC<NewsQualityMetricsProps> = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <Card sx={{         
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 2,
      width: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quality Metrics
        </Typography>
        <Stack spacing={2}>
          {metrics && Object.entries(metrics).map(([key, value]) => {
            if (key === 'id') return null;
            return (
              <Box key={key}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {camelCaseToTitleCase(key)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {value}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Number(value) * 10}
                  sx={{ 
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NewsQualityMetrics; 