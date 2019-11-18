import axios, { AxiosResponse } from 'axios'
import chalk from 'chalk'
import { getTime, getHours, isWeekend } from 'date-fns'
import * as config from './config'
import { validateConfig, getNowPlaying, shouldSetStatus } from './utils'

const LOG_LFM = chalk.red('[LastFM]')
const LOG_SLK = chalk.greenBright('[Slack]')
const LOG_BOT = chalk.blue('[Bot]')

/**
 * Get the most recent track from a users LastFM profile
 *
 * [API Doc](https://www.last.fm/api/show/user.getRecentTracks)
 */
async function getLastFmTrack (username: string) {
  type LastFMResponse = AxiosResponse<LastFM.APIResponse.RecentTracks>
  const url = `${config.lastFM.apiUrl}/?method=user.getrecenttracks`
  const opts = {
    params: {
      format: 'json',
      api_key: config.lastFM.apiKey,
      user: username,
      limit: 1
    }
  }

  try {
    const { data }: LastFMResponse = await axios.get(url, opts)
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
 */
async function setSlackStatus (status: string) {
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
async function getSlackPresence (): Promise<Slack.Presence> {
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
async function getSlackProfile (): Promise<Slack.Profile> {
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

async function clearSlackStatus () {
  console.log(`${LOG_SLK} Clearing Slack status`)
  await setSlackStatus('')
}

async function main () {
  // Time restrictions
  const currentTime = getTime(new Date())
  const currentHour = getHours(currentTime)

  const { start, end } = config.activeHours
  if (currentHour < start || currentHour > end) {
    console.log(`${LOG_BOT} Outside active hours (${start}-${end}), skipping`)
    await clearSlackStatus()
    return
  }

  if (!config.updateWeekends && isWeekend(currentTime)) {
    console.log(`${LOG_BOT} Weekend updates not enabled, skipping`)
    await clearSlackStatus()
    return
  }

  // Status restrictions
  console.log(`${LOG_SLK} Getting Slack profile`)
  const currentProfile = await getSlackProfile()
  if (!shouldSetStatus(currentProfile)) {
    console.log(`${LOG_BOT} Custom status detected, skipping`)
    return
  }

  console.log(`${LOG_SLK} Getting Slack presence`)
  const currentPresence = await getSlackPresence()
  if (currentPresence === 'away') {
    console.log(`${LOG_BOT} User presence is "away", skipping`)
    await clearSlackStatus()
    return
  }

  // Now playing restrictions
  console.log(`${LOG_LFM} Getting track info`)
  const track = await getLastFmTrack(config.lastFM.username)
  const nowPlaying = getNowPlaying(track.recenttracks.track)

  if (nowPlaying === undefined) {
    console.log(`${LOG_BOT} Nothing playing, skipping`)
    await clearSlackStatus()
    return
  }

  // Update!
  let status = nowPlaying.name
  status += ' '
  status += config.slack.separator
  status += ' '
  status += nowPlaying.artist['#text']

  console.log(`${LOG_SLK} Setting status to "${status}"`)
  await setSlackStatus(status)
}

validateConfig(config)
  .then(main)
  .then(() => {
    setInterval(main, config.updateInterval * 60000)
  })
  .catch(error => {
    console.error(chalk.red(error.message))
    process.exit(1)
  })

