import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Chip,
  alpha
} from '@mui/material';
import { Channel } from '@/APIs/ChannelAPI';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useApiContext } from '@/contexts/ApiContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface StudioChannelCardProps {
  channel: Channel;
  onRefresh: () => void;
}

const StudioChannelCard: React.FC<StudioChannelCardProps> = ({ 
  channel,
  onRefresh
}) => {
  const navigate = useNavigate();
  const { api } = useApiContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      await api?.channelApi.deleteChannel(channel.id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete channel:', error);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          '&:hover': {
            boxShadow: theme => `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`
          }
        }}
      >
        {/* Banner Image */}
        <Box
          sx={{
            height: 120,
            backgroundImage: `url(${channel?.bannerUrl || 'https://via.placeholder.com/600x400'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius: 1,
            borderTopRightRadius: 1,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
            }
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1
            }}
          >
            <IconButton
              onClick={handleMenuOpen}
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.4)'
                }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {channel.name}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 2
                }}
              >
                {channel.description}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <Chip 
                size="small"
                label={`${channel.subscriberCount} subscribers`}
                sx={{ 
                  bgcolor: theme => 
                    theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.primary.main, 0.05),
                  color: 'primary.main'
                }}
              />
              <Chip 
                size="small"
                label={`10 news`}
                sx={{ 
                  bgcolor: theme =>
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.secondary.main, 0.1)
                      : alpha(theme.palette.secondary.main, 0.05),
                  color: 'secondary.main'
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 200 }
        }}
      >
        <MenuItem onClick={() => {
          navigate(PATHS.STUDIO_CHANNEL_EDIT.replace(':channelId', channel.id));
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Channel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/app/channels/${channel.id}`);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Public Page</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            setDeleteDialogOpen(true);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Channel</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Channel"
        content="Are you sure you want to delete this channel? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
      />
    </>
  );
};

export default StudioChannelCard; 