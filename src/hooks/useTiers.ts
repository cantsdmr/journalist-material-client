import { useState, useEffect } from 'react';
import { useApiContext } from '@/contexts/ApiContext';
import { ChannelTier, CreateChannelTierData, EditChannelTierData } from '@/APIs/ChannelAPI';
import { useApiCall } from '@/hooks/useApiCall';

export const useTiers = (channelId?: string) => {
  const { api } = useApiContext();
  const { execute } = useApiCall();
  const [tiers, setTiers] = useState<ChannelTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTiers = async () => {
    if (!channelId) return;
    
    setIsLoading(true);
    
    const result = await execute(
      () => api?.channelApi.getTiers(channelId),
      { showErrorToast: true }
    );
    
    if (result) {
      setTiers(result?.items || []);
    }
    
    setIsLoading(false);
  };

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
      await fetchTiers(); // Refresh data
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
      await fetchTiers(); // Refresh data
    }
  };

  const updateTiers = async (tiers: ChannelTier[], fetch: boolean = true) => {
    if (!channelId) return;
    
    const result = await execute(
      () => api?.channelApi.updateTiers(channelId, tiers),
      {
        showSuccessMessage: true,
        successMessage: 'Tiers updated successfully'
      }
    );
    
    if (result && fetch) {
      await fetchTiers();
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
      await fetchTiers(); // Refresh data
    }
  };

  useEffect(() => {
    if (!channelId) return;
    fetchTiers();
  }, [channelId]);

  return {
    tiers,
    isLoading,
    createTier,
    updateTier,
    deleteTier,
    updateTiers
  };
}; 