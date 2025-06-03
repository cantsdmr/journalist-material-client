export type Poll = {
    id: string;
    title: string;
    description?: string;
    channelId: string;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
    endDate?: string;
    options: PollOption[];
    channel: {
        id: string;
        name: string;
    };
    creator: {
        id: string;
        displayName: string;
    };
    stats: PollStatistics;
    voteCount: number;
    tags: PollTag[];
    isTrending: boolean;
};

export type PollOption = {
    id: string;
    text: string;
    voteCount: number;
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