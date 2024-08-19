import { AxiosJournalist } from "../util/axios";
import { HTTPApi } from "../util/http";
import { Membership } from "./MembershipAPI";

export type User = {
    id: string;
    username: string;
    email: string;
    created_at: Date;
    role_id: string;
    external_id: string;
    memberships: Membership[];
}

export type CreateUserData = Omit<User, "id" | "created_at" | "created_by">
export type EditUserData = Omit<User, "id" | "created_at" | "created_by" | "external_id">

const API_PATH = 'api/users'

export class UserAPI extends HTTPApi<User, CreateUserData, EditUserData> {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }
}