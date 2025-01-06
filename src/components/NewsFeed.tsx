import React, { useEffect, useState } from 'react';
import {
  Grid
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import Entry from './Entry';
import { News } from '../APIs/NewsAPI';
import { useApiContext } from '../contexts/ApiContext';

interface NewsFeedProps {
  selectedTag: string;
  isSubscribed?: boolean; // Optional prop to determine if it's subscribed feed
}

const NewsFeed: React.FC<NewsFeedProps> = ({ selectedTag, isSubscribed = false }) => {
  const [allNews, setAllNews] = useState<News[]>([]);
  const [firstLoad, setFirstLoad] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { api, isAuthenticated } = useApiContext();

  const fetchMoreData = () => {
    getNews(page + 1);
  };

  const getNews = async (_page: number = page) => {
    try {
      let newsResult;
      
      if (isSubscribed) {
        newsResult = await api?.newsApi.getSubscribedChannelNews(_page, limit);
      } else {
        newsResult = await api?.newsApi.getMostPopular(_page, limit);
      }
      
      if (_page === 1) {
        setAllNews(newsResult?.items ?? []);
      } else {
        setAllNews(prev => [...prev, ...(newsResult?.items ?? [])]);
      }
      
      setPage(newsResult?.metadata.currentPage ?? 1);
      setLimit(newsResult?.metadata.limit ?? 10);
      setHasMore(newsResult?.metadata.hasNext === true);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !firstLoad) {
      getNews(page);
      setFirstLoad(true);
    }
  }, [firstLoad]);

  return (
    <InfiniteScroll
      dataLength={allNews.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>No more news to display.</b>
        </p>
      }
    >
      <Grid container spacing={2}>
        {allNews.map((news) => (
          <Entry key={news.id} news={news} />
        ))}
      </Grid>
    </InfiniteScroll>
  );
};

export default NewsFeed;