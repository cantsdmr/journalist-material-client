import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  InputAdornment
} from '@mui/material';
import { ChannelTier, CreateChannelTierData, EditChannelTierData } from '@/APIs/ChannelAPI';
import { SUPPORTED_CURRENCIES } from '@/constants/currencies';

type TierFormFields = keyof (CreateChannelTierData & EditChannelTierData);
type TierFormData = CreateChannelTierData & EditChannelTierData;

interface ChannelTierFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TierFormData) => Promise<void>;
  initialData: Nullable<ChannelTier>;
  isEdit?: boolean;
}

export const ChannelTierForm: React.FC<ChannelTierFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<TierFormData>({
    name: '',
    description: '',
    price: 0,
    benefits: [],
    order: 0,
    isDefault: false,
    currency: SUPPORTED_CURRENCIES.USD.code,
    channel_id: ''
  });
  const [errors, setErrors] = useState<Partial<Record<TierFormFields, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        benefits: initialData.benefits,
        order: initialData.order,
        isDefault: initialData.isDefault,
        currency: initialData.currency || SUPPORTED_CURRENCIES.USD.code,
        channel_id: initialData.channelId
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<TierFormFields, string>> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (formData.price < 0) newErrors.price = 'Price must be positive';
    if (!formData.benefits) newErrors.benefits = 'Benefits are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof TierFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'price' ? Number(event.target.value) : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to submit tier:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isEdit ? 'Edit Tier' : 'Create New Tier'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              label="Tier Name"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description}
              fullWidth
            />

            <TextField
              type="number"
              label="Monthly Price"
              value={formData.price}
              onChange={handleChange('price')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              error={!!errors.price}
              helperText={errors.price}
              fullWidth
            />

            <TextField
              label="Benefits"
              value={formData.benefits}
              onChange={handleChange('benefits')}
              multiline
              rows={4}
              placeholder="Enter benefits, one per line"
              error={!!errors.benefits}
              helperText={errors.benefits}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isEdit ? 'Save Changes' : 'Create Tier'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 