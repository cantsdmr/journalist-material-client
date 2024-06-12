import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import Entry from '../components/Entry';
import { allVideos, Video } from '../constants/videos';

const UserFeed: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(allVideos.slice(0, 5));
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchMoreData = () => {
    if (videos.length >= allVideos.length) {
      setHasMore(false);
      return;
    }
    // Simulate an API call to fetch more data
    setTimeout(() => {
      setVideos(videos.concat(allVideos.slice(videos.length, videos.length + 5)));
    }, 1500);
  };

  return (
    <Container maxWidth="md">
      <InfiniteScroll
        dataLength={videos.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <Grid container spacing={2}>
          {videos.map((video) => (
            <Entry key={video.id} video={video} />
          ))}
        </Grid>
      </InfiniteScroll>
    </Container>
  );
};

export default UserFeed;