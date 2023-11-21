export const sendDiscordMessage = (
  channel: `#${keyof typeof channelMap}`,
  message: string | object,
) => {
  const key = channelMap[channel.slice(1) as keyof typeof channelMap]
  return fetch(`https://discord.com/api/webhooks/${key}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      typeof message === "string" ? { content: message } : message,
    ),
  }).catch(() => {
    console.error("Failed to send Discord message", message)
  })
}

const channelMap = {
  movie: `1122167462285291680/2BBXTJRzcLM07f6uYTo3udTKPB4PEYQsSDH3Zio1xdnTyRZ-3t4sOtbHc7Q6Ds3duKgl`,
} as const
