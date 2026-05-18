import { useQueryStates } from "nuqs";
import { workflowsParams } from "../params";

/**
 * React hook for managing workflows list query parameters.
 * Synchronizes page, pageSize, and search state with URL query string.
 * Returns tuple with current params and setter function.
 *
 * @author Maruf Bepary
 * @returns tuple of [params, setParams]
 */
export const useWorkflowsParams = () => {
  return useQueryStates(workflowsParams);
};
