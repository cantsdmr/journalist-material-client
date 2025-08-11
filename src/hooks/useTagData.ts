import { useState, useEffect } from 'react';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from './useApiCall';
import { Tag } from '@/components/filters/TagFilter';

interface UseTagDataProps {
  contentType: 'news' | 'channels' | 'polls';
  enabled?: boolean;
}

export const useTagData = ({ contentType, enabled = true }: UseTagDataProps) => {
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [trendingTags, setTrendingTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { api } = useApiContext();
  const { execute } = useApiCall();

  const fetchTagData = async () => {
    if (!enabled || !api) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch popular and trending tags based on content type
      const [popularResponse, trendingResponse] = await Promise.all([
        execute(() => fetchPopularTags(contentType), { showErrorToast: false }),
        execute(() => fetchTrendingTags(contentType), { showErrorToast: false })
      ]);

      if (popularResponse) {
        setPopularTags(popularResponse);
      }
      
      if (trendingResponse) {
        setTrendingTags(trendingResponse);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tag data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularTags = async (type: string): Promise<Tag[]> => {
    // For now, return mock data. Later this would call actual API endpoints
    const mockPopularTags: Record<string, Tag[]> = {
      news: [
        { id: '1', name: 'politics', count: 1250, popular: true },
        { id: '2', name: 'technology', count: 890, popular: true },
        { id: '3', name: 'sports', count: 567, popular: true },
        { id: '4', name: 'business', count: 445, popular: true },
        { id: '5', name: 'science', count: 334, popular: true },
        { id: '6', name: 'health', count: 289, popular: true },
        { id: '7', name: 'entertainment', count: 256, popular: true },
        { id: '8', name: 'world', count: 234, popular: true }
      ],
      channels: [
        { id: '1', name: 'investigative', count: 45, popular: true },
        { id: '2', name: 'local-news', count: 38, popular: true },
        { id: '3', name: 'tech-review', count: 32, popular: true },
        { id: '4', name: 'breaking-news', count: 29, popular: true },
        { id: '5', name: 'opinion', count: 25, popular: true },
        { id: '6', name: 'documentary', count: 22, popular: true }
      ],
      polls: [
        { id: '1', name: 'current-events', count: 78, popular: true },
        { id: '2', name: 'public-opinion', count: 65, popular: true },
        { id: '3', name: 'politics', count: 54, popular: true },
        { id: '4', name: 'community', count: 43, popular: true },
        { id: '5', name: 'trending', count: 36, popular: true }
      ]
    };

    return mockPopularTags[type] || [];
  };

  const fetchTrendingTags = async (type: string): Promise<Tag[]> => {
    // Mock trending tags data
    const mockTrendingTags: Record<string, Tag[]> = {
      news: [
        { id: '1', name: 'breaking', count: 156, trending: true },
        { id: '2', name: 'election2024', count: 134, trending: true },
        { id: '3', name: 'ai-revolution', count: 98, trending: true },
        { id: '4', name: 'climate-change', count: 87, trending: true },
        { id: '5', name: 'crypto-news', count: 76, trending: true },
        { id: '6', name: 'space-exploration', count: 54, trending: true }
      ],
      channels: [
        { id: '1', name: 'exclusive', count: 23, trending: true },
        { id: '2', name: 'live-updates', count: 19, trending: true },
        { id: '3', name: 'verified', count: 17, trending: true },
        { id: '4', name: 'premium', count: 14, trending: true }
      ],
      polls: [
        { id: '1', name: 'urgent', count: 34, trending: true },
        { id: '2', name: 'quick-poll', count: 28, trending: true },
        { id: '3', name: 'hot-topic', count: 25, trending: true },
        { id: '4', name: 'debate', count: 21, trending: true }
      ]
    };

    return mockTrendingTags[type] || [];
  };

  useEffect(() => {
    fetchTagData();
  }, [contentType, enabled]);

  const refetch = () => {
    fetchTagData();
  };

  return {
    popularTags,
    trendingTags,
    loading,
    error,
    refetch
  };
}; 