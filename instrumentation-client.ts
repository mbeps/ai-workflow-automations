/**
 * Client-side instrumentation configuration for Sentry.
 * This file is executed in the browser environment to initialize observability,
 * tracking client-side errors, performance metrics, and session replays.
 *
 * @author Maruf Bepary
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://f1a2853e6bb4b74c72976cd5c3b37dd9@o4507629901053952.ingest.de.sentry.io/4510150041337936",

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

/**
 * Handler for capturing router transition start events in Sentry.
 */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
