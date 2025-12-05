import { AxiosJournalist } from "@/utils/axios";
import { AdminNewsAPI } from "./AdminNewsAPI";
import { AdminChannelAPI } from "./AdminChannelAPI";
import { AdminPollAPI } from "./AdminPollAPI";
import { AdminUserAPI } from "./AdminUserAPI";
import { AdminPayoutAPI } from "./AdminPayoutAPI";
import { AdminSubscriptionAPI } from "./AdminSubscriptionAPI";
import { AdminTagAPI } from "./AdminTagAPI";
import { AdminExpenseOrderAPI } from "./AdminExpenseOrderAPI";

/**
 * Main Admin API class that combines all admin-specific endpoints
 * All routes require ADMIN or SUPER_ADMIN role
 * Provides unfiltered access to data for administrative purposes
 */
export class AdminAPI {
    public news: AdminNewsAPI;
    public channels: AdminChannelAPI;
    public polls: AdminPollAPI;
    public users: AdminUserAPI;
    public payouts: AdminPayoutAPI;
    public subscriptions: AdminSubscriptionAPI;
    public tags: AdminTagAPI;
    public expenseOrders: AdminExpenseOrderAPI;

    constructor(axiosJ: AxiosJournalist) {
        this.news = new AdminNewsAPI(axiosJ);
        this.channels = new AdminChannelAPI(axiosJ);
        this.polls = new AdminPollAPI(axiosJ);
        this.users = new AdminUserAPI(axiosJ);
        this.payouts = new AdminPayoutAPI(axiosJ);
        this.subscriptions = new AdminSubscriptionAPI(axiosJ);
        this.tags = new AdminTagAPI(axiosJ);
        this.expenseOrders = new AdminExpenseOrderAPI(axiosJ);
    }
}

// Re-export types for convenience
export * from "./AdminNewsAPI";
export * from "./AdminChannelAPI";
export * from "./AdminPollAPI";
export * from "./AdminUserAPI";
export * from "./AdminPayoutAPI";
export * from "./AdminSubscriptionAPI";
export * from "./AdminTagAPI";
export * from "./AdminExpenseOrderAPI";
