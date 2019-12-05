import chalk from 'chalk'

const contexts = {
  lastfm: chalk.red('[LastFM]'),
  slack: chalk.greenBright('[Slack]'),
  bot: chalk.blue('[Bot]')
}

type LogContext = keyof typeof contexts

export function log (message: string, ctx: LogContext = 'bot') {
  if (process.env.NODE_ENV === 'test') return
  console.log(`${contexts[ctx]} ${message}`)
}
