// Bookmarkable Type Enum
export const BOOKMARKABLE_TYPE = {
  NEWS: "NEWS",
  POLL: "POLL"
} as const;

export type BookmarkableType = typeof BOOKMARKABLE_TYPE[keyof typeof BOOKMARKABLE_TYPE];

// Helper Functions
export function getBookmarkableTypeLabel(type: BookmarkableType): string {
  switch (type) {
  case BOOKMARKABLE_TYPE.NEWS:
    return "News";
  case BOOKMARKABLE_TYPE.POLL:
    return "Poll";
  default:
    return type;
  }
}

// Dropdown Options
export const ALL_BOOKMARKABLE_TYPES = [
  { value: BOOKMARKABLE_TYPE.NEWS, label: "News" },
  { value: BOOKMARKABLE_TYPE.POLL, label: "Poll" }
] as const;
