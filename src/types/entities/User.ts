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