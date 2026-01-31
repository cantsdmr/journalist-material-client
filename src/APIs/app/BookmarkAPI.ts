import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, CursorPaginatedResponse } from "@/utils/http";
import { News, Poll, Bookmark, BookmarkStatus, MixedBookmarkItem } from "@/types/index";
import { BookmarkableType } from "@/enums/BookmarkEnums";

const API_PATH = '/api/bookmarks';

interface CursorPaginationParams {
    limit?: number;
    after?: string;
    before?: string;
}

export class BookmarkAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    // ==================== NEWS BOOKMARK OPERATIONS ====================

    /**
     * Bookmark a news article
     */
    public async bookmarkNews(newsId: string): Promise<Bookmark> {
        return this._post<Bookmark>(`${API_PATH}/news/${newsId}`, {});
    }

    /**
     * Unbookmark a news article
     */
    public async unbookmarkNews(newsId: string): Promise<void> {
        return this._remove(`${API_PATH}/news/${newsId}`);
    }

    /**
     * Check if a news article is bookmarked
     */
    public async checkNewsBookmarkStatus(newsId: string): Promise<BookmarkStatus> {
        return this._get<BookmarkStatus>(`${API_PATH}/news/${newsId}/status`);
    }

    /**
     * Get user's bookmarked news with cursor pagination
     */
    public async getBookmarkedNews(
        params: CursorPaginationParams = {}
    ): Promise<CursorPaginatedResponse<News>> {
        return this._listWithCursor<News>(`${API_PATH}/news`, params);
    }

    // ==================== POLL BOOKMARK OPERATIONS ====================

    /**
     * Bookmark a poll
     */
    public async bookmarkPoll(pollId: string): Promise<Bookmark> {
        return this._post<Bookmark>(`${API_PATH}/polls/${pollId}`, {});
    }

    /**
     * Unbookmark a poll
     */
    public async unbookmarkPoll(pollId: string): Promise<void> {
        return this._remove(`${API_PATH}/polls/${pollId}`);
    }

    /**
     * Check if a poll is bookmarked
     */
    public async checkPollBookmarkStatus(pollId: string): Promise<BookmarkStatus> {
        return this._get<BookmarkStatus>(`${API_PATH}/polls/${pollId}/status`);
    }

    /**
     * Get user's bookmarked polls with cursor pagination
     */
    public async getBookmarkedPolls(
        params: CursorPaginationParams = {}
    ): Promise<CursorPaginatedResponse<Poll>> {
        return this._listWithCursor<Poll>(`${API_PATH}/polls`, params);
    }

    // ==================== GENERAL BOOKMARK OPERATIONS ====================

    /**
     * Get all bookmarks (mixed news and polls) with optional type filter and cursor pagination
     * @param type - BookmarkableType (null=all, "NEWS", "POLL")
     */
    public async getBookmarks(
        type: BookmarkableType | null,
        params: CursorPaginationParams = {}
    ): Promise<CursorPaginatedResponse<MixedBookmarkItem>> {
        const queryParams: any = { ...params };
        queryParams.type = type;
        return this._listWithCursor<MixedBookmarkItem>(API_PATH, queryParams);
    }
}
