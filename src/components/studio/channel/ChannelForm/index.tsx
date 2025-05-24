import React, { useState } from 'react';
import {
  Stack, TextField, Button, FormControl,
  Select, MenuItem, Box,
  Typography
} from '@mui/material';
import { CreateChannelData, EditChannelData } from '@/APIs/ChannelAPI';
import ImageUpload from '@/components/common/ImageUpload';
import { CHANNEL_STATUS } from '@/enums/ChannelEnums';

interface ChannelFormProps {
  initialData?: Nullable<CreateChannelData> | Nullable<EditChannelData>;
  onSubmit: (data: Nullable<CreateChannelData> | Nullable<EditChannelData>) => Promise<void>;
  submitButtonText: string;
}

const ChannelForm: React.FC<ChannelFormProps> = ({
  initialData,
  onSubmit,
  submitButtonText
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateChannelData>(() => ({
    name: initialData?.name || '',
    description: initialData?.description || '',
    handle: initialData?.handle || '',
    status: initialData?.status || CHANNEL_STATUS.ACTIVE,
    logoUrl: initialData?.logoUrl || '',
    bannerUrl: initialData?.bannerUrl || '',
    tags: initialData?.tags || []
  }));

  const [logo, setLogo] = useState<Nullable<string>>(initialData?.logoUrl || undefined);
  const [banner, setBanner] = useState<Nullable<string>>(initialData?.bannerUrl || undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        logoUrl: logo || '',
        bannerUrl: banner || '',
        tags: []
      });
    } catch (error) {
      console.error('Failed to submit channel:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        {/* Branding Section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Branding
          </Typography>
          <Stack spacing={4}>
            {/* Avatar */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Channel Logo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                This image will appear next to your channel's content.
                Use a square image for best results.
              </Typography>
              <ImageUpload
                label="Upload Channel Logo"
                value={logo}
                onChange={setLogo}
              />
            </Box>

            {/* Banner */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Channel Banner
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                This image appears at the top of your channel page.
                Recommended size: 2048 x 1152 pixels.
              </Typography>
              <ImageUpload
                label="Upload Channel Banner"
                value={banner}
                onChange={setBanner}
              />
            </Box>
          </Stack>
        </Box>

        {/* Basic Info Section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Basic Info
          </Typography>
          <Stack spacing={4}>
            {/* Name */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Channel Name
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose a name that represents your channel. You can change this later.
              </Typography>
              <TextField
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                required
                fullWidth
                placeholder="Enter channel name"
              />
            </Box>

            {/* add handle name input */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Channel Handle
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                This is the unique identifier for your channel. It will be used in the URL of your channel page.
              </Typography>
              <TextField
                value={formData.handle}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  handle: e.target.value
                }))}
                required
                fullWidth
                placeholder="Enter channel handle"
              />
            </Box>

            {/* Description */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tell viewers about your channel. This appears in search results and your channel page.
              </Typography>
              <TextField
                value={formData.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                multiline
                rows={4}
                fullWidth
                placeholder="Tell your story..."
              />
            </Box>
          </Stack>
        </Box>

        {/* Settings Section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Channel Settings
          </Typography>
          <Stack spacing={4}>
            {/* Visibility */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Channel Visibility
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Control who can see and access your channel's content.
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.status}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      status: value,
                    }));
                  }}
                >
                  <MenuItem value={CHANNEL_STATUS.ACTIVE}>
                    Public - Channel is visible to everyone
                  </MenuItem>
                  <MenuItem value={CHANNEL_STATUS.PRIVATE}>
                    Private - Only invited members can access
                  </MenuItem>
                  <MenuItem value={CHANNEL_STATUS.INACTIVE}>
                    Hidden - Channel is temporarily hidden from public view
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {loading ? 'Submitting...' : submitButtonText}
        </Button>
      </Stack>
    </form>
  );
};

export default ChannelForm; 