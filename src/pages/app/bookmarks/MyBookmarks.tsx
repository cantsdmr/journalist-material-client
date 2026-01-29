import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Container
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useApiContext } from '@/contexts/ApiContext';
import { useCursorPagination } from '@/hooks/useCursorPagination';
import NewsEntry from '@/components/news/NewsEntry';
import PollCard from '@/components/poll/PollCard';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { News, Poll } from '@/types/index';
import { BOOKMARKABLE_TYPE } from '@/enums/BookmarkEnums';

type TabValue = 0 | 1 | 2; // 0 = all, 1 = news, 2 = poll

interface BookmarkedItem {
  id: string;
  bookmarkedAt: string;
  type: number; // 1 = news, 2 = poll
  content: News | Poll;
}

const MyBookmarks: React.FC = () => {
  const { api } = useApiContext();
  const [activeTab, setActiveTab] = useState<TabValue>(0); // 0 = all

  // Cursor pagination for 'all' bookmarks
  const allBookmarks = useCursorPagination<BookmarkedItem>({
    fetcher: async (_, cursor, limit) => {
      return api.app.bookmark.getBookmarks(0, { // 0 = all
        after: cursor,
        limit: limit || 20
      });
    },
    pageSize: 20,
    autoFetch: false
  });

  // Cursor pagination for 'news' bookmarks
  const newsBookmarks = useCursorPagination<News>({
    fetcher: async (_, cursor, limit) => {
      return api.app.bookmark.getBookmarkedNews({
        after: cursor,
        limit: limit || 20
      });
    },
    pageSize: 20,
    autoFetch: false
  });

  // Cursor pagination for 'poll' bookmarks
  const pollBookmarks = useCursorPagination<Poll>({
    fetcher: async (_, cursor, limit) => {
      return api.app.bookmark.getBookmarkedPolls({
        after: cursor,
        limit: limit || 20
      });
    },
    pageSize: 20,
    autoFetch: false
  });

  // Get current pagination state based on active tab
  const getCurrentPagination = () => {
    switch (activeTab) {
      case 0: // all
        return allBookmarks;
      case 1: // news
        return newsBookmarks;
      case 2: // poll
        return pollBookmarks;
      default:
        return allBookmarks;
    }
  };

  const currentPagination = getCurrentPagination();

  // Fetch data when tab changes
  useEffect(() => {
    currentPagination.fetchInitial();
  }, [activeTab]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  // Empty state
  const renderEmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        px: 3
      }}
    >
      <BookmarkIcon
        sx={{
          fontSize: 80,
          color: 'text.disabled',
          mb: 2
        }}
      />
      <Typography variant="h5" gutterBottom fontWeight={600}>
        No bookmarks yet
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {activeTab === 0 && 'Start bookmarking news and polls to see them here'}
        {activeTab === 1 && 'You haven\'t bookmarked any news articles yet'}
        {activeTab === 2 && 'You haven\'t bookmarked any polls yet'}
      </Typography>
    </Box>
  );

  // Loading spinner
  const renderLoader = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress />
    </Box>
  );

  // Render items based on type
  const renderItems = () => {
    if (activeTab === 0) { // all
      return (allBookmarks.items as BookmarkedItem[]).map((item) => (
        <Box key={item.id} sx={{ mb: 2 }}>
          {item.type === BOOKMARKABLE_TYPE.NEWS ? (
            <NewsEntry news={item.content as News} mode="grid" />
          ) : (
            <PollCard poll={item.content as Poll} mode="grid" showAsPreview />
          )}
        </Box>
      ));
    } else if (activeTab === 1) { // news
      return (newsBookmarks.items as News[]).map((news) => (
        <Box key={news.id} sx={{ mb: 2 }}>
          <NewsEntry news={news} mode="grid" />
        </Box>
      ));
    } else { // poll
      return (pollBookmarks.items as Poll[]).map((poll) => (
        <Box key={poll.id} sx={{ mb: 2 }}>
          <PollCard poll={poll} mode="grid" showAsPreview />
        </Box>
      ));
    }
  };

  const isInitialLoading = currentPagination.isLoading && currentPagination.items.length === 0;

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header */}
        <Typography variant="h4" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
          My Bookmarks
        </Typography>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 3
          }}
        >
          <Tab label="All" value={0} />
          <Tab label="News" value={1} />
          <Tab label="Polls" value={2} />
        </Tabs>

        {/* Content */}
        {isInitialLoading ? (
          renderLoader()
        ) : currentPagination.items.length === 0 ? (
          renderEmptyState()
        ) : (
          <InfiniteScroll
            dataLength={currentPagination.items.length}
            next={currentPagination.loadMore}
            hasMore={currentPagination.hasMore}
            loader={renderLoader()}
            endMessage={
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  You've reached the end of your bookmarks
                </Typography>
              </Box>
            }
            style={{ overflow: 'visible' }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: 2
              }}
            >
              {renderItems()}
            </Box>
          </InfiniteScroll>
        )}
      </Container>
    </Box>
  );
};

export default MyBookmarks;
