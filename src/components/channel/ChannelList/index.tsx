import React from 'react';
import { 
  Box,
  Typography,
  Avatar,
  IconButton,
  Stack,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Channel } from '@/APIs/ChannelAPI';
import PeopleIcon from '@mui/icons-material/People';
// import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import { useProfile } from '@/contexts/ProfileContext';
import { PATHS } from '@/constants/paths';

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
  const { 
    channelRelations: {
      hasMembership,
    }
  } = useProfile();

  const isUserFollowing = hasMembership(channel.id);

  const handleClick = () => {
    navigate(PATHS.APP_CHANNEL_VIEW.replace(':channelId', channel.id));
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUserFollowing) {
      onUnfollow(channel.id);
    } else {
      onFollow(channel.id);
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        p: 2,
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          bgcolor: (theme) => 
            theme.palette.mode === 'dark' 
              ? alpha(theme.palette.common.white, 0.05)
              : alpha(theme.palette.common.black, 0.03),
          transform: 'translateX(4px)'
        }
      }}
    >
      <Avatar 
        src={channel.logoUrl} 
        sx={{ 
          width: 56, 
          height: 56,
          borderRadius: 2,
          bgcolor: 'primary.main'
        }}
      />

      <Box sx={{ flex: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 0.5
        }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            {channel.name}
          </Typography>

          <IconButton
            size="small"
            onClick={handleFollow}
            sx={{ 
              bgcolor: isUserFollowing ? 'success.main' : 'primary.main',
              color: 'white',
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: isUserFollowing ? 'success.dark' : 'primary.dark',
              }
            }}
          >
            {isUserFollowing ? <CheckIcon /> : <AddIcon />}
          </IconButton>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {channel.description}
        </Typography>

        <Stack 
          direction="row" 
          spacing={2}
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.875rem'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: isUserFollowing ? 'primary.main' : 'inherit'
          }}>
            <PeopleIcon sx={{ fontSize: 16 }} />
            {channel.stats?.activeMemberCount?.toLocaleString('en-US', { 
              notation: 'compact',
              maximumFractionDigits: 1 
            })}
          </Box>
          {/* <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: hasSubscription ? 'primary.main' : 'inherit'
          }}>
            <WorkspacePremiumIcon sx={{ fontSize: 16 }} />
            {channel.subscriberCount.toLocaleString('en-US', { 
              notation: 'compact',
              maximumFractionDigits: 1 
            })}
          </Box> */}
        </Stack>
      </Box>
    </Box>
  );
};

export default ChannelItem; 