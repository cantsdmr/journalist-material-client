import { memo, useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  CircularProgress, 
  Backdrop,
} from '@mui/material';
import { ChannelTierList } from './ChannelTierList';
import { ChannelTierForm } from './ChannelTierForm';
import { ChannelTier, CreateChannelTierData, EditChannelTierData } from '../../../../types';
import { useApiCall } from '@/hooks/useApiCall';
import { useApiContext } from '@/contexts/ApiContext';

interface TiersTabProps {
  channelId: string;
}

export const TiersTab = memo<TiersTabProps>(({ channelId }) => {
  const { api } = useApiContext();
  const { execute: fetchTiers } = useApiCall<{ items: ChannelTier[] }>();
  const { execute: executeCreate } = useApiCall<ChannelTier>();
  const { execute: executeUpdate } = useApiCall<void>();
  const { execute: executeUpdateTiers } = useApiCall<ChannelTier[]>();
  const { execute: executeDelete } = useApiCall<void>();
  
  const [tiers, setTiers] = useState<ChannelTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<Nullable<ChannelTier>>(null);
  const [isReordering, setIsReordering] = useState(false);

  const loadTiers = useCallback(async () => {
    if (!channelId) return;
    
    setIsLoading(true);
    const result = await fetchTiers(
      () => api?.channelApi.getTiers(channelId),
      { showErrorToast: true }
    );
    
    if (result) {
      setTiers(result.items || []);
    }
    setIsLoading(false);
  }, [channelId, fetchTiers, api]);

  useEffect(() => {
    loadTiers();
  }, [loadTiers]);

  const handleEdit = (tierId: string) => {
    const tier = tiers.find(t => t.id === tierId);
    if (tier) {
      setSelectedTier(tier);
      setIsFormOpen(true);
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedTier(null);
  };

  const handleCreate = async (data: CreateChannelTierData) => {
    const result = await executeCreate(
      () => api?.channelApi.createTier(channelId, data),
      {
        showSuccessMessage: true,
        successMessage: 'Tier created successfully'
      }
    );
    
    if (result) {
      await loadTiers();
      handleClose();
    }
  };

  const handleUpdate = async (tierId: string, data: EditChannelTierData) => {
    await executeUpdate(
      () => api?.channelApi.updateTier(channelId, tierId, data),
      {
        showSuccessMessage: true,
        successMessage: 'Tier updated successfully'
      }
    );
    
    await loadTiers();
    handleClose();
  };

  const handleDelete = async (tierId: string) => {
    await executeDelete(
      () => api?.channelApi.deleteTier(channelId, tierId),
      {
        showSuccessMessage: true,
        successMessage: 'Tier deleted successfully'
      }
    );
    
    await loadTiers();
  };

  const handleReorder = async (reorderedTiers: ChannelTier[]) => {
    try {
      setIsReordering(true);
      await executeUpdateTiers(
        () => api?.channelApi.updateTiers(channelId, reorderedTiers),
        {
          showSuccessMessage: true,
          successMessage: 'Tiers reordered successfully'
        }
      );
      
      setTiers(reorderedTiers);
    } catch (error) {
      // Error handling is done by useApiCall
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ChannelTierList 
        tiers={tiers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
        onCreateTier={() => setIsFormOpen(true)}
      />

      <ChannelTierForm 
        open={isFormOpen}
        onClose={handleClose}
        onSubmit={selectedTier ? 
          (data) => handleUpdate(selectedTier.id, data) : 
          handleCreate}
        initialData={selectedTier}
        tierCount={tiers.length}
        isEdit={!!selectedTier}
      />

      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(3px)'
        }}
        open={isReordering}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}, (prevProps, nextProps) => prevProps.channelId === nextProps.channelId);

TiersTab.displayName = 'TiersTab'; 