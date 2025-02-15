// Base paths
export const BASE = {
  HOME: '/',
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
  VIEW: ':id',
} as const;

const ENV_BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // Remove trailing slash if present

// Absolute paths
export const PATHS = {
  // Base
  HOME: `${ENV_BASE}${BASE.HOME}`,
  // Auth
  LOGIN: `${ENV_BASE}${BASE.AUTH}/login`,
  SIGNUP: `${ENV_BASE}${BASE.AUTH}/signup`,
  
  // App
  APP_ROOT: `${ENV_BASE}${BASE.APP}`,
  APP_NEWS: `${ENV_BASE}${BASE.APP}/${NEWS.ROOT}`,
  APP_NEWS_TRENDING: `${ENV_BASE}${BASE.APP}/${NEWS.ROOT}/trending`,
  APP_NEWS_MY_FEED: `${ENV_BASE}${BASE.APP}/${NEWS.ROOT}/my-feed`,
  APP_NEWS_VIEW: `${ENV_BASE}${BASE.APP}/${NEWS.ROOT}/:id`,
  APP_CHANNELS: `${ENV_BASE}${BASE.APP}/${CHANNEL.ROOT}`,
  APP_CHANNEL_VIEW: `${ENV_BASE}${BASE.APP}/${CHANNEL.ROOT}/:channelId`,
  APP_EXPLORE: `${ENV_BASE}${BASE.APP}/explore`,
  APP_SUBSCRIPTIONS: `${ENV_BASE}${BASE.APP}/subscriptions`,
  
  // Studio
  STUDIO_ROOT: `${ENV_BASE}${BASE.STUDIO}`,
  STUDIO_NEWS: `${ENV_BASE}${BASE.STUDIO}/${NEWS.ROOT}`,
  STUDIO_NEWS_CREATE: `${ENV_BASE}${BASE.STUDIO}/${NEWS.ROOT}/${NEWS.CREATE}`,
  STUDIO_NEWS_EDIT: `${ENV_BASE}${BASE.STUDIO}/${NEWS.ROOT}/${NEWS.EDIT}/:id`,
  STUDIO_NEWS_VIEW: `${ENV_BASE}${BASE.STUDIO}/${NEWS.ROOT}/:id`,
  STUDIO_CHANNELS: `${ENV_BASE}${BASE.STUDIO}/${CHANNEL.ROOT}`,
  STUDIO_CHANNEL_CREATE: `${ENV_BASE}${BASE.STUDIO}/${CHANNEL.ROOT}/${CHANNEL.CREATE}`,
  STUDIO_CHANNEL_EDIT: `${ENV_BASE}${BASE.STUDIO}/${CHANNEL.ROOT}/${CHANNEL.EDIT}/:channelId`,
  STUDIO_CHANNEL_VIEW: `${ENV_BASE}${BASE.STUDIO}/${CHANNEL.ROOT}/:channelId`,
} as const;

export type PathsType = typeof PATHS;