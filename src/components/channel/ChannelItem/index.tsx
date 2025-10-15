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
import { Channel, SubscriptionTier } from '@/types/index';
import PeopleIcon from '@mui/icons-material/People';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { PATHS } from '@/constants/paths';

interface ChannelItemProps {
  channel: Channel;
  hasSubscription: boolean;
  subscriptionTier: SubscriptionTier | null;
  onJoin: (channelId: string, tierId?: string) => void;
  onCancel: (channelId: string) => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ 
  channel, 
  hasSubscription,
  subscriptionTier,
  onJoin,
  onCancel
}) => {
  const navigate = useNavigate();
  const currentSubscription = hasSubscription;
  const currentTier = subscriptionTier;
  const defaultTier = channel.tiers?.find(tier => tier.isDefault);

  const handleClick = () => {
    navigate(PATHS.APP_CHANNEL_VIEW.replace(':channelId', channel.id));
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSubscription) {
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
        gap: 1.5,
        p: 1.5,
        borderRadius: 1.5,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        height: '100%',
        border: '1px solid',
        borderColor: 'transparent',
        '&:hover': {
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.05)
              : alpha(theme.palette.common.black, 0.03),
          borderColor: 'divider',
          transform: 'translateX(4px)'
        }
      }}
    >
      <Avatar
        src={channel.logoUrl}
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1.5,
          bgcolor: 'primary.main'
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 0.5
        }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '0.9rem'
            }}
          >
            {channel.name}
          </Typography>

          {currentSubscription ? (
            <Chip
              label={currentTier?.name}
              color="primary"
              onDelete={handleJoin}
              size="small"
              sx={{ height: 24 }}
            />
          ) : (
            <IconButton
              size="small"
              onClick={handleJoin}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: 32,
                height: 32,
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              <WorkspacePremiumIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '0.8rem'
          }}
        >
          {channel.description}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            color: 'text.secondary',
            fontSize: '0.75rem'
          }}
        >
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            <PeopleIcon sx={{ fontSize: 14 }} />
            {channel.stats?.activeSubscriptionCount?.toLocaleString('en-US', {
              notation: 'compact',
              maximumFractionDigits: 1
            })}
          </Box>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            <WorkspacePremiumIcon sx={{ fontSize: 14 }} />
            {channel.stats?.tierCount || 0} Tiers
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ChannelItem; 