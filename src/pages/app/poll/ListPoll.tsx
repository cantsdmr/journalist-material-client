import React, { useEffect, useState } from 'react';
import { Typography, Box, Tabs, Tab } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import TagFilter from '@/components/filters/TagFilter';
import PollsList from '@/components/poll/PollsList';

enum PollTab {
  ALL = 'all',
  TRENDING = 'trending',
  FUNDED = 'funded'
}

const ListPoll: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PollTab>(PollTab.ALL);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract tags from URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tagsParam = searchParams.get('tags');

    if (tagsParam) {
      const urlTags = tagsParam.split(',').map(tag => decodeURIComponent(tag.trim()));
      setSelectedTags(urlTags);
    }
  }, [location.search]);

  // Build filters based on active tab and tags
  const getFilters = () => {
    const filters: any = {};

    // Apply tab-based filters
    switch (activeTab) {
      case PollTab.TRENDING:
        filters.trending = true;
        break;
      case PollTab.FUNDED:
        filters.funded = true;
        break;
      default:
        break; // All polls
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filters.tags = selectedTags;
    }

    return filters;
  };

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);

    // Update URL with selected tags
    const searchParams = new URLSearchParams(location.search);
    if (tags.length > 0) {
      searchParams.set('tags', tags.map(tag => encodeURIComponent(tag)).join(','));
    } else {
      searchParams.delete('tags');
    }

    const newPath = `${location.pathname}?${searchParams.toString()}`;
    navigate(newPath, { replace: true });
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Community Polls
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vote on polls from your favorite journalists and help shape their content
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, maxWidth: 800, mx: 'auto' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          aria-label="poll categories"
        >
          <Tab label="All Polls" value={PollTab.ALL} />
          <Tab label="Trending" value={PollTab.TRENDING} />
          <Tab label="Funded" value={PollTab.FUNDED} />
        </Tabs>
      </Box>

      {/* Tag Filter Component */}
      <Box sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
        <TagFilter
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          contentType="polls"
          maxTags={4}
          showCounts={false}
        />
      </Box>

      {/* Polls List */}
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <PollsList
          filters={getFilters()}
          emptyTitle="No polls found"
          emptyDescription="There are no polls available in this category at the moment."
        />
      </Box>
    </Box>
  );
};

export default ListPoll; 