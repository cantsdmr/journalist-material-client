import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedResponse } from "@/utils/http";

export interface SearchFilters {
  type?: number;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: number;
  onlyPremium?: boolean;
  channelId?: string;
}

export interface SearchResult {
  type: 'news' | 'channel' | 'user' | 'poll' | 'tag';
  id: string;
  title: string;
  description?: string;
  handle?: string;
  slug?: string;
  relevanceScore: number;
  publishedAt?: string;
  startDate?: string;
  endDate?: string;
  voteCount?: number;
  usageCount?: number;
  typeId?: number;
  statusId?: number;
  tags?: string[];
  channel?: {
    id: string;
    name: string;
    handle: string;
  };
}

export interface SearchSuggestionsResponse {
  query: string;
  suggestions: string[];
}

const API_PATH = '/api/search';

export class SearchAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    /**
     * Perform a comprehensive search across all content types
     */
    public async search(
        query: string,
        filters: SearchFilters = {},
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<SearchResult>> {
        const params: any = {
            q: query,
            ...pagination
        };

        // Add filter parameters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    params[key] = value.join(',');
                } else if (value instanceof Date) {
                    params[key] = value.toISOString();
                } else {
                    params[key] = value.toString();
                }
            }
        });

        return this._list<SearchResult>(API_PATH, params);
    }

    /**
     * Search specific content type
     */
    public async searchNews(
        query: string, 
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<SearchResult>> {
        return this._list<SearchResult>(`${API_PATH}/news`, {
            q: query,
            ...pagination
        });
    }

    public async searchChannels(
        query: string, 
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<SearchResult>> {
        return this._list<SearchResult>(`${API_PATH}/channels`, {
            q: query,
            ...pagination
        });
    }

    public async searchUsers(
        query: string, 
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<SearchResult>> {
        return this._list<SearchResult>(`${API_PATH}/users`, {
            q: query,
            ...pagination
        });
    }

    public async searchPolls(
        query: string, 
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<SearchResult>> {
        return this._list<SearchResult>(`${API_PATH}/polls`, {
            q: query,
            ...pagination
        });
    }

    public async searchTags(
        query: string, 
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<SearchResult>> {
        return this._list<SearchResult>(`${API_PATH}/tags`, {
            q: query,
            ...pagination
        });
    }

    /**
     * Get search suggestions
     */
    public async getSuggestions(query: string, type?: string): Promise<SearchSuggestionsResponse> {
        const params: any = { q: query };
        if (type) {
            params.type = type;
        }

        return this._get<SearchSuggestionsResponse>(`${API_PATH}/suggestions`, { params });
    }
} 