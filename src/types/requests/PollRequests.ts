import { PollMediaType, PollMediaFormat } from "@/enums/PollEnums";

export type CreatePollData = {
    title: string;
    description?: string;
    channelId: string;
    options: Array<{
        text: string;
        description?: string;
    }>;
    media?: Array<{
        mediaTypeId: PollMediaType;
        mediaFormatId: PollMediaFormat;
        url: string;
        caption?: string;
    }>;
    endDate?: string;
    allowMultipleVotes?: boolean;
    isPublic?: boolean;
    requiredTierId?: string;
};

export type UpdatePollData = {
    title?: string;
    description?: string;
    media?: Array<{
        mediaTypeId: PollMediaType;
        mediaFormatId: PollMediaFormat;
        url: string;
        caption?: string;
    }>;
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
    media?: Array<{
        mediaTypeId: PollMediaType;
        mediaFormatId: PollMediaFormat;
        url: string;
        caption?: string;
    }>;
    startDate?: string;
    endDate?: string;
    allowMultipleVotes?: boolean;
}; 