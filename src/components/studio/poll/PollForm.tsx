import React, { useState } from 'react';
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
  Paper
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useProfile } from '@/contexts/ProfileContext';

interface PollOption {
  text: string;
}

interface PollFormData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  channelId: string;
  options: PollOption[];
}

interface PollFormProps {
  initialData?: Partial<PollFormData>;
  onSubmit: (data: PollFormData) => void;
  submitButtonText?: string;
}

const PollForm: React.FC<PollFormProps> = ({
  initialData,
  onSubmit,
  submitButtonText = 'Submit'
}) => {
  const { profile  } = useProfile();
  const [formData, setFormData] = useState<PollFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate || new Date(),
    endDate: initialData?.endDate || new Date(),
    channelId: initialData?.channelId || '',
    options: initialData?.options || [{ text: '' }, { text: '' }]
  });

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
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="channel-select-label">Channel</InputLabel>
            <Select
              labelId="channel-select-label"
              value={formData.channelId}
              label="Channel"
              onChange={(e) => handleChange('channelId', e.target.value)}
              required
            >
              {profile?.channelUsers?.map((channel) => (
                <MenuItem key={channel.channel.id} value={channel.channel.id}>
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