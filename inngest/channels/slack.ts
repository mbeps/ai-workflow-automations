import { channel, topic } from "@inngest/realtime";

export const SLACK_CHANNEL_NAME = "slack-execution";

/**
 * Inngest Realtime channel for Slack node execution status.
 * Used for streaming real-time execution status updates to the UI,
 * allowing for animated borders and state indicators on the canvas.
 *
 * @author Maruf Bepary
 */
export const slackChannel = channel(SLACK_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
