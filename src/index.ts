import { getHours, getTime, isWeekend } from 'date-fns'
import { truncateStatus } from './lib'
import { Cache, Config, LastFM, Schedule, SlackAPI, log } from './services'
import type { Track } from './services/LastFM'

const config = Config.load()

// API Clients
let lastFm: LastFM
let clients: SlackAPI[]

async function setup(): Promise<void> {
  const { lastfm, slack } = Config.load()

  if (lastFm === undefined) {
    lastFm = new LastFM(lastfm.username, lastfm.api_key)
    log(`Configured Last.fm (${lastFm.username})`, 'bot', true)
  }

  if (clients === undefined) {
    clients = slack.map(
      ({ user_id: userId, token }) => new SlackAPI(token, userId)
    )
    log(
      `Configured ${clients.length} Slack Team${clients.length > 1 ? 's' : ''}`,
      'bot',
      true
    )
  }

  log('slack-fm ready!', 'bot', true)
}

async function clearOnEnded(cachedTrack?: Track): Promise<void> {
  if (cachedTrack === undefined) return
  if (cachedTrack.duration !== undefined && cachedTrack.duration !== 0) return

  for (const client of clients) {
    log('Cached track is missing or has no duration, clearing status', 'bot')
    await client.setStatus('')
  }
}

async function main(): Promise<void> {
  const cachedTrack = await Cache.readTrackJSON()

  // Time restrictions
  // ---
  const currentTime = getTime(new Date())
  const currentHour = getHours(currentTime)

  const { update_hour_start: start, update_hour_end: end } = config.app
  if (currentHour < start || currentHour >= end) {
    log(`Outside active hours (${start}-${end})`)
    await clearOnEnded(cachedTrack)
    return
  }

  if (isWeekend(currentTime) && !config.app.update_weekends) {
    log('Weekend updates not enabled, skipping')
    await clearOnEnded(cachedTrack)
    return
  }

  // Get recent track
  // ---
  const tracks = await lastFm.getRecentTracks()
  const nowPlaying = tracks.find(t => t.nowPlaying)

  if (nowPlaying === undefined) {
    log('Nothing playing', 'bot')
    await Cache.deleteTrackJSON()
    await clearOnEnded(cachedTrack)
    return
  }

  // Don't update if the now playing track does not match the cached track,
  // otherwise cache the new track
  // ---
  if (
    cachedTrack?.name.toLowerCase() === nowPlaying?.name.toLowerCase() &&
    cachedTrack?.artist.toLowerCase() === nowPlaying?.artist.toLowerCase()
  ) {
    log('Now playing track is cached, no update necessary', 'bot')
    return
  } else {
    log('Caching track', 'bot')
    await Cache.writeTrackJSON(nowPlaying)
  }

  // Attempt to find more details (duration)
  // ---
  const track = await lastFm.getTrack(nowPlaying.name, nowPlaying.artist)

  if (track !== undefined) {
    log('Updating cached track', 'bot')
    await Cache.writeTrackJSON(track)
  }

  // Compute new status and duration
  // ---
  const trackDuration = track?.duration ?? 600000 // 10 minutes
  const trackName = track?.name ?? nowPlaying.name
  const trackArtist = track?.artist ?? nowPlaying.artist

  const status = `${trackName} ${config.app.separator} ${trackArtist}`

  // Propagate updates to all Slack Teams
  // ---
  for (const client of clients) {
    // Don't update if the user is away
    const presence = await client.getPresence()
    if (presence === 'away') continue

    // Don't update if the status wasn't previously set by slack-fm
    const profile = await client.getProfile()
    if (
      profile.status_text !== '' &&
      !profile.status_text.includes(config.app.separator)
    )
      continue

    await client.setStatus(
      truncateStatus(status, config.app.separator),
      trackDuration
    )
  }
}

const interval = config.app.update_interval * 60000
const schedule = new Schedule(main, interval)

setup()
  .then(main)
  .then(() => {
    schedule.start()
  })
  .catch(console.error)
