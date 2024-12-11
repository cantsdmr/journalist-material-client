import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import Entry from '../components/Entry';
import { News } from '../APIs/NewsAPI';
import { useApiContext } from '../contexts/ApiContext';

const UserFeed: React.FC = () => {
  const [allNews, setAllNews] = useState<News[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { api, isAuthenticated } = useApiContext();

  const fetchMoreData = () => {
    getNews(page + 1)
  };

  const getNews = async (_page: number = page) => {
    const newsResult = await api?.newsApi.list(`most-popular`, {
      page: _page,
      limit
    });
    setAllNews(allNews.concat(newsResult?.items ?? []));
    setPage(newsResult?._meta.currentPage ?? 1)
    setLimit(newsResult?._meta.limit ?? 1)
    setHasMore(newsResult?._meta.hasNext === true)
  }

  useEffect(() => {
    if (isAuthenticated) {
      getNews()
    }
  }, [api?.newsApi != null, isAuthenticated])


  return (
    <Container maxWidth="md">
      <InfiniteScroll
        dataLength={allNews.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>No more records to display.</b>
          </p>
        }
      >
        <Grid container spacing={2}>
          {allNews.map((video) => (
            <Entry key={video.id} news={video} />
          ))}
        </Grid>
      </InfiniteScroll>
    </Container>
  );
};

export default UserFeed;