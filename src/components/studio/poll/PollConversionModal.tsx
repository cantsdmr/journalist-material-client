import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  alpha
} from '@mui/material';
import { Poll } from '@/types/index';
import { NEWS_STATUS } from '@/enums/NewsEnums';
import { useProfile } from '@/contexts/ProfileContext';
import JEditor from '@/components/editor/JEditor';
import { OutputData } from '@editorjs/editorjs';

interface PollConversionModalProps {
  open: boolean;
  poll: Poll | null;
  onClose: () => void;
  onConvert: (newsData: any) => Promise<void>;
  loading?: boolean;
}

const PollConversionModal: React.FC<PollConversionModalProps> = ({
  open,
  poll,
  onClose,
  onConvert,
  loading = false
}) => {
  const { profile } = useProfile();
  const [formData, setFormData] = useState({
    title: '',
    channelId: '',
    status: NEWS_STATUS.PUBLISHED as number,
    isPremium: false,
    requiredTierId: null,
    content: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.channelId) {
      setError('Channel is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setError(null);
      await onConvert(formData);
      handleClose();
    } catch (error) {
      setError((error as Error).message || 'Failed to convert poll to news');
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      channelId: '',
      status: NEWS_STATUS.PUBLISHED as number,
      isPremium: false,
      requiredTierId: null,
      content: ''
    });
    setError(null);
    onClose();
  };

  const handleEditorChange = (data: OutputData) => {
    setFormData(prev => ({
      ...prev,
      content: JSON.stringify(data)
    }));
  };

  // Initialize form with poll data when opened
  React.useEffect(() => {
    if (open && poll) {
      setFormData(prev => ({
        ...prev,
        title: `News Article: ${poll.title}`,
        channelId: poll.channel?.id || '',
        content: poll.description || ''
      }));
    }
  }, [open, poll]);

  if (!poll) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Typography variant="h6">Convert Poll to News Article</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Convert "{poll.title}" into a news article with poll results included
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Poll Results Preview */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: theme => alpha(theme.palette.primary.main, 0.05),
              border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Poll Results (will be included in the article)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Votes: {poll.voteCount || 0} • 
              Status: {poll.stats?.hasEnded ? 'Ended' : 'Active'}
            </Typography>
          </Box>

          {/* Title */}
          <TextField
            label="Article Title"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            helperText="Create an engaging title for your news article"
          />

          {/* Channel Selection */}
          <FormControl fullWidth required>
            <InputLabel>Channel</InputLabel>
            <Select
              value={formData.channelId}
              label="Channel"
              onChange={(e) => setFormData(prev => ({ ...prev, channelId: e.target.value }))}
            >
              {profile?.staffChannels?.map((channel) => (
                <MenuItem key={channel.id} value={channel.channelId}>
                  {channel.channel.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Content Editor */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Article Content
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Write your news article. Poll results will be automatically appended.
            </Typography>
            <JEditor
              data={formData.content ? JSON.parse(formData.content) : undefined}
              onChange={handleEditorChange}
              placeholder="Write your news article content here..."
              borderColor={theme => 
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.23)
                  : alpha(theme.palette.common.black, 0.23)
              }
            />
          </Box>

          {/* Publishing Options */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Publishing Options
            </Typography>
            
            <Stack spacing={2}>
              {/* Premium Content */}
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPremium}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPremium: e.target.checked }))}
                  />
                }
                label="Premium Content"
              />

              {/* Status */}
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData(prev => ({ ...prev, status: Number(e.target.value) }))}
                >
                  <MenuItem value={NEWS_STATUS.DRAFT}>Draft</MenuItem>
                  <MenuItem value={NEWS_STATUS.PUBLISHED}>Published</MenuItem>
                  <MenuItem value={NEWS_STATUS.PENDING_REVIEW}>Pending Review</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Converting...' : 'Convert to News'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PollConversionModal;