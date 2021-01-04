import { WebClient } from '@slack/web-api'
import { getUnixTime } from 'date-fns'
import { Config } from '.'
import { log } from './Logger'
import type { Profile, Presence } from '../types/slack'

/**
 * Add the duration returned from LastFM (ms) to the current unix time
 *
 * @param duration Duration of song in milliseconds
 */
function calcExpiration(duration: number): number {
  return getUnixTime(new Date()) + duration / 1000
}

function obfuscateToken(token: string): string {
  if (token === '') return token

  const first = token.slice(0, 4)
  const last = token.slice(-5, token.length + 1)

  return `${first}-xxxxx-${last}`
}

export class SlackAPI {
  public readonly userId: string
  private readonly client: WebClient

  constructor(token: string, userId: string) {
    this.client = new WebClient(token)
    this.userId = userId
  }

  async getProfile(): Promise<Profile> {
    const safeToken = obfuscateToken(this.client.token ?? '')

    log(`users.profile.get (${safeToken})`, 'slack')

    const user = await this.client.users.profile.get({ user: this.userId })
    if (!user.ok) throw Error(user.error)

    const profile = user.profile as Profile
    return profile
  }

  async getPresence(): Promise<Presence> {
    const safeToken = obfuscateToken(this.client.token ?? '')

    log(`users.getPresence (${safeToken})`, 'slack')
    const result = await this.client.users.getPresence({
      user: this.userId
    })

    if (!result.ok) throw Error(result.error)

    return result.presence as Presence
  }

  /**
   * @param status
   * @param duration Track runtime in milliseconds
   */
  async setStatus(status: string, duration?: number): Promise<any> {
    const config = Config.load()
    const safeToken = obfuscateToken(this.client.token ?? '')

    const payload = {
      status_text: status,
      status_emoji: status !== '' ? config.app?.emoji ?? ':headphones:' : '',
      status_expiration:
        status !== ''
          ? duration !== undefined
            ? calcExpiration(duration)
            : 0
          : 0
    }

    log(`users.profile.set (${safeToken}): ${JSON.stringify(payload)}`, 'slack')

    const result = await this.client.users.profile.set({
      user: this.userId,
      profile: JSON.stringify(payload)
    })

    if (!result.ok) throw Error(result.error)

    return result.profile
  }
}
