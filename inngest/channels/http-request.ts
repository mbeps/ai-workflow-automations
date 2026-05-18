import { channel, topic } from "@inngest/realtime";

export const HTTP_REQUEST_CHANNEL_NAME = "http-request-execution";

/**
 * Inngest Realtime channel for HTTP Request node execution status.
 * Used for streaming real-time execution status updates to the UI,
 * allowing for animated borders and state indicators on the canvas.
 *
 * @author Maruf Bepary
 */
export const httpRequestChannel = channel(HTTP_REQUEST_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
