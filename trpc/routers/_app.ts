/**
 * Root tRPC application router composing all feature routers.
 * Three main router branches:
 * - workflows: CRUD operations (gated by premiumProcedure for create)
 * - credentials: Encrypted API key management (gated by premiumProcedure for create)
 * - executions: Workflow execution history and status queries (protectedProcedure)
 * 
 * @author Maruf Bepary
 */

import { credentialsRouter } from "@/features/credentials/server/routers";
import { executionsRouter } from "@/features/executions/server/routers";
import { workflowsRouter } from "@/features/workflows/server/routers";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  executions: executionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
