export const POLL_STATUS = {
    ACTIVE: 1,
    TRENDING: 2,
    CLAIMED: 3,
    CONVERTED: 4,
    CLOSED: 5,
    EXPIRED: 6,
    FUNDED: 7,
    CANCELLED: 8,
    ARCHIVED: 9
} as const;

export const POLL_MEDIA_TYPE = {
    COVER: 1,
    SUMMARY: 2,
    AVATAR: 3,
    TEASER: 4,
    INTRO: 5,
    OUTRO: 6,
    OTHER: 7
} as const;

export const POLL_MEDIA_FORMAT = {
    IMAGE: 1,
    VIDEO: 2,
    AUDIO: 3,
    DOCUMENT: 4,
    URL: 5,
    ARTICLE: 6,
    OTHER: 7
} as const;