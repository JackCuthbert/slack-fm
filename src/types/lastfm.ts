interface APIImage {
  size: 'small' | 'medium' | 'large' | 'extralarge'
  /** URL */
  '#text': string
}

export interface APIRecentTrack {
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
  image: APIImage[]
  streamable: string
  date: {
    uts: string
    '#text': string
  }
  url: string
  name: string
  mbid: string
}

export interface APITag {
  name: string
  url: string
}

export interface APITrack {
  name: string
  url: string
  duration: string
  streamable: {
    '#text': string
    fulltrack: string
  }
  listeners: string
  playcount: string
  artist: {
    name: string
    mbid: string
    url: string
  }
  album: {
    artist: string
    title: string
    url: string
    image: APIImage[]
  }
  toptags: {
    tag: APITag[]
  }
}

export interface APIUserGetRecentTracks {
  recenttracks: {
    '@attr': {
      page: string
      total: string
      user: string
      perPage: string
      totalPages: string
    }
    track: APIRecentTrack[]
  }
}

export interface APITrackGetInfo {
  track?: APITrack
}
