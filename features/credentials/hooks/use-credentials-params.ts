import { useQueryStates } from "nuqs";
import { credentialsParams } from "../params";

/**
 * Hook to read and update credentials list URL parameters (page, pageSize, search).
 * Syncs pagination and search state with the browser URL for shareable, bookmarkable lists.
 * Uses `nuqs` for type-safe query string management.
 * 
 * @returns Tuple of [params state object, setter function to update params].
 * @author Maruf Bepary
 */
export const useCredentialsParams = () => {
  return useQueryStates(credentialsParams);
};
