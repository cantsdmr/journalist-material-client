export const SEARCH_TYPE = {
  ALL: 0,
  NEWS: 1,
  CHANNELS: 2,
  USERS: 3,
  POLLS: 4,
  TAGS: 5
} as const;

export const SEARCH_SORT = {
  RELEVANCE: 0,
  DATE: 1,
  POPULARITY: 2
} as const;

// String mappings for UI display
export const SearchTypeStrings = {
  [SEARCH_TYPE.ALL]: 'all',
  [SEARCH_TYPE.NEWS]: 'news',
  [SEARCH_TYPE.CHANNELS]: 'channels',
  [SEARCH_TYPE.USERS]: 'users',
  [SEARCH_TYPE.POLLS]: 'polls',
  [SEARCH_TYPE.TAGS]: 'tags'
} as const;

export const SearchSortStrings = {
  [SEARCH_SORT.RELEVANCE]: 'relevance',
  [SEARCH_SORT.DATE]: 'date',
  [SEARCH_SORT.POPULARITY]: 'popularity'
} as const;

// Reverse mappings for converting from strings to numbers
export const StringToSearchType: Record<string, number> = {
  'all': SEARCH_TYPE.ALL,
  'news': SEARCH_TYPE.NEWS,
  'channels': SEARCH_TYPE.CHANNELS,
  'users': SEARCH_TYPE.USERS,
  'polls': SEARCH_TYPE.POLLS,
  'tags': SEARCH_TYPE.TAGS
};

export const StringToSearchSort: Record<string, number> = {
  'relevance': SEARCH_SORT.RELEVANCE,
  'date': SEARCH_SORT.DATE,
  'popularity': SEARCH_SORT.POPULARITY
};

// Type definitions
export type SearchType = typeof SEARCH_TYPE[keyof typeof SEARCH_TYPE];
export type SearchSort = typeof SEARCH_SORT[keyof typeof SEARCH_SORT];
export type SearchTypeString = 'all' | 'news' | 'channels' | 'users' | 'polls' | 'tags';
export type SearchSortString = 'relevance' | 'date' | 'popularity'; 