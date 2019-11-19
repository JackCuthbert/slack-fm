import chalk from 'chalk'

const contexts = {
  lastfm: chalk.red('[LastFM]'),
  slack: chalk.greenBright('[Slack]'),
  bot: chalk.blue('[Bot]')
}

type LogContext = keyof typeof contexts

export function log (message: string, ctx: LogContext = 'bot') {
  console.log(`${contexts[ctx]} ${message}`)
}
