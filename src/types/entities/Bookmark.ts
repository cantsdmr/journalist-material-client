import { BookmarkableType } from "@/enums/BookmarkEnums";
import { News } from "./News";
import { Poll } from "./Poll";

export interface Bookmark {
    id: string;
    userId: string;
    bookmarkableType: BookmarkableType; // "NEWS" or "POLL"
    bookmarkableId: string;
    createdAt: string;
    updatedAt: string;
}

export interface BookmarkStatus {
    isBookmarked: boolean;
    entityId: string;
    entityType: BookmarkableType; // "NEWS" or "POLL"
}

export interface MixedBookmarkItem {
    id: string;
    bookmarkedAt: string;
    type: BookmarkableType; // "NEWS" or "POLL"
    content: News | Poll;
}
