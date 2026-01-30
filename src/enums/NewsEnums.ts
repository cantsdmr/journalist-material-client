// News Status Enum
export const NEWS_STATUS = {
  DRAFT: "DRAFT",
  PENDING_REVIEW: "PENDING_REVIEW",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
  DELETED: "DELETED",
  PRIVATE: "PRIVATE"
} as const;

export type NewsStatus = typeof NEWS_STATUS[keyof typeof NEWS_STATUS];

// Social Platform Type Enum
export const SOCIAL_PLATFORM_TYPE = {
  INSTAGRAM: "INSTAGRAM",
  TWITTER: "TWITTER",
  YOUTUBE: "YOUTUBE",
  TIKTOK: "TIKTOK",
  FACEBOOK: "FACEBOOK",
  LINKEDIN: "LINKEDIN",
  OTHER: "OTHER"
} as const;

export type SocialPlatformType = typeof SOCIAL_PLATFORM_TYPE[keyof typeof SOCIAL_PLATFORM_TYPE];

// News Media Type Enum
export const NEWS_MEDIA_TYPE = {
  COVER: "COVER",
  SUMMARY: "SUMMARY",
  AVATAR: "AVATAR",
  TEASER: "TEASER",
  INTRO: "INTRO",
  OUTRO: "OUTRO",
  OTHER: "OTHER"
} as const;

export type NewsMediaType = typeof NEWS_MEDIA_TYPE[keyof typeof NEWS_MEDIA_TYPE];

// News Media Format Enum
export const NEWS_MEDIA_FORMAT = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  AUDIO: "AUDIO",
  DOCUMENT: "DOCUMENT",
  URL: "URL",
  ARTICLE: "ARTICLE",
  OTHER: "OTHER"
} as const;

export type NewsMediaFormat = typeof NEWS_MEDIA_FORMAT[keyof typeof NEWS_MEDIA_FORMAT];

// Helper Functions for News Status
export function getNewsStatusLabel(status: NewsStatus): string {
  switch (status) {
  case NEWS_STATUS.DRAFT:
    return "Draft";
  case NEWS_STATUS.PENDING_REVIEW:
    return "Pending Review";
  case NEWS_STATUS.PUBLISHED:
    return "Published";
  case NEWS_STATUS.REJECTED:
    return "Rejected";
  case NEWS_STATUS.ARCHIVED:
    return "Archived";
  case NEWS_STATUS.DELETED:
    return "Deleted";
  case NEWS_STATUS.PRIVATE:
    return "Private";
  default:
    return status;
  }
}

export function getNewsStatusColor(status: NewsStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (status) {
  case NEWS_STATUS.DRAFT:
    return "default";
  case NEWS_STATUS.PENDING_REVIEW:
    return "info";
  case NEWS_STATUS.PUBLISHED:
    return "success";
  case NEWS_STATUS.REJECTED:
    return "error";
  case NEWS_STATUS.ARCHIVED:
    return "secondary";
  case NEWS_STATUS.DELETED:
    return "error";
  case NEWS_STATUS.PRIVATE:
    return "warning";
  default:
    return "default";
  }
}

// Helper Functions for Social Platform
export function getSocialPlatformLabel(platform: SocialPlatformType): string {
  switch (platform) {
  case SOCIAL_PLATFORM_TYPE.INSTAGRAM:
    return "Instagram";
  case SOCIAL_PLATFORM_TYPE.TWITTER:
    return "Twitter";
  case SOCIAL_PLATFORM_TYPE.YOUTUBE:
    return "YouTube";
  case SOCIAL_PLATFORM_TYPE.TIKTOK:
    return "TikTok";
  case SOCIAL_PLATFORM_TYPE.FACEBOOK:
    return "Facebook";
  case SOCIAL_PLATFORM_TYPE.LINKEDIN:
    return "LinkedIn";
  case SOCIAL_PLATFORM_TYPE.OTHER:
    return "Other";
  default:
    return platform;
  }
}

// Helper Functions for Media Type
export function getNewsMediaTypeLabel(type: NewsMediaType): string {
  switch (type) {
  case NEWS_MEDIA_TYPE.COVER:
    return "Cover";
  case NEWS_MEDIA_TYPE.SUMMARY:
    return "Summary";
  case NEWS_MEDIA_TYPE.AVATAR:
    return "Avatar";
  case NEWS_MEDIA_TYPE.TEASER:
    return "Teaser";
  case NEWS_MEDIA_TYPE.INTRO:
    return "Intro";
  case NEWS_MEDIA_TYPE.OUTRO:
    return "Outro";
  case NEWS_MEDIA_TYPE.OTHER:
    return "Other";
  default:
    return type;
  }
}

// Helper Functions for Media Format
export function getNewsMediaFormatLabel(format: NewsMediaFormat): string {
  switch (format) {
  case NEWS_MEDIA_FORMAT.IMAGE:
    return "Image";
  case NEWS_MEDIA_FORMAT.VIDEO:
    return "Video";
  case NEWS_MEDIA_FORMAT.AUDIO:
    return "Audio";
  case NEWS_MEDIA_FORMAT.DOCUMENT:
    return "Document";
  case NEWS_MEDIA_FORMAT.URL:
    return "URL";
  case NEWS_MEDIA_FORMAT.ARTICLE:
    return "Article";
  case NEWS_MEDIA_FORMAT.OTHER:
    return "Other";
  default:
    return format;
  }
}

// Dropdown Options
export const ALL_NEWS_STATUSES = [
  { value: NEWS_STATUS.DRAFT, label: "Draft" },
  { value: NEWS_STATUS.PENDING_REVIEW, label: "Pending Review" },
  { value: NEWS_STATUS.PUBLISHED, label: "Published" },
  { value: NEWS_STATUS.REJECTED, label: "Rejected" },
  { value: NEWS_STATUS.ARCHIVED, label: "Archived" },
  { value: NEWS_STATUS.PRIVATE, label: "Private" }
] as const;

export const ALL_SOCIAL_PLATFORMS = [
  { value: SOCIAL_PLATFORM_TYPE.INSTAGRAM, label: "Instagram" },
  { value: SOCIAL_PLATFORM_TYPE.TWITTER, label: "Twitter" },
  { value: SOCIAL_PLATFORM_TYPE.YOUTUBE, label: "YouTube" },
  { value: SOCIAL_PLATFORM_TYPE.TIKTOK, label: "TikTok" },
  { value: SOCIAL_PLATFORM_TYPE.FACEBOOK, label: "Facebook" },
  { value: SOCIAL_PLATFORM_TYPE.LINKEDIN, label: "LinkedIn" },
  { value: SOCIAL_PLATFORM_TYPE.OTHER, label: "Other" }
] as const;

export const ALL_NEWS_MEDIA_TYPES = [
  { value: NEWS_MEDIA_TYPE.COVER, label: "Cover" },
  { value: NEWS_MEDIA_TYPE.SUMMARY, label: "Summary" },
  { value: NEWS_MEDIA_TYPE.AVATAR, label: "Avatar" },
  { value: NEWS_MEDIA_TYPE.TEASER, label: "Teaser" },
  { value: NEWS_MEDIA_TYPE.INTRO, label: "Intro" },
  { value: NEWS_MEDIA_TYPE.OUTRO, label: "Outro" },
  { value: NEWS_MEDIA_TYPE.OTHER, label: "Other" }
] as const;

export const ALL_NEWS_MEDIA_FORMATS = [
  { value: NEWS_MEDIA_FORMAT.IMAGE, label: "Image" },
  { value: NEWS_MEDIA_FORMAT.VIDEO, label: "Video" },
  { value: NEWS_MEDIA_FORMAT.AUDIO, label: "Audio" },
  { value: NEWS_MEDIA_FORMAT.DOCUMENT, label: "Document" },
  { value: NEWS_MEDIA_FORMAT.URL, label: "URL" },
  { value: NEWS_MEDIA_FORMAT.ARTICLE, label: "Article" },
  { value: NEWS_MEDIA_FORMAT.OTHER, label: "Other" }
] as const;
