export const sendDiscordMessage = (message: string | object) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL is not set')
    return
  }

  return fetch(webhookUrl, {
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
