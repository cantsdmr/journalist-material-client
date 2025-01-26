// Base paths
export const BASE = {
  APP: '/app',
  STUDIO: '/studio',
  AUTH: '/auth'
} as const;

// Feature bases
export const NEWS = {
  ROOT: 'news',
  SUBPATHS : {
    TRENDING: 'trending',
    MY_FEED: 'my-feed'
  },
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: ':id'
} as const;

export const CHANNEL = {
  ROOT: 'channels',
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: ':id'
} as const;

// Absolute paths
export const PATHS = {
  // Auth
  LOGIN: `${BASE.AUTH}/login`,
  SIGNUP: `${BASE.AUTH}/signup`,
  
  // App
  APP_ROOT: BASE.APP,
  APP_NEWS: `${BASE.APP}/${NEWS.ROOT}`,
  APP_NEWS_TRENDING: `${BASE.APP}/${NEWS.ROOT}/trending`,
  APP_NEWS_MY_FEED: `${BASE.APP}/${NEWS.ROOT}/my-feed`,
  APP_NEWS_VIEW: `${BASE.APP}/${NEWS.ROOT}/:id`,
  APP_CHANNELS: `${BASE.APP}/${CHANNEL.ROOT}`,
  APP_CHANNEL_VIEW: `${BASE.APP}/${CHANNEL.ROOT}/:channelId`,
  APP_EXPLORE: `${BASE.APP}/explore`,
  APP_SUBSCRIPTIONS: `${BASE.APP}/subscriptions`,
  
  // Studio
  STUDIO_ROOT: BASE.STUDIO,
  STUDIO_NEWS: `${BASE.STUDIO}/${NEWS.ROOT}`,
  STUDIO_NEWS_CREATE: `${BASE.STUDIO}/${NEWS.ROOT}/${NEWS.CREATE}`,
  STUDIO_NEWS_EDIT: `${BASE.STUDIO}/${NEWS.ROOT}/${NEWS.EDIT}/:id`,
  STUDIO_NEWS_VIEW: `${BASE.STUDIO}/${NEWS.ROOT}/:id`,
  STUDIO_CHANNELS: `${BASE.STUDIO}/${CHANNEL.ROOT}`,
  STUDIO_CHANNEL_CREATE: `${BASE.STUDIO}/${CHANNEL.ROOT}/${CHANNEL.CREATE}`,
  STUDIO_CHANNEL_EDIT: `${BASE.STUDIO}/${CHANNEL.ROOT}/${CHANNEL.EDIT}/:channelId`,
  STUDIO_CHANNEL_VIEW: `${BASE.STUDIO}/${CHANNEL.ROOT}/:channelId`,
} as const;

export type PathsType = typeof PATHS;