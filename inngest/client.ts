import { Inngest } from "inngest";
import { env } from "@/lib/env";

/**
 * The Inngest client instance for the application.
 * Handles event routing and function registration.
 * 
 * @author Maruf Bepary
 */
export const inngest = new Inngest({
  id: "nodebase",
  eventKey: env.INNGEST_EVENT_KEY,
  inngestBaseUrl: env.INNGEST_BASE_URL,
  isDev: env.INNGEST_EVENT_KEY === "local" || process.env.NODE_ENV === "development",
});
