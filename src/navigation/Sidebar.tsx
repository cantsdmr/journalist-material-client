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

const appPath = '/app';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <Box sx={{ width: isOpen ? 240 : 60, transition: 'width 0.3s' }}>
      <IconButton onClick={toggleSidebar} sx={{ display: isOpen ? 'none' : 'block', ml: 1 }}>
      </IconButton>
      <List>
        <ListItem button component={Link} to={`${appPath}/public-news`}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          {isOpen && <ListItemText primary="Feed" />}
        </ListItem>
        <ListItem button component={Link} to={`${appPath}/subscribed-news`}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          {isOpen && <ListItemText primary="Subscribed News" />}
        </ListItem>
        <ListItem button component={Link} to={`${appPath}/channels`}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          {isOpen && <ListItemText primary="Channels" />}
        </ListItem>
        <ListItem button component={Link} to={`${appPath}/subscriptions`}>
          <ListItemIcon><SubscriptionsIcon /></ListItemIcon>
          {isOpen && <ListItemText primary="Subscriptions" />}
        </ListItem>
        <ListItem button component={Link} to={`${appPath}/explore`}>
          <ListItemIcon><ExploreIcon /></ListItemIcon>
          {isOpen && <ListItemText primary="Explore" />}
        </ListItem>
        <ListItem button component={Link} to={`${appPath}/polls`}>
          <ListItemIcon><PollIcon /></ListItemIcon>
          {isOpen && <ListItemText primary="Polls" />}
        </ListItem>
      </List>
      {isOpen && <Divider />}
    </Box>
  );
};

export default Sidebar;
