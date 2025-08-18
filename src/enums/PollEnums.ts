export const POLL_STATUS = {
    ACTIVE: 1,
    INACTIVE: 2,
    COMPLETED: 3,
    CANCELLED: 4
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