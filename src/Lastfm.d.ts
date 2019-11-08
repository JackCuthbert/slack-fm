declare namespace LastFM {
  interface Track {
    artist: {
      mbid: string
      '#text': string
    },
    album: { mbid: '', '#text': 'American Sun' },
    image: [ [Object], [Object], [Object], [Object] ],
    streamable: string
    date: {
      uts: string
      '#text': string
    },
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
