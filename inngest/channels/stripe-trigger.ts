import { channel, topic } from "@inngest/realtime";

export const STRIPE_TRIGGER_CHANNEL_NAME = "stripe-trigger-execution";

/**
 * Inngest Realtime channel for Stripe trigger node execution status.
 * Used for streaming real-time execution status updates to the UI,
 * allowing for animated borders and state indicators on the canvas.
 *
 * @author Maruf Bepary
 */
export const stripeTriggerChannel = channel(
  STRIPE_TRIGGER_CHANNEL_NAME,
).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
