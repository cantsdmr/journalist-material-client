import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedResponse } from "@/utils/http";

export interface FundData {
  id: string;
  channelId: string;
  channelWalletId: string;
  fundableId: string;
  fundableType: number; // 1 = NEWS, 2 = POLL
  currentAmount: number;
  goalAmount?: number;
  currency: string;
  expiresAt?: string;
  isActive: boolean;
  goalReached: boolean;
  statusId: number;
  createdAt: string;
  updatedAt: string;
}

export interface FundContribution {
  id: string;
  fundId: string;
  userId: string;
  channelSubscriptionId?: string;
  amount: number;
  currency: string;
  transactionId?: string;
  comment?: string;
  isAnonymous: boolean;
  statusId: number;
  typeId: number; // 1 = ONE_TIME, 2 = RECURRING
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    handle: string;
    name: string;
  };
}

export interface CreateContributionRequest {
  amount: number;
  currency: string;
  paymentMethodId: string;
  comment?: string;
  isAnonymous?: boolean;
}

export interface FundSummary {
  fund: FundData;
  contributions: FundContribution[];
  totalContributors: number;
  recentContributions: FundContribution[];
  topContributors: FundContribution[];
}

const API_PATH = '/api/funding';

export class FundingAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    /**
     * Get fund data for specific content (news or poll)
     */
    public async getFund(contentType: 'news' | 'poll', contentId: string): Promise<FundData | null> {
        try {
            return this._get<FundData>(`${API_PATH}/${contentType}/${contentId}`);
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null; // Fund doesn't exist yet
            }
            throw error;
        }
    }

    /**
     * Get detailed fund summary with contributions
     */
    public async getFundSummary(contentType: 'news' | 'poll', contentId: string): Promise<FundSummary | null> {
        try {
            return this._get<FundSummary>(`${API_PATH}/${contentType}/${contentId}/summary`);
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    /**
     * Create a contribution to fund content
     */
    public async createContribution(
        contentType: 'news' | 'poll', 
        contentId: string, 
        contributionData: CreateContributionRequest
    ): Promise<FundContribution> {
        return this._post<FundContribution>(
            `${API_PATH}/${contentType}/${contentId}/contribute`, 
            contributionData
        );
    }

    /**
     * Get contributions for specific content
     */
    public async getContributions(
        contentType: 'news' | 'poll',
        contentId: string,
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<FundContribution>> {
        return this._list<FundContribution>(
            `${API_PATH}/${contentType}/${contentId}/contributions`,
            pagination
        );
    }

    /**
     * Get user's contributions across all content
     */
    public async getUserContributions(
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<FundContribution>> {
        return this._list<FundContribution>(`${API_PATH}/my-contributions`, pagination);
    }

    /**
     * Get contributions by user for specific content
     */
    public async getUserContributionsForContent(
        contentType: 'news' | 'poll',
        contentId: string
    ): Promise<FundContribution[]> {
        return this._get<FundContribution[]>(`${API_PATH}/${contentType}/${contentId}/my-contributions`);
    }

    /**
     * Create or update a fund for content (admin/creator only)
     */
    public async createFund(contentType: 'news' | 'poll', contentId: string, data: {
        goalAmount?: number;
        currency?: string;
        expiresAt?: string;
    }): Promise<FundData> {
        return this._post<FundData>(`${API_PATH}/${contentType}/${contentId}/fund`, data);
    }

    /**
     * Update fund settings (admin/creator only)
     */
    public async updateFund(
        contentType: 'news' | 'poll',
        contentId: string,
        data: Partial<{
            goalAmount: number;
            currency: string;
            expiresAt: string;
            isActive: boolean;
        }>
    ): Promise<FundData> {
        return this._put<FundData>(`${API_PATH}/${contentType}/${contentId}/fund`, data);
    }

    /**
     * Get funding statistics for a channel
     */
    public async getChannelFundingStats(channelId: string, params?: {
        startDate?: string;
        endDate?: string;
        contentType?: 'news' | 'poll';
    }): Promise<{
        totalRaised: number;
        totalContributions: number;
        activeFunds: number;
        completedFunds: number;
        topFundedContent: Array<{
            id: string;
            title: string;
            type: 'news' | 'poll';
            amount: number;
            currency: string;
        }>;
        currencyBreakdown: Record<string, {
            amount: number;
            contributions: number;
        }>;
    }> {
        return this._get<any>(`${API_PATH}/channels/${channelId}/stats`, { params });
    }

    /**
     * Process fund payout (admin only)
     */
    public async processPayout(
        contentType: 'news' | 'poll',
        contentId: string,
        data: {
            amount?: number; // If not specified, transfers all available funds
            recipientId: string; // journalist/creator ID
            description?: string;
        }
    ): Promise<{
        transactionId: string;
        amount: number;
        currency: string;
        recipientId: string;
        status: string;
    }> {
        return this._post<any>(`${API_PATH}/${contentType}/${contentId}/payout`, data);
    }
}