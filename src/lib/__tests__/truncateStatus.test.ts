import { truncateStatus } from '../truncateStatus'

const sep = '·'
const hellip = '…'

describe('truncateStatus', () => {
  it('returns a short status unaltered', () => {
    expect(truncateStatus(`Hello ${sep} Yes`, sep)).toBe(`Hello ${sep} Yes`)
  })

  it('returns a long track name truncated', () => {
    const longBoi =
      'One Day the Only Butterflies Left Will Be in Your Chest as You March Towards Your Death · Bring me the Horizon'
    const result = truncateStatus(longBoi, sep)

    const truncName = `One Day the Only Butterflies Left Will Be in Your Chest as You March Towards${hellip}`
    const truncArtist = 'Bring me the Horizon'

    expect(result).toEqual(`${truncName} ${sep} ${truncArtist}`)
    expect(result.length).toBeLessThanOrEqual(100)
  })

  it('returns a long artist name truncated', () => {
    const longBoi =
      'Bring me the Horizon · One Day the Only Butterflies Left Will Be in Your Chest as You March Towards Your Death'
    const result = truncateStatus(longBoi, sep)

    const truncName = 'Bring me the Horizon'
    const truncArtist = `One Day the Only Butterflies Left Will Be in Your Chest as You March Towards${hellip}`

    expect(result).toEqual(`${truncName} ${sep} ${truncArtist}`)
    expect(result.length).toEqual(100)
  })

  it('returns long track and artist names truncated', () => {
    const longBoi =
      'One Day the Only Butterflies Left Will Be in Your Chest as You March Towards Your Death · One Day the Only Butterflies Left Will Be in Your Chest as You March Towards Your Death'
    const result = truncateStatus(longBoi, sep)

    const truncName = `One Day the Only Butterflies Left Will Be in Yo${hellip}`
    const truncArtist = `One Day the Only Butterflies Left Will Be in Yo${hellip}`

    expect(result).toEqual(`${truncName} ${sep} ${truncArtist}`)
    expect(result.length).toBeLessThanOrEqual(100)
  })
})
