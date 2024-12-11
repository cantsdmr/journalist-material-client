import React from 'react';
import { Container, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button } from '@mui/material';

const DemoSupporterDashboard = () => {
    const supportedCreators = [
        {
            id: 1,
            name: "John Doe",
            avatar: "https://via.placeholder.com/150",
            recentPost: "The Future of Renewable Energy",
        },
        {
            id: 2,
            name: "Jane Smith",
            avatar: "https://via.placeholder.com/150",
            recentPost: "Tech Innovations in 2024",
        },
    ];

    return (
        <Container maxWidth="md" style={{ marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Your Dashboard
            </Typography>
            <Typography variant="h6" gutterBottom>
                Supported Creators
            </Typography>
            <List>
                {supportedCreators.map((creator) => (
                    <ListItem key={creator.id}>
                        <ListItemAvatar>
                            <Avatar src={creator.avatar} alt={creator.name} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={creator.name}
                            secondary={`Recent post: ${creator.recentPost}`}
                        />
                        <Button variant="contained" size="small">
                            View Profile
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default DemoSupporterDashboard;
