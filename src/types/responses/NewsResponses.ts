export type NewsStatsResponse = {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    engagementRate: number;
    // Add other stats fields as needed
};

export type NewsTagResponse = {
    id: string;
    title: string;
    slug: string;
    usage_count: number;
}; 