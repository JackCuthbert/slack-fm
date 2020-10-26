import axios, { AxiosResponse } from 'axios'
import * as config from '../config'
import { log } from './log'
import type {
  APITrackGetInfo,
  APIUserGetRecentTracks,
  RecentTrack,
  Track
} from '../types/lastfm'

/**
 * Get the most recent tracks from a users LastFM profile
 *
 * [API Doc](https://www.last.fm/api/show/user.getRecentTracks)
 */
export async function getRecentLastFmTracks (username: string) {
  log(`Getting recent track info for "${config.lastFM.username}"`, 'lastfm')

  type LastFMResponse = AxiosResponse<APIUserGetRecentTracks>
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
    return data.recenttracks
  } catch (error) {
    if (error.response) throw Error(error.response.data.message)
    throw error
  }
}

/**
 * Get the detailed track info given a track name and artist
 *
 * [API Doc](https://www.last.fm/api/show/track.getInfo)
 */
export async function getLastFmTrack (track: string, artist: string): Promise<Track | undefined> {
  log(`Getting track info for "${track}" by ${artist}`, 'lastfm')

  type LastFMResponse = AxiosResponse<APITrackGetInfo>
  const url = `${config.lastFM.apiUrl}/?method=track.getInfo`
  const opts = {
    params: {
      artist,
      track,
      format: 'json',
      api_key: config.lastFM.apiKey,
      limit: 1
    }
  }

  try {
    const { data }: LastFMResponse = await axios.get(url, opts)
    return data.track
  } catch (error) {
    if (error.response) throw Error(error.response.data.message)
    throw error
  }
}

/** Returns a LastFM track if it's considered now playing */
export function getNowPlaying (tracks: RecentTrack[]) {
  return tracks.find(track => track['@attr']?.nowplaying === 'true')
}

/** Determines if the recent track is equal to the cached track */
export function trackIsEqual (recent: RecentTrack, cached?: Track) {
  if (cached === undefined) return false
  return recent.name === cached.name && recent.artist['#text'] === cached.artist.name
}
