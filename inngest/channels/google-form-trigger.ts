import { channel, topic } from "@inngest/realtime";

export const GOOGLE_FORM_TRIGGER_CHANNEL_NAME = "google-form-trigger-execution";

/**
 * Inngest Realtime channel for Google Form trigger node execution status.
 * Used for streaming real-time execution status updates to the UI,
 * allowing for animated borders and state indicators on the canvas.
 *
 * @author Maruf Bepary
 */
export const googleFormTriggerChannel = channel(
  GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
