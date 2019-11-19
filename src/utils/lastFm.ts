import axios, { AxiosResponse } from 'axios'
import * as config from '../config'
import { log } from './log'

/**
 * Get the most recent tracks from a users LastFM profile
 *
 * [API Doc](https://www.last.fm/api/show/user.getRecentTracks)
 */
export async function getLastFmTrack (username: string) {
  log('Getting track info', 'lastfm')

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
    return data.recenttracks
  } catch (error) {
    if (error.response) throw Error(error.response.data.message)
    throw error
  }
}
/** Returns a LastFM track if it's considered now playing */
export function getNowPlaying (tracks: LastFM.Track[]) {
  return tracks.find(track => track['@attr']?.nowplaying === 'true')
}
