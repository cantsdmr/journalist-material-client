export const NEWS_STATUS = {
    DRAFT: 1,
    PENDING_REVIEW: 2,
    PUBLISHED: 3,
    REJECTED: 4,
    ARCHIVED: 5,
    DELETED: 6
} as const;

export const SOCIAL_PLATFORM_TYPE = {
    INSTAGRAM: 1,
    TWITTER: 2,
    YOUTUBE: 3,
    TIKTOK: 4,
    FACEBOOK: 5,
    LINKEDIN: 6,
    OTHER: 7
} as const;

export const NEWS_MEDIA_TYPE = {
    COVER: 1,
    SUMMARY: 2,
    AVATAR: 3,
    TEASER: 4,
    INTRO: 5,
    OUTRO: 6,
    OTHER: 7
} as const;

export const NEWS_MEDIA_FORMAT = {
    IMAGE: 1,
    VIDEO: 2,
    AUDIO: 3,
    DOCUMENT: 4,
    URL: 5,
    ARTICLE: 6,
    OTHER: 7
} as const;
