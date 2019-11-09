import Joi from '@hapi/joi'
import * as config from './config'

/** Validate the user-configurable options in config */
export async function validateConfig (cfg: typeof config) {
  const schema = Joi.object({
    slackToken: Joi
      .string()
      .min(1)
      .required()
      .messages({
        'string.base': 'SLACK_TOKEN must be defined',
        'string.min': 'SLACK_TOKEN must be defined',
        'string.empty': 'SLACK_TOKEN must be defined'
      }),
    lastFMKey: Joi
      .string()
      .min(1)
      .required()
      .messages({
        'string.base': 'LAST_FM_KEY must be defined',
        'string.min': 'LAST_FM_KEY must be defined',
        'string.empty': 'LAST_FM_KEY must be defined'
      }),
    lastFMUsername: Joi
      .string()
      .min(1)
      .required()
      .messages({
        'string.base': 'LAST_FM_USERNAME must be defined',
        'string.min': 'LAST_FM_USERNAME must be defined',
        'string.empty': 'LAST_FM_USERNAME must be defined'
      }),
    activeHours: Joi.object({
      start: Joi
        .number()
        .min(0).max(23)
        .custom((v, helpers)=> {
          if (v > cfg.activeHours.end) {
            return helpers.error('startafterend')
          }
        })
        .required()
        .messages({
          'number.base': 'ACTIVE_HOURS_START must be a number',
          'number.min': 'ACTIVE_HOURS_START must be equal to or greater than 0',
          'number.max': 'ACTIVE_HOURS_START must be equal to or less than 23',
          'startafterend': 'ACTIVE_HOURS_START must be before ACTIVE_HOURS_END'
        }),
      end: Joi
        .number()
        .min(0).max(23)
        .custom((v, helpers)=> {
          if (v < cfg.activeHours.start) {
            return helpers.error('startbeforeend')
          }
        })
        .required()
        .messages({
          'number.base': 'ACTIVE_HOURS_END must be a number',
          'number.min': 'ACTIVE_HOURS_END must be equal to or greater than 0',
          'number.max': 'ACTIVE_HOURS_END must be equal to or less than 23',
          'startbeforeend': 'ACTIVE_HOURS_END must be after ACTIVE_HOURS_START'
        }),
    }).required()
  })

  return schema.validateAsync({
    slackToken: cfg.slack.token,
    lastFMKey: cfg.lastFM.apiKey,
    lastFMUsername: cfg.lastFM.username,
    activeHours: {
      start: cfg.activeHours.start,
      end: cfg.activeHours.end,
    }
  })
}

/** Returns a LastFM track if it's considered now playing */
export function getNowPlaying (tracks: LastFM.Track[]) {
  return tracks.find(track => track['@attr']?.nowplaying === 'true')
}

/**
 * Returns true if the profile should be updated.
 *
 * It assumes that if a status is using the `:headphones:` emoji and contains a
 * middle dot character (`•`) that the app has previously been used to update
 * the status and should continue to.
 *
 * This ensures that any custom status the user has set is not overridden and
 * empty statuses are updated accordingly.
 */
export function shouldSetStatus (profile: Slack.Profile) {
  if (profile.status_emoji === '' && profile.status_text === '') return true
  if (profile.status_emoji === ':headphones:' && profile.status_text.includes(' • ')) return true
  return false
}
