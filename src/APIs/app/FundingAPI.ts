import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedResponse } from "@/utils/http";
import { Fund, FundContribution, FundSummary, ChannelFundingStats } from "../../types";

// Re-export entity types for backward compatibility
export type { Fund as FundData, FundContribution, FundSummary, ChannelFundingStats };

export interface CreateContributionRequest {
  amount: number;
  currency: string;
  paymentMethodId: string;
  comment?: string;
  isAnonymous?: boolean;
}

const API_PATH = '/api/funding';

export class FundingAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    /**
     * Get fund data for specific content (news or poll)
     */
    public async getFund(contentType: 'news' | 'poll', contentId: string): Promise<Fund | null> {
        try {
            return this._get<Fund>(`${API_PATH}/${contentType}/${contentId}`);
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
     * Create PayPal order for contribution (SDK-First Flow - Step 1)
     */
    public async createPayPalOrder(
        contentType: 'news' | 'poll',
        contentId: string,
        data: {
            amount: number;
            currency: string;
            comment?: string;
        }
    ): Promise<{ orderId: string; contributionId: string }> {
        return this._post<{ orderId: string; contributionId: string }>(
            `${API_PATH}/${contentType}/${contentId}/create-paypal-order`,
            data
        );
    }

    /**
     * Capture PayPal order after user approval (SDK-First Flow - Step 2)
     */
    public async capturePayPalOrder(
        contentType: 'news' | 'poll',
        contentId: string,
        data: {
            orderId: string;
            contributionId: string;
        }
    ): Promise<FundContribution> {
        return this._post<FundContribution>(
            `${API_PATH}/${contentType}/${contentId}/capture-paypal-order`,
            data
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
    }): Promise<Fund> {
        return this._post<Fund>(`${API_PATH}/${contentType}/${contentId}/fund`, data);
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
    ): Promise<Fund> {
        return this._put<Fund>(`${API_PATH}/${contentType}/${contentId}/fund`, data);
    }

    /**
     * Get funding statistics for a channel
     */
    public async getChannelFundingStats(channelId: string, params?: {
        startDate?: string;
        endDate?: string;
        contentType?: 'news' | 'poll';
    }): Promise<ChannelFundingStats> {
        return this._get<ChannelFundingStats>(`${API_PATH}/channels/${channelId}/stats`, { params });
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
