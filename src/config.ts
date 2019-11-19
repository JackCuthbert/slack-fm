const {
  LAST_FM_KEY = '',
  LAST_FM_SECRET = '',
  LAST_FM_USERNAME = '',
  SLACK_TOKEN = '',
  SLACK_EMOJI = ':headphones:',
  SLACK_SEPARATOR = '•',
  TZ = 'Australia/Melbourne',
  ACTIVE_HOURS_START = '9',
  ACTIVE_HOURS_END = '17',
  UPDATE_INTERVAL = '1',
  UPDATE_WEEKENDS,
  SENTRY_DSN
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

export const tz = TZ
