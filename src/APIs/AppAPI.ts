import { AxiosJournalist } from "@/utils/axios";
import { ChannelAPI } from "./ChannelAPI";
import { NewsAPI } from "./NewsAPI";
import { PollAPI } from "./PollAPI";
import { UserAPI } from "./UserAPI";
import { AuthAPI } from "./AuthAPI";
import { AccountAPI } from "./AccountAPI";
import { ExpenseOrderAPI } from "./ExpenseOrderAPI";

export class AppAPI {
    private axiosJ: AxiosJournalist
    public userApi: UserAPI;
    public authApi: AuthAPI;
    public pollApi: PollAPI;
    public newsApi: NewsAPI;
    public channelApi: ChannelAPI;
    public accountApi: AccountAPI;
    public expenseOrderApi: ExpenseOrderAPI;

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
        this.authApi = new AuthAPI(this.axiosJ)
        this.pollApi = new PollAPI(this.axiosJ)
        this.newsApi = new NewsAPI(this.axiosJ)
        this.channelApi = new ChannelAPI(this.axiosJ)
        this.accountApi = new AccountAPI(this.axiosJ)
        this.expenseOrderApi = new ExpenseOrderAPI(this.axiosJ)

        return this
    }
}