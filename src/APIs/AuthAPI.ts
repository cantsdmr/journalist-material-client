import { HTTPApi } from "@/utils/http";
import { AxiosJournalist } from "@/utils/axios";
import { SignInData, SignUpData, VerifyTokenData } from "../types";

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