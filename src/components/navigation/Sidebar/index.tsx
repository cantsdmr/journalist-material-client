import React from 'react';
import { 
  List, ListItem, ListItemIcon, ListItemText 
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExploreIcon from '@mui/icons-material/Explore';
import PeopleIcon from '@mui/icons-material/People';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import PollIcon from '@mui/icons-material/Poll';
import { PATHS } from '@/constants/paths';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();

  const menuItems = [
    { path: `${PATHS.APP_NEWS_TRENDING}`, icon: <TrendingUpIcon />, label: 'Trending' },
    { path: `${PATHS.APP_EXPLORE}`, icon: <ExploreIcon />, label: 'Explore' },
    { path: `${PATHS.APP_NEWS_MY_FEED}`, icon: <PeopleIcon />, label: 'Following' },
    { path: `${PATHS.APP_SUBSCRIPTIONS}`, icon: <SubscriptionsIcon />, label: 'Subscriptions' },
    { path: `${PATHS.APP_CHANNELS}`, icon: <RssFeedIcon />, label: 'Channels' },
    { path: `${PATHS.APP_POLLS}`, icon: <PollIcon />, label: 'Polls' }
  ];

  return (
    <List>
      {menuItems.map((item) => (
        <ListItem
          button
          component={Link}
          to={item.path}
          key={item.path}
          selected={location.pathname === item.path}
          sx={{
            borderRadius: 1,
            mx: 1,
            width: 'auto',
            '&.Mui-selected': {
              backgroundColor: 'action.selected',
            }
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;
