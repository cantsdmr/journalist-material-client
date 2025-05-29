import { memo, useState } from 'react';
import { 
  Box, 
  CircularProgress, 
  Backdrop,
} from '@mui/material';
import { ChannelTierList } from './ChannelTierList';
import { ChannelTierForm } from './ChannelTierForm';
import { ChannelTier, CreateChannelTierData, EditChannelTierData } from '@/APIs/ChannelAPI';
import { useTiers } from '@/hooks/useTiers';

interface TiersTabProps {
  channelId: string;
}

export const TiersTab = memo<TiersTabProps>(({ channelId }) => {
  const { 
    tiers,
    isLoading,
    createTier,
    updateTier,
    updateTiers,
    deleteTier
  } = useTiers(channelId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<Nullable<ChannelTier>>(null);
  const [isReordering, setIsReordering] = useState(false);

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
    await createTier(data);
    handleClose();
  };

  const handleUpdate = async (tierId: string, data: EditChannelTierData) => {
    await updateTier(tierId, data);
    handleClose();
  };

  const handleReorder = async (reorderedTiers: ChannelTier[]) => {
    try {
      setIsReordering(true);
      await updateTiers(reorderedTiers);
    } catch (error) {
      // Show error notification
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
        onDelete={deleteTier}
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