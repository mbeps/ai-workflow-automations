import { channel, topic } from "@inngest/realtime";

export const OPENAI_CHANNEL_NAME = "openai-execution";

/**
 * Inngest Realtime channel for OpenAI node execution status.
 * Used for streaming real-time execution status updates to the UI,
 * allowing for animated borders and state indicators on the canvas.
 *
 * @author Maruf Bepary
 */
export const openAiChannel = channel(OPENAI_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
