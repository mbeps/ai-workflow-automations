import { channel, topic } from "@inngest/realtime";

export const ANTHROPIC_CHANNEL_NAME = "anthropic-execution";

/**
 * Inngest Realtime channel for Anthropic node execution status.
 * Used for streaming real-time execution status updates to the UI,
 * allowing for animated borders and state indicators on the canvas.
 *
 * @author Maruf Bepary
 */
export const anthropicChannel = channel(ANTHROPIC_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
