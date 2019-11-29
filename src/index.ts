import { getTime, getHours, isWeekend } from 'date-fns'
import * as config from './config'
import {
  getSlackPresence,
  getSlackProfile,
  setSlackStatus,
  shouldSetStatus
} from './utils/slack'
import {
  getLastFmTrack,
  getNowPlaying,
  getRecentLastFmTracks
} from './utils/lastFm'
import { handleError, enableErrorTracking } from './utils/errors'
import { log } from './utils/log'
import { validateConfig } from './utils/validation'

async function main () {
  // Time restrictions
  const currentTime = getTime(new Date())
  const currentHour = getHours(currentTime)

  const { start, end } = config.activeHours
  if (currentHour < start || currentHour >= end) {
    log(`Outside active hours (${start}-${end}), skipping`)
    return
  }

  if (!config.updateWeekends && isWeekend(currentTime)) {
    log('Weekend updates not enabled, skipping')
    return
  }

  // Status restrictions
  const currentPresence = await getSlackPresence()
  if (currentPresence === 'away') {
    log('User presence is "away", skipping')
    return
  }

  const currentProfile = await getSlackProfile()
  if (!shouldSetStatus(currentProfile)) {
    log('Custom status detected, skipping')
    return
  }

  // Now playing restrictions
  const recentTracks = await getRecentLastFmTracks(config.lastFM.username)
  const nowPlaying = getNowPlaying(recentTracks.track)

  if (nowPlaying === undefined) {
    log('Nothing playing, skipping')
    return
  }

  const track = await getLastFmTrack(nowPlaying.name, nowPlaying.artist['#text'])

  if (track !== undefined) {
    const status = `${track.name} ${config.slack.separator} ${track.artist.name}`
    log(`Setting status to "${status}"`, 'slack')
    await setSlackStatus(status, Number(track.duration))
    return
  }

  log('Unable to find detailed track info, falling back to recent track', 'lastfm')
  const status = `${nowPlaying.name} ${config.slack.separator} ${nowPlaying.artist['#text']}`
  log(`Setting status to "${status}"`, 'slack')
  await setSlackStatus(status)
}

async function loop () {
  const interval = config.updateInterval * 60000
  setInterval(() => main().catch(handleError), interval)
}

validateConfig(config)
  .then(enableErrorTracking)
  .then(main)
  .then(loop)
  .catch(handleError)
