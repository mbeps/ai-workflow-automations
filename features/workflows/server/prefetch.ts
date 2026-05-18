import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.workflows.getMany>;

/**
 * Prefetches workflows list on server for streaming SSR.
 * Populates TanStack Query cache before Client Component hydration.
 * Reduces loading states and improves perceived performance.
 *
 * @author Maruf Bepary
 * @param params - Pagination and search parameters
 * @returns Promise that resolves when prefetch completes
 */
export const prefetchWorkflows = (params: Input) => {
  return prefetch(trpc.workflows.getMany.queryOptions(params));
};

/**
 * Prefetches a single workflow on server for streaming SSR.
 * Used when navigating to workflow editor to have data ready on hydration.
 *
 * @author Maruf Bepary
 * @param id - Workflow ID to prefetch
 * @returns Promise that resolves when prefetch completes
 */
export const prefetchWorkflow = (id: string) => {
  return prefetch(trpc.workflows.getOne.queryOptions({ id }));
};
