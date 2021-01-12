const MAX_LENGTH = 100

export function truncateStatus(status: string, sepChar: string): string {
  if (status.length <= MAX_LENGTH) return status

  const hellip = '…'
  const separator = ` ${sepChar} `

  const [name, artist] = status.split(separator)

  let newTrackName = name
  let newArtistName = artist

  // truncate track name
  if (name.length > 48 && artist.length <= 48) {
    const availNumChars =
      MAX_LENGTH - artist.length - separator.length - hellip.length

    newTrackName = name.slice(0, availNumChars).trim() + hellip
  }

  // truncate artist name
  else if (name.length <= 48 && artist.length > 48) {
    const availNumChars =
      MAX_LENGTH - name.length - separator.length - hellip.length

    newArtistName = artist.slice(0, availNumChars).trim() + hellip
  }

  // truncate both
  else if (artist.length > 48 && artist.length > 48) {
    const availNumChars =
      (MAX_LENGTH - separator.length - hellip.length * 2) / 2

    newTrackName = name.slice(0, availNumChars).trim() + hellip
    newArtistName = artist.slice(0, availNumChars).trim() + hellip
  }

  return `${newTrackName} ${sepChar} ${newArtistName}`
}
