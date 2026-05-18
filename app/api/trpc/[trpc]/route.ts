import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

/**
 * tRPC API route handler.
 * Serves as the primary entry point for all end-to-end typesafe API requests
 * used for workflow management, credential handling, and execution history.
 *
 * @author Maruf Bepary
 * @param req - The incoming fetch request.
 * @returns The response from the fetch request handler.
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
export { handler as GET, handler as POST };
