import { AxiosJournalist } from "@/utils/axios";
import { AdminAPI } from "./admin/AdminAPI";
import { AppAPI } from "./app/AppAPI";
import { AuthAPI } from "./AuthAPI";
import { StudioAPI } from "./StudioAPI";

/**
 * Main APIs class
 * Provides organized access to all API endpoints
 * - admin: Administrative APIs (admin.users, admin.news, etc.)
 * - app: Regular application APIs (app.user, app.news, etc.)
 * - auth: Authentication APIs (standalone)
 * - studio: Studio-specific APIs
 */
export class APIs {
    private axiosJ: AxiosJournalist;

    public admin: AdminAPI;
    public app: AppAPI;
    public auth: AuthAPI;
    public studio: StudioAPI;

    constructor() {
        this.axiosJ = new AxiosJournalist();
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
        this.admin = new AdminAPI(this.axiosJ);
        this.app = new AppAPI(this.axiosJ);
        this.auth = new AuthAPI(this.axiosJ);
        this.studio = new StudioAPI(this.axiosJ);

        return this;
    };
}
