import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ExploreIcon from '@mui/icons-material/Explore';
import PollIcon from '@mui/icons-material/Poll';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const demoPath = '/demo';

const DemoSidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <Box sx={{ width: isOpen ? 240 : 60, transition: 'width 0.3s' }}>
      <IconButton onClick={toggleSidebar} sx={{ display: isOpen ? 'none' : 'block', ml: 1 }}>
      </IconButton>
      <List>
        <ListItem button component={Link} to={`${demoPath}/creator-profile`}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          {isOpen && <ListItemText primary="Creator Profile" />}
        </ListItem>
        <ListItem button component={Link} to={`${demoPath}/explore-creators`}>
          <ListItemIcon><SubscriptionsIcon /></ListItemIcon>
          {isOpen && <ListItemText primary="Explore Creators" />}
        </ListItem>
        <ListItem button component={Link} to={`${demoPath}/supporter-dashboard`}>
          <ListItemIcon><ExploreIcon /></ListItemIcon>
          {isOpen && <ListItemText primary="Supporter Dashboard" />}
        </ListItem>
        <ListItem button component={Link} to={`${demoPath}/news-feed`}>
          <ListItemIcon><PollIcon /></ListItemIcon>
          {isOpen && <ListItemText primary="News Feed" />}
        </ListItem>
        <ListItem button component={Link} to={`${demoPath}/demo-poll`}>
          <ListItemIcon><PollIcon /></ListItemIcon>
          {isOpen && <ListItemText primary="Poll" />}
        </ListItem>
      </List>
      {isOpen && <Divider />}
    </Box>
  );
};

export default DemoSidebar;
