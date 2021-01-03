import { getNowPlaying } from "../lastFm";
import type { RecentTrack } from "../../types/lastfm";

describe("lastfm", () => {
  describe("getNowPlaying", () => {
    it("returns a now playing track", () => {
      const track: Partial<RecentTrack> = {
        "@attr": {
          nowplaying: "true",
        },
      };

      expect(getNowPlaying([track as any])).toEqual(track);
    });

    it("returns undefined when nowplaying = false", () => {
      const track: Partial<RecentTrack> = {
        "@attr": {
          nowplaying: "false",
        },
      };

      expect(getNowPlaying([track as any])).toBeUndefined();
    });

    it("returns undefined when @attr.nowplaying is undefined", () => {
      const track: Partial<RecentTrack> = {
        artist: {
          mbid: "",
          "#text": "",
        },
      };

      expect(getNowPlaying([track as any])).toBeUndefined();
    });
  });
});
