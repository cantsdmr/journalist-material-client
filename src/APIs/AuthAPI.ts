import { HTTPApi } from "@/utils/http";
import { AxiosJournalist } from "@/utils/axios";

export type SignInData = {
    idToken: string;
};

export type SignUpData = {
    external_id: string | null;
    email: string | null;
    display_name: string | null;
    photo_url: string | null;
    role_id: number;
};

export type VerifyTokenData = {
    idToken: string;
};

const API_PATH = '/api/auth';

export class AuthAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    public async signIn(data: SignInData): Promise<void> {
        return this._post<void>(`${API_PATH}/sign-in`, data);
    }

    public async signUp(data: SignUpData): Promise<void> {
        return this._post<void>(`${API_PATH}/sign-up`, data);
    }

    public async verifyToken(data: VerifyTokenData): Promise<any> {
        return this._post<any>(`${API_PATH}/verify-token`, data);
    }
} 