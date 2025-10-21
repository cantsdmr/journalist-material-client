export type NewsFilters = {
    feed?: boolean;
    trending?: boolean;
    subscribed?: boolean;
    channel?: string;
    creator?: string;
    status?: string;
    premium?: boolean;
    tags?: string[];
    query?: string;
}; 