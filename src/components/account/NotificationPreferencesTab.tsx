import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Stack,
  Divider,
  Button,
  Skeleton,
  Alert,
} from '@mui/material';
import { Save, Notifications as NotificationsIcon } from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { NotificationPreference, NotificationTypeMetadata } from '@/types/index';
import { useApiCall } from '@/hooks/useApiCall';
import { NotificationType } from '@/enums/NotificationEnums';

interface PreferenceWithMetadata extends NotificationPreference {
  metadata?: NotificationTypeMetadata;
}

const categoryLabels: Record<string, string> = {
  subscription: 'Subscription Notifications',
  payout: 'Payout Notifications',
  funding: 'Funding Notifications',
  channel: 'Channel Notifications',
  system: 'System Notifications'
};

const categoryOrder = ['subscription', 'payout', 'funding', 'channel', 'system'];

const NotificationPreferencesTab: React.FC = () => {
  const [preferences, setPreferences] = useState<PreferenceWithMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { api } = useApiContext();
  const { execute } = useApiCall();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [prefsResult, metadataResult] = await Promise.all([
        execute(() => api.app.account.getNotificationPreferences(), { showErrorToast: false }),
        execute(() => api.app.notification.getNotificationTypeMetadata(), { showErrorToast: false })
      ]);

      if (prefsResult && metadataResult) {
        const metadataMap = new Map(metadataResult.map(m => [m.id, m]));
        const prefsWithMeta = prefsResult.preferences.map(pref => ({
          ...pref,
          metadata: metadataMap.get(pref.notificationTypeId)
        }));
        setPreferences(prefsWithMeta);
      } else {
        setError('Failed to load notification preferences');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (
    notificationTypeId: NotificationType,
    field: 'pushEnabled' | 'inAppEnabled',
    value: boolean
  ) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.notificationTypeId === notificationTypeId
          ? { ...pref, [field]: value }
          : pref
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const updates = preferences.map(pref => ({
      notificationTypeId: pref.notificationTypeId,
      pushEnabled: pref.pushEnabled,
      inAppEnabled: pref.inAppEnabled
    }));

    const result = await execute(
      () => api.app.account.bulkUpdateNotificationPreferences(updates),
      {
        showSuccessMessage: true,
        successMessage: 'Notification preferences saved successfully',
        showErrorToast: true
      }
    );

    if (result) {
      setHasChanges(false);
      // Refresh to get updated data
      fetchData();
    }

    setSaving(false);
  };

  const handleReset = () => {
    fetchData();
    setHasChanges(false);
  };

  // Group preferences by category
  const groupedPreferences = preferences.reduce((acc, pref) => {
    const category = pref.metadata?.category || 'system';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(pref);
    return acc;
  }, {} as Record<string, PreferenceWithMetadata[]>);

  if (loading) {
    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          Notification Preferences
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Loading...
        </Typography>
        <Stack spacing={2}>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} variant="rectangular" height={80} />
          ))}
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          Notification Preferences
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Notification Preferences
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Control which notifications you receive via push and in-app
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleReset}
            disabled={!hasChanges || saving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={saving ? undefined : <Save />}
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      <Stack spacing={3}>
        {categoryOrder.map(category => {
          const items = groupedPreferences[category];
          if (!items || items.length === 0) return null;

          return (
            <Box key={category}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <NotificationsIcon fontSize="small" />
                {categoryLabels[category]}
              </Typography>

              <Stack spacing={1.5}>
                {items.map(pref => (
                  <Paper
                    key={pref.notificationTypeId}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ flex: 1, mr: 3 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {pref.metadata?.name || `Notification Type ${pref.notificationTypeId}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pref.metadata?.description || 'No description available'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={pref.pushEnabled}
                              onChange={(e) =>
                                handleToggle(pref.notificationTypeId, 'pushEnabled', e.target.checked)
                              }
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Push
                            </Typography>
                          }
                          labelPlacement="top"
                          sx={{ m: 0 }}
                        />

                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                        <FormControlLabel
                          control={
                            <Switch
                              checked={pref.inAppEnabled}
                              onChange={(e) =>
                                handleToggle(pref.notificationTypeId, 'inAppEnabled', e.target.checked)
                              }
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              In-App
                            </Typography>
                          }
                          labelPlacement="top"
                          sx={{ m: 0 }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Box>
          );
        })}
      </Stack>

      {hasChanges && (
        <Alert severity="info" sx={{ mt: 3 }}>
          You have unsaved changes. Click "Save Changes" to apply your preferences.
        </Alert>
      )}
    </Box>
  );
};

export default NotificationPreferencesTab;
