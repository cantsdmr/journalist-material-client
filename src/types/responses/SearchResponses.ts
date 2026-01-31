// Search result type - represents aggregated search results from different entities
export type SearchResultType = 'news' | 'channel' | 'user' | 'poll' | 'tag';

export interface SearchResult {
  type: SearchResultType;
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
  typeId?: string;
  statusId?: string;
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

export interface StructuredSearchSuggestion {
  id: string;
  text: string;
  type: SearchResultType;
  relevanceScore?: number;
  metadata?: {
    channelName?: string;
    handle?: string;
    articleCount?: number;
    publishedAt?: string;
    voteCount?: number;
    usageCount?: number;
  };
}

export interface StructuredSearchSuggestionsResponse {
  query: string;
  suggestions: StructuredSearchSuggestion[];
}
