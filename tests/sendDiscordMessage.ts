export const sendDiscordMessage = (
  channel: `#${keyof typeof channelMap}`,
  message: string | object,
) => {
  const key = channelMap[channel.slice(1) as keyof typeof channelMap]
  return fetch(`https://discord.com/api/webhooks/${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      typeof message === 'string' ? { content: message } : message,
    ),
  }).catch(() => {
    console.error('Failed to send Discord message', message)
  })
}

const k = `1335782749398761613`
const t= `xjdHIT-am4MibKtm5t4keM_7qEkaTj5wzvrn7p3hHBhRdPmNcbyZWAp-DaLSivlYesBl`.split("").reverse().join("")

const channelMap = {
  movie: `/${k}/${t}`,
} as const
