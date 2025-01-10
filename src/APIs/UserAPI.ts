import { AxiosJournalist } from "../util/axios";
import { HTTPApi } from "../util/http";
import { Membership } from "./MembershipAPI";

export type User = {
    id: string;
    displayName: string | null;
    email: string | null;
    createdAt: Date;
    photoUrl: string | null;
    roleId: number;
    statusId: number;
    externalId: string | null;
    memberships: Membership[];
}

export type CreateUserData = Omit<User, "id" | "createdAt" | "memberships">
export type EditUserData = Omit<User, "id" | "createdAt" | "externalId" | "memberships">

const API_PATH = 'api/users'
const SUB_PATH = {
    PROFILE: 'profile',
    SIGN_IN: 'sign-in',
    SIGN_UP: 'sign-up'
}

export class UserAPI extends HTTPApi<User, CreateUserData, EditUserData> {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    public signUp = async ({
        external_id,
        email,
        display_name,
        photo_url,
        role_id
    }: {
        external_id: string | null,
        email: string | null,
        display_name: string | null,
        photo_url: string | null,
        role_id: number
    }) => {
        return this._post(`${this.apiPath}/${SUB_PATH.SIGN_UP}`, { external_id, email, display_name, photo_url, role_id });
    }

    public signIn = async ({
        idToken
    }: {
        idToken: string
    }) => {
        return this._post(`${this.apiPath}/${SUB_PATH.SIGN_IN}`, { idToken });
    }

    public getUserInfo = async () => {
        return this._get(`${this.apiPath}/${SUB_PATH.PROFILE}`);
    }

    public getUserInfoByExternalId = async (externalId: string) => {
        return this._get(`${this.apiPath}/${SUB_PATH.PROFILE}/${externalId}`);
    }
}