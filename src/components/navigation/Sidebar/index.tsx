import React, { useEffect, useState } from 'react';
import {
  List, ListItem, ListItemIcon, ListItemText, Typography, Box, Avatar, Divider
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExploreIcon from '@mui/icons-material/Explore';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import HomeIcon from '@mui/icons-material/Home';
import PollIcon from '@mui/icons-material/Poll';
import { PATHS } from '@/constants/paths';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import { Channel } from '@/types/index';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { api } = useApiContext();
  const { execute } = useApiCall();
  const [popularChannels, setPopularChannels] = useState<Channel[]>([]);

  const menuItems = [
    { path: `${PATHS.APP_NEWS_MY_FEED}`, icon: <HomeIcon />, label: 'For you' },
    { path: `${PATHS.APP_NEWS_DISCOVER}`, icon: <ExploreIcon />, label: 'Discover' },
    { path: `${PATHS.APP_POLLS}`, icon: <PollIcon />, label: 'Polls' },
    { path: `${PATHS.APP_CHANNELS}`, icon: <RssFeedIcon />, label: 'Channels' },
  ];

  const exploreCategories = [
    { path: `${PATHS.APP_NEWS_TRENDING}`, icon: <TrendingUpIcon />, label: 'Trending' },
  ];

  useEffect(() => {
    const fetchPopularChannels = async () => {
      const response = await execute(
        () => api?.app.channel.getChannels({}, { page: 1, limit: 5 }),
        { showErrorToast: false }
      );
      if (response) {
        setPopularChannels(response.items);
      }
    };
    if (isOpen) {
      fetchPopularChannels();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 1 }}>
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
                mx: 0.5,
                justifyContent: 'center',
                minHeight: 48,
                '&.Mui-selected': {
                  backgroundColor: 'action.selected',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 'auto' }}>{item.icon}</ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto', p: 2 }}>
      {/* Main Navigation */}
      <List sx={{ pt: 0, pb: 0 }}>
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
              mb: 0.5,
              py: 1,
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                fontWeight: 600,
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
                fontSize: '0.95rem'
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Explore Categories */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.5px'
          }}
        >
          Categories
        </Typography>
      </Box>
      <List sx={{ pt: 0, pb: 1 }}>
        {exploreCategories.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.path}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              py: 0.75,
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.9rem'
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Popular Channels Section */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.5px'
          }}
        >
          Popular
        </Typography>
      </Box>
      <List sx={{ pt: 0, pb: 1, flexGrow: 1 }}>
        {popularChannels.map((channel) => (
          <ListItem
            button
            component={Link}
            to={`${PATHS.APP_CHANNELS}/${channel.id}`}
            key={channel.id}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              py: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <Avatar
              src={channel.logoUrl}
              sx={{ width: 32, height: 32, mr: 1.5 }}
            >
              {channel.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {channel.name}
                </Typography>
                {/* {channel.isVerified && (
                  <CheckCircleIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                )} */}
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>

    </Box>
  );
};

export default Sidebar;
