import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Paper,
  Stack
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import { EmptyState } from '@/components/common/EmptyState';
import MediaUpload from '@/components/common/MediaUpload';
import { POLL_MEDIA_TYPE } from '@/enums/PollEnums';

interface PollOption {
  text: string;
}

interface PollMedia {
  id: string;
  pollId: string;
  url: string;
  type: number;
  format: number;
  caption?: string;
}

interface PollFormData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  channelId: string;
  options: PollOption[];
  media: PollMedia[];
}

interface PollFormProps {
  initialData?: Partial<PollFormData>;
  onSubmit: (data: PollFormData) => void;
  submitButtonText?: string;
  isEdit?: boolean;
  isCreate?: boolean;
}

const PollForm: React.FC<PollFormProps> = ({
  initialData,
  onSubmit,
  submitButtonText = 'Submit',
  isEdit
}) => {
  const { profile, channelRelations: { hasChannel } } = useProfile();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PollFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate || new Date(),
    endDate: initialData?.endDate || new Date(),
    channelId: initialData?.channelId || '',
    options: initialData?.options || [{ text: '' }, { text: '' }],
    media: initialData?.media || []
  });

  const [coverMedia, setCoverMedia] = useState<PollMedia | null>(
    initialData?.media?.find(m => m.type === POLL_MEDIA_TYPE.COVER) || null
  );

  // Check if profile has channels
  useEffect(() => {
    if (profile && (!profile.staffChannels || profile.staffChannels.length === 0)) {
      // Profile has no channels
      return;
    }
  }, [profile]);

  const handleChange = (field: keyof PollFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = { text: value };
    handleChange('options', newOptions);
  };

  const addOption = () => {
    handleChange('options', [...formData.options, { text: '' }]);
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) return; // Minimum 2 options required
    const newOptions = formData.options.filter((_, i) => i !== index);
    handleChange('options', newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pollData = {
      ...formData,
      media: coverMedia ? [coverMedia] : []
    };
    onSubmit(pollData);
  };

  return !hasChannel() ? (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3 
    }}>
      <EmptyState
        title="Channel Required"
        description="You need to create a channel before you can start creating polls."
        icon={<AddToQueueIcon sx={{ fontSize: 48 }} />}
        action={{
          label: "Create Channel",
          onClick: () => navigate(PATHS.STUDIO_CHANNEL_CREATE)
        }}
      />
    </Box>
  ) : (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth disabled={isEdit}>
            <InputLabel id="channel-select-label">Channel</InputLabel>
            <Select
              labelId="channel-select-label"
              value={formData.channelId}
              label="Channel"
              onChange={(e) => handleChange('channelId', e.target.value)}
              required
            >
              {profile?.staffChannels?.map((channel) => (
                <MenuItem key={channel.id} value={channel.channelId}>
                  {channel.channel.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Poll Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={4}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <DateTimePicker
            label="Start Date"
            value={formData.startDate}
            onChange={(date) => handleChange('startDate', date)}
            sx={{ width: '100%' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <DateTimePicker
            label="End Date"
            value={formData.endDate}
            onChange={(date) => handleChange('endDate', date)}
            sx={{ width: '100%' }}
          />
        </Grid>

        {/* Media Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Media
            </Typography>
            <Stack spacing={4}>
              {/* Cover Media */}
              <Box>
                <MediaUpload
                  title="Cover Media"
                  description="Upload an image or short video that will be displayed with your poll and in previews."
                  value={coverMedia ? {
                    id: coverMedia.id || '0',
                    url: coverMedia.url,
                    type: coverMedia.type,
                    format: coverMedia.format
                  } : null}
                  onChange={(media) => setCoverMedia(media ? {
                    id: media.id,
                    url: media.url,
                    type: media.type,
                    format: media.format,
                    pollId: ''
                  } : null)}
                  mediaTypeId={POLL_MEDIA_TYPE.COVER}
                  useNewsFormats={false}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Poll Options
            </Typography>
            {formData.options.map((option, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                  sx={{ mr: 1 }}
                />
                <IconButton
                  onClick={() => removeOption(index)}
                  disabled={formData.options.length <= 2}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addOption}
              variant="outlined"
              size="small"
            >
              Add Option
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
          >
            {submitButtonText}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PollForm; 