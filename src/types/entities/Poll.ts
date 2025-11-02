export type Poll = {
    id: string;
    title: string;
    description?: string;
    channelId: string;
    creatorId: string;
    statusId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    endDate?: string;
    claimedBy?: string;
    claimedAt?: string | null;
    isTrending: boolean;
    isConverted: boolean;
    fundingAmount: number;
    fundingGoal?: number;
    voteCount: number;
    viewCount: number;
    options: PollOption[];
    media: PollMedia[];
    channel: {
        id: string;
        name: string;
    };
    creator: {
        id: string;
        displayName: string;
    };
    requiredTier?: {
        id: string;
        name: string;
        description?: string;
        price: number;
        order: number;
    };
    status?: {
        id: number;
        name: string;
    };
    stats: PollStatistics;
    tags: PollTag[];
    funding?: PollFunding;
    journalist?: {
        id: string;
        displayName: string;
    };
};

export type PollOption = {
    id: string;
    text: string;
    voteCount: number;
};

export type PollMedia = {
    id: string;
    pollId: string;
    type: number;
    format: number;
    url: string;
    caption?: string;
};

export type PollStatus = {
    id: number;
    name: string;
};

export type PollTag = {
    id: string;
    name: string;
};

export type PollGoal = {
    id: string;
    targetAmount: number;
};

export type PollFund = {
    id: string;
    amount: number;
};

export type PollStatistics = {
    totalVotes: number;
    totalGoals: number;
    totalTags: number;
    totalFunds: number;
    hasEnded: boolean;
    viewCount: number;
};

export type PollFunding = {
    id: string;
    currentAmount: number;
    goalAmount: number;
    status: {
        id: number;
        name: string;
    };
    contributions: Array<{
        id: string;
        amount: number;
        userId: string;
        isAnonymous: boolean;
        comment?: string;
        createdAt: Date;
    }>;
}; 