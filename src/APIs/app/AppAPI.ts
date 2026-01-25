import { AxiosJournalist } from "@/utils/axios";
import { ChannelAPI } from "./ChannelAPI";
import { NewsAPI } from "./NewsAPI";
import { PollAPI } from "./PollAPI";
import { UserAPI } from "./UserAPI";
import { AccountAPI } from "./AccountAPI";
import { ExpenseOrderAPI } from "./ExpenseOrderAPI";
import { SubscriptionAPI } from "./SubscriptionAPI";
import { TagAPI } from "./TagAPI";
import { SearchAPI } from "./SearchAPI";
import { FundingAPI } from "./FundingAPI";
import { PaymentTokenAPI } from "./PaymentTokenAPI";
import { IyzicoTokenAPI } from "./IyzicoTokenAPI";
import { PayoutAPI } from "./PayoutAPI";
import { NotificationAPI } from "./NotificationAPI";

/**
 * Main App API class that combines all regular application endpoints
 * These are user-facing APIs with appropriate access controls
 */
export class AppAPI {
    public user: UserAPI;
    public poll: PollAPI;
    public news: NewsAPI;
    public channel: ChannelAPI;
    public account: AccountAPI;
    public expenseOrder: ExpenseOrderAPI;
    public subscription: SubscriptionAPI;
    public tag: TagAPI;
    public search: SearchAPI;
    public funding: FundingAPI;
    public paymentToken: PaymentTokenAPI;
    public iyzicoToken: IyzicoTokenAPI;
    public payout: PayoutAPI;
    public notification: NotificationAPI;

    constructor(axiosJ: AxiosJournalist) {
        this.user = new UserAPI(axiosJ);
        this.poll = new PollAPI(axiosJ);
        this.news = new NewsAPI(axiosJ);
        this.channel = new ChannelAPI(axiosJ);
        this.account = new AccountAPI(axiosJ);
        this.expenseOrder = new ExpenseOrderAPI(axiosJ);
        this.subscription = new SubscriptionAPI(axiosJ);
        this.tag = new TagAPI(axiosJ);
        this.search = new SearchAPI(axiosJ);
        this.funding = new FundingAPI(axiosJ);
        this.paymentToken = new PaymentTokenAPI(axiosJ);
        this.iyzicoToken = new IyzicoTokenAPI(axiosJ);
        this.payout = new PayoutAPI(axiosJ);
        this.notification = new NotificationAPI(axiosJ);
    }
}

// Re-export all APIs for convenience
export * from "./ChannelAPI";
export * from "./NewsAPI";
export * from "./PollAPI";
export * from "./UserAPI";
export * from "./AccountAPI";
export * from "./ExpenseOrderAPI";
export * from "./SubscriptionAPI";
export * from "./TagAPI";
export * from "./SearchAPI";
export * from "./FundingAPI";
export * from "./PaymentTokenAPI";
export * from "./IyzicoTokenAPI";
export * from "./PayoutAPI";
export * from "./NotificationAPI";
