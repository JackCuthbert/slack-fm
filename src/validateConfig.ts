import Joi from '@hapi/joi'
import * as config from './config'

export async function validateConfig (cfg: typeof config) {
  const schema = Joi.object({
    slackToken: Joi
      .string()
      .min(1)
      .required()
      .messages({
        'string.base': 'SLACK_TOKEN must be defined',
        'string.min': 'SLACK_TOKEN must be defined'
      }),
    lastFMKey: Joi
      .string()
      .min(1)
      .required()
      .messages({
        'string.base': 'LAST_FM_KEY must be defined',
        'string.min': 'LAST_FM_KEY must be defined'
      }),
    lastFMUsername: Joi
      .string()
      .min(1)
      .required()
      .messages({
        'string.base': 'LAST_FM_USERNAME must be defined',
        'string.min': 'LAST_FM_USERNAME must be defined'
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
