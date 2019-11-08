declare namespace LastFM {
  interface Track {
    artist: {
      mbid: string
      '#text': string
    }
    '@attr'?: {
      nowplaying: 'true' | 'false'
    }
    album: {
      mbid: string
      '#text': string
    }
    image: Image[]
    streamable: string
    date: {
      uts: string
      '#text': string
    }
    url: string
    name: string
    mbid: string
  }

  interface Image {
    size: 'small' | 'medium' | 'large' | 'extralarge'
    /** URL */
    '#text' : string
  }

  namespace APIResponse {
    interface RecentTracks {
      recenttracks: {
        '@attr': {
          page: string
          total: string
          user: string
          perPage: string
          totalPages: string
        }
        track: Track[]
      }
    }
  }
}
