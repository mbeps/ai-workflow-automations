import { channel, topic } from "@inngest/realtime";

export const MANUAL_TRIGGER_CHANNEL_NAME = "manual-trigger-execution";

/**
 * Inngest Realtime channel for Manual trigger node execution status.
 * Used for streaming real-time execution status updates to the UI,
 * allowing for animated borders and state indicators on the canvas.
 *
 * @author Maruf Bepary
 */
export const manualTriggerChannel = channel(
  MANUAL_TRIGGER_CHANNEL_NAME,
).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
