import type { CredentialType } from "@prisma/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useCredentialsParams } from "./use-credentials-params";

/**
 * Hook to fetch all credentials with suspense for pagination and search.
 * Reads page, pageSize, and search from URL parameters via `useCredentialsParams`.
 * Throws promise until data loads; use with `<Suspense>` boundary.
 * 
 * @returns Query result with credentials array, pagination metadata, and isFetching state.
 * @author Maruf Bepary
 */
export const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();

  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};

/**
 * Hook to create a new credential (OpenAI, Anthropic, Gemini, or OpenRouter).
 * Encrypts API key at rest; success toast shows credential name; invalidates list cache.
 * Premium subscription required (enforced by backend `premiumProcedure`).
 * 
 * @returns Mutation object with mutateAsync, isPending, and error states.
 * @author Maruf Bepary
 */
export const useCreateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" created`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
      },
      onError: (error) => {
        toast.error(`Failed to create credential: ${error.message}`);
      },
    }),
  );
};

/**
 * Hook to delete a credential by ID.
 * Invalidates both list and detail caches after successful deletion.
 * Shows success toast with credential name; handles error silently.
 * 
 * @returns Mutation object with mutate/mutateAsync and isPending state.
 * @author Maruf Bepary
 */
export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" removed`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryFilter({ id: data.id }),
        );
      },
    }),
  );
};

/**
 * Hook to fetch a single credential by ID with suspense.
 * Decrypted plaintext API key returned from server; use only in trusted contexts.
 * Throws promise until data loads; use with `<Suspense>` boundary.
 * 
 * @param id - The credential ID to fetch.
 * @returns Query result with credential object and isFetching state.
 * @author Maruf Bepary
 */
export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
};

/**
 * Hook to update a credential's name, type, or API key.
 * Encrypts updated API key at rest; invalidates both list and detail caches.
 * Success toast shows updated credential name; displays error on failure.
 * 
 * @returns Mutation object with mutateAsync, isPending, and error states.
 * @author Maruf Bepary
 */
export const useUpdateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" saved`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to save credential: ${error.message}`);
      },
    }),
  );
};

/**
 * Hook to fetch credentials filtered by type (OpenAI, Anthropic, Gemini, OpenRouter).
 * Used in workflow editor to populate credential selector dropdowns for each AI node.
 * Returns credentials ordered by update time (most recent first).
 * 
 * @param type - The credential type to filter by.
 * @returns Query result with filtered credentials array.
 * @author Maruf Bepary
 */
export const useCredentialsByType = (type: CredentialType) => {
  const trpc = useTRPC();
  return useQuery(trpc.credentials.getByType.queryOptions({ type }));
};
