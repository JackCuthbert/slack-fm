import * as fs from 'fs-extra'
import { cachePath } from '../lib'
import type { RecentTrack, Track } from '../services/LastFM'

export async function writeTrackJSON(obj?: Track): Promise<void> {
  if (obj === undefined) return undefined
  return await fs.writeJSON(cachePath, obj)
}

export async function readTrackJSON(): Promise<
  Track | RecentTrack | undefined
> {
  try {
    const track: Track = await fs.readJSON(cachePath)
    return track
  } catch (error) {
    // this is fine, I promise
    return undefined
  }
}

export async function deleteTrackJSON(): Promise<void> {
  try {
    await fs.remove(cachePath)
  } catch (error) {
    // this is okay
  }
}
