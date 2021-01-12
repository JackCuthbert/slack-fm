import { EventEmitter } from 'events'

type CB = () => Promise<void>

export class Schedule extends EventEmitter {
  action: CB
  handle?: NodeJS.Timer
  interval: number

  constructor(action: CB, ms: number) {
    super()
    this.action = action
    this.handle = undefined
    this.interval = ms
    this.addListener('timeout', () => {
      this.action().catch(console.error)
    })
  }

  public start(): void {
    if (this.handle === undefined) {
      this.handle = setInterval(() => this.emit('timeout'), this.interval)
    }
  }

  public stop(): void {
    if (this.handle !== undefined) {
      clearInterval(this.handle)
      this.handle = undefined
    }
  }
}
