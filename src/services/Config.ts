import Joi from 'joi'
import * as fs from 'fs'
import yaml from 'js-yaml'
import { configPath } from '../lib'

declare global {
  var APP_CONFIG: Config | undefined
}

interface AppConfig {
  emoji: string
  separator: string
  update_interval: number
  update_weekends: boolean
  update_hour_start: number
  update_hour_end: number
}

interface LastFmConfig {
  username: string
  api_key: string
  shared_secret: string
}

interface SlackWorkspaceConfig {
  user_id: string
  token: string
}

export interface Config {
  app: AppConfig
  lastfm: LastFmConfig
  slack: SlackWorkspaceConfig[]
}

function validate(cfg: any): Joi.ValidationResult {
  const schema = Joi.object<Config>({
    app: Joi.object<AppConfig>({
      emoji: Joi.string()
        .required()
        .regex(/^:[^:]+:$/i),
      separator: Joi.string().required().min(1).max(1),
      update_interval: Joi.number().required().positive(),
      update_weekends: Joi.boolean().required(),
      update_hour_start: Joi.number().required().min(0).max(23),
      update_hour_end: Joi.number().required().min(0).max(23)
    }).required(),
    lastfm: Joi.object<LastFmConfig>({
      username: Joi.string().required(),
      api_key: Joi.string().required(),
      shared_secret: Joi.string().required()
    }).required(),
    slack: Joi.array()
      .items(
        Joi.object<SlackWorkspaceConfig>({
          user_id: Joi.string().required(),
          token: Joi.string().required()
        })
      )
      .required()
      .min(1)
  })

  return schema.validate(cfg)
}

export function load(): Config {
  if (global.APP_CONFIG === undefined) {
    const config = yaml.load(fs.readFileSync(configPath, 'utf8')) as Config
    const { value, error } = validate(config)

    if (error !== undefined) {
      throw error
    }

    global.APP_CONFIG = value as Config
  }

  return global.APP_CONFIG
}
