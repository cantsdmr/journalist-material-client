export type CreateChannelData = {
    name: string;
    description: string;
    handle: string;
    logoUrl: string;
    bannerUrl: string;
    status: number;
    tags: string[];
    defaultCurrency: string;
};

export type EditChannelData = {
    name?: string;
    description?: string;
    handle?: string;
    logoUrl?: string;
    bannerUrl?: string;
    status?: number;
    tags?: string[];
    defaultCurrency?: string;
};

export type CreateChannelTierData = {
    name: string;
    description: string;
    price: number;
    benefits: string[];
    order: number;
};

export type EditChannelTierData = CreateChannelTierData;

export type ChannelSubscribeData = {
    tierId?: string;
    paymentMethodId?: string;
}; 