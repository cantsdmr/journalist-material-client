import React from 'react';
import { Box } from '@mui/material';
import PollsList from '@/components/poll/PollsList';

const ListPoll: React.FC = () => {
  return (
    <Box sx={{
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 64,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 0,
      padding: 0,
      zIndex: 1
    }}>
      {/* Polls List in Scroll Mode */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <PollsList
          filters={{}}
          emptyTitle="No polls found"
          emptyDescription="There are no polls available at the moment."
          mode="scroll"
        />
      </Box>
    </Box>
  );
};

export default ListPoll; 