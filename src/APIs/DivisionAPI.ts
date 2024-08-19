import { AxiosJournalist } from "../util/axios";
import { HTTPApi } from "../util/http";

export type Division = {
    id: string;
    name: string;
    fund_id: string;
    created_at: Date;
    premium: boolean;
}

export type CreateDivisionData = Omit<Division, "id">
export type EditDivisionData = Omit<Division, "id">

const API_PATH = '/divisions'

export class DivisionAPI extends HTTPApi<Division, CreateDivisionData, EditDivisionData> {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }
}