import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import ImageUpload from '../ImageUpload';
import VideoUpload from '../VideoUpload';
import { NEWS_MEDIA_FORMAT } from '@/enums/NewsEnums';
import { POLL_MEDIA_FORMAT } from '@/enums/PollEnums';

interface MediaItem {
  id: string;
  url: string;
  type: number;
  format: number;
  caption?: string;
}

interface MediaUploadProps {
  value: MediaItem | null;
  onChange: (media: MediaItem | null) => void;
  mediaTypeId: number;
  title?: string;
  description?: string;
  useNewsFormats?: boolean; // Flag to determine which enum to use
}

const MediaUpload: React.FC<MediaUploadProps> = ({ 
  value, 
  onChange, 
  mediaTypeId,
  title = "Media",
  description = "Upload an image or video",
  useNewsFormats = true
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const IMAGE_FORMAT = useNewsFormats ? NEWS_MEDIA_FORMAT.IMAGE : POLL_MEDIA_FORMAT.IMAGE;
  const VIDEO_FORMAT = useNewsFormats ? NEWS_MEDIA_FORMAT.VIDEO : POLL_MEDIA_FORMAT.VIDEO;

  const handleImageChange = (url: string | null) => {
    if (url) {
      onChange({
        id: '0',
        url,
        type: mediaTypeId,
        format: IMAGE_FORMAT
      });
    } else {
      onChange(null);
    }
  };

  const handleVideoChange = (url: string | null) => {
    if (url) {
      onChange({
        id: '0',
        url,
        type: mediaTypeId,
        format: VIDEO_FORMAT
      });
    } else {
      onChange(null);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Clear current media when switching tabs
    if (value) {
      onChange(null);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Image" />
          <Tab label="Video" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <ImageUpload
          label="Upload Image"
          value={value?.format === IMAGE_FORMAT ? value.url : null}
          onChange={handleImageChange}
        />
      )}

      {activeTab === 1 && (
        <VideoUpload
          label="Upload Video"
          value={value?.format === VIDEO_FORMAT ? value.url : null}
          onChange={handleVideoChange}
        />
      )}
    </Box>
  );
};

export default MediaUpload;