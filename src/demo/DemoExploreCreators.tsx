import React from 'react';
import { Container, Grid, Card, CardContent, Avatar, Typography, Button } from '@mui/material';

const DemoExploreCreators = () => {
    const creators = [
        { id: 1, name: "John Doe", bio: "Climate journalist", avatar: "https://via.placeholder.com/150" },
        { id: 2, name: "Jane Smith", bio: "Tech expert", avatar: "https://via.placeholder.com/150" },
    ];

    return (
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Explore Creators
            </Typography>
            <Grid container spacing={4}>
                {creators.map((creator) => (
                    <Grid item xs={12} sm={6} md={4} key={creator.id}>
                        <Card>
                            <CardContent>
                                <Avatar src={creator.avatar} alt={creator.name} style={{ width: 100, height: 100, margin: '0 auto' }} />
                                <Typography variant="h6" style={{ textAlign: 'center', marginTop: '10px' }}>
                                    {creator.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" style={{ textAlign: 'center' }}>
                                    {creator.bio}
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    style={{ marginTop: '15px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                                >
                                    View Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default DemoExploreCreators;
