export type CreateTagData = {
    name: string;
    typeId?: number;
};

export type UpdateTagData = {
    name?: string;
    typeId?: number;
    statusId?: number;
    isVerified?: boolean;
    isTrending?: boolean;
}; 