import { AxiosJournalist } from "../util/axios";
import { Collection, HTTPApi } from "../util/http";

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

const API_PATH = '/api/news'

export class NewsAPI extends HTTPApi<News, CreateNewsData, EditNewsData> {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    // get most popular news
    public getMostPopular = async (): Promise<Collection<News>> => {
        return this.list({
            sort: 'views',
            order: 'desc',
            limit: 10
        });
    }
}