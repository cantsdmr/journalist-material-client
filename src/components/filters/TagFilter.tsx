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
  borderRadius: theme.spacing(0.75),
  height: 28,
  fontWeight: 500,
  fontSize: '0.75rem',
  padding: '0 8px',
  transition: 'all 0.2s ease',
  border: '1px solid transparent',
  '&.selected': {
    // Inverse colors for selected state - more prominent
    backgroundColor: theme.palette.mode === 'dark'
      ? theme.palette.common.white
      : theme.palette.grey[900],
    color: theme.palette.mode === 'dark'
      ? theme.palette.grey[900]
      : theme.palette.common.white,
    fontWeight: 600,
    borderColor: theme.palette.mode === 'dark'
      ? theme.palette.common.white
      : theme.palette.grey[900],
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[100]
        : theme.palette.grey[800],
      borderColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[100]
        : theme.palette.grey[800],
    }
  },
  '&:not(.selected)': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.1)',
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.2)',
    }
  }
}));

const ScrollableContainer = styled(Box)<{ horizontal?: boolean }>(({ theme, horizontal }) => ({
  display: 'flex',
  flexDirection: horizontal ? 'row' : 'column',
  gap: theme.spacing(horizontal ? 1 : 1),
  scrollBehavior: 'smooth',
  ...(horizontal && {
    overflowX: 'auto',
    overflowY: 'hidden',
    paddingBottom: theme.spacing(0.5),
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    msOverflowStyle: 'none'
  })
}));

const ArrowButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.06)',
  width: 32,
  height: 32,
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
  horizontal?: boolean;
}

const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags = [],
  onTagsChange,
  contentType,
  maxTags: _maxTags = 10, // Renamed with underscore - single tag selection enforced
  className,
  horizontal = false
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
      // Single tag selection only - replace existing tag
      onTagsChange([tagName]);
    }
  };

  // Check if content is scrollable (only for horizontal mode)
  const checkScroll = () => {
    if (horizontal && containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    if (horizontal) {
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
    }
  }, [availableTags, loading, horizontal]);

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
      <Box className={className}>
        <ScrollableContainer horizontal={horizontal}>
          {[...Array(10)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width={horizontal ? 100 : '100%'}
              height={28}
              sx={{ borderRadius: 0.75, flexShrink: horizontal ? 0 : undefined }}
            />
          ))}
        </ScrollableContainer>
      </Box>
    );
  }

  // Horizontal layout with arrows
  if (horizontal) {
    return (
      <Box className={className} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {showLeftArrow && (
          <ArrowButton onClick={handleScrollLeft} size="small">
            <ArrowBackIcon fontSize="small" />
          </ArrowButton>
        )}

        <ScrollableContainer ref={containerRef} horizontal={horizontal} sx={{ flex: 1 }}>
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
  }

  // Vertical layout (no arrows)
  return (
    <Box className={className}>
      <ScrollableContainer ref={containerRef} horizontal={horizontal}>
        {/* All button */}
        <TagChip
          label="All"
          className={selectedTags.length === 0 ? 'selected' : ''}
          onClick={() => onTagsChange([])}
          clickable
          sx={{ width: '100%', justifyContent: 'flex-start' }}
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
              sx={{ width: '100%', justifyContent: 'flex-start' }}
            />
          );
        })}
      </ScrollableContainer>
    </Box>
  );
};

export default TagFilter; 