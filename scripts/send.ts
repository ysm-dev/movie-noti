import { sendDiscordMessage } from '../tests/sendDiscordMessage'

async function main() {
  const randomString = Math.random().toString(36).substring(7)

  await sendDiscordMessage(
    '#movie',
    `https://github.com/ysm-dev/movie-noti/raw/main/temp/current.png?${randomString}`,
  )
  await sendDiscordMessage(
    '#movie',
    `https://github.com/ysm-dev/movie-noti/raw/main/temp/future.png?${randomString}`,
  )
}

main()
