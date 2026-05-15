import { Inngest } from "inngest";
import { env } from "@/lib/env";

export const inngest = new Inngest({
  id: "nodebase",
  eventKey: env.INNGEST_EVENT_KEY,
  inngestBaseUrl: env.INNGEST_BASE_URL,
  isDev: env.INNGEST_EVENT_KEY === "local" || process.env.NODE_ENV === "development",
});
