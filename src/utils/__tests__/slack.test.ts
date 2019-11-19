import { shouldSetStatus } from '../slack'

describe('slack', () => {
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
