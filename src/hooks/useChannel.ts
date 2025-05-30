import { useState, useEffect } from 'react';
import { useApiContext } from '@/contexts/ApiContext';
import { Channel, ChannelTier, CreateChannelTierData, EditChannelData, EditChannelTierData } from '@/APIs/ChannelAPI';
import { useApiCall } from '@/hooks/useApiCall';

export const useChannel = (channelId?: string) => {
  const { api } = useApiContext();
  const { execute } = useApiCall();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChannel = async () => {
    if (!channelId) return;
    
    setIsLoading(true);
    
    const result = await execute(
      () => api?.channelApi.getChannel(channelId),
      { showErrorToast: true }
    );
    
    if (result) {
      setChannel(result);
    }
    
    setIsLoading(false);
  };

  const updateChannel = async (data: EditChannelData) => {
    if (!channelId) return;
    
    const result = await execute(
      () => api?.channelApi.updateChannel(channelId, data),
      {
        showSuccessMessage: true,
        successMessage: 'Channel updated successfully'
      }
    );
    
    if (result) {
      await fetchChannel();
    }
  };

  // Tier operations
  const createTier = async (data: CreateChannelTierData) => {
    if (!channelId) return;
    
    const result = await execute(
      () => api?.channelApi.createTier(channelId, data),
      {
        showSuccessMessage: true,
        successMessage: 'Tier created successfully'
      }
    );
    
    if (result) {
      await fetchChannel();
    }
  };

  const updateTier = async (tierId: string, data: EditChannelTierData) => {
    if (!channelId) return;
    
    const result = await execute(
      () => api?.channelApi.updateTier(channelId, tierId, data),
      {
        showSuccessMessage: true,
        successMessage: 'Tier updated successfully'
      }
    );
    
    if (result) {
      await fetchChannel();
    }
  };

  const deleteTier = async (tierId: string) => {
    if (!channelId) return;
    
    const result = await execute(
      () => api?.channelApi.deleteTier(channelId, tierId),
      {
        showSuccessMessage: true,
        successMessage: 'Tier deleted successfully'
      }
    );
    
    if (result) {
      await fetchChannel();
    }
  };

  const updateTiers = async (tiers: ChannelTier[]) => {
    if (!channelId) return;
    
    const result = await execute(
      () => api?.channelApi.updateTiers(channelId, tiers),
      {
        showSuccessMessage: true,
        successMessage: 'Tiers updated successfully'
      }
    );
    
    if (result) {
      await fetchChannel();
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [channelId]);

  return {
    channel,
    isLoading,
    updateChannel,
    createTier,
    updateTier,
    deleteTier,
    updateTiers
  };
}; 