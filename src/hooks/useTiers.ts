import { useState, useEffect } from 'react';
import { useApiContext } from '@/contexts/ApiContext';
import { ChannelTier, CreateChannelTierData, EditChannelTierData } from '@/APIs/ChannelAPI';

export const useTiers = (channelId?: string) => {
  const { api } = useApiContext();
  const [tiers, setTiers] = useState<ChannelTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTiers = async () => {
    if (!channelId) return;
    try {
      setIsLoading(true);
      const data = await api?.channelApi.getTiers(channelId);
      setTiers(data?.items || []);
    } catch (error) {
      console.error('Failed to fetch tiers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTier = async (data: CreateChannelTierData) => {
    if (!channelId) return;
    try {
      await api?.channelApi.createTier(channelId, data);
      await fetchTiers(); // Refresh data
    } catch (error) {
      console.error('Failed to create tier:', error);
    }
  };

  const updateTier = async (tierId: string, data: EditChannelTierData) => {
    if (!channelId) return;
    try {
      await api?.channelApi.updateTier(channelId, tierId, data);
      await fetchTiers(); // Refresh data
    } catch (error) {
      console.error('Failed to update tier:', error);
    }
  };

  const updateTiers = async (tiers: ChannelTier[], fetch: boolean = true) => {
    if (!channelId) return;
    try {
      await api?.channelApi.updateTiers(channelId, tiers);
      if (fetch) {
        await fetchTiers();
      }
    } catch (error) {
      console.error('Failed to update tiers:', error);
    }
  };

  const deleteTier = async (tierId: string) => {
    if (!channelId) return;
    try {
      await api?.channelApi.deleteTier(channelId, tierId);
      await fetchTiers(); // Refresh data
    } catch (error) {
      console.error('Failed to delete tier:', error);
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