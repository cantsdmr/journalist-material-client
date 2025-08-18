import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import DeleteIcon from '@mui/icons-material/Delete';

interface VideoUploadProps {
  label: Nullable<string>;
  value: Nullable<string>;
  onChange: (url: Nullable<string>) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ label, value, onChange }) => {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 50MB for short videos)
      if (file.size > 50 * 1024 * 1024) {
        alert('Video file size must be less than 50MB');
        return;
      }

      // Create a temporary URL for preview
      const tempUrl = URL.createObjectURL(file);
      onChange(tempUrl);
      
      // TODO: Implement actual video upload logic here
      // After upload, call onChange with the real URL
      // const uploadedUrl = await uploadVideo(file);
      // onChange(uploadedUrl);
    }
  };

  const handleRemove = () => {
    if (value) {
      URL.revokeObjectURL(value);
    }
    onChange(null);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 250,
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.paper'
      }}
    >
      {value ? (
        <>
          <video 
            src={value} 
            controls
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
            preload="metadata"
          />
          <Button
            onClick={handleRemove}
            startIcon={<DeleteIcon />}
            color="error"
            variant="contained"
            size="small"
            sx={{ 
              position: 'absolute',
              bottom: 8,
              right: 8,
              opacity: 0.9
            }}
          >
            Remove
          </Button>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Button
            component="label"
            startIcon={<VideoFileIcon />}
            variant="outlined"
            size="large"
            sx={{ mb: 2 }}
          >
            {label ?? 'Upload Video'}
            <input
              type="file"
              hidden
              accept="video/*"
              onChange={handleUpload}
            />
          </Button>
          <Typography variant="body2" color="text.secondary">
            Upload short videos (max 50MB)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Supported formats: MP4, WebM, MOV
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default VideoUpload;