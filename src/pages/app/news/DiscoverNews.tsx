import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import TagFilter from '@/components/filters/TagFilter';
import NewsList from '@/components/news/NewsList';

const DiscoverNews: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    <Box sx={{ width: '100%', overflow: 'hidden', pb: 4 }}>
      {/* Tag Filter Component - Horizontal */}
      <Box sx={{ mb: 3 }}>
        <TagFilter
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          contentType="news"
          maxTags={5}
          showCounts={false}
          horizontal={true}
        />
      </Box>

      {/* News List - Grid Mode */}
      <Box>
        <NewsList
          filters={selectedTags.length > 0 ? { tags: selectedTags } : {}}
          emptyTitle="No news found"
          emptyDescription="No news articles available at the moment"
          mode="grid"
        />
      </Box>
    </Box>
  );
};

export default DiscoverNews;
