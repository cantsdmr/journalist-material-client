import React from 'react';
import { 
  Box, Drawer, Toolbar, List, ListItem,
  ListItemIcon, ListItemText, Typography, Divider
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import PollIcon from '@mui/icons-material/Poll';
import AddChartIcon from '@mui/icons-material/AddChart';
import SearchIcon from '@mui/icons-material/Search';
import { PATHS } from '@/constants/paths';

interface StudioSidebarProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

const StudioSidebar: React.FC<StudioSidebarProps> = ({ 
  mobileOpen, 
  onDrawerToggle 
}) => {
  const location = useLocation();
  const isMobile = window.innerWidth <= 600;

  const generalItems = [
    { 
      path: PATHS.STUDIO_SEARCH, 
      icon: <SearchIcon />, 
      label: 'Search' 
    },
  ];

  const menuItems = {
    news: [
      { 
        path: PATHS.STUDIO_NEWS, 
        icon: <NewspaperIcon />, 
        label: 'My News' 
      },
      { 
        path: PATHS.STUDIO_NEWS_CREATE, 
        icon: <PostAddIcon />, 
        label: 'Create News' 
      },
    ],
    channels: [
      { 
        path: PATHS.STUDIO_CHANNELS, 
        icon: <RssFeedIcon />, 
        label: 'My Channels' 
      },
      { 
        path: PATHS.STUDIO_CHANNEL_CREATE, 
        icon: <AddToQueueIcon />, 
        label: 'Create Channel' 
      },
    ],
    polls: [
      { 
        path: PATHS.STUDIO_POLLS, 
        icon: <PollIcon />, 
        label: 'My Polls' 
      },
      {
        path: PATHS.STUDIO_POLL_CREATE,
        icon: <AddChartIcon />,
        label: 'Create Poll'
      }
    ]
  };

  const drawer = (
    <Box>
      <Toolbar />
      <List sx={{ px: 2 }}>
        {/* General Section */}
        <Typography
          variant="overline"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'text.secondary',
            ml: 1,
            mb: 1
          }}
        >
          General
        </Typography>
        {generalItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 40,
                color: location.pathname === item.path ? 'primary.main' : 'inherit'
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: location.pathname === item.path ? 600 : 400
              }}
            />
          </ListItem>
        ))}

        <Divider sx={{ my: 2 }} />

        {/* News Management Section */}
        <Typography
          variant="overline"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'text.secondary',
            ml: 1,
            mb: 1
          }}
        >
          News Management
        </Typography>
        {menuItems.news.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 40,
                color: location.pathname === item.path ? 'primary.main' : 'inherit'
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: location.pathname === item.path ? 600 : 400
              }}
            />
          </ListItem>
        ))}

        <Divider sx={{ my: 2 }} />

        {/* Channel Management Section */}
        <Typography
          variant="overline"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'text.secondary',
            ml: 1,
            mb: 1
          }}
        >
          Channel Management
        </Typography>
        {menuItems.channels.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 40,
                color: location.pathname === item.path ? 'primary.main' : 'inherit'
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: location.pathname === item.path ? 600 : 400
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Poll Management Section */}
      <Divider sx={{ my: 2 }} />
      <List sx={{ px: 2 }}>
        <Typography
          variant="overline"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'text.secondary',
            ml: 1,
            mb: 1
          }}
        >
          Poll Management
        </Typography>
        {menuItems.polls.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 40,
                color: location.pathname === item.path ? 'primary.main' : 'inherit'
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: location.pathname === item.path ? 600 : 400
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              height: '100%',
              bgcolor: 'background.default'
            }
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: 240,
              border: 'none'
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          PaperProps={{
            sx: {
              height: '100%',
              bgcolor: 'background.default'
            }
          }}
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              transition: 'width 0.2s',
              overflowX: 'hidden',
              border: 'none',
              borderRight: 'none'
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default StudioSidebar; 