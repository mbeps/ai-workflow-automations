/**
 * Server-side prefetch utilities for execution data.
 * Used in Server Components and layouts to hydrate React Query cache before rendering.
 * Enables instant data display and optimized page load.
 *
 * @author Maruf Bepary
 */

import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.executions.getMany>;

/**
 * Prefetches paginated execution list and hydrates React Query cache.
 * Call in Server Components before rendering to stream data immediately.
 *
 * @param params - Pagination and filter parameters
 * @returns Promise that resolves when data is cached
 */
export const prefetchExecutions = (params: Input) => {
  return prefetch(trpc.executions.getMany.queryOptions(params));
};

/**
 * Prefetches a single execution by ID and hydrates React Query cache.
 * Call in Server Components before rendering to stream data immediately.
 *
 * @param id - Execution ID to prefetch
 * @returns Promise that resolves when data is cached
 */
export const prefetchExecution = (id: string) => {
  return prefetch(trpc.executions.getOne.queryOptions({ id }));
};
