/**
 * Custom hook for managing execution list URL parameters.
 * Syncs page and pageSize query parameters with component state.
 *
 * @author Maruf Bepary
 */

import { useQueryStates } from "nuqs";
import { executionsParams } from "../params";

/**
 * Hook to read and update execution list URL parameters.
 * Returns tuple of [params, setParams] for query string management.
 *
 * @returns Tuple with current params object and setter function
 */
export const useExecutionsParams = () => {
  return useQueryStates(executionsParams);
};
