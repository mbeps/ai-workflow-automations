import type { GetStepTools, Inngest } from "inngest";

/**
 * Alias for Inngest's step tools, providing utilities for durable execution within background functions.
 *
 * @author Maruf Bepary
 */
export type StepTools = GetStepTools<Inngest.Any>;
