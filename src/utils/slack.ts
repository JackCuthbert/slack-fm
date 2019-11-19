import axios, { AxiosResponse } from 'axios'
import * as config from '../config'
import { log } from './log'

/**
 * Set a users status on slack with some message and emoji
 *
 * [API Doc](https://api.slack.com/methods/users.profile.set)
 */
export async function setSlackStatus (status: string) {
  type SlackResponse = AxiosResponse<Slack.APIResponse.UsersProfile>
  const url = `${config.slack.apiUrl}/users.profile.set`
  const body = {
    profile: {
      status_text: status,
      status_emoji: status !== '' ? config.slack.emoji : '',
      status_expiration: 0
    }
  }
  const params = {
    headers: { Authorization: `Bearer ${config.slack.token}` }
  }

  try {
    const { data }: SlackResponse = await axios.post(url, body, params)
    if (!data.ok) throw Error(data.error)
    return data
  } catch (error) {
    if (error.response) throw Error(error.response.data.message)
    throw error
  }
}

/**
 * Return the current presence of the authenticated user
 *
 * [API Doc](https://api.slack.com/methods/users.getPresence)
 */
export async function getSlackPresence (): Promise<Slack.Presence> {
  log('Getting user presence', 'slack')

  type SlackResponse = AxiosResponse<Slack.APIResponse.UsersGetPresence>
  const url = `${config.slack.apiUrl}/users.getPresence`
  const params = {
    headers: { Authorization: `Bearer ${config.slack.token}` }
  }

  try {
    const { data }: SlackResponse = await axios.get(url, params)
    if (!data.ok) throw Error(data.error)
    return data.presence
  } catch (error) {
    if (error.response) throw Error(error.response.data.message)
    throw error
  }
}

/**
 * Return the current profile (including status) of the authenticated user
 *
 * [API Doc](https://api.slack.com/methods/users.profile.get)
 */
export async function getSlackProfile (): Promise<Slack.Profile> {
  log('Getting user profile', 'slack')

  type SlackResponse = AxiosResponse<Slack.APIResponse.UsersProfile>
  const url = `${config.slack.apiUrl}/users.profile.get`
  const opts = {
    headers: { Authorization: `Bearer ${config.slack.token}` }
  }

  try {
    const { data }: SlackResponse = await axios.get(url, opts)
    if (!data.ok) throw Error(data.error)
    return data.profile
  } catch (error) {
    if (error.response) throw Error(error.response.data.message)
    throw error
  }
}

export async function clearSlackStatus () {
  log('Clearing user status', 'slack')
  await setSlackStatus('')
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
