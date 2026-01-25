import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION } from "@/utils/http";
import {
    Notification,
    NotificationFeedResponse,
    UnreadCountResponse,
    GetNotificationsParams,
    GetNotificationFeedParams
} from "@/types";

const API_PATH = '/api/notifications';
const DEVICE_TOKENS_PATH = '/api/notifications/device-tokens';
const FEED_PATH = '/api/notifications/feed';

/**
 * NotificationAPI - Handles all notification-related API calls
 * Includes in-app notifications and FCM device token management
 */
export class NotificationAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    /**
     * Get user notifications with filters and pagination
     * @param params - Filter parameters (typeId, categoryId, isRead)
     * @param pagination - Pagination object (limit, offset)
     */
    public async getNotifications(
        params: GetNotificationsParams = {},
        pagination: PaginationObject = DEFAULT_PAGINATION
    ) {
        const queryParams: any = { ...pagination };

        if (params.typeId !== undefined) queryParams.typeId = params.typeId;
        if (params.categoryId !== undefined) queryParams.categoryId = params.categoryId;
        if (params.isRead !== undefined) queryParams.isRead = params.isRead;

        const response = await this._list<Notification>(API_PATH, queryParams);
        return response;
    }

    /**
     * Get new notifications count since last checked (YouTube-style badge)
     * Shows count of notifications created since user last opened notification center
     */
    public async getNewNotificationsCount(): Promise<UnreadCountResponse> {
        return await this._get<UnreadCountResponse>(`${API_PATH}/new-count`);
    }

    /**
     * Mark as checked - updates last checked timestamp
     * Resets the "new notifications" badge count (YouTube-style)
     */
    public async markAsChecked(): Promise<void> {
        await this._post(`${API_PATH}/mark-checked`, {});
    }

    /**
     * Mark a specific notification as read
     * @param notificationId - ID of the notification to mark as read
     */
    public async markAsRead(notificationId: string): Promise<void> {
        await this._patch(`${API_PATH}/${notificationId}/read`, null);
    }

    /**
     * Mark all notifications as read for current user
     */
    public async markAllAsRead(): Promise<void> {
        await this._patch(`${API_PATH}/mark-all-read`, null);
    }

    /**
     * Delete a notification (soft delete)
     * @param notificationId - ID of the notification to delete
     */
    public async deleteNotification(notificationId: string): Promise<void> {
        await this._remove(`${API_PATH}/${notificationId}`);
    }

    /**
     * Register FCM device token for push notifications
     * @param token - FCM device token
     */
    public async registerDeviceToken(token: string): Promise<void> {
        await this._post(DEVICE_TOKENS_PATH, { token });
    }

    /**
     * Unregister FCM device token
     * @param token - FCM device token to remove
     */
    public async unregisterDeviceToken(token: string): Promise<void> {
        await this._remove(`${DEVICE_TOKENS_PATH}/${token}`);
    }

    /**
     * Get notification feed with cursor-based pagination
     * Optimized for infinite scroll with self-describing opaque cursors
     * @param params - Filter parameters and cursor options
     */
    public async getNotificationFeed(
        params: GetNotificationFeedParams = {}
    ): Promise<NotificationFeedResponse> {
        const queryParams: any = {};

        // Filter params
        if (params.typeId !== undefined) queryParams.typeId = params.typeId;
        if (params.categoryId !== undefined) queryParams.categoryId = params.categoryId;
        if (params.isRead !== undefined) queryParams.isRead = params.isRead;

        // Cursor pagination params (cursors are self-describing)
        if (params.limit !== undefined) queryParams.limit = params.limit;
        if (params.after) queryParams.after = params.after;
        if (params.before) queryParams.before = params.before;

        const response = await this._listWithCursor<Notification>(FEED_PATH, queryParams);

        return response;
    }
}
