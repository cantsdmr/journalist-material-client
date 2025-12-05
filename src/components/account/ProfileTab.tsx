import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Stack,
  Alert,
  Skeleton,
  CircularProgress
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { UserProfile, UpdateProfileData } from '@/types/index';
import { useApiCall } from '@/hooks/useApiCall';

const ProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateProfileData>({});
  
  const { api } = useApiContext();
  const { execute } = useApiCall();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    const result = await execute(
      () => api.app.account.getProfile(),
      { showErrorToast: true }
    );
    
    if (result) {
      setProfile(result);
      setFormData({
        displayName: result.displayName,
        photoUrl: result.photoUrl
      });
    }
    
    setLoading(false);
  };

  const handleEdit = () => {
    setEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setEditing(false);
    if (profile) {
      setFormData({
        displayName: profile.displayName,
        photoUrl: profile.photoUrl
      });
    }
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    const result = await execute(
      () => api.app.account.updateProfile(formData),
      {
        showSuccessMessage: true,
        successMessage: 'Profile updated successfully'
      }
    );
    
    if (result) {
      setProfile(result);
      setEditing(false);
    }
    
    setSaving(false);
  };

  const handleInputChange = (field: keyof UpdateProfileData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Stack spacing={3} alignItems="center">
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="text" width="50%" height={40} />
          <Skeleton variant="rectangular" width="100%" height={56} />
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Stack>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load profile</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        
        {/* Avatar Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={formData.photoUrl || profile.photoUrl}
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Typography variant="h6">{profile.email}</Typography>
          <Typography variant="body2" color="text.secondary">
            Joined {new Date(profile.createdAt || '').toLocaleDateString()}
          </Typography>
        </Box>

        {/* Form Fields */}
        <TextField
          label="Display Name"
          value={formData.displayName || ''}
          onChange={handleInputChange('displayName')}
          disabled={!editing}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Photo URL"
          value={formData.photoUrl || ''}
          onChange={handleInputChange('photoUrl')}
          disabled={!editing}
          fullWidth
          variant="outlined"
          placeholder="https://example.com/photo.jpg"
        />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {!editing ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                onClick={handleSave}
                disabled={saving}
              >
                Save Changes
              </Button>
            </>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default ProfileTab; 