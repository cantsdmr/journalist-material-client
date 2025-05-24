import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION } from "@/utils/http";
import { PaginatedCollection } from "@/utils/http";

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
    description?: string;
    channelId: string;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
    endDate?: string;
    options: {
        id: string;
        text: string;
        voteCount: number;
    }[];
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
}

export type CreatePollData = {
    title: string;
    description?: string;
    channelId: string;
    options: string[];
    endDate?: string;
}

export type EditPollData = {
    title?: string;
    description?: string;
    endDate?: string;
}

export type VoteData = {
    optionId: string;
}

const API_PATH = '/api/polls'
   
export class PollAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    // Public routes (authenticated)
    public async getAll(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Poll>> {
        return this._list<Poll>(API_PATH, pagination);
    }

    public async getTrending(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Poll>> {
        return this._list<Poll>(`${API_PATH}/trending`, pagination);
    }

    public async getFunded(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Poll>> {
        return this._list<Poll>(`${API_PATH}/funded`, pagination);
    }

    public async get(id: string): Promise<Poll> {
        return this._get<Poll>(`${API_PATH}/${id}`);
    }

    public async getResults(id: string): Promise<any> {
        return this._get<any>(`${API_PATH}/${id}/results`);
    }

    public async getFunding(id: string): Promise<any> {
        return this._get<any>(`${API_PATH}/${id}/funding`);
    }

    public async getPollsByChannel(channelId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Poll>> {
        return this._list<Poll>(`${API_PATH}/channel/${channelId}`, pagination);
    }

    // Member routes
    public async vote(id: string, data: VoteData): Promise<void> {
        return this._post<void>(`${API_PATH}/${id}/vote`, data);
    }

    public async getUserVote(id: string): Promise<{ optionId: string | null }> {
        return this._get<{ optionId: string | null }>(`${API_PATH}/${id}/vote`);
    }

    // Journalist routes
    public async getClaimed(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Poll>> {
        return this._list<Poll>(`${API_PATH}/claimed`, pagination);
    }

    public async claim(id: string): Promise<Poll> {
        return this._post<Poll>(`${API_PATH}/${id}/claim`, {});
    }

    public async convertToNews(id: string, newsData: any): Promise<any> {
        return this._post<any>(`${API_PATH}/${id}/convert`, newsData);
    }

    // Admin/Editor routes
    public async create(data: CreatePollData): Promise<Poll> {
        return this._post<Poll>(API_PATH, data);
    }

    public async update(id: string, data: EditPollData): Promise<Poll> {
        return this._put<Poll>(`${API_PATH}/${id}`, data);
    }

    public async delete(id: string): Promise<void> {
        return this._remove<void>(`${API_PATH}/${id}`);
    }

    public async getUserPolls(userId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Poll>> {
        return this._list<Poll>(`${API_PATH}/user/${userId}`, pagination);
    }
}