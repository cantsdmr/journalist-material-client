export type TagFilters = {
    trending?: boolean;
    popular?: boolean;
    category?: 'news' | 'polls' | 'channels';
    verified?: boolean;
}; 