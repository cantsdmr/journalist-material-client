// Search Type Enum
export const SEARCH_TYPE = {
  ALL: "ALL",
  NEWS: "NEWS",
  CHANNELS: "CHANNELS",
  USERS: "USERS",
  POLLS: "POLLS",
  TAGS: "TAGS"
} as const;

export type SearchType = typeof SEARCH_TYPE[keyof typeof SEARCH_TYPE];

// Search Sort Enum
export const SEARCH_SORT = {
  RELEVANCE: "RELEVANCE",
  DATE: "DATE",
  POPULARITY: "POPULARITY"
} as const;

export type SearchSort = typeof SEARCH_SORT[keyof typeof SEARCH_SORT];

// Helper Functions for Search Type
export function getSearchTypeLabel(type: SearchType): string {
  switch (type) {
  case SEARCH_TYPE.ALL:
    return "All";
  case SEARCH_TYPE.NEWS:
    return "News";
  case SEARCH_TYPE.CHANNELS:
    return "Channels";
  case SEARCH_TYPE.USERS:
    return "Users";
  case SEARCH_TYPE.POLLS:
    return "Polls";
  case SEARCH_TYPE.TAGS:
    return "Tags";
  default:
    return type;
  }
}

// Helper Functions for Search Sort
export function getSearchSortLabel(sort: SearchSort): string {
  switch (sort) {
  case SEARCH_SORT.RELEVANCE:
    return "Relevance";
  case SEARCH_SORT.DATE:
    return "Date";
  case SEARCH_SORT.POPULARITY:
    return "Popularity";
  default:
    return sort;
  }
}

// Dropdown Options
export const ALL_SEARCH_TYPES = [
  { value: SEARCH_TYPE.ALL, label: "All" },
  { value: SEARCH_TYPE.NEWS, label: "News" },
  { value: SEARCH_TYPE.CHANNELS, label: "Channels" },
  { value: SEARCH_TYPE.USERS, label: "Users" },
  { value: SEARCH_TYPE.POLLS, label: "Polls" },
  { value: SEARCH_TYPE.TAGS, label: "Tags" }
] as const;

export const ALL_SEARCH_SORTS = [
  { value: SEARCH_SORT.RELEVANCE, label: "Relevance" },
  { value: SEARCH_SORT.DATE, label: "Date" },
  { value: SEARCH_SORT.POPULARITY, label: "Popularity" }
] as const;

// Additional type definitions
export type SearchSuggestionType = "news" | "channel" | "user" | "tag" | "poll";
export type SearchFilterType = "news" | "channels" | "users" | "all";
export type SearchDateRange = "day" | "week" | "month" | "year";

// Interface definitions for search functionality
export interface SearchSuggestion {
  id: string;
  text: string;
  type: SearchSuggestionType;
  metadata?: {
    channelName?: string;
    handle?: string;
    articleCount?: number;
  };
}

export interface SearchFilters {
  type?: SearchFilterType;
  tags?: string[];
  dateRange?: SearchDateRange;
}
