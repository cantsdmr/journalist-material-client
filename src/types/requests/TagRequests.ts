import { TagType, TagStatus } from "@/enums/TagEnums";

export type CreateTagData = {
    name: string;
    typeId?: TagType;
};

export type UpdateTagData = {
    name?: string;
    typeId?: TagType;
    statusId?: TagStatus;
    isVerified?: boolean;
    isTrending?: boolean;
}; 