import { channel, topic } from "@inngest/realtime";

export const DISCORD_CHANNEL_NAME = "discord-execution";

/**
 * Inngest Realtime channel for Discord node execution status.
 * Used for streaming real-time execution status updates to the UI,
 * allowing for animated borders and state indicators on the canvas.
 *
 * @author Maruf Bepary
 */
export const discordChannel = channel(DISCORD_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
