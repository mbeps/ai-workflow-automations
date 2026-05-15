"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { openrouterChannel } from "@/inngest/channels/openrouter";
import { inngest } from "@/inngest/client";

export type OpenRouterToken = Realtime.Token<
  typeof openrouterChannel,
  ["status"]
>;

export async function fetchOpenRouterRealtimeToken(): Promise<OpenRouterToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: openrouterChannel(),
    topics: ["status"],
  });

  return token;
}
