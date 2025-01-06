import { AxiosJournalist } from "../util/axios";
import { PaginatedCollection, HTTPApi, Collection } from "../util/http";

export type News = {
    id: string;
    division_id: string;
    fund_id: string;
    title: string;
    description: string;
    body: string;
    image_url: string;
    video_url: string;
    start_at: Date;
    end_at: Date;
    created_by: string;
    tags: string[];
}

export type CreateNewsData = Omit<News, "id" | "fund_id" | "created_by">
export type EditNewsData = Omit<News, "id" | "fund_id" | "created_by">

export interface NewsTag {
  id: string;
  title: string;
}

const API_PATH = '/api/news'
const SUB_PATH = {
    MOST_POPULAR: 'most-popular',
    NEWS_TAGS: 'news-tags',
    SUBSCRIBED_CHANNEL_NEWS: 'subscribed-channel-news'
}

export class NewsAPI extends HTTPApi<News, CreateNewsData, EditNewsData> {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    // get most popular news
    public getMostPopular = async (page: number = 1, limit: number = 10): Promise<PaginatedCollection<News>> => {
        return this.list(SUB_PATH.MOST_POPULAR, {
            order: 'desc',
            limit: limit,
            page: page
        });
    }

    // get subscribed channel news
    public getSubscribedChannelNews = async (page: number = 1, limit: number = 10): Promise<PaginatedCollection<News>> => {
        return this.list(SUB_PATH.SUBSCRIBED_CHANNEL_NEWS, {
            order: 'desc',
            limit: limit,
            page: page
        });
    }

    // get news tags
    public getNewsTags = async (): Promise<Collection<NewsTag>> => {
        return this.listAll(SUB_PATH.NEWS_TAGS);
    }
}