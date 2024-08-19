import { AxiosJournalist } from "../util/axios";
import { HTTPApi } from "../util/http";

export interface Publisher {

}

const API_PATH = '/publishers'

export class PublisherAPI extends HTTPApi<Publisher, any, any> {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }
}