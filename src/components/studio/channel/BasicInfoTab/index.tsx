import React from 'react';
import { Box } from '@mui/material';
import ChannelForm from '@/components/studio/channel/ChannelForm';
import { EditChannelData, CreateChannelData, Channel } from '@/APIs/ChannelAPI';

interface BasicInfoTabProps {
    channel: Channel;
    onUpdate: (data: EditChannelData) => Promise<void>;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ channel, onUpdate }) => {
  const handleSubmit = async (data: EditChannelData | CreateChannelData | null | undefined) => {
    if (!data || !('name' in data)) return;
    await onUpdate(data as EditChannelData);
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <ChannelForm 
        initialData={channel}
        onSubmit={handleSubmit}
        submitButtonText="Save"
      />
    </Box>
  );
}; 