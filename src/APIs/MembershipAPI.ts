import { AxiosJournalist } from "../util/axios";
import { HTTPApi } from "../util/http";

export type Membership = {
    id: string;
    division_tier_id: string;
    user_id: string;
    division_name: string;
}

export type CreateMembershipData = Omit<Membership, "id">
export type EditMembershipData = Omit<Membership, "id">
  
const API_PATH = '/memberships'

export class MembershipAPI extends HTTPApi<Membership, CreateMembershipData, EditMembershipData> {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }
}