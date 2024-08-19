import { AxiosJournalist } from "../util/axios";
import { DivisionAPI } from "./DivisionAPI";
import { MembershipAPI } from "./MembershipAPI";
import { NewsAPI } from "./NewsAPI";
import { PollAPI } from "./PollAPI";
import { PublisherAPI } from "./PublisherAPI";
import { SupporterAPI } from "./SupporterAPI";
import { UserAPI } from "./UserAPI";

export class AppAPI {
    private axiosJ: AxiosJournalist
    public userApi: UserAPI;
    public supporterApi: SupporterAPI;
    public pollApi: PollAPI;
    public newsApi: NewsAPI;
    public membershipApi: MembershipAPI;
    public publisherApi: PublisherAPI;
    public divisionApi: DivisionAPI;

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
        this.supporterApi = new SupporterAPI(this.axiosJ)
        this.pollApi = new PollAPI(this.axiosJ)
        this.newsApi = new NewsAPI(this.axiosJ)
        this.membershipApi = new MembershipAPI(this.axiosJ)
        this.publisherApi = new PublisherAPI(this.axiosJ)
        this.divisionApi = new DivisionAPI(this.axiosJ)

        return this
    }
}