import { channel, topic } from "@inngest/realtime";

export const OPENROUTER_CHANNEL_NAME = "openrouter-execution";

export const openrouterChannel = channel(OPENROUTER_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
