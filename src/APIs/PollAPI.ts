import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi } from "@/utils/http";

export type Poll = {
    id: string;
    title: string;
    description: string;
    image_url: string;
    video_url: string;
    division: string;
    user: string;
    questions: Question[];
}

export type Question = {
    id: string;
    text: string;
    type: string;
    options: Option[];
  }
  

export type Option = {
    id: string;
    text: string;
    order: number;
}

export type CreatePollData = Omit<Poll, "id">
export type EditPollData = Omit<Poll, "id">

const API_PATH = '/polls'
   
export class PollAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }
}