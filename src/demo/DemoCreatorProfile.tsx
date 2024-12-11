import React from 'react';
import { Container, Grid, Avatar, Typography, Card, CardContent, Button } from '@mui/material';

const DemoCreatorProfile = () => {
    const creator = {
        name: "John Doe",
        avatar: "https://via.placeholder.com/150",
        bio: "Independent journalist focused on climate and sustainability.",
        posts: [
            {
                id: 1,
                title: "The Future of Renewable Energy",
                date: "Dec 1, 2024",
                preview: "An in-depth look at the latest trends in renewable energy...",
            },
            {
                id: 2,
                title: "Wildfires and Their Impact on Biodiversity",
                date: "Nov 28, 2024",
                preview: "Exploring the devastating effects of wildfires on ecosystems...",
            },
        ],
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                    <Avatar
                        src={creator.avatar}
                        alt={creator.name}
                        style={{ width: 150, height: 150 }}
                    />
                    <Typography variant="h5" style={{ marginTop: '10px' }}>
                        {creator.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {creator.bio}
                    </Typography>
                    <Button
                        variant="contained"
                        style={{ marginTop: '20px' }}
                    >
                        Support {creator.name}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Typography variant="h6" gutterBottom>
                        Latest Posts
                    </Typography>
                    {creator.posts.map((post) => (
                        <Card key={post.id} style={{ marginBottom: '20px' }}>
                            <CardContent>
                                <Typography variant="h6">{post.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {post.date}
                                </Typography>
                                <Typography variant="body1" style={{ marginTop: '10px' }}>
                                    {post.preview}
                                </Typography>
                                <Button
                                    size="small"
                                    variant="text"
                                    style={{ marginTop: '10px' }}
                                >
                                    Read More
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
            </Grid>
        </Container>
    );
};

export default DemoCreatorProfile;
