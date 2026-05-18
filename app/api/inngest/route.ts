import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { executeWorkflow } from "@/inngest/functions";

/**
 * Inngest API route handler.
 * Exposes the durable functions used for background job processing,
 * specifically the core workflow execution engine that handles DAG traversal.
 *
 * @author Maruf Bepary
 */
// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [executeWorkflow],
});
