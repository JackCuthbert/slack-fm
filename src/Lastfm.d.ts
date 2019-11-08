declare namespace LastFM {
  interface Track {
    artist: {
      mbid: string
      '#text': string
    }
    album: {
      mbid: string
      '#text': string
    }
    image: any[]
    streamable: string
    date: {
      uts: string
      '#text': string
    }
    url: string
    name: string
    mbid: string
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
