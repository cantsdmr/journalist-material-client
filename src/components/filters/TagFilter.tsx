import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Typography,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import { Tag as BaseTag } from '@/types/entities/Tag';

// Extended Tag interface for TagFilter with additional UI properties
interface Tag extends BaseTag {
  count?: number;
  trending?: boolean;
  popular?: boolean;
}

// Styled components
const TagChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  margin: theme.spacing(0.5),
  fontWeight: 500,
  '&.selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    }
  },
  '&:not(.selected)': {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    }
  }
}));

const ScrollableContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  overflowY: 'hidden',
  paddingBottom: theme.spacing(1),
  gap: theme.spacing(1),
  '&::-webkit-scrollbar': {
    height: 6,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.action.disabled,
    borderRadius: 3,
  }
}));

// Types
export interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  contentType: 'news' | 'channels' | 'polls';
  maxTags?: number;
  showCounts?: boolean;
  className?: string;
}

const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags = [],
  onTagsChange,
  contentType,
  maxTags = 10,
  showCounts = false,
  className
}) => {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const { api } = useApiContext();
  const { execute } = useApiCall();

  // Fetch available tags for the content type
  useEffect(() => {
    const fetchTags = async () => {
      if (!api?.tagApi) return;
      
      setLoading(true);
      
      try {
        // Fetch all tags, trending tags, and popular tags for the content type
        const [allResponse, trendingResponse, popularResponse] = await Promise.all([
          execute(() => api.tagApi.getTags({ category: contentType === 'channels' ? undefined : contentType }), { showErrorToast: false }),
          execute(() => api.tagApi.getTags({ trending: true, category: contentType === 'channels' ? undefined : contentType }), { showErrorToast: false }),
          execute(() => api.tagApi.getTags({ popular: true, category: contentType === 'channels' ? undefined : contentType }), { showErrorToast: false })
        ]);

        // Combine and deduplicate tags
        const tags = new Map<string, Tag>();
        
        // Add all tags
        if (allResponse?.items) {
          allResponse.items.forEach((tag: Tag) => {
            tags.set(tag.id, {
              ...tag,
              count: tag.analytics?.usageCount || 0
            });
          });
        }

        // Mark trending tags
        if (trendingResponse?.items) {
          trendingResponse.items.forEach((tag: Tag) => {
            const existing = tags.get(tag.id);
            if (existing) {
              tags.set(tag.id, { ...existing, trending: true });
            } else {
              tags.set(tag.id, {
                ...tag,
                count: tag.analytics?.usageCount || 0,
                trending: true
              });
            }
          });
        }

        // Mark popular tags
        if (popularResponse?.items) {
          popularResponse.items.forEach((tag: Tag) => {
            const existing = tags.get(tag.id);
            if (existing && !existing.trending) {
              tags.set(tag.id, { ...existing, popular: true });
            } else if (!existing) {
              tags.set(tag.id, {
                ...tag,
                count: tag.analytics?.usageCount || 0,
                popular: true
              });
            }
          });
        }

        // Convert to array and sort by usage count
        const sortedTags = Array.from(tags.values())
          .sort((a, b) => (b.count || 0) - (a.count || 0))
          .slice(0, 20); // Limit to top 20 tags

        setAvailableTags(sortedTags);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
        setAvailableTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [contentType, api, execute]);

  // Handle tag selection
  const handleTagClick = (tagName: string) => {
    const isSelected = selectedTags.includes(tagName);
    
    if (isSelected) {
      // Remove tag
      onTagsChange(selectedTags.filter(tag => tag !== tagName));
    } else {
      // Add tag (respect max limit)
      if (selectedTags.length < maxTags) {
        onTagsChange([...selectedTags, tagName]);
      }
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Box className={className} sx={{ py: 1 }}>
        <ScrollableContainer>
          {[...Array(8)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width={80}
              height={32}
              sx={{ borderRadius: 3, flexShrink: 0 }}
            />
          ))}
        </ScrollableContainer>
      </Box>
    );
  }

  return (
    <Box className={className} sx={{ py: 1 }}>
      <ScrollableContainer>
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag.name);
          
          return (
            <TagChip
              key={tag.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {tag.name}
                  {showCounts && tag.count && tag.count > 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.7rem',
                        opacity: 0.8,
                        ml: 0.5
                      }}
                    >
                      {tag.count}
                    </Typography>
                  )}
                </Box>
              }
              className={isSelected ? 'selected' : ''}
              onClick={() => handleTagClick(tag.name)}
              clickable
              size="small"
              sx={{
                flexShrink: 0,
                ...(tag.trending && {
                  background: 'linear-gradient(45deg, #f44336 30%, #ff9800 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #d32f2f 30%, #f57c00 90%)',
                  }
                }),
                ...(tag.popular && !tag.trending && {
                  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976d2 30%, #0097a7 90%)',
                  }
                })
              }}
            />
          );
        })}
      </ScrollableContainer>
      
      {selectedTags.length > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: 1, mt: 1, display: 'block' }}
        >
          {selectedTags.length}/{maxTags} tags selected
        </Typography>
      )}
    </Box>
  );
};

export default TagFilter; 