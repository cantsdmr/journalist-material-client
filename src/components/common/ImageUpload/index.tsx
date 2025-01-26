import React from 'react';
import { Box, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ImageUploadProps {
  label: Nullable<string>;
  value: Nullable<string>;
  onChange: (url: Nullable<string>) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange }) => {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Implement your image upload logic here
      // After upload, call onChange with the URL
      // onChange(uploadedUrl);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 200,
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {value ? (
        <>
          <img 
            src={value} 
            alt="Cover" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
          />
          <Button
            onClick={() => onChange(null)}
            sx={{ 
              position: 'absolute',
              bottom: 8,
              right: 8
            }}
          >
            Remove
          </Button>
        </>
      ) : (
        <Button
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          {label ?? 'Upload Image'}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleUpload}
          />
        </Button>
      )}
    </Box>
  );
};

export default ImageUpload; 