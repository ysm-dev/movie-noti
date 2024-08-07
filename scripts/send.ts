import { sendDiscordMessage } from '../tests/sendDiscordMessage'

async function main() {
  const currentDate = new Date().toISOString().split('T')[0]

  await sendDiscordMessage(
    '#movie',
    `https://github.com/ysm-dev/movie-noti/raw/main/temp/${currentDate}-current.png`,
  )
  await sendDiscordMessage(
    '#movie',
    `https://github.com/ysm-dev/movie-noti/raw/main/temp/${currentDate}-future.png`,
  )
}

main()
