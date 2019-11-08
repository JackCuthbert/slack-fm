import axios, { AxiosResponse } from 'axios'
import chalk from 'chalk'
import { getTime, getHours, isWeekend } from 'date-fns'
import * as config from './config'
import { validateConfig, getNowPlaying } from './utils'

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
    if (error.response) {
      throw Error(error.response.data.message)
    }

    throw error
  }
}

/**
 * Set a users status on slack with some message and emoji
 *
 * [API Doc](https://api.slack.com/methods/users.profile.set)
 */
async function updateSlackStatus (status: string, emoji = ':headphones:') {
  type SlackResponse = AxiosResponse<Slack.APIResponse.UsersProfileSet>
  const url = `${config.slack.apiUrl}/users.profile.set`
  const body = {
    profile: {
      status_text: status,
      status_emoji: emoji,
      status_expiration: 0
    }
  }
  const params = {
    headers: { Authorization: `Bearer ${config.slack.token}` }
  }

  try {
    const { data }: SlackResponse = await axios.post(url, body, params)
    if (!data.ok) throw Error(data?.error)
    return data
  } catch (error) {
    if (error.response) {
      throw Error(error.response.data.message)
    }

    throw error
  }
}

async function main () {
  const lfmLog = chalk.red('[LastFM]')
  const slkLog = chalk.greenBright('[Slack]')
  const botLog = chalk.blue('[Bot]')

  const currentTime = getTime(new Date())
  const currentHour = getHours(currentTime)

  const { start, end } = config.activeHours
  if (currentHour < start || currentHour > end) {
    console.log(`${botLog} Outside active hours (${start}-${end}), skipping`)
    return
  }

  if (!config.updateWeekends && isWeekend(currentTime)) {
    console.log(`${botLog} Weekend updates not enabled, skipping`)
    return
  }

  console.log(`${lfmLog} Getting track info`)
  const track = await getLastFmTrack(config.lastFM.username)
  const nowPlaying = getNowPlaying(track.recenttracks.track)

  if (nowPlaying === undefined) {
    console.log(`${botLog} Nothing playing, skipping`)
    return
  }

  let status = ''
  status += nowPlaying.name
  status += ' • '
  status += nowPlaying.artist['#text']

  console.log(`${slkLog} Setting status to "${status}"`)
  await updateSlackStatus(status)
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

