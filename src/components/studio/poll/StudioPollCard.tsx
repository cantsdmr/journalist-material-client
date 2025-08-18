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
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArticleIcon from '@mui/icons-material/Article';
import { useApiContext } from '@/contexts/ApiContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useApiCall } from '@/hooks/useApiCall';
import PollConversionModal from './PollConversionModal';

interface StudioPollCardProps {
  poll: any; // TODO: Replace with proper Poll type
  onRefresh: () => void;
}

const StudioPollCard: React.FC<StudioPollCardProps> = ({
  poll,
  onRefresh
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversionModalOpen, setConversionModalOpen] = useState(false);
  const navigate = useNavigate();
  const { api } = useApiContext();
  const { execute } = useApiCall();
  const theme = useTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    navigate(`${PATHS.STUDIO_POLL_VIEW.replace(':id', poll.id)}`);
    handleMenuClose();
  };

  const handleEdit = () => {
    navigate(`${PATHS.STUDIO_POLL_EDIT.replace(':id', poll.id)}`);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConvertClick = () => {
    setConversionModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    const result = await execute(
      () => api?.pollApi.delete(poll.id),
      {
        showSuccessMessage: true,
        successMessage: 'Poll deleted successfully'
      }
    );
    
    if (result) {
      onRefresh();
    }
    
    setDeleteDialogOpen(false);
  };

  const handleConvert = async (newsData: any) => {
    const result = await execute(
      () => api?.pollApi.convertToNews(poll.id, newsData),
      {
        showSuccessMessage: true,
        successMessage: 'Poll converted to news successfully!'
      }
    );
    
    if (result) {
      onRefresh();
    }
  };

  const getPollStatus = () => {
    const now = new Date();
    const startDate = new Date(poll.startDate);
    const endDate = new Date(poll.endDate);

    if (now < startDate) {
      return { label: 'Scheduled', color: 'warning' };
    } else if (now > endDate) {
      return { label: 'Ended', color: 'error' };
    } else {
      return { label: 'Active', color: 'success' };
    }
  };

  const status = getPollStatus();
  
  // Check if poll can be converted (in studio, creators can convert their own polls)
  const canConvert = !poll.isConverted && !poll.stats?.hasEnded;

  return (
    <Card
      sx={{
        height: '100%',
        bgcolor: theme => alpha(
          theme.palette.mode === 'dark' 
            ? theme.palette.common.white 
            : theme.palette.common.black,
          theme.palette.mode === 'dark' ? 0.05 : 0.03
        ),
        transition: theme.transitions.create(['background-color', 'box-shadow']),
        '&:hover': {
          bgcolor: theme => alpha(
            theme.palette.mode === 'dark'
              ? theme.palette.common.white
              : theme.palette.common.black,
            theme.palette.mode === 'dark' ? 0.08 : 0.05
          ),
          boxShadow: 1
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            {poll.title}
          </Typography>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ ml: 1 }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {poll.description}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={status.label}
            size="small"
            color={status.color as any}
          />
          <Typography variant="caption" color="text.secondary">
            {poll.totalVotes ?? 0} votes
          </Typography>
        </Stack>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 200 }
        }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Poll</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Poll</ListItemText>
        </MenuItem>
        {canConvert && (
          <MenuItem onClick={handleConvertClick}>
            <ListItemIcon>
              <ArticleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Convert to News</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Poll</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Poll"
        content="Are you sure you want to delete this poll? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />

      <PollConversionModal
        open={conversionModalOpen}
        poll={poll}
        onClose={() => setConversionModalOpen(false)}
        onConvert={handleConvert}
      />
    </Card>
  );
};

export default StudioPollCard; 