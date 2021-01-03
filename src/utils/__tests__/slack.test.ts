import { shouldSetStatus, calcExpiration } from "../slack";
import { getUnixTime } from "date-fns";
import type { Profile } from "../../types/slack";

describe("slack", () => {
  describe("shouldSetStatus", () => {
    it("returns true when the app has previously updated the profile", () => {
      const profile: Partial<Profile> = {
        status_emoji: ":headphones:",
        status_text: "Some song • Some artist",
      };
      const result = shouldSetStatus(profile as any);
      expect(result).toBeTruthy();
    });

    it("returns true when no status is set", () => {
      const profile: Partial<Profile> = {
        status_emoji: "",
        status_text: "",
      };
      const result = shouldSetStatus(profile as any);
      expect(result).toBeTruthy();
    });

    it("returns false when a custom status is set", () => {
      const profile: Partial<Profile> = {
        status_emoji: ":troll:",
        status_text: "Doing other things",
      };
      const result = shouldSetStatus(profile as any);
      expect(result).toBeFalsy();
    });
  });

  describe("calcExpiration", () => {
    it("adds the duration to the current time", () => {
      const result = calcExpiration(5 * 60 * 1000); // 5 min in ms
      const now = getUnixTime(new Date());

      expect(result).toBeGreaterThan(now);
      expect(result).toBe(now + 300); // adds 300s/5min to current unix time
    });
  });
});
