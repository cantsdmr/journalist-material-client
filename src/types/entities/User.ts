import { ChannelSubscription } from "./Channel";

export type User = {
    id: string;
    externalId: string;
    email: string;
    displayName: string;
    photoUrl?: string;
    roleId: number;
    statusId: number;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
    channelSubscriptions?: ChannelSubscription[];
};

export interface UserPreference {
    id: string | null;
    userId: string;
    themeInfo?: {
        mode: 'light' | 'dark';
    };
    createdAt: Date | string | null;
    updatedAt: Date | string | null;
}