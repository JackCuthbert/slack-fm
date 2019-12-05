import axios from 'axios'
import * as config from '../config'
import { log } from './log'
import { getUnixTime } from 'date-fns'

/**
 * Add the duration returned from LastFM (ms) to the current unix time
 *
 * @param duration Duration of song in milliseconds
 */
export function calcExpiration (duration: number) {
  return getUnixTime(new Date()) + (duration / 1000)
}

export async function requestSlackAPI (
  method: 'get',
  apiMethod: 'users.getPresence'
): Promise<Slack.APIResponse.UsersGetPresence>
export async function requestSlackAPI (
  method: 'get',
  apiMethod: 'users.profile.get'
): Promise<Slack.APIResponse.UsersProfile>
export async function requestSlackAPI (
  method: 'post',
  apiMethod: 'users.profile.set',
  body: Slack.APIRequest.UsersProfileSet
): Promise<Slack.APIResponse.UsersProfile>

/** Generic function to request some supported methods on the Slack API */
export async function requestSlackAPI (
  method: 'post' | 'get',
  apiMethod: 'users.profile.set' | 'users.profile.get' | 'users.getPresence',
  body?: Slack.APIRequest.UsersProfileSet
) {
  const url = `${config.slack.apiUrl}/${apiMethod}`

  const params = {
    headers: { Authorization: `Bearer ${config.slack.token}` }
  }

  const axiosMethod = method === 'post'
    ? axios.post(url, body, params)
    : axios.get(url, params)

  try {
    const { data } = await axiosMethod
    if (!data.ok) throw Error(data.error)
    return data
  } catch (error) {
    if (error.response) throw Error(error.response.data.message)
    throw error
  }
}

/**
 * Set a users status on slack with some message and emoji
 *
 * [API Doc](https://api.slack.com/methods/users.profile.set)
 *
 * @param status The status text to set
 * @param duration The time in milliseconds to keep the state
 *
 */
export async function setSlackStatus (status: string, duration?: number): Promise<Slack.Profile> {
  const body = {
    profile: {
      status_text: status,
      status_emoji: status !== '' ? config.slack.emoji : '',
      status_expiration: duration !== undefined ? calcExpiration(duration) : 0
    }
  }

  const result = await requestSlackAPI('post', 'users.profile.set', body)
  return result.profile!
}

/**
 * Return the current presence of the authenticated user
 *
 * [API Doc](https://api.slack.com/methods/users.getPresence)
 */
export async function getSlackPresence (): Promise<Slack.Presence> {
  log('Getting user presence', 'slack')
  const result = await requestSlackAPI('get', 'users.getPresence')
  return result.presence!
}

/**
 * Return the current profile (including status) of the authenticated user
 *
 * [API Doc](https://api.slack.com/methods/users.profile.get)
 */
export async function getSlackProfile (): Promise<Slack.Profile> {
  log('Getting user profile', 'slack')
  const result = await requestSlackAPI('get', 'users.profile.get')
  return result.profile!
}

/**
 * Returns true if the profile should be updated.
 *
 * It assumes that if a status is using the configured emoji and contains a
 * middle dot character (`•`) that the app has previously been used to update
 * the status and should continue to.
 *
 * This ensures that any custom status the user has set is not overridden and
 * empty statuses are updated accordingly.
 */
export function shouldSetStatus (profile: Slack.Profile) {
  if (profile.status_emoji === '' && profile.status_text === '') return true
  if (profile.status_emoji === config.slack.emoji && profile.status_text.includes(' • ')) return true
  return false
}
