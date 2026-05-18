/**
 * Custom hooks for fetching executions with React Query suspense.
 * Provides suspense-enabled queries for execution lists and individual executions.
 *
 * @author Maruf Bepary
 */

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useExecutionsParams } from "./use-executions-params";

/**
 * Fetches paginated execution list with suspense.
 * Respects URL parameters for page and pageSize.
 * Throws promise until data is loaded; use with Suspense boundary.
 *
 * @returns Query result with execution data, pagination, and loading states
 */
export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionsParams();

  return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};

/**
 * Fetches a single execution by ID with suspense.
 * Throws promise until data is loaded; use with Suspense boundary.
 *
 * @param id - Execution ID to fetch
 * @returns Query result with execution data and loading states
 */
export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};
