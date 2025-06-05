export type CreatePollData = {
    title: string;
    description?: string;
    channelId: string;
    options: Array<{
        text: string;
        description?: string;
    }>;
    endDate?: string;
    allowMultipleVotes?: boolean;
    isPublic?: boolean;
    requiredTierId?: string;
};

export type UpdatePollData = {
    title?: string;
    description?: string;
    endDate?: string;
    allowMultipleVotes?: boolean;
    isPublic?: boolean;
    requiredTierId?: string;
};

export type VotePollData = {
    optionId: string;
};

export type VotingEligibilityResponse = {
    canVote: boolean;
    reason?: string;
};

// Studio-specific poll creation (might have different structure)
export type StudioCreatePollData = {
    title: string;
    description?: string;
    channelId: string;
    options: string[];
    startDate?: string;
    endDate?: string;
    allowMultipleVotes?: boolean;
}; 