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

export const POLL = {
  ROOT: 'polls',
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: ':id'
} as const;

export const ACCOUNT = {
  ROOT: 'account',
  PROFILE: 'profile',
  PAYMENT_METHODS: 'payment-methods',
  SUBSCRIPTIONS: 'subscriptions'
} as const;

const ENV_BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // Remove trailing slash if present

// Absolute paths
export const PATHS = {
  // Base
  HOME: `${ENV_BASE}${BASE.HOME}`,
  // Auth
  LOGIN: `${ENV_BASE}${BASE.AUTH}/login`,
  SIGNUP: `${ENV_BASE}${BASE.AUTH}/signup`,
  POST_SIGNUP: `${ENV_BASE}${BASE.AUTH}/welcome`,
  
  // App
  APP_ROOT: `${ENV_BASE}${BASE.APP}`,
  APP_NEWS: `${ENV_BASE}${BASE.APP}/${NEWS.ROOT}`,
  APP_NEWS_TRENDING: `${ENV_BASE}${BASE.APP}/${NEWS.ROOT}/trending`,
  APP_NEWS_MY_FEED: `${ENV_BASE}${BASE.APP}/${NEWS.ROOT}/my-feed`,
  APP_NEWS_VIEW: `${ENV_BASE}${BASE.APP}/${NEWS.ROOT}/:id`,
  APP_CHANNELS: `${ENV_BASE}${BASE.APP}/${CHANNEL.ROOT}`,
  APP_CHANNEL_VIEW: `${ENV_BASE}${BASE.APP}/${CHANNEL.ROOT}/:channelId`,
  APP_POLL_LIST: `${ENV_BASE}${BASE.APP}/${POLL.ROOT}`,
  APP_POLL_VIEW: `${ENV_BASE}${BASE.APP}/${POLL.ROOT}/:id`,
  APP_EXPLORE: `${ENV_BASE}${BASE.APP}/explore`,
  APP_SUBSCRIPTIONS: `${ENV_BASE}${BASE.APP}/subscriptions`,
  APP_POLLS: `${ENV_BASE}${BASE.APP}/${POLL.ROOT}`,
  APP_ACCOUNT: `${ENV_BASE}${BASE.APP}/${ACCOUNT.ROOT}`,
  APP_ACCOUNT_PROFILE: `${ENV_BASE}${BASE.APP}/${ACCOUNT.ROOT}/${ACCOUNT.PROFILE}`,
  APP_ACCOUNT_PAYMENT_METHODS: `${ENV_BASE}${BASE.APP}/${ACCOUNT.ROOT}/${ACCOUNT.PAYMENT_METHODS}`,
  APP_ACCOUNT_SUBSCRIPTIONS: `${ENV_BASE}${BASE.APP}/${ACCOUNT.ROOT}/${ACCOUNT.SUBSCRIPTIONS}`,
  
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
  STUDIO_POLLS: `${ENV_BASE}${BASE.STUDIO}/${POLL.ROOT}`,
  STUDIO_POLL_CREATE: `${ENV_BASE}${BASE.STUDIO}/${POLL.ROOT}/${POLL.CREATE}`,
  STUDIO_POLL_EDIT: `${ENV_BASE}${BASE.STUDIO}/${POLL.ROOT}/${POLL.EDIT}/:id`,
  STUDIO_POLL_VIEW: `${ENV_BASE}${BASE.STUDIO}/${POLL.ROOT}/:id`,
} as const;

export type PathsType = typeof PATHS;