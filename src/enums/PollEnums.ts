// Poll Status Enum
export const POLL_STATUS = {
  ACTIVE: "ACTIVE",
  TRENDING: "TRENDING",
  CLAIMED: "CLAIMED",
  CONVERTED: "CONVERTED",
  CLOSED: "CLOSED",
  EXPIRED: "EXPIRED",
  FUNDED: "FUNDED",
  CANCELLED: "CANCELLED",
  ARCHIVED: "ARCHIVED"
} as const;

export type PollStatus = typeof POLL_STATUS[keyof typeof POLL_STATUS];

// Poll Media Type Enum
export const POLL_MEDIA_TYPE = {
  COVER: "COVER",
  SUMMARY: "SUMMARY",
  AVATAR: "AVATAR",
  TEASER: "TEASER",
  INTRO: "INTRO",
  OUTRO: "OUTRO",
  OTHER: "OTHER"
} as const;

export type PollMediaType = typeof POLL_MEDIA_TYPE[keyof typeof POLL_MEDIA_TYPE];

// Poll Media Format Enum
export const POLL_MEDIA_FORMAT = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  AUDIO: "AUDIO",
  DOCUMENT: "DOCUMENT",
  URL: "URL",
  ARTICLE: "ARTICLE",
  OTHER: "OTHER"
} as const;

export type PollMediaFormat = typeof POLL_MEDIA_FORMAT[keyof typeof POLL_MEDIA_FORMAT];

// Helper Functions for Poll Status
export function getPollStatusLabel(status: PollStatus): string {
  switch (status) {
  case POLL_STATUS.ACTIVE:
    return "Active";
  case POLL_STATUS.TRENDING:
    return "Trending";
  case POLL_STATUS.CLAIMED:
    return "Claimed";
  case POLL_STATUS.CONVERTED:
    return "Converted";
  case POLL_STATUS.CLOSED:
    return "Closed";
  case POLL_STATUS.EXPIRED:
    return "Expired";
  case POLL_STATUS.FUNDED:
    return "Funded";
  case POLL_STATUS.CANCELLED:
    return "Cancelled";
  case POLL_STATUS.ARCHIVED:
    return "Archived";
  default:
    return status;
  }
}

export function getPollStatusColor(status: PollStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (status) {
  case POLL_STATUS.ACTIVE:
    return "success";
  case POLL_STATUS.TRENDING:
    return "warning";
  case POLL_STATUS.CLAIMED:
    return "info";
  case POLL_STATUS.CONVERTED:
    return "primary";
  case POLL_STATUS.CLOSED:
    return "secondary";
  case POLL_STATUS.EXPIRED:
    return "error";
  case POLL_STATUS.FUNDED:
    return "success";
  case POLL_STATUS.CANCELLED:
    return "secondary";
  case POLL_STATUS.ARCHIVED:
    return "secondary";
  default:
    return "default";
  }
}

// Helper Functions for Media Type
export function getPollMediaTypeLabel(type: PollMediaType): string {
  switch (type) {
  case POLL_MEDIA_TYPE.COVER:
    return "Cover";
  case POLL_MEDIA_TYPE.SUMMARY:
    return "Summary";
  case POLL_MEDIA_TYPE.AVATAR:
    return "Avatar";
  case POLL_MEDIA_TYPE.TEASER:
    return "Teaser";
  case POLL_MEDIA_TYPE.INTRO:
    return "Intro";
  case POLL_MEDIA_TYPE.OUTRO:
    return "Outro";
  case POLL_MEDIA_TYPE.OTHER:
    return "Other";
  default:
    return type;
  }
}

// Helper Functions for Media Format
export function getPollMediaFormatLabel(format: PollMediaFormat): string {
  switch (format) {
  case POLL_MEDIA_FORMAT.IMAGE:
    return "Image";
  case POLL_MEDIA_FORMAT.VIDEO:
    return "Video";
  case POLL_MEDIA_FORMAT.AUDIO:
    return "Audio";
  case POLL_MEDIA_FORMAT.DOCUMENT:
    return "Document";
  case POLL_MEDIA_FORMAT.URL:
    return "URL";
  case POLL_MEDIA_FORMAT.ARTICLE:
    return "Article";
  case POLL_MEDIA_FORMAT.OTHER:
    return "Other";
  default:
    return format;
  }
}

// Dropdown Options
export const ALL_POLL_STATUSES = [
  { value: POLL_STATUS.ACTIVE, label: "Active" },
  { value: POLL_STATUS.TRENDING, label: "Trending" },
  { value: POLL_STATUS.CLAIMED, label: "Claimed" },
  { value: POLL_STATUS.CONVERTED, label: "Converted" },
  { value: POLL_STATUS.CLOSED, label: "Closed" },
  { value: POLL_STATUS.EXPIRED, label: "Expired" },
  { value: POLL_STATUS.FUNDED, label: "Funded" },
  { value: POLL_STATUS.CANCELLED, label: "Cancelled" },
  { value: POLL_STATUS.ARCHIVED, label: "Archived" }
] as const;

export const ALL_POLL_MEDIA_TYPES = [
  { value: POLL_MEDIA_TYPE.COVER, label: "Cover" },
  { value: POLL_MEDIA_TYPE.SUMMARY, label: "Summary" },
  { value: POLL_MEDIA_TYPE.AVATAR, label: "Avatar" },
  { value: POLL_MEDIA_TYPE.TEASER, label: "Teaser" },
  { value: POLL_MEDIA_TYPE.INTRO, label: "Intro" },
  { value: POLL_MEDIA_TYPE.OUTRO, label: "Outro" },
  { value: POLL_MEDIA_TYPE.OTHER, label: "Other" }
] as const;

export const ALL_POLL_MEDIA_FORMATS = [
  { value: POLL_MEDIA_FORMAT.IMAGE, label: "Image" },
  { value: POLL_MEDIA_FORMAT.VIDEO, label: "Video" },
  { value: POLL_MEDIA_FORMAT.AUDIO, label: "Audio" },
  { value: POLL_MEDIA_FORMAT.DOCUMENT, label: "Document" },
  { value: POLL_MEDIA_FORMAT.URL, label: "URL" },
  { value: POLL_MEDIA_FORMAT.ARTICLE, label: "Article" },
  { value: POLL_MEDIA_FORMAT.OTHER, label: "Other" }
] as const;
