import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.credentials.getMany>;

/**
 * Prefetch all credentials with pagination and search filters.
 * Used in Server Components to populate TanStack Query cache before rendering.
 * Ensures credentials list data is available immediately without loading spinners.
 * 
 * @param params - Pagination and search parameters (page, pageSize, search).
 * @author Maruf Bepary
 */
export const prefetchCredentials = (params: Input) => {
  return prefetch(trpc.credentials.getMany.queryOptions(params));
};

/**
 * Prefetch a single credential by ID.
 * Used in Server Components to hydrate the credential detail view with data.
 * Encrypts credential value at rest; decryption occurs only at execution time.
 * 
 * @param id - The credential ID to fetch.
 * @author Maruf Bepary
 */
export const prefetchCredential = (id: string) => {
  return prefetch(trpc.credentials.getOne.queryOptions({ id }));
};
