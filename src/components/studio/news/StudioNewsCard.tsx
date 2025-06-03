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
import { News } from '@/types/index';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useApiContext } from '@/contexts/ApiContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useApiCall } from '@/hooks/useApiCall';
import { NEWS_MEDIA_TYPE } from '@/enums/NewsEnums';
import DefaultNewsAvatar from '@/assets/BG_journo.png';
import CampaignIcon from '@mui/icons-material/Campaign';

interface StudioNewsCardProps {
  news: News;
  onRefresh: () => void;
}

const StudioNewsCard: React.FC<StudioNewsCardProps> = ({
  news,
  onRefresh
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { api } = useApiContext();
  const { execute } = useApiCall();
  const theme = useTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    navigate(PATHS.APP_NEWS_VIEW.replace(':id', news.id));
    handleMenuClose();
  };

  const handleEdit = () => {
    navigate(PATHS.STUDIO_NEWS_EDIT.replace(':id', news.id));
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    const result = await execute(
      () => api?.newsApi.delete(news.id),
      {
        showSuccessMessage: true,
        successMessage: 'News article deleted successfully'
      }
    );
    
    if (result) {
      onRefresh();
    }
    
    setDeleteDialogOpen(false);
  };

  const coverImage = news.media?.find(m => m.type === NEWS_MEDIA_TYPE.COVER);

  const getStatusColor = () => {
    const now = new Date();
    const publishedAt = new Date(news.publishedAt);
    
    if (publishedAt > now) {
      return { label: 'Scheduled', color: 'warning' as const };
    } else {
      return { label: 'Published', color: 'success' as const };
    }
  };

  const status = getStatusColor();

  return (
    <Card
      onClick={() => navigate(PATHS.STUDIO_NEWS_VIEW.replace(':id', news.id))}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        bgcolor: theme => alpha(
          theme.palette.mode === 'dark' 
            ? theme.palette.common.white 
            : theme.palette.common.black,
          theme.palette.mode === 'dark' ? 0.05 : 0.03
        ),
        transition: theme.transitions.create(['background-color', 'box-shadow', 'transform']),
        '&:hover': {
          bgcolor: theme => alpha(
            theme.palette.mode === 'dark'
              ? theme.palette.common.white
              : theme.palette.common.black,
            theme.palette.mode === 'dark' ? 0.08 : 0.05
          ),
          transform: 'translateY(-2px)',
          boxShadow: theme => `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
        }
      }}
    >
      <Box
        sx={{
          height: { xs: 120, sm: 140 },
          backgroundImage: `url(${coverImage?.url || DefaultNewsAvatar})`,
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
                fontSize: { xs: '1rem', sm: '1.125rem' },
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3
              }}
            >
              {news.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CampaignIcon 
                sx={{ 
                  fontSize: '0.875rem', 
                  mr: 0.5, 
                  color: 'text.secondary' 
                }} 
              />
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {news.channel.name}
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                lineHeight: 1.4
              }}
            >
              {news.content?.substring(0, 100) + '...'}
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
              label={status.label}
              color={status.color}
              sx={{ 
                height: 24,
                fontSize: '0.75rem',
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
            <Chip 
              size="small"
              label={new Date(news.publishedAt).toLocaleDateString()}
              sx={{ 
                height: 24,
                fontSize: '0.75rem',
                bgcolor: theme => alpha(theme.palette.text.secondary, 0.1),
                color: 'text.secondary',
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
            {news?.tags?.length > 0 && (
              <Chip 
                size="small"
                label={`${news.tags.length} tags`}
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
            )}
          </Stack>
        </Stack>
      </CardContent>

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
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="View Article" />
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit Article" />
        </MenuItem>
        <MenuItem 
          onClick={handleDeleteClick}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete Article" />
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete News Article"
        content="Are you sure you want to delete this news article? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
        confirmText="Delete"
        confirmColor="error"
      />
    </Card>
  );
};

export default StudioNewsCard; 