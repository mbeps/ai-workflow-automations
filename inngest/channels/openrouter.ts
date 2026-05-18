import { channel, topic } from "@inngest/realtime";

export const OPENROUTER_CHANNEL_NAME = "openrouter-execution";

/**
 * Inngest Realtime channel for OpenRouter node execution status.
 * Used for streaming real-time execution status updates to the UI,
 * allowing for animated borders and state indicators on the canvas.
 *
 * @author Maruf Bepary
 */
export const openrouterChannel = channel(OPENROUTER_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
