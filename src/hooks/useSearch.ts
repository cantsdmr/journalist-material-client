import { useState, useCallback } from 'react';

export interface SearchFilters {
  type?: 'news' | 'channels' | 'users' | 'all';
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'relevance' | 'date' | 'popularity';
  onlyPremium?: boolean;
  channelId?: string;
}

export interface SearchResult {
  type: 'news' | 'channel' | 'user';
  id: string;
  title: string;
  description?: string;
  handle?: string;
  relevanceScore: number;
  publishedAt?: Date;
  tags?: string[];
  channel?: {
    id: string;
    name: string;
    handle: string;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  filters: SearchFilters;
  took: number;
}

export interface UseSearchReturn {
  searchResults: SearchResponse | null;
  loading: boolean;
  error: string | null;
  performSearch: (query: string, filters?: SearchFilters, page?: number, limit?: number) => Promise<void>;
  getSuggestions: (query: string, type?: string) => Promise<string[]>;
  clearResults: () => void;
}

export const useSearch = (apiBaseUrl: string = '/api'): UseSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (
    query: string, 
    filters: SearchFilters = {}, 
    page: number = 1, 
    limit: number = 20
  ) => {
    if (!query.trim()) {
      setError('Search query cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        offset: ((page - 1) * limit).toString()
      });

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((item) => params.append(key, item.toString()));
          } else if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`${apiBaseUrl}/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  const getSuggestions = useCallback(async (query: string, type?: string): Promise<string[]> => {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      const params = new URLSearchParams({ q: query });
      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`${apiBaseUrl}/search/suggestions?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Suggestions failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data.suggestions || [];
      } else {
        console.warn('Suggestions request failed:', data.error);
        return [];
      }
    } catch (err) {
      console.error('Suggestions error:', err);
      return [];
    }
  }, [apiBaseUrl]);

  const clearResults = useCallback(() => {
    setSearchResults(null);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    performSearch,
    getSuggestions,
    clearResults
  };
};

export default useSearch; 