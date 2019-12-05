import axios from 'axios'
import { getUnixTime } from 'date-fns'
import { mocked } from 'ts-jest/utils'
import {
  calcExpiration,
  getSlackPresence,
  getSlackProfile,
  shouldSetStatus,
  setSlackStatus,
  requestSlackAPI
} from '../slack'

jest.mock('axios')
const mockedAxios = mocked(axios, true)

const profileFixture: Slack.Profile = {
  avatar_hash: '',
  status_text: '',
  status_emoji: '',
  status_expiration: 0,
  real_name: '',
  display_name: '',
  real_name_normalized: '',
  display_name_normalized: '',
  email: '',
  image_24: '',
  image_32: '',
  image_48: '',
  image_72: '',
  image_192: '',
  image_512: '',
  team: ''
}

describe('slack', () => {
  describe('requestSlackAPI', () => {
    it('returns without error', async () => {
      const data: Slack.APIResponse.UsersGetPresence = {
        ok: true,
        presence: 'away'
      }
      mockedAxios.get.mockResolvedValueOnce({ data })
      const result = await requestSlackAPI('get', 'users.getPresence')
      expect(mockedAxios.get).toBeCalled()
      expect(result).toEqual(data)
    })

    it('returns with { ok: false }', async () => {
      const data: Slack.APIResponse.UsersGetPresence = {
        ok: false,
        error: 'error_message'
      }
      mockedAxios.get.mockResolvedValueOnce({ data })

      expect.assertions(2)
      try {
        await requestSlackAPI('get', 'users.profile.get')
      } catch (error) {
        expect(mockedAxios.get).toBeCalled()
        expect(error.message).toEqual(data.error)
      }
    })

    it('can post with data', async () => {
      const data: Slack.APIResponse.UsersProfileSet = {
        ok: true,
        profile: profileFixture
      }
      mockedAxios.post.mockResolvedValueOnce({ data })

      const body = {
        profile: {
          status_text: '',
          status_emoji: '',
          status_expiration: 0
        }
      }

      const result = await requestSlackAPI('post', 'users.profile.set', body)

      expect(mockedAxios.post).toBeCalled()
      expect(result.profile).toBeDefined()
    })

    it('handles a real error', async () => {
      const response = {
        data: {
          message: 'Uh oh'
        }
      }
      mockedAxios.get.mockRejectedValueOnce({ response })

      expect.assertions(2)
      try {
        await requestSlackAPI('get', 'users.getPresence')
      } catch (error) {
        expect(mockedAxios.get).toBeCalled()
        expect(error.message).toEqual(response.data.message)
      }
    })
  })

  describe('getSlackPresence', () => {
    it('returns a slack presence', async () => {
      const data: Slack.APIResponse.UsersGetPresence = {
        ok: true,
        presence: 'away'
      }
      mockedAxios.get.mockResolvedValueOnce({ data })
      const result = await getSlackPresence()
      expect(result).toEqual(data.presence)
    })
  })

  describe('getSlackProfile', () => {
    it('returns a slack profile', async () => {
      const data: Slack.APIResponse.UsersProfile = {
        ok: true,
        profile: { ...profileFixture, status_text: 'hello' }
      }

      mockedAxios.get.mockResolvedValueOnce({ data })
      const result = await getSlackProfile()
      expect(result.status_text).toEqual(data.profile!.status_text)
    })
  })

  describe('setSlackStatus', () => {
    it('sets a users status', async () => {
      const status = 'new_status'
      const data: Slack.APIResponse.UsersProfileSet = {
        ok: true,
        profile: {
          ...profileFixture,
          status_text: status
        }
      }

      mockedAxios.post.mockResolvedValueOnce({ data })
      const result = await setSlackStatus(status)
      expect(result.status_text).toEqual(status)
    })
  })

  describe('shouldSetStatus', () => {
    it('returns true when the app has previously updated the profile', () => {
      const profile = {
        ...profileFixture,
        status_emoji: ':headphones:',
        status_text: 'Some song • Some artist'
      }
      const result = shouldSetStatus(profile)
      expect(result).toBeTruthy()
    })

    it('returns true when no status is set', () => {
      const profile = {
        ...profileFixture,
        status_emoji: '',
        status_text: ''
      }
      const result = shouldSetStatus(profile)
      expect(result).toBeTruthy()
    })

    it('returns false when a custom status is set', () => {
      const profile = {
        ...profileFixture,
        status_emoji: ':troll:',
        status_text: 'Doing other things'
      }
      const result = shouldSetStatus(profile)
      expect(result).toBeFalsy()
    })
  })

  describe('calcExpiration', () => {
    it('adds the duration to the current time', () => {
      const result = calcExpiration(5 * 60 * 1000) // 5 min in ms
      const now = getUnixTime(new Date())

      expect(result).toBeGreaterThan(now)
      expect(result).toBe(now + 300) // adds 300s/5min to current unix time
    })
  })
})
