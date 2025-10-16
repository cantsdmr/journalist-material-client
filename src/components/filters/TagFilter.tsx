import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Skeleton,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  borderRadius: theme.spacing(1),
  height: 36,
  fontWeight: 500,
  fontSize: '0.875rem',
  padding: '0 12px',
  transition: 'all 0.2s ease',
  '&.selected': {
    backgroundColor: theme.palette.mode === 'dark'
      ? theme.palette.grey[800]
      : theme.palette.grey[900],
    color: theme.palette.mode === 'dark'
      ? theme.palette.common.white
      : theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[800],
    }
  },
  '&:not(.selected)': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)',
    color: theme.palette.text.primary,
    border: 'none',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.1)',
    }
  }
}));

const ScrollableContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  overflowY: 'hidden',
  gap: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
  scrollbarWidth: 'none', // Firefox
  '&::-webkit-scrollbar': {
    display: 'none', // Chrome, Safari, Opera
  },
  msOverflowStyle: 'none', // IE and Edge
  scrollBehavior: 'smooth'
}));

const ArrowButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.06)',
  width: 36,
  height: 36,
  flexShrink: 0,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(0, 0, 0, 0.1)',
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
  className
}) => {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
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

  // Check if content is scrollable
  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [availableTags, loading]);

  // Handle scroll left
  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  // Handle scroll right
  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Box className={className} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ScrollableContainer sx={{ flex: 1 }}>
          {[...Array(10)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width={100}
              height={36}
              sx={{ borderRadius: 1, flexShrink: 0 }}
            />
          ))}
        </ScrollableContainer>
      </Box>
    );
  }

  return (
    <Box className={className} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {showLeftArrow && (
        <ArrowButton onClick={handleScrollLeft} size="small">
          <ArrowBackIcon fontSize="small" />
        </ArrowButton>
      )}

      <ScrollableContainer ref={containerRef} sx={{ flex: 1 }}>
        {/* All button */}
        <TagChip
          label="All"
          className={selectedTags.length === 0 ? 'selected' : ''}
          onClick={() => onTagsChange([])}
          clickable
          sx={{ flexShrink: 0 }}
        />

        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag.name);

          return (
            <TagChip
              key={tag.id}
              label={tag.name}
              className={isSelected ? 'selected' : ''}
              onClick={() => handleTagClick(tag.name)}
              clickable
              sx={{ flexShrink: 0 }}
            />
          );
        })}
      </ScrollableContainer>

      {showRightArrow && (
        <ArrowButton onClick={handleScrollRight} size="small">
          <ArrowForwardIcon fontSize="small" />
        </ArrowButton>
      )}
    </Box>
  );
};

export default TagFilter; 