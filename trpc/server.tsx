import "server-only"; // <-- ensure this file cannot be imported from the client
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  createTRPCOptionsProxy,
  type TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.

/**
 * Returns a stable QueryClient for the current request context.
 * 
 * @author Maruf Bepary
 */
export const getQueryClient = cache(makeQueryClient);

/**
 * Server-side tRPC client proxy for use in Server Components.
 * 
 * @author Maruf Bepary
 */
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

// ...

/**
 * Direct server-side caller for tRPC procedures.
 * 
 * @author Maruf Bepary
 */
export const caller = appRouter.createCaller(createTRPCContext);

/**
 * Prefetches a tRPC query on the server to hydrate the client.
 * 
 * @param queryOptions The query options to prefetch.
 * @author Maruf Bepary
 */
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}

/**
 * Component to hydrate the QueryClient state on the client side.
 * 
 * @param props Component props containing children.
 * @author Maruf Bepary
 */
export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
