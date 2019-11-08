declare namespace Slack {
  namespace APIResponse {
    interface UsersProfileSet {
      ok: boolean
      error?: string
      profile: {
        avatar_hash: string
        status_text: string
        status_emoji: string
        status_expiration: number
        real_name: string
        display_name: string
        real_name_normalized: string
        display_name_normalized: string
        email: string
        image_24: string
        image_32: string
        image_48: string
        image_72: string
        image_192: string
        image_512: string
        team: string
      }
    }
  }
}
