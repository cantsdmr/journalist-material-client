import { useState, useCallback } from 'react';
import { StringToSearchType, StringToSearchSort, SearchTypeString, SearchSortString } from '@/enums/SearchEnums';
import { SearchFilters as APISearchFilters, SearchResult, SearchSuggestionsResponse, StructuredSearchSuggestionsResponse, StructuredSearchSuggestion } from '@/APIs/SearchAPI';
import { PaginatedResponse } from '@/utils/http';
import { useApiCall } from './useApiCall';
import { useApiContext } from '@/contexts/ApiContext';

export interface SearchFilters {
  type?: SearchTypeString;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: SearchSortString;
  onlyPremium?: boolean;
  channelId?: string;
}

export interface UseSearchReturn {
  searchResults: PaginatedResponse<SearchResult> | null;
  loading: boolean;
  error: string | null;
  performSearch: (query: string, filters?: SearchFilters, page?: number, limit?: number) => Promise<void>;
  getSuggestions: (query: string, type?: string) => Promise<string[]>;
  getStructuredSuggestions: (query: string, type?: string) => Promise<StructuredSearchSuggestion[]>;
  clearResults: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [searchResults, setSearchResults] = useState<PaginatedResponse<SearchResult> | null>(null);
  const [loading, setLoading] = useState(false);
  const { api } = useApiContext();
  const { execute } = useApiCall();
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
      // Convert frontend string filters to backend number filters
      const apiFilters: APISearchFilters = {};

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'type' && typeof value === 'string') {
            // Convert string type to number for API
            const numericType = StringToSearchType[value];
            if (numericType !== undefined) {
              apiFilters.type = numericType;
            }
          } else if (key === 'sortBy' && typeof value === 'string') {
            // Convert string sortBy to number for API
            const numericSort = StringToSearchSort[value];
            if (numericSort !== undefined) {
              apiFilters.sortBy = numericSort;
            }
          } else {
            (apiFilters as any)[key] = value;
          }
        }
      });

      const pagination = {
        page,
        limit
      };

      const data = await execute(
        () => api?.searchApi.search(query, apiFilters, pagination),
        {
          showSuccessMessage: false,
        }
      );
      setSearchResults(data);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [execute]);

  const getSuggestions = useCallback(async (query: string, type?: string): Promise<string[]> => {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      const data: SearchSuggestionsResponse = await execute(
        () => api?.searchApi.getSuggestions(query, type),
        {
          showSuccessMessage: false
        }
      );
      return data.suggestions || [];
    } catch (err) {
      console.error('Suggestions error:', err);
      return [];
    }
  }, [execute]);

  const getStructuredSuggestions = useCallback(async (query: string, type?: string): Promise<StructuredSearchSuggestion[]> => {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    if (!api?.searchApi) {
      console.error('Search API not available');
      return [];
    }

    try {
      const data: StructuredSearchSuggestionsResponse = await execute(
        () => api.searchApi.getStructuredSuggestions(query, type),
        {
          showSuccessMessage: false
        }
      );
      return data?.suggestions || [];
    } catch (err) {
      console.error('Structured suggestions error:', err);
      return [];
    }
  }, [execute, api?.searchApi]);

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
    getStructuredSuggestions,
    clearResults
  };
};

export default useSearch; 