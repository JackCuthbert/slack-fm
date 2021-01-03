import chalk from "chalk";
import { loggingEnabled } from "../config";

const contexts = {
  lastfm: chalk.red("[LastFM]"),
  slack: chalk.greenBright("[Slack]"),
  bot: chalk.blue("[Bot]"),
};

type LogContext = keyof typeof contexts;

export function log(message: string, ctx: LogContext = "bot", force = false) {
  if (loggingEnabled || force) {
    console.log(`${contexts[ctx]} ${message}`);
  }
}
