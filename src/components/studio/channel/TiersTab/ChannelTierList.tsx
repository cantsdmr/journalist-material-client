import React, { useState, useEffect } from 'react';
import {
  Typography,
  IconButton,
  Stack,
  Box,
  Chip,
  Paper,
  Button,
  Skeleton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ChannelTier } from '../../../../types';
import { EmptyState } from '@/components/common/EmptyState';

interface ChannelTierListProps {
  tiers: ChannelTier[];
  isLoading?: boolean;
  onEdit: (tierId: string) => void;
  onDelete: (tierId: string) => void;
  onReorder: (tiers: ChannelTier[]) => Promise<void>;
  onCreateTier: () => void;
}

export const ChannelTierList: React.FC<ChannelTierListProps> = ({
  tiers,
  isLoading = false,
  onEdit,
  onDelete,
  onReorder,
  onCreateTier
}) => {
  const [localTiers, setLocalTiers] = useState(tiers);
  
  useEffect(() => {
    setLocalTiers([...tiers].sort((a, b) => a.order - b.order));
  }, [tiers]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;

    // Sort tiers by current order before reordering
    const orderedTiers = [...localTiers].sort((a, b) => a.order - b.order);
    
    // Move the tier to new position
    const [movedTier] = orderedTiers.splice(sourceIndex, 1);
    orderedTiers.splice(destinationIndex, 0, movedTier);

    // Reassign order numbers based on final position
    const reorderedTiers = orderedTiers.map((tier, index) => ({
      ...tier,
      order: index + 1
    }));

    setLocalTiers(reorderedTiers);
    onReorder(reorderedTiers);
  };

  if (isLoading) {
    return (
      <Stack spacing={3} sx={{ maxWidth: 900 }}>
        {[1, 2, 3].map((i) => (
          <Paper key={i} sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="text" width="80%" height={20} />
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    );
  }

  if (tiers.length === 0) {
    return (
      <EmptyState
        title="Set Up Channel Subscriptions"
        description="Create subscription tiers to offer exclusive perks and content to your subscribers"
        action={{
          label: "Create Your First Tier",
          onClick: onCreateTier
        }}
        icon={<WorkspacePremiumIcon sx={{ fontSize: 48 }} />}
      />
    );
  }

  return (
    <Stack spacing={4}>
      {/* Header Section */}
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between"
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Subscription Tiers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateTier}
          sx={{ 
            px: 3,
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          Create Tier
        </Button>
      </Stack>

      {/* Info Section */}
      <Paper 
        sx={{ 
          p: 2, 
          bgcolor: 'primary.50', 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'primary.100'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <InfoIcon color="primary" />
          <Typography variant="body2" color="primary.700">
            Drag to reorder tiers. Members will see tiers in this order on your channel page.
          </Typography>
        </Stack>
      </Paper>

      {/* Draggable List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tiers">
          {(provided) => (
            <Stack 
              spacing={3} 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              sx={{ 
                maxWidth: 800,
                width: '100%'
              }}
            >
              {localTiers.map((tier, index) => (
                <Draggable key={tier.id} draggableId={tier.id} index={index}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <Paper 
                          elevation={snapshot.isDragging ? 8 : 2}
                          sx={{ 
                            p: 3,
                            transition: 'all 0.2s ease',
                            transform: snapshot.isDragging ? 'scale(1.02)' : 'scale(1)',
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            '&:hover': {
                              boxShadow: 4,
                              '& .drag-handle': {
                                opacity: 1
                              }
                            }
                          }}
                        >
                          <Chip
                            label={tier.order}
                            color="primary"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: -12,
                              left: 16,
                              height: 32,
                              width: 32,
                              borderRadius: '50%',
                              boxShadow: 2,
                              zIndex: 1,
                              '& .MuiChip-label': {
                                px: 0,
                                fontSize: '1rem',
                                fontWeight: 'bold'
                              }
                            }}
                          />

                          {/* Drag Handle Overlay */}
                          <Box 
                            {...provided.dragHandleProps}
                            className="drag-handle"
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transition: 'opacity 0.2s ease',
                              '&:hover': {
                                cursor: 'move',
                                '& .drag-icon': {
                                  transform: 'scale(1.1)'
                                }
                              }
                            }}
                          >
                            <Box 
                              className="drag-icon"
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: 'action.hover',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.2s ease'
                              }}
                            >
                              <DragIndicatorIcon color="action" />
                            </Box>
                          </Box>

                          {/* Content */}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {tier.name}
                            </Typography>
                            <Typography variant="h4" gutterBottom>
                              ${tier.price}
                              <Typography component="span" variant="body2" sx={{ ml: 1 }}>
                                /month
                              </Typography>
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              {tier.description}
                            </Typography>
                          </Box>

                          {/* Actions */}
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton onClick={() => onEdit(tier.id)} size="small">
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => onDelete(tier.id)} size="small">
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </Paper>
                      </Box>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
    </Stack>
  );
};

export default ChannelTierList; 