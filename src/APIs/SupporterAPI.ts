import { AxiosJournalist } from "../util/axios";
import { HTTPApi } from "../util/http";

export interface Supporter {

}

const API_PATH = '/supporters'

export class SupporterAPI extends HTTPApi<Supporter, any, any> {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }
}