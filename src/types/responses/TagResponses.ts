import { News } from "../entities/News";
import { Poll } from "../entities/Poll";

export type TagContentResponse = {
    items: News[] | Poll[];
    metadata: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
};