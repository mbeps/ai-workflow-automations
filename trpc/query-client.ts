/**
 * Configures TanStack Query client with sensible defaults for SSR hydration.
 * 30-second stale time; pending queries included in server-side dehydration.
 * Superjson serialization for transport and deserialization on client.
 * 
 * @author Maruf Bepary
 */

import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import superjson from "superjson";
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}
