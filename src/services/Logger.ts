import env from 'env-var'
import chalk from 'chalk'

const contexts = {
  lastfm: chalk.red('[LastFM]'),
  slack: chalk.greenBright('[Slack]'),
  bot: chalk.blue('[Bot]')
}

type LogContext = keyof typeof contexts

export function log(
  message: string,
  ctx: LogContext = 'bot',
  force = false
): void {
  const loggingEnabled = env.get('ENABLE_LOGGING').default('false').asBool()

  if (loggingEnabled || force) {
    console.log(`${contexts[ctx]} ${message}`)
  }
}
