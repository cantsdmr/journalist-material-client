export type CreatePollData = {
    title: string;
    description?: string;
    channelId: string;
    options: string[];
    startDate?: string;
    endDate?: string;
    allowMultipleVotes?: boolean;
};

export type EditPollData = {
    title?: string;
    description?: string;
    options?: string[];
    startDate?: string;
    endDate?: string;
    allowMultipleVotes?: boolean;
};

export type VotePollData = {
    optionIds: string[];
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