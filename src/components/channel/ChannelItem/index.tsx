import React from 'react';
import { 
  Box,
  Typography,
  Avatar,
  IconButton,
  Stack,
  alpha,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Channel, ChannelTier } from '@/APIs/ChannelAPI';
import PeopleIcon from '@mui/icons-material/People';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { PATHS } from '@/constants/paths';

interface ChannelItemProps {
  channel: Channel;
  hasMembership: boolean;
  membershipTier: ChannelTier | null;
  onJoin: (channelId: string, tierId?: string) => void;
  onCancel: (channelId: string) => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ 
  channel, 
  hasMembership,
  membershipTier,
  onJoin,
  onCancel
}) => {
  const navigate = useNavigate();
  const currentMembership = hasMembership;
  const currentTier = membershipTier;
  const defaultTier = channel.tiers?.find(tier => tier.isDefault);

  const handleClick = () => {
    navigate(PATHS.APP_CHANNEL_VIEW.replace(':channelId', channel.id));
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMembership) {
      onCancel(channel.id);
    } else {
      onJoin(channel.id, defaultTier?.id);
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

          {currentMembership ? (
            <Chip
              label={currentTier?.name}
              color="primary"
              onDelete={handleJoin}
              size="small"
            />
          ) : (
            <IconButton
              size="small"
              onClick={handleJoin}
              sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              <WorkspacePremiumIcon />
            </IconButton>
          )}
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
            gap: 0.5
          }}>
            <PeopleIcon sx={{ fontSize: 16 }} />
            {channel.stats?.activeMemberCount?.toLocaleString('en-US', { 
              notation: 'compact',
              maximumFractionDigits: 1 
            })}
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5
          }}>
            <WorkspacePremiumIcon sx={{ fontSize: 16 }} />
            {channel.stats?.tierCount || 0} Tiers
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ChannelItem; 