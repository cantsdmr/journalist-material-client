import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Avatar } from '@mui/material';

const DemoNewsFeed = () => {
    const posts = [
        {
            id: 1,
            title: "Breaking News: Climate Change Report",
            creator: "John Doe",
            avatar: "https://via.placeholder.com/150",
            preview: "A deep dive into the latest IPCC report...",
            date: "Dec 5, 2024",
        },
        {
            id: 2,
            title: "Tech Innovations in 2024",
            creator: "Jane Smith",
            avatar: "https://via.placeholder.com/150",
            preview: "Exploring the latest AI advancements...",
            date: "Dec 4, 2024",
        },
    ];

    return (
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Latest News from Creators
            </Typography>
            <Grid container spacing={3}>
                {posts.map((post) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <Card>
                            <CardContent>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item>
                                        <Avatar src={post.avatar} alt={post.creator} />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6">{post.title}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            by {post.creator} on {post.date}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant="body1" style={{ marginTop: '10px' }}>
                                    {post.preview}
                                </Typography>
                                <Button
                                    size="small"
                                    variant="contained"
                                    style={{ marginTop: '15px' }}
                                >
                                    Read More
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default DemoNewsFeed;
