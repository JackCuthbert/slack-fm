import * as path from 'path'
import * as fs from 'fs-extra'

const cachePath = path.join('.', '.track.json')

export async function writeTrackJSON (obj?: LastFM.Track) {
  if (obj === undefined) return undefined
  return fs.writeJSON(cachePath, obj)
}

export async function readTrackJSON (): Promise<LastFM.Track | undefined> {
  try {
    const track: LastFM.Track = await fs.readJSON(cachePath)
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
