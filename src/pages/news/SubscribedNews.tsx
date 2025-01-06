import React, { useState } from 'react';
import { Container } from '@mui/material';
import NewsFeed from '../../components/NewsFeed';
import NewsTags from '../../components/NewsTags';

const Feed: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const handleTagSelect = (tagId: string) => {
    setSelectedTag(tagId);
  };

  return (
    <Container maxWidth="xl">
      <NewsTags 
        selectedTag={selectedTag}
        onTagSelect={handleTagSelect}
      />
      <NewsFeed 
        selectedTag={selectedTag}
        isSubscribed={true}
      />
    </Container>
  );
};

export default Feed;
