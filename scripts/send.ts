import { sendDiscordMessage } from '../tests/sendDiscordMessage'

async function main() {
  await sendDiscordMessage(
    '#movie',
    `https://github.com/ysm-dev/movie-noti/raw/main/temp/current.png`,
  )
  await sendDiscordMessage(
    '#movie',
    `https://github.com/ysm-dev/movie-noti/raw/main/temp/future.png`,
  )
}

main()
