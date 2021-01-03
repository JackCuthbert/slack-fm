interface Image {
  size: "small" | "medium" | "large" | "extralarge";
  /** URL */
  "#text": string;
}

export interface RecentTrack {
  artist: {
    mbid: string;
    "#text": string;
  };
  "@attr"?: {
    nowplaying: "true" | "false";
  };
  album: {
    mbid: string;
    "#text": string;
  };
  image: Image[];
  streamable: string;
  date: {
    uts: string;
    "#text": string;
  };
  url: string;
  name: string;
  mbid: string;
}

export interface Tag {
  name: string;
  url: string;
}

export interface Track {
  name: string;
  url: string;
  duration: string;
  streamable: {
    "#text": string;
    fulltrack: string;
  };
  listeners: string;
  playcount: string;
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  album: {
    artist: string;
    title: string;
    url: string;
    image: Image[];
  };
  toptags: {
    tag: Tag[];
  };
}

export interface APIUserGetRecentTracks {
  recenttracks: {
    "@attr": {
      page: string;
      total: string;
      user: string;
      perPage: string;
      totalPages: string;
    };
    track: RecentTrack[];
  };
}

export interface APITrackGetInfo {
  track: Track;
}
