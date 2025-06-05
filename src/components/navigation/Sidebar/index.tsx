import React from 'react';
import { 
  List, ListItem, ListItemIcon, ListItemText, Typography, Box 
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import ExploreIcon from '@mui/icons-material/Explore';
import PeopleIcon from '@mui/icons-material/People';
// import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import PollIcon from '@mui/icons-material/Poll';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import SearchIcon from '@mui/icons-material/Search';
import { PATHS } from '@/constants/paths';
import { VERSION } from '@/constants/values';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: `${PATHS.APP_NEWS_MY_FEED}`, icon: <PeopleIcon />, label: 'Feed' },
    { path: `${PATHS.APP_NEWS_TRENDING}`, icon: <TrendingUpIcon />, label: 'Popular' },
    // { path: `${PATHS.APP_SEARCH}`, icon: <SearchIcon />, label: 'Search' },
    // { path: `${PATHS.APP_EXPLORE}`, icon: <ExploreIcon />, label: 'Explore' },
    // { path: `${PATHS.APP_SUBSCRIPTIONS}`, icon: <SubscriptionsIcon />, label: 'Subscriptions' },
    { path: `${PATHS.APP_CHANNELS}`, icon: <RssFeedIcon />, label: 'Channels' },
    { path: `${PATHS.APP_POLLS}`, icon: <PollIcon />, label: 'Polls' },
    { path: `${PATHS.APP_ACCOUNT}`, icon: <AccountCircleIcon />, label: 'Account' }
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <List sx={{ flexGrow: 1 }}>
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
      
      {/* Version display at bottom of sidebar */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
          sx={{ 
            fontSize: '0.75rem',
            opacity: 0.7,
            display: isOpen ? 'block' : 'none'
          }}
        >
          MetaJourno v{VERSION}
        </Typography>
        {!isOpen && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ 
              fontSize: '0.625rem',
              opacity: 0.7,
              lineHeight: 1.2
            }}
          >
            v{VERSION}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
