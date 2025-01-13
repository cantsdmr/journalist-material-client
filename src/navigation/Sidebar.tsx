import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box,
  useMediaQuery
} from '@mui/material';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ExploreIcon from '@mui/icons-material/Explore';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const appPath = '/app';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)');

  const menuItems = [
    { path: '/trending', icon: <TrendingUpIcon />, label: 'Trending' },
    { path: '/explore', icon: <ExploreIcon />, label: 'Explore' },
    { path: '/my-feed', icon: <NewspaperIcon />, label: 'My Feed' },
    { path: '/channels', icon: <RssFeedIcon />, label: 'Channels' },
    { path: '/subscriptions', icon: <SubscriptionsIcon />, label: 'Following' },
  ];

  return (
    <Box
      sx={{
        width: isOpen ? '100%' : '48px',
        height: '100%',
        bgcolor: 'background.default',
        transition: 'width 0.2s'
      }}
    >
      <List sx={{ py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === `${appPath}${item.path}`;
          return (
            <ListItem
              key={item.path}
              component={Link}
              to={`${appPath}${item.path}`}
              onClick={() => {
                if (isMobile) {
                  toggleSidebar();
                }
              }}
              sx={{
                px: isOpen ? 3 : 1.5,
                py: 1.5,
                color: isActive ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover'
                },
                borderRadius: 1,
                mx: isOpen ? 1 : 0.25,
                justifyContent: isOpen ? 'flex-start' : 'center'
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isOpen ? 40 : 32,
                  color: 'inherit',
                  justifyContent: 'center'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  ml: 1,
                  opacity: isOpen ? 1 : 0,
                  transition: 'opacity 0.2s',
                  width: isOpen ? 'auto' : 0,
                  '& .MuiTypography-root': {
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                    whiteSpace: 'nowrap'
                  }
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
