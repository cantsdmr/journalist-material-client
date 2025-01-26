import React, { useState, useCallback, useEffect } from 'react';
import { 
  Box, Stack, TextField, FormControl, Alert,
  Select, MenuItem, FormControlLabel, Switch, Button,
  alpha, Typography
} from '@mui/material';
import { CreateNewsData, NewsMedia, SocialLink } from '../../../APIs/NewsAPI';
import { OutputData } from '@editorjs/editorjs';
import { NEWS_STATUS } from '@/enums/NewsEnums';
import JEditor from '@/components/editor/JEditor';
import NewsSocialLinks from '@/components/news/NewsSocialLinks';
import { useUserInfo } from '@/hooks/useUserInfo';
import ImageUpload from '@/components/common/ImageUpload';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import { EmptyState } from '@/components/common/EmptyState';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';

interface NewsFormProps {
  initialData?: CreateNewsData;
  onSubmit: (data: CreateNewsData) => Promise<void>;
  submitButtonText: string;
}

const NewsForm: React.FC<NewsFormProps> = ({
  initialData,
  onSubmit,
  submitButtonText
}) => {
  const { userInfo } = useUserInfo();
  const navigate = useNavigate();
  
  // Check if user has channels
  useEffect(() => {
    if (userInfo && (!userInfo.channels || userInfo.channels.length === 0)) {
      // User has no channels
      return;
    }
  }, [userInfo]);

  const [formData, setFormData] = useState<any>(() => ({
    title: initialData?.title || '',
    channelId: initialData?.channelId || '',
    status: initialData?.status || NEWS_STATUS.PUBLISHED,
    requiredTierId: initialData?.requiredTierId || null,
    isPremium: initialData?.isPremium || false,
    content: initialData?.content || ''
  }));
  
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<NewsMedia | null>(initialData?.media?.[0] || null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialData?.socialLinks || []);
  const [error, setError] = useState<string | null>(null);
 
  const tiers: any[] = []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newsData = {
        ...formData,
        media: coverImage ? [coverImage] : [],
        socialLinks
      };

      await onSubmit(newsData);
    } catch (error) {
      console.error('Failed to submit news:', error);
      setError('Failed to submit news');
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = useCallback((data: OutputData) => {
    setFormData(prev => ({
      ...prev,
      content: JSON.stringify(data)
    }));
  }, []);

  if (!userInfo?.channels || userInfo.channels.length === 0) {
    return (
      <EmptyState
        title="Channel Required"
        description="You need to create a channel before you can start publishing news articles."
        icon={<AddToQueueIcon sx={{ fontSize: 48 }} />}
        action={{
          label: "Create Channel",
          onClick: () => navigate(PATHS.STUDIO_CHANNEL_CREATE)
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        {/* Warning Alert when no channels */}
        {userInfo && (!userInfo.channels || userInfo.channels.length === 0) && (
          <Alert 
            severity="warning"
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => navigate(PATHS.STUDIO_CHANNEL_CREATE)}
              >
                Create Channel
              </Button>
            }
          >
            You need to create a channel before you can create news articles
          </Alert>
        )}

        {/* Rest of your form components */}
        {userInfo?.channels && userInfo.channels.length > 0 ? (
          <>
            {/* Media Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Media
              </Typography>
              <Stack spacing={4}>
                {/* Cover Image */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Cover Image
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    This image will be displayed at the top of your news article and in previews.
                    Use a high-quality image for best results.
                  </Typography>
                  <ImageUpload
                    image={coverImage}
                    onChange={setCoverImage}
                    aspectRatio="16/9"
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
                {/* Title */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Title
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Create a clear and engaging title for your news article.
                    This will be the first thing readers see.
                  </Typography>
                  <TextField
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    required
                    fullWidth
                    placeholder="Enter news title"
                  />
                </Box>

                {/* Channel Selection */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Channel
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select the channel where this news will be published.
                    Choose the most relevant channel for your content.
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={formData.channelId}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        channelId: e.target.value
                      }))}
                      required
                    >
                      {userInfo?.channels.map((channel) => (
                        <MenuItem key={channel.channelId} value={channel.channelId}>
                          {channel.channelName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Content Editor */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Content
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Write your news article using the editor below.
                    You can add text, images, and other media elements.
                  </Typography>
                  <JEditor
                    data={formData.content ? JSON.parse(formData.content) : undefined}
                    onChange={handleEditorChange}
                    placeholder="Start writing your news content..."
                    borderColor={theme => 
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.23)
                        : alpha(theme.palette.common.black, 0.23)
                    }
                  />
                </Box>
              </Stack>
            </Box>

            {/* Social Links */}
            <Box>
              <NewsSocialLinks
                links={socialLinks}
                onChange={setSocialLinks}
              />
            </Box>

            {/* Publishing Options */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Publishing Options
              </Typography>
              <Stack spacing={4}>
                {/* Premium Content Switch */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Premium Content
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Mark this content as premium to restrict access to specific subscribers.
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPremium}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          isPremium: e.target.checked
                        }))}
                      />
                    }
                    label="Premium Content"
                  />
                </Box>

                {/* Required Tier */}
                {formData.isPremium && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Required Subscription Tier
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Select which subscription tier is required to access this content. 
                      Higher tiers will automatically have access to content from lower tiers.
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={formData.requiredTierId || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          requiredTierId: e.target.value
                        }))}
                        required={formData.isPremium}
                      >
                        {tiers.map(tier => (
                          <MenuItem key={tier.id} value={tier.id}>
                            {tier.name} - {tier.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}

                {/* Status */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Set the visibility status of your news article.
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
                      <MenuItem value={NEWS_STATUS.DRAFT}>
                        Draft - Save for later
                      </MenuItem>
                      <MenuItem value={NEWS_STATUS.PUBLISHED}>
                        Published - Visible to readers
                      </MenuItem>
                      <MenuItem value={NEWS_STATUS.PENDING_REVIEW}>
                        Pending Review - Submit for approval
                      </MenuItem>
                      <MenuItem value={NEWS_STATUS.ARCHIVED}>
                        Archived - No longer visible
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
              disabled={loading || !userInfo?.channels?.length}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {loading ? 'Submitting...' : submitButtonText}
            </Button>
          </>
        ) : null}
      </Stack>
    </form>
  );
};

export default NewsForm; 