import React from 'react';
import { Box, Stack, Skeleton, Container } from '@mui/material';

const ChannelFormSkeleton: React.FC = () => {
  return (
    <Container sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Skeleton 
        variant="text" 
        width={200} 
        height={32} 
        sx={{ mb: 3 }} 
      />
      
      <Stack spacing={4}>
        <Stack spacing={3}>
          {/* Avatar Skeleton */}
          <Box>
            <Skeleton 
              variant="text" 
              width={120} 
              sx={{ mb: 1 }} 
            />
            <Skeleton 
              variant="rectangular" 
              height={200} 
              sx={{ borderRadius: 1 }} 
            />
          </Box>

          {/* Banner Skeleton */}
          <Box>
            <Skeleton 
              variant="text" 
              width={120} 
              sx={{ mb: 1 }} 
            />
            <Skeleton 
              variant="rectangular" 
              height={200} 
              sx={{ borderRadius: 1 }} 
            />
          </Box>

          {/* Name Field */}
          <Skeleton 
            variant="rectangular" 
            height={56} 
            sx={{ borderRadius: 1 }} 
          />

          {/* Description Field */}
          <Skeleton 
            variant="rectangular" 
            height={128} 
            sx={{ borderRadius: 1 }} 
          />

          {/* Type Select */}
          <Skeleton 
            variant="rectangular" 
            height={56} 
            sx={{ borderRadius: 1 }} 
          />

          {/* Status Select */}
          <Skeleton 
            variant="rectangular" 
            height={56} 
            sx={{ borderRadius: 1 }} 
          />
        </Stack>

        {/* Submit Button */}
        <Skeleton 
          variant="rectangular" 
          height={48} 
          width={200} 
          sx={{ 
            borderRadius: 1,
            alignSelf: 'flex-start' 
          }} 
        />
      </Stack>
    </Container>
  );
};

export default ChannelFormSkeleton; 