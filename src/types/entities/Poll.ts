import { PollStatus, PollMediaType, PollMediaFormat } from "@/enums/PollEnums";
import { AccessInfo } from "../ApiTypes";

export type Poll = {
    id: string;
    title: string;
    description?: string;
    channelId: string;
    creatorId: string;
    statusId: PollStatus;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    endDate?: string;
    claimedBy?: string;
    claimedAt?: string | null;
    isTrending: boolean;
    isConverted: boolean;
    isPremium: boolean;
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
    stats: PollStatistics;
    tags: PollTag[];
    funding?: PollFunding;
    journalist?: {
        id: string;
        displayName: string;
    };

    // access control
    accessInfo?: AccessInfo;

    // bookmark status
    isBookmarked?: boolean;
};

export type PollOption = {
    id: string;
    text: string;
    voteCount: number;
};

export type PollMedia = {
    id: string;
    pollId: string;
    type: PollMediaType;
    format: PollMediaFormat;
    url: string;
    caption?: string;
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
    status: PollStatus;
    contributions: Array<{
        id: string;
        amount: number;
        userId: string;
        isAnonymous: boolean;
        comment?: string;
        createdAt: Date;
    }>;
}; 