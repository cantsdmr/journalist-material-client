import { AxiosJournalist } from "../util/axios";
import { ChannelAPI } from "./ChannelAPI";
import { NewsAPI } from "./NewsAPI";
import { PollAPI } from "./PollAPI";
import { UserAPI } from "./UserAPI";

export class AppAPI {
    private axiosJ: AxiosJournalist
    public userApi: UserAPI;
    public pollApi: PollAPI;
    public newsApi: NewsAPI;
    public channelApi: ChannelAPI;

    constructor() {
        this.axiosJ = new AxiosJournalist()
    }

    public setAuthHeader = (token: string | null) => {
        if (token) {
            this.axiosJ.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.axiosJ.axiosInstance.defaults.headers.common['Authorization'];
        }

        return this;
    };

    public setApis = () => {
        this.userApi = new UserAPI(this.axiosJ)
        this.pollApi = new PollAPI(this.axiosJ)
        this.newsApi = new NewsAPI(this.axiosJ)
        this.channelApi = new ChannelAPI(this.axiosJ)

        return this
    }
}