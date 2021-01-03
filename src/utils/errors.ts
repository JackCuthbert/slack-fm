import * as Sentry from "@sentry/node";
import * as config from "../config";
import { log } from "./log";

/** Generic error handler for async function failures */
export function handleError(error: Error) {
  console.error(error);
  Sentry.captureException(error);
}

/** If a Sentry DSN is supplied, enable error tracking */
export function enableErrorTracking() {
  if (config.sentryDsn !== undefined) {
    log("Sentry error reporting enabled");
    Sentry.init({
      dsn: config.sentryDsn,
      attachStacktrace: true,
    });
  }
}
