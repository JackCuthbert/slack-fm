const {
  LAST_FM_KEY = '',
  LAST_FM_SECRET = '',
  LAST_FM_USERNAME = '',
  SLACK_TOKEN = '',
  SLACK_EMOJI = ':headphones:',
  SLACK_SEPARATOR = '•',
  TZ = 'Australia/Melbourne',
  ACTIVE_HOURS_START = '8',
  ACTIVE_HOURS_END = '18',
  UPDATE_INTERVAL = '1',
  UPDATE_EXPIRATION = '10',
  UPDATE_WEEKENDS,
  SENTRY_DSN,
  ENABLE_LOGGING = ''
} = process.env

export const lastFM = {
  apiUrl: 'http://ws.audioscrobbler.com/2.0',
  apiKey: LAST_FM_KEY,
  apiSecret: LAST_FM_SECRET,
  username: LAST_FM_USERNAME
}

export const slack = {
  apiUrl: 'https://slack.com/api',
  token: SLACK_TOKEN,
  emoji: SLACK_EMOJI,
  separator: SLACK_SEPARATOR
}

export const activeHours = {
  start: Number(ACTIVE_HOURS_START),
  end: Number(ACTIVE_HOURS_END)
}

export const sentryDsn = SENTRY_DSN

/** Time in minutes to request new Last.fm data */
export const updateInterval = Number(UPDATE_INTERVAL)
export const updateWeekends = !!UPDATE_WEEKENDS

/** Time in minutes to use as a default expiration time */
export const updateExpiration = Number(UPDATE_EXPIRATION)

/** Whether or not logging has been enabled */
export const loggingEnabled = ENABLE_LOGGING !== ''

export const tz = TZ
