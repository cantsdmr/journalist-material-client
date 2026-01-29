export const BOOKMARKABLE_TYPE = {
  NEWS: 1,
  POLL: 2
} as const;

export type BookmarkableTypeValue = typeof BOOKMARKABLE_TYPE[keyof typeof BOOKMARKABLE_TYPE];
