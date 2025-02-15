import { useState, useEffect } from 'react';
import { useApiContext } from '@/contexts/ApiContext';
import { Channel, ChannelTier, CreateChannelTierData, EditChannelData, EditChannelTierData } from '@/APIs/ChannelAPI';

export const useChannel = (channelId?: string) => {
  const { api } = useApiContext();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChannel = async () => {
    if (!channelId) return;
    try {
      setIsLoading(true);
      const data = await api?.channelApi.getChannel(channelId);
      setChannel(data || null);
    } catch (error) {
      console.error('Failed to fetch channel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateChannel = async (data: EditChannelData) => {
    if (!channelId) return;
    try {
      await api?.channelApi.updateChannel(channelId, data);
      await fetchChannel();
    } catch (error) {
      console.error('Failed to update channel:', error);
    }
  };

  // Tier operations
  const createTier = async (data: CreateChannelTierData) => {
    if (!channelId) return;
    try {
      await api?.channelApi.createTier(channelId, data);
      await fetchChannel();
    } catch (error) {
      console.error('Failed to create tier:', error);
    }
  };

  const updateTier = async (tierId: string, data: EditChannelTierData) => {
    if (!channelId) return;
    try {
      await api?.channelApi.updateTier(channelId, tierId, data);
      await fetchChannel();
    } catch (error) {
      console.error('Failed to update tier:', error);
    }
  };

  const deleteTier = async (tierId: string) => {
    if (!channelId) return;
    try {
      await api?.channelApi.deleteTier(channelId, tierId);
      await fetchChannel();
    } catch (error) {
      console.error('Failed to delete tier:', error);
    }
  };

  const updateTiers = async (tiers: ChannelTier[]) => {
    if (!channelId) return;
    try {
      await api?.channelApi.updateTiers(channelId, tiers);
      await fetchChannel();
    } catch (error) {
      console.error('Failed to update tiers:', error);
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