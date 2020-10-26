import * as path from 'path'
import * as fs from 'fs-extra'
import type { Track } from '../types/lastfm'

const cachePath = path.join('.', '.track.json')

export async function writeTrackJSON (obj?: Track) {
  if (obj === undefined) return undefined
  return fs.writeJSON(cachePath, obj)
}

export async function readTrackJSON (): Promise<Track | undefined> {
  try {
    const track: Track = await fs.readJSON(cachePath)
    return track
  } catch (error) {
    // this is fine, I promise
    return undefined
  }
}

export async function deleteTrackJSON () {
  try {
    await fs.remove(cachePath)
  } catch (error) {
    // this is okay
  }
}
