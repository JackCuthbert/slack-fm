import env from 'env-var'
import axios from 'axios'
import { log } from './Logger'
import type {
  APIUserGetRecentTracks,
  APIRecentTrack,
  APITrackGetInfo,
  APITrack
} from '../types/lastfm'

export interface RecentTrack {
  name: string
  artist: string
  nowPlaying?: boolean
}

export interface Track {
  name: string
  artist: string
  duration?: number
}

function toRecentTrack(rt: APIRecentTrack): RecentTrack {
  return {
    name: rt.name,
    artist: rt.artist['#text'],
    nowPlaying: rt['@attr']?.nowplaying === 'true'
  }
}

function toTrack(t: APITrack): Track {
  return {
    name: t.name,
    artist: t.artist.name,
    duration:
      t.duration === '0' || t.duration === undefined
        ? undefined
        : Number(t.duration)
  }
}

export class LastFM {
  public readonly username: string
  private readonly apiUrl: string
  private readonly apiKey: string

  constructor(username: string, apiKey: string) {
    this.username = username
    this.apiKey = apiKey

    this.apiUrl = env
      .get('LASTFM_API_URL')
      .default('http://ws.audioscrobbler.com/2.0')
      .asString()
  }

  /**
   * Get the most recent tracks from a users LastFM profile
   *
   * [API Doc](https://www.last.fm/api/show/user.getRecentTracks)
   */
  async getRecentTracks(): Promise<RecentTrack[]> {
    log(`Getting recent track info for "${this.username}"`, 'lastfm')

    const url = `${this.apiUrl}/?method=user.getrecenttracks`
    const opts = {
      params: {
        format: 'json',
        api_key: this.apiKey,
        user: this.username,
        limit: 1
      }
    }

    try {
      const { data } = await axios.get<APIUserGetRecentTracks>(url, opts)
      return data.recenttracks.track.map(toRecentTrack)
    } catch (error) {
      throw error.response !== undefined
        ? Error(error.response.data.message)
        : error
    }
  }

  /**
   * Get the detailed track info given a track name and artist
   *
   * [API Doc](https://www.last.fm/api/show/track.getInfo)
   */
  async getTrack(track: string, artist: string): Promise<Track | undefined> {
    log(`Getting track info for "${track}" by ${artist}`, 'lastfm')

    const url = `${this.apiUrl}/?method=track.getInfo`
    const opts = {
      params: {
        artist,
        track,
        format: 'json',
        api_key: this.apiKey,
        limit: 1
      }
    }

    try {
      const { data } = await axios.get<APITrackGetInfo>(url, opts)
      return data.track !== undefined ? toTrack(data.track) : undefined
    } catch (error) {
      throw error.response !== undefined
        ? Error(error.response.data.message)
        : error
    }
  }
}
