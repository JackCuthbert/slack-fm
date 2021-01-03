import { getTime, getHours, isWeekend } from "date-fns";
import * as config from "./config";
import {
  getSlackPresence,
  getSlackProfile,
  setSlackStatus,
  shouldSetStatus,
} from "./utils/slack";
import {
  getLastFmTrack,
  getNowPlaying,
  getRecentLastFmTracks,
  trackIsEqual,
} from "./utils/lastFm";
import { deleteTrackJSON, readTrackJSON, writeTrackJSON } from "./utils/cache";
import { handleError, enableErrorTracking } from "./utils/errors";
import { log } from "./utils/log";
import { validateConfig } from "./utils/validation";
import type { Track } from "./types/lastfm";

/** Clears the slack status if the cached track has no duration */
async function clearSlackStatus(cached: Track | undefined) {
  if (cached && cached.duration === "0") {
    log("Cached track has no duration, clearing Slack status", "slack");
    await setSlackStatus("");
  }
}

async function main() {
  const cachedTrack = await readTrackJSON();

  // Time restrictions
  const currentTime = getTime(new Date());
  const currentHour = getHours(currentTime);

  const { start, end } = config.activeHours;
  if (currentHour < start || currentHour >= end) {
    log(`Outside active hours (${start}-${end})`);
    await clearSlackStatus(cachedTrack);
    return;
  }

  if (!config.updateWeekends && isWeekend(currentTime)) {
    log("Weekend updates not enabled, skipping");
    await clearSlackStatus(cachedTrack);
    return;
  }

  // Status restrictions
  const currentPresence = await getSlackPresence();
  if (currentPresence === "away") {
    log('User presence is "away"');
    await clearSlackStatus(cachedTrack);
    return;
  }

  const currentProfile = await getSlackProfile();
  if (!shouldSetStatus(currentProfile)) {
    log("Custom status detected");
    return;
  }

  // Now playing restrictions
  const recentTracks = await getRecentLastFmTracks(config.lastFM.username);
  const nowPlaying = getNowPlaying(recentTracks.track);

  if (nowPlaying === undefined) {
    log("Nothing playing");
    await clearSlackStatus(cachedTrack);
    await deleteTrackJSON();
    return;
  }

  // Equality restriction, don't update if it's not necessary
  if (trackIsEqual(nowPlaying, cachedTrack)) {
    log("Now playing track is cached, no update necessary");
    return;
  }

  const track = await getLastFmTrack(
    nowPlaying.name,
    nowPlaying.artist["#text"]
  );
  let duration = 60 * (config.updateExpiration * 1000);
  let status = `${nowPlaying.name} ${config.slack.separator} ${nowPlaying.artist["#text"]}`;

  if (track !== undefined) {
    await writeTrackJSON(track);

    status = `${track.name} ${config.slack.separator} ${track.artist.name}`;
    duration = track.duration !== "0" ? Number(track.duration) : duration;
  } else {
    log("No detailed track info found, falling back to recent track", "lastfm");
    await deleteTrackJSON();
  }

  log(`Setting status to "${status}"`, "slack");
  await setSlackStatus(status, duration);
}

async function loop() {
  const interval = config.updateInterval * 60000;
  setInterval(async () => await main().catch(handleError), interval);
}

validateConfig(config)
  .then(enableErrorTracking)
  .then(() => {
    log("slack-fm ready", "bot", true);
  })
  .then(main)
  .then(loop)
  .catch(handleError);
