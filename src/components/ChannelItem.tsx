import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Avatar,
  Button,
  Stack,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Channel } from '../APIs/ChannelAPI';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

interface ChannelItemProps {
  channel: Channel;
  onFollow: (channelId: string) => void;
  onUnfollow: (channelId: string) => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ 
  channel, 
  onFollow,
  onUnfollow
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/app/channels/${channel.id}`);
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (channel.isFollowing) {
      onUnfollow(channel.id);
    } else {
      onFollow(channel.id);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        }
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute',
          top: -20,
          left: 24,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Avatar 
          src={channel.logoUrl} 
          sx={{ 
            width: 56, 
            height: 56,
            border: '3px solid white',
            boxShadow: 2,
            backgroundColor: 'primary.main'
          }}
        />
        <IconButton
          size="small"
          onClick={handleFollow}
          sx={{ 
            backgroundColor: channel.isFollowing ? 'success.main' : 'primary.main',
            color: 'white',
            width: 32,
            height: 32,
            '&:hover': {
              backgroundColor: channel.isFollowing ? 'success.dark' : 'primary.dark',
            }
          }}
        >
          {channel.isFollowing ? <CheckIcon /> : <AddIcon />}
        </IconButton>
      </Box>

      <CardContent sx={{ pt: 5, pb: 2 }}>
        <Stack spacing={2} sx={{ height: '100%' }}>
          <Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                mb: 0.5,
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
              onClick={handleClick}
            >
              {channel.name}
            </Typography>
            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center"
            >
              <PersonOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
              >
                {channel.followers?.toLocaleString() || 0} followers
              </Typography>
            </Stack>
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '40px',
              flex: 1
            }}
          >
            {channel.description}
          </Typography>

          <Button
            variant="text"
            color="primary"
            size="small"
            endIcon={<ArrowForwardIcon />}
            onClick={handleClick}
            sx={{ 
              alignSelf: 'flex-start',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main'
              }
            }}
          >
            View Channel
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChannelItem; 