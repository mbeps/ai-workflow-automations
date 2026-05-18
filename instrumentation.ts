import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";

/**
 * Next.js instrumentation bootstrap function.
 * This runs in the server-side environment (Node.js or Edge Runtime) once per server instance.
 * It initializes Sentry observability tools based on the current runtime environment.
 *
 * @author Maruf Bepary
 */
export async function register() {
  if (env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

/**
 * Global handler for capturing request-related errors in Sentry.
 */
export const onRequestError = Sentry.captureRequestError;
