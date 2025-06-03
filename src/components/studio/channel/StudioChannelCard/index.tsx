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
  alpha,
  useTheme
} from '@mui/material';
import { Channel } from '@/types/index';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useApiContext } from '@/contexts/ApiContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useApiCall } from '@/hooks/useApiCall';

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
  const { execute } = useApiCall();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const theme = useTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    const result = await execute(
      () => api?.channelApi.deleteChannel(channel.id),
      {
        showSuccessMessage: true,
        successMessage: 'Channel deleted successfully'
      }
    );
    
    if (result) {
      onRefresh();
    }
    
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card 
        onClick={() => navigate(PATHS.STUDIO_CHANNEL_EDIT.replace(':channelId', channel.id))}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          cursor: 'pointer',
          transition: theme.transitions.create(['box-shadow', 'transform'], {
            duration: theme.transitions.duration.shorter
          }),
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme => `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
          }
        }}
      >
        <Box
          sx={{
            height: { xs: 100, sm: 120 },
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
              background: theme => `linear-gradient(180deg, 
                ${alpha(theme.palette.background.default, 0)} 0%, 
                ${alpha(theme.palette.background.default, 0.8)} 100%)`
            }
          }}
        >
          <IconButton
            onClick={handleMenuOpen}
            sx={{ 
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              color: 'text.primary',
              bgcolor: theme => alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(4px)',
              '&:hover': {
                bgcolor: theme => alpha(theme.palette.background.paper, 0.95)
              }
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
          <Stack spacing={{ xs: 1.5, sm: 2 }}>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: { xs: '1rem', sm: '1.125rem' }
                }}
              >
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
                  fontSize: { xs: '0.875rem', sm: '0.875rem' },
                  lineHeight: 1.5
                }}
              >
                {channel.description}
              </Typography>
            </Box>

            <Stack 
              direction="row" 
              spacing={1} 
              flexWrap="wrap"
              sx={{ gap: 1 }}
            >
              <Chip 
                size="small"
                label={`${channel?.stats?.activeMemberCount} members`}
                sx={{ 
                  height: 24,
                  fontSize: '0.75rem',
                  bgcolor: theme => alpha(theme.palette.primary.main, 
                    theme.palette.mode === 'dark' ? 0.15 : 0.08),
                  color: 'primary.main',
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
              <Chip 
                size="small"
                label={`10 news`}
                sx={{ 
                  height: 24,
                  fontSize: '0.75rem',
                  bgcolor: theme => alpha(theme.palette.secondary.main,
                    theme.palette.mode === 'dark' ? 0.15 : 0.08),
                  color: 'secondary.main',
                  '& .MuiChip-label': {
                    px: 1
                  }
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
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: { 
            width: 200,
            mt: 1
          }
        }}
      >
        <MenuItem onClick={() => {
          navigate(PATHS.STUDIO_CHANNEL_EDIT.replace(':channelId', channel.id));
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit Channel" />
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(PATHS.APP_CHANNEL_VIEW.replace(':channelId', channel.id));
          handleMenuClose();
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="View Public Page" />
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
          <ListItemText primary="Delete Channel" />
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