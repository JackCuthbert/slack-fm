import { getNowPlaying, shouldSetStatus } from '../utils'

describe('utils', () => {
  describe('getNowPlaying', () => {
    it('returns a now playing track', () => {
      const track: Partial<LastFM.Track> = {
        '@attr': {
          nowplaying: 'true'
        }
      }

      expect(getNowPlaying([track as any])).toEqual(track)
    })

    it('returns undefined when nowplaying = false', () => {
      const track: Partial<LastFM.Track> = {
        '@attr': {
          nowplaying: 'false'
        }
      }

      expect(getNowPlaying([track as any])).toBeUndefined()
    })

    it('returns undefined when @attr.nowplaying is undefined', () => {
      const track: Partial<LastFM.Track> = {
        artist: {
          mbid: '',
          '#text': ''
        }
      }

      expect(getNowPlaying([track as any])).toBeUndefined()
    })
  })

  describe('shouldSetStatus', () => {
    it('returns true when the app has previously updated the profile', () => {
      const profile: Partial<Slack.Profile> = {
        status_emoji: ':headphones:',
        status_text: 'Some song • Some artist'
      }
      const result = shouldSetStatus(profile as any)
      expect(result).toBeTruthy()
    })

    it('returns true when no status is set', () => {
      const profile: Partial<Slack.Profile> = {
        status_emoji: '',
        status_text: ''
      }
      const result = shouldSetStatus(profile as any)
      expect(result).toBeTruthy()
    })

    it('returns false when a custom status is set', () => {
      const profile: Partial<Slack.Profile> = {
        status_emoji: ':troll:',
        status_text: 'Doing other things'
      }
      const result = shouldSetStatus(profile as any)
      expect(result).toBeFalsy()
    })
  })
})
