import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION } from "@/utils/http";
import { User } from "./UserAPI";
import { Channel } from "./ChannelAPI";

export type PollStatus = {
    id: number;
    name: string;
}

export type PollOption = {
    id: string;
    text: string;
    voteCount: number;
}

export type PollTag = {
    id: string;
    name: string;
}

export type PollGoal = {
    id: string;
    targetAmount: number;
}

export type PollFund = {
    id: string;
    amount: number;
}

export type PollStatistics = {
    totalVotes: number;
    totalGoals: number;
    totalTags: number;
    totalFunds: number;
    hasEnded: boolean;
    viewCount: number;
}

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
}

export type Poll = {
    id: string;
    title: string;
    description: string;
    
    // Relations
    channel: Channel;
    creator: User;
    status: PollStatus;
    requiredTier: {
        id: string;
        name: string;
    } | null;
    options: PollOption[];
    votes: any[];
    goals: PollGoal[];
    tags: PollTag[];
    funds: PollFund[];
    stats: any;
    statistics: PollStatistics;
    journalist?: User;
    funding?: PollFunding;

    // Timestamps
    endsAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;

    // Status fields
    statusId: number;
    claimedBy?: string;
    claimedAt?: Date;
    isTrending: boolean;
    isConverted: boolean;
    fundingAmount: number;
    fundingGoal?: number;

    // Counts
    voteCount: number;
    viewCount: number;
}

export type CreatePollData = {
    title: string;
    description: string;
    channelId: string;
    options: Array<{
        text: string;
    }>;
    endsAt: Date;
    requiredTierId?: string;
}

export type EditPollData = Partial<CreatePollData>

export type VoteData = {
    optionId: string;
}

const API_PATH = '/api/polls'
   
export class PollAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    // Public routes (authenticated)
    public getAll = (pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<Poll>(API_PATH, pagination);
    }

    public getTrending = (pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<Poll>(`${API_PATH}/trending`, pagination);
    }

    public getFunded = (pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<Poll>(`${API_PATH}/funded`, pagination);
    }

    public get = (id: string) => {
        return this._get<Poll>(`${API_PATH}/${id}`);
    }

    public getResults = (id: string) => {
        return this._get<any>(`${API_PATH}/${id}/results`);
    }

    public getFunding = (id: string) => {
        return this._get<any>(`${API_PATH}/${id}/funding`);
    }

    public getPollsByChannel = (channelId: string, pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<Poll>(`${API_PATH}/channel/${channelId}`, pagination);
    }

    // Member routes
    public vote = (id: string, data: VoteData) => {
        return this._post<any>(`${API_PATH}/${id}/vote`, data);
    }

    public getUserVote = (id: string) => {
        return this._get<any>(`${API_PATH}/${id}/vote`);
    }

    // Journalist routes
    public getClaimed = (pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<Poll>(`${API_PATH}/claimed`, pagination);
    }

    public claim = (id: string) => {
        return this._post<Poll>(`${API_PATH}/${id}/claim`, {});
    }

    public convertToNews = (id: string, newsData: any) => {
        return this._post<any>(`${API_PATH}/${id}/convert`, newsData);
    }

    // Admin/Editor routes
    public create = (data: CreatePollData) => {
        return this._post<Poll>(API_PATH, data);
    }

    public update = (id: string, data: EditPollData) => {
        return this._put<Poll>(`${API_PATH}/${id}`, data);
    }

    public delete = (id: string) => {
        return this._remove<void>(`${API_PATH}/${id}`);
    }
}