import { getTime, getHours, isWeekend } from 'date-fns'
import * as config from './config'
import {
  clearSlackStatus,
  getSlackPresence,
  getSlackProfile,
  setSlackStatus,
  shouldSetStatus
} from './utils/slack'
import { handleError, enableErrorTracking } from './utils/errors'
import { getLastFmTrack, getNowPlaying } from './utils/lastFm'
import { log } from './utils/log'
import { validateConfig } from './utils/validation'

async function main () {
  // Time restrictions
  const currentTime = getTime(new Date())
  const currentHour = getHours(currentTime)

  const { start, end } = config.activeHours
  if (currentHour >= start || currentHour < end) {
    log(`Outside active hours (${start}-${end}), skipping`)
    await clearSlackStatus()
    return
  }

  if (!config.updateWeekends && isWeekend(currentTime)) {
    log('Weekend updates not enabled, skipping')
    await clearSlackStatus()
    return
  }

  // Status restrictions
  const currentPresence = await getSlackPresence()
  if (currentPresence === 'away') {
    log('User presence is "away", skipping')
    await clearSlackStatus()
    return
  }

  const currentProfile = await getSlackProfile()
  if (!shouldSetStatus(currentProfile)) {
    log('Custom status detected, skipping')
    return
  }

  // Now playing restrictions
  const recentTracks = await getLastFmTrack(config.lastFM.username)
  const nowPlaying = getNowPlaying(recentTracks.track)

  if (nowPlaying === undefined) {
    log('Nothing playing, skipping')
    await clearSlackStatus()
    return
  }

  // Update!
  let status = nowPlaying.name
  status += ' '
  status += config.slack.separator
  status += ' '
  status += nowPlaying.artist['#text']

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
