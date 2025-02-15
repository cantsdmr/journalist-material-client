import React, { useState } from 'react';
import {
  Stack, TextField, Button,
  Box, Typography, InputAdornment,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ChannelTier, CreateChannelTierData, EditChannelTierData } from '@/APIs/ChannelAPI';

interface TierFormProps {
  initialData?: ChannelTier;
  channelId: string;
  onSubmit: (data: CreateChannelTierData | EditChannelTierData) => Promise<void>;
  submitButtonText: string;
}

const TierForm: React.FC<TierFormProps> = ({
  initialData,
  channelId,
  onSubmit,
  submitButtonText
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateChannelTierData>(() => ({
    name: initialData?.name || '',
    price: initialData?.price || 0,
    description: initialData?.description || '',
    channelId: channelId,
    order: initialData?.order || 0,
    benefits: initialData?.benefits || ['']
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit tier:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData(prev => ({ ...prev, benefits: newBenefits }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const removeBenefit = (index: number) => {
    if (formData.benefits.length > 1) {
      const newBenefits = formData.benefits.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, benefits: newBenefits }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        {/* Basic Info */}
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Basic Information
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Tier Name
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose a name for this membership tier.
              </Typography>
              <TextField
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                required
                fullWidth
                placeholder="e.g., Premium Tier"
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Monthly Price
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Set the monthly subscription price for this tier.
              </Typography>
              <TextField
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  price: Number(e.target.value)
                }))}
                required
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Describe what subscribers will get with this tier.
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
                placeholder="Describe the benefits of this tier..."
              />
            </Box>
          </Stack>
        </Box>

        {/* Benefits */}
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Benefits
          </Typography>
          <Stack spacing={2}>
            {formData.benefits.map((benefit: string, index: number) => (
              <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  value={benefit}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  fullWidth
                  placeholder="Add a benefit..."
                  required
                />
                <IconButton 
                  onClick={() => removeBenefit(index)}
                  disabled={formData.benefits.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addBenefit}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Benefit
            </Button>
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

export default TierForm; 