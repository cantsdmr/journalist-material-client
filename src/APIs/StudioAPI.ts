import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedCollection } from "@/utils/http";
import { News, CreateNewsData } from "./NewsAPI";
import { Channel, CreateChannelData } from "./ChannelAPI";
import { Poll } from "./PollAPI";

// Creator statistics
export type CreatorStats = {
  period: string;
  stats: {
    totalNews: number;
    totalChannels: number;
    totalPolls: number;
    totalViews: number;
    totalSubscribers: number;
    revenue: number;
  };
};

// Content type filter for unified content endpoint
export type ContentType = 'all' | 'news' | 'channels' | 'polls';

// Creator content response for unified content
export type CreatorContent = {
  news?: News[];
  channels?: Channel[];
  polls?: Poll[];
};

// Create poll data specific to studio (might have different structure)
export type StudioCreatePollData = {
  title: string;
  description?: string;
  channelId: string;
  options: string[];
  startDate?: string;
  endDate?: string;
  allowMultipleVotes?: boolean;
};

const API_PATH = '/api/studio';

export class StudioAPI extends HTTPApi {
  constructor(axiosJ: AxiosJournalist) {
    super(axiosJ, API_PATH);
  }

  // ==================== CONTENT CREATION RESOURCES ====================
  
  /**
   * Create news article in studio
   * POST /api/studio/news
   */
  public async createNews(data: CreateNewsData): Promise<News> {
    return this._post<News>(`${API_PATH}/news`, data);
  }

  /**
   * Create channel in studio
   * POST /api/studio/channels
   */
  public async createChannel(data: CreateChannelData): Promise<Channel> {
    return this._post<Channel>(`${API_PATH}/channels`, data);
  }

  /**
   * Create poll in studio
   * POST /api/studio/polls
   */
  public async createPoll(data: StudioCreatePollData): Promise<Poll> {
    return this._post<Poll>(`${API_PATH}/polls`, data);
  }

  // ==================== USER/CREATOR RESOURCES ====================

  /**
   * Get current user's channels for dropdown/selection in forms
   * GET /api/studio/me/channels
   */
  public async getMyChannels() {
    return this._list<Channel>(`${API_PATH}/me/channels`);
  }

  /**
   * Get current user's content with unified interface
   * GET /api/studio/me/content
   * @param type - Type of content to retrieve ('all', 'news', 'channels', 'polls')
   * @param pagination - Pagination options
   */
  public async getMyContent(
    type: ContentType = 'all',
    pagination: PaginationObject = DEFAULT_PAGINATION
  ): Promise<PaginatedCollection<any> | CreatorContent> {
    const params = { type, ...pagination };
    
    if (type === 'all') {
      return this._get<CreatorContent>(`${API_PATH}/me/content`, { params });
    } else {
      return this._list<any>(`${API_PATH}/me/content`, params);
    }
  }

  // ==================== DASHBOARD RESOURCES ====================

  /**
   * Get creator analytics/statistics
   * GET /api/studio/analytics
   * @param period - Time period for stats ('7d', '30d', '90d', '1y')
   */
  public async getAnalytics(period: string = '30d'): Promise<CreatorStats> {
    const params = { period };
    return this._get<CreatorStats>(`${API_PATH}/analytics`, { params });
  }

  // ==================== CONVENIENCE METHODS ====================

  /**
   * Get current user's recent news
   */
  public async getMyRecentNews(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
    return this.getMyContent('news', pagination) as Promise<PaginatedCollection<News>>;
  }

  /**
   * Get current user's recent polls
   */
  public async getMyRecentPolls(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Poll>> {
    return this.getMyContent('polls', pagination) as Promise<PaginatedCollection<Poll>>;
  }

  /**
   * Get current user's recent channels
   */
  public async getMyRecentChannels(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Channel>> {
    return this.getMyContent('channels', pagination) as Promise<PaginatedCollection<Channel>>;
  }

  // ==================== BACKWARD COMPATIBILITY ALIASES ====================
  
  /**
   * @deprecated Use getMyChannels() instead
   */
  public async getCreatorChannels() {
    return this.getMyChannels();
  }

  /**
   * @deprecated Use getMyContent() instead
   */
  public async getCreatorContent(
    type: ContentType = 'all',
    pagination: PaginationObject = DEFAULT_PAGINATION
  ) {
    return this.getMyContent(type, pagination);
  }

  /**
   * @deprecated Use getAnalytics() instead
   */
  public async getCreatorStats(period: string = '30d'): Promise<CreatorStats> {
    return this.getAnalytics(period);
  }
}

export default StudioAPI; 